import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/orderItem.entity';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cartItem.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createOrder(userId: number): Promise<Order> {
    const cart = await this.cartRepository.findOne({ where: { userId } });
    if (!cart) {
      throw new Error('Cart not found');
    }
    const cartItems = await this.cartItemRepository.find({
      where: { cartId: cart.id },
    });
    const productMap = new Map<number, Product>();
    for (const item of cartItems) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });
      if (!product) throw new Error('Product not found');
      productMap.set(item.productId, product);
    }

    let totalAmount = 0;
    for (const item of cartItems) {
      const product = productMap.get(item.productId);
      if (!product) throw new Error('Product not found');
      totalAmount += product.price * item.quantity;
    }

    const order = await this.orderRepository.save(
      this.orderRepository.create({ userId, totalAmount: totalAmount }),
    );
    for (const item of cartItems) {
      const product = productMap.get(item.productId);
      if (!product) throw new Error('Product not found');
      await this.orderItemRepository.save(
        this.orderItemRepository.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        }),
      );
    }
    return order;
  }
}
