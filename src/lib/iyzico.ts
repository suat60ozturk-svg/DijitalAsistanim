interface IyzicoConfig {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
}

interface PaymentRequest {
  price: number;
  paidPrice: number;
  currency: string;
  basketId: string;
  paymentCard: {
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
  };
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    identityNumber: string;
    registrationAddress: string;
    city: string;
    country: string;
    ip: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    itemType: string;
    price: number;
  }>;
}

interface SubscriptionRequest {
  locale: string;
  conversationId: string;
  pricingPlanReferenceCode: string;
  subscriptionInitialStatus: string;
  customer: {
    name: string;
    surname: string;
    email: string;
    identityNumber: string;
    billingAddress: {
      contactName: string;
      city: string;
      country: string;
      address: string;
    };
  };
  paymentCard: {
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
  };
}

export class IyzicoService {
  private config: IyzicoConfig;

  constructor() {
    const apiKey = import.meta.env.VITE_IYZICO_API_KEY || '';
    const secretKey = import.meta.env.VITE_IYZICO_SECRET_KEY || '';
    const isProduction = import.meta.env.VITE_IYZICO_PRODUCTION === 'true';

    this.config = {
      apiKey,
      secretKey,
      baseUrl: isProduction
        ? 'https://api.iyzipay.com'
        : 'https://sandbox-api.iyzipay.com',
    };
  }

  private async makeRequest(endpoint: string, body: any): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('iyzico credentials not configured');
    }

    const randomString = this.generateRandomString();
    const authString = await this.generateAuthString(endpoint, body, randomString);

    try {
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': authString,
          'Content-Type': 'application/json',
          'x-iyzi-rnd': randomString,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(data.errorMessage || 'Payment failed');
      }

      return data;
    } catch (error: any) {
      console.error('iyzico request error:', error);
      throw error;
    }
  }

  private generateRandomString(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private async generateAuthString(
    endpoint: string,
    body: any,
    randomString: string
  ): Promise<string> {
    const bodyString = JSON.stringify(body);
    const dataToSign = `${randomString}${endpoint}${bodyString}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(dataToSign);
    const keyData = encoder.encode(this.config.secretKey);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
    const hashArray = Array.from(new Uint8Array(signature));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const hashBase64 = btoa(
      hashArray.map(byte => String.fromCharCode(byte)).join('')
    );

    return `IYZWS ${this.config.apiKey}:${hashBase64}`;
  }

  async createPayment(request: PaymentRequest): Promise<{
    success: boolean;
    paymentId?: string;
    status?: string;
    error?: string;
  }> {
    try {
      const result = await this.makeRequest('/payment/auth', {
        locale: 'tr',
        conversationId: request.basketId,
        price: request.price.toFixed(2),
        paidPrice: request.paidPrice.toFixed(2),
        currency: request.currency,
        installment: '1',
        basketId: request.basketId,
        paymentChannel: 'WEB',
        paymentGroup: 'PRODUCT',
        paymentCard: request.paymentCard,
        buyer: request.buyer,
        shippingAddress: request.shippingAddress,
        billingAddress: request.billingAddress,
        basketItems: request.basketItems,
      });

      return {
        success: true,
        paymentId: result.paymentId,
        status: result.status,
      };
    } catch (error: any) {
      console.error('Payment creation error:', error);
      return {
        success: false,
        error: error.message || 'Payment failed',
      };
    }
  }

  async createSubscription(request: SubscriptionRequest): Promise<{
    success: boolean;
    referenceCode?: string;
    status?: string;
    error?: string;
  }> {
    try {
      const result = await this.makeRequest('/v2/subscription/initialize', request);

      return {
        success: true,
        referenceCode: result.data?.referenceCode,
        status: result.data?.subscriptionStatus,
      };
    } catch (error: any) {
      console.error('Subscription creation error:', error);
      return {
        success: false,
        error: error.message || 'Subscription failed',
      };
    }
  }

  async cancelSubscription(subscriptionReferenceCode: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await this.makeRequest('/v2/subscription/cancel', {
        locale: 'tr',
        subscriptionReferenceCode,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Subscription cancellation error:', error);
      return {
        success: false,
        error: error.message || 'Cancellation failed',
      };
    }
  }

  async getSubscription(subscriptionReferenceCode: string): Promise<{
    success: boolean;
    subscription?: any;
    error?: string;
  }> {
    try {
      const result = await this.makeRequest('/v2/subscription/retrieve', {
        locale: 'tr',
        subscriptionReferenceCode,
      });

      return {
        success: true,
        subscription: result.data,
      };
    } catch (error: any) {
      console.error('Get subscription error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get subscription',
      };
    }
  }

  isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.secretKey);
  }

  getConfigStatus(): { configured: boolean; missing: string[]; sandbox: boolean } {
    const missing: string[] = [];

    if (!this.config.apiKey) missing.push('VITE_IYZICO_API_KEY');
    if (!this.config.secretKey) missing.push('VITE_IYZICO_SECRET_KEY');

    return {
      configured: missing.length === 0,
      missing,
      sandbox: this.config.baseUrl.includes('sandbox'),
    };
  }
}

export const iyzicoService = new IyzicoService();
