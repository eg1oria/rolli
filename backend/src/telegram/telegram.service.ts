import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
  private botToken: string;
  private chatId: string;

  constructor(private readonly configService: ConfigService) {
    this.botToken = this.configService.get<string>('telegram.botToken') || '';
    this.chatId = this.configService.get<string>('telegram.chatId') || '';

    if (this.botToken && this.chatId) {
      this.logger.log('Telegram bot configured');
    } else {
      this.logger.warn('Telegram not fully configured, notifications disabled');
    }
  }

  async sendOrderNotification(order: OrderNotification): Promise<void> {
    if (!this.botToken || !this.chatId) {
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
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        this.logger.error(`Failed to send Telegram notification: ${error}`);
        return;
      }

      this.logger.log(`Order notification sent for #${order.orderNumber}`);
    } catch (error) {
      this.logger.error(`Failed to send Telegram notification: ${error}`);
    }
  }

  private formatPrice(rubles: number): string {
    return `${rubles.toLocaleString('ru-RU')} ₽`;
  }
}
