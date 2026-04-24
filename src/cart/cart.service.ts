import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cartItem.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async getCert(userId: number): Promise<Cart | null> {
    return this.cartRepository.findOne({ where: { userId } });
  }

  async postCart(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    let cart = await this.getCert(userId);
    if (!cart) {
      cart = await this.cartRepository.save(
        this.cartRepository.create({ userId }),
      );
    }
    const cartItem = this.cartItemRepository.create({
      cartId: cart.id,
      productId,
      quantity,
    });
    await this.cartItemRepository.save(cartItem);
    return cart;
  }

  async deleteItem(id: number): Promise<void> {
    await this.cartRepository.delete(id);
  }
}
