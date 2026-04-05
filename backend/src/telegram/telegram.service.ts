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
  gift: string;
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
          `  ${i + 1}. ${this.escapeHtml(item.name)} (${this.escapeHtml(item.pieces)}) × ${item.quantity} — ${this.formatPrice(item.price * item.quantity)}`,
      )
      .join('\n');

    let message = `<b>НОВЫЙ ЗАКАЗ #${order.orderNumber}</b>\n`;
    message += `<b>${typeLabel}</b>\n\n`;

    message += `Имя: ${this.escapeHtml(order.customerName)}\n`;
    message += `Тел: ${this.escapeHtml(order.customerPhone)}\n`;

    if (order.type === 'DELIVERY' && order.address) {
      message += `Адрес: ${this.escapeHtml(order.address)}\n`;
    } else if (order.type === 'PICKUP') {
      message += `Адрес: Пр. Дзержинского 27/2\n`;
    }

    message += `\n<b>Товары:</b>\n${itemsText}\n`;

    if (order.sauces) {
      message += `\nСоусы: ${this.escapeHtml(order.sauces)}`;
    }

    if (order.comment) {
      message += `\nКомментарий: ${this.escapeHtml(order.comment)}`;
    }

    if (order.gift) {
      message += `\n\n<b>ПОДАРОК: ${this.escapeHtml(order.gift)}</b>`;
    }

    message += `\n\n<b>Итого: ${this.formatPrice(order.totalPrice)}</b>`;

    const now = new Date();
    const timeStr = now.toLocaleString('ru-RU', {
      timeZone: 'Asia/Yekaterinburg',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    message += `\n${timeStr}`;

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

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
