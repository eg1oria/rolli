import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';

interface OrderNotification {
  orderNumber: string;
  type: 'DELIVERY' | 'PICKUP';
  customerName: string;
  customerPhone: string;
  address: string | null;
  items: Array<{
    name: string;
    pieces: string;
    quantity: number;
    price: number;
  }>;
  sauces: string;
  comment: string;
  totalPrice: number;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private bot: TelegramBot | null = null;
  private chatId: string;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('telegram.botToken');
    this.chatId = this.configService.get<string>('telegram.chatId') || '';

    if (token) {
      this.bot = new TelegramBot(token, { polling: false });
      this.logger.log('Telegram bot initialized');
    } else {
      this.logger.warn('Telegram bot token not configured, notifications disabled');
    }
  }

  async sendOrderNotification(order: OrderNotification): Promise<void> {
    if (!this.bot || !this.chatId) {
      this.logger.warn('Telegram not configured, skipping notification');
      return;
    }

    const typeLabel = order.type === 'DELIVERY' ? 'Доставка' : 'Самовывоз';

    const itemsText = order.items
      .map(
        (item, i) =>
          `  ${i + 1}. ${item.name} (${item.pieces}) × ${item.quantity} — ${this.formatPrice(item.price * item.quantity)}`,
      )
      .join('\n');

    let message = `🆕 Новый заказ #${order.orderNumber}\n\n`;
    message += `📦 Тип: ${typeLabel}\n`;
    message += `👤 Имя: ${order.customerName}\n`;
    message += `📞 Тел: ${order.customerPhone}\n`;

    if (order.type === 'DELIVERY' && order.address) {
      message += `📍 Адрес: ${order.address}\n`;
    } else if (order.type === 'PICKUP') {
      message += `📍 Самовывоз: Пр. Дзержинского 27/2\n`;
    }

    message += `\n🍣 Товары:\n${itemsText}\n`;

    if (order.sauces) {
      message += `\n🫙 Соусы: ${order.sauces}`;
    }

    if (order.comment) {
      message += `\n💬 Комментарий: ${order.comment}`;
    }

    message += `\n\n💰 Итого: ${this.formatPrice(order.totalPrice)}`;

    const now = new Date();
    const timeStr = now.toLocaleString('ru-RU', {
      timeZone: 'Asia/Yekaterinburg',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    message += `\n🕐 ${timeStr}`;

    try {
      await this.bot.sendMessage(this.chatId, message);
      this.logger.log(`Order notification sent for #${order.orderNumber}`);
    } catch (error) {
      this.logger.error(`Failed to send Telegram notification: ${error}`);
    }
  }

  private formatPrice(kopecks: number): string {
    const rubles = kopecks / 100;
    return `${rubles.toLocaleString('ru-RU')} ₽`;
  }
}
