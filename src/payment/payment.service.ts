import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class PaymentService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia',
  });

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createPayment(orderId: number): Promise<Payment> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) throw new Error('Order not found');
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: order.totalAmount,
      currency: 'jpy',
    });
    return this.paymentRepository.save(
      this.paymentRepository.create({
        orderId,
        stripePaymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      }),
    );
  }
}
