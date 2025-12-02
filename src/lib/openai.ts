import OpenAI from 'openai';

export class AIService {
  private client: OpenAI | null = null;
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';

    if (this.apiKey) {
      this.client = new OpenAI({
        apiKey: this.apiKey,
        dangerouslyAllowBrowser: true,
      });
    }
  }

  async chat(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options?: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
    }
  ): Promise<{ success: boolean; response?: string; error?: string }> {
    if (!this.client) {
      return {
        success: false,
        error: 'OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to .env',
      };
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: options?.model || 'gpt-4',
        messages: messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 500,
      });

      const response = completion.choices[0]?.message?.content || '';

      return {
        success: true,
        response,
      };
    } catch (error: any) {
      console.error('OpenAI chat error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get AI response',
      };
    }
  }

  async generateCustomerResponse(
    customerMessage: string,
    context: {
      customerName?: string;
      orderHistory?: any[];
      businessName?: string;
    },
    systemPrompt?: string
  ): Promise<{ success: boolean; response?: string; error?: string }> {
    const defaultPrompt = `Sen bir e-ticaret müşteri hizmetleri asistanısın.
İşletme adı: ${context.businessName || 'SiparişBot'}
Müşteri: ${context.customerName || 'Değerli müşterimiz'}

Görevin:
- Müşterilere yardımcı olmak
- Sipariş durumlarını kontrol etmek
- Ürün bilgileri vermek
- Kibar ve profesyonel olmak

Eğer bir soruyu cevaplayamıyorsan, insan temsilciye yönlendir.`;

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt || defaultPrompt },
      { role: 'user', content: customerMessage },
    ];

    return this.chat(messages);
  }

  async analyzeSentiment(
    text: string
  ): Promise<{ success: boolean; sentiment?: 'positive' | 'neutral' | 'negative'; error?: string }> {
    if (!this.client) {
      return { success: false, error: 'OpenAI API key not configured' };
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'Analyze the sentiment of the following text and respond with only one word: positive, neutral, or negative',
          },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
        max_tokens: 10,
      });

      const sentiment = completion.choices[0]?.message?.content?.toLowerCase().trim() as
        | 'positive'
        | 'neutral'
        | 'negative';

      if (!['positive', 'neutral', 'negative'].includes(sentiment)) {
        return { success: false, error: 'Invalid sentiment response' };
      }

      return { success: true, sentiment };
    } catch (error: any) {
      console.error('Sentiment analysis error:', error);
      return { success: false, error: error.message };
    }
  }

  async generateOrderSummary(orderData: any): Promise<{ success: boolean; summary?: string; error?: string }> {
    const prompt = `Aşağıdaki sipariş bilgilerini müşteri dostu bir şekilde özetle:

Sipariş No: ${orderData.order_number}
Durum: ${orderData.status}
Tutar: ${orderData.total_amount} TL
Ürünler: ${JSON.stringify(orderData.items)}

Kısa ve net bir özet yaz.`;

    return this.chat([
      { role: 'system', content: 'Sen bir müşteri hizmetleri asistanısın.' },
      { role: 'user', content: prompt },
    ]);
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  getConfigStatus(): { configured: boolean; missing: string[] } {
    const missing: string[] = [];

    if (!this.apiKey) {
      missing.push('VITE_OPENAI_API_KEY');
    }

    return {
      configured: missing.length === 0,
      missing,
    };
  }
}

export const aiService = new AIService();
