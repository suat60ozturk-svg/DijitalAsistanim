interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'image';
  body?: string;
  template?: {
    name: string;
    language: string;
    components: any[];
  };
  image?: {
    url: string;
  };
}

interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  businessAccountId: string;
}

export class WhatsAppService {
  private config: WhatsAppConfig;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor() {
    this.config = {
      phoneNumberId: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '',
      accessToken: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || '',
      businessAccountId: import.meta.env.VITE_WHATSAPP_BUSINESS_ACCOUNT_ID || '',
    };
  }

  async sendMessage(message: WhatsAppMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.config.phoneNumberId || !this.config.accessToken) {
      console.error('WhatsApp credentials not configured');
      return {
        success: false,
        error: 'WhatsApp credentials not configured. Please add VITE_WHATSAPP_PHONE_NUMBER_ID and VITE_WHATSAPP_ACCESS_TOKEN to .env',
      };
    }

    try {
      const payload: any = {
        messaging_product: 'whatsapp',
        to: message.to.replace(/\D/g, ''),
        type: message.type,
      };

      if (message.type === 'text' && message.body) {
        payload.text = { body: message.body };
      } else if (message.type === 'template' && message.template) {
        payload.template = message.template;
      } else if (message.type === 'image' && message.image) {
        payload.image = message.image;
      }

      const response = await fetch(
        `${this.baseUrl}/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to send message');
      }

      return {
        success: true,
        messageId: data.messages?.[0]?.id,
      };
    } catch (error: any) {
      console.error('WhatsApp send error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send WhatsApp message',
      };
    }
  }

  async sendTextMessage(phone: string, text: string) {
    return this.sendMessage({
      to: phone,
      type: 'text',
      body: text,
    });
  }

  async sendTemplateMessage(phone: string, templateName: string, variables: string[]) {
    return this.sendMessage({
      to: phone,
      type: 'template',
      template: {
        name: templateName,
        language: 'tr',
        components: [
          {
            type: 'body',
            parameters: variables.map(v => ({ type: 'text', text: v })),
          },
        ],
      },
    });
  }

  async sendImageMessage(phone: string, imageUrl: string) {
    return this.sendMessage({
      to: phone,
      type: 'image',
      image: { url: imageUrl },
    });
  }

  async verifyWebhook(mode: string, token: string, challenge: string): Promise<string | null> {
    const verifyToken = import.meta.env.VITE_WHATSAPP_VERIFY_TOKEN || 'siparisbot_webhook_2024';

    if (mode === 'subscribe' && token === verifyToken) {
      return challenge;
    }

    return null;
  }

  async handleWebhook(body: any): Promise<void> {
    try {
      const entries = body.entry || [];

      for (const entry of entries) {
        const changes = entry.changes || [];

        for (const change of changes) {
          if (change.field === 'messages') {
            const messages = change.value?.messages || [];

            for (const message of messages) {
              await this.processIncomingMessage(message);
            }
          }
        }
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
    }
  }

  private async processIncomingMessage(message: any): Promise<void> {
    console.log('Processing incoming WhatsApp message:', {
      from: message.from,
      type: message.type,
      timestamp: message.timestamp,
    });
  }

  isConfigured(): boolean {
    return !!(this.config.phoneNumberId && this.config.accessToken);
  }

  getConfigStatus(): { configured: boolean; missing: string[] } {
    const missing: string[] = [];

    if (!this.config.phoneNumberId) missing.push('VITE_WHATSAPP_PHONE_NUMBER_ID');
    if (!this.config.accessToken) missing.push('VITE_WHATSAPP_ACCESS_TOKEN');
    if (!this.config.businessAccountId) missing.push('VITE_WHATSAPP_BUSINESS_ACCOUNT_ID');

    return {
      configured: missing.length === 0,
      missing,
    };
  }
}

export const whatsappService = new WhatsAppService();
