import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartItem.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { Payment } from './entities/payment.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DATABASE_URL ? undefined : 'localhost',
      port: process.env.DATABASE_URL ? undefined : 5432,
      username: process.env.DATABASE_URL ? undefined : 'gotoyasuko',
      database: process.env.DATABASE_URL ? undefined : 'cart',
      password: '',
      entities: [User, Product, Cart, CartItem, Order, OrderItem, Payment],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProductModule,
    CartModule,
    OrderModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
