import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PolicyModule } from './policy/policy.module';
import { RoleModule } from './role/role.module';
import { AbilityModule } from './ability/ability.module';
import { BillModule } from './bill/bill.module';
import { UsertokenModule } from './usertoken/usertoken.module';
import { UserModule } from './user/user.module';
import { FirebaseModule } from './firebase/firebase.module';
import { UserotpModule } from './userotp/userotp.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { CartModule } from './cart/cart.module';
import { StoreModule } from './store/store.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ProductModule } from './product/product.module';
import { SeedsModule } from './seeds/seeds.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { NotificationModule } from './notification/notification.module';
import { PromotionModule } from './promotion/promotion.module';
import { FineModule } from './fine/fine.module';
import { CategoryModule } from './category/category.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI, { dbName: "ReduxAndAuth" }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          port: 465,
          ignoreTLS: true,
          host: config.get('MAIL_HOST'),
          secure: true,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_USER')}>`,
        },
        template: {
          dir: join(__dirname, 'src/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),

    UserModule,
    AuthModule,
    PolicyModule,
    RoleModule,
    AbilityModule,
    FirebaseModule,
    BillModule,
    UsertokenModule,
    UserotpModule,
    CartModule,
    StoreModule,
    FeedbackModule,
    ProductModule,
    SeedsModule,
    EvaluationModule,
    NotificationModule,
    PromotionModule,
    FineModule,
    CategoryModule,
  ],
  providers: [],
})
export class AppModule { }
