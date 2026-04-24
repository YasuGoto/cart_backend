import { Controller, Get, Param, Post, Body, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { Delete } from '@nestjs/common';
import { Cart } from '../entities/cart.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCart(@Request() req: any): Promise<Cart | null> {
    return this.cartService.getCert(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  postCart(
    @Body() body: { productId: number; quantity: number },
    @Request() req: any,
  ): Promise<Cart> {
    return this.cartService.postCart(
      req.user.sub,
      body.productId,
      body.quantity,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteItem(@Param('id') id: string): Promise<void> {
    return this.cartService.deleteItem(Number(id));
  }
}
