import { Injectable } from '@nestjs/common';

@Injectable()
export class WhatsappService {
  private formatPhone(phone: string): string {
    // Remove tudo que não for número e garante o código do Brasil
    const digits = phone.replace(/\D/g, '');
    return digits.startsWith('55') ? digits : `55${digits}`;
  }

  private formatCurrency(value: number | string): string {
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  buildOrderConfirmationUrl(order: {
    id: number;
    total: number | string;
    notes?: string | null;
    deliveryTime?: string | null;
    customer: {
      name: string;
      phone?: string | null;
    };
    seller: {
      name: string;
    };
    items: {
      quantity: number;
      product: { name: string };
    }[];
    deliveryAddress?: {
      street: string;
      number: string;
      neighborhood: string;
      complement?: string | null;
    } | null;
    payment?: {
      method: string;
    } | null;
  }): string | null {
    if (!order.customer.phone) return null;

    const itemsList = order.items
      .map((i) => `• ${i.quantity}x ${i.product.name}`)
      .join('\n');

    const address = order.deliveryAddress
      ? `${order.deliveryAddress.street}, ${order.deliveryAddress.number} - ${order.deliveryAddress.neighborhood}${order.deliveryAddress.complement ? ` (${order.deliveryAddress.complement})` : ''}`
      : 'Não informado';

    const paymentMethod =
      order.payment?.method === 'PIX' ? 'PIX' : 'Dinheiro';

    const notes = order.notes ? `\n💬 *Mensagem para você:* ${order.notes}` : '';
    const deliveryTime = order.deliveryTime
      ? `\n⏰ *Retirada combinada:* ${order.deliveryTime}`
      : '';

    const message = [
      `Olá, ${order.customer.name}! 👋`,
      ``,
      `Aqui é *${order.seller.name}* do *CampusMarket*.`,
      `Seu pedido *#${order.id}* foi confirmado e já está em preparação ✅`,
      ``,
      `🧾 *Resumo do pedido*`,
      `🛒 *Itens:*`,
      itemsList,
      ``,
      `💵 *Total:* ${this.formatCurrency(order.total)}`,
      `💳 *Pagamento:* ${paymentMethod}`,
      `📍 *Local de entrega/retirada:* ${address}`,
      `${deliveryTime}${notes}`,
      ``,
      `Se precisar ajustar algo, me chama por aqui 🤝`,
      `Obrigado pela preferência! 💚`,
    ]
      .join('\n')
      .trim();

    const phone = this.formatPhone(order.customer.phone);
    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${phone}?text=${encodedMessage}`;
  }
}