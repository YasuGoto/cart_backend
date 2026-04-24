import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Payment } from '../entities/payment.entity';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  createPayment(@Body() body: { orderId: number }): Promise<Payment> {
    return this.paymentService.createPayment(body.orderId);
  }
}
