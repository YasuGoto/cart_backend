import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { Req } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrder(@Req() req: any): Promise<Order> {
    return this.orderService.createOrder(req.user.sub);
  }
}
