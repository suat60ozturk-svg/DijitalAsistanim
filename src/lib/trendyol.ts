interface TrendyolConfig {
  supplierId: string;
  apiKey: string;
  apiSecret: string;
}

interface TrendyolOrder {
  orderNumber: string;
  orderDate: number;
  status: string;
  grossAmount: number;
  totalPrice: number;
  customerFirstName: string;
  customerLastName: string;
  lines: Array<{
    productName: string;
    quantity: number;
    price: number;
    barcode: string;
  }>;
  shipmentAddress: {
    fullAddress: string;
    city: string;
    district: string;
  };
  cargoTrackingNumber?: string;
}

export class TrendyolService {
  private config: TrendyolConfig;
  private baseUrl = 'https://api.trendyol.com/sapigw/suppliers';

  constructor() {
    this.config = {
      supplierId: import.meta.env.VITE_TRENDYOL_SUPPLIER_ID || '',
      apiKey: import.meta.env.VITE_TRENDYOL_API_KEY || '',
      apiSecret: import.meta.env.VITE_TRENDYOL_API_SECRET || '',
    };
  }

  private getAuthHeaders(): HeadersInit {
    const credentials = btoa(`${this.config.apiKey}:${this.config.apiSecret}`);
    return {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      'User-Agent': 'SiparisBot/1.0',
    };
  }

  async getOrders(params?: {
    page?: number;
    size?: number;
    startDate?: number;
    endDate?: number;
    status?: string;
  }): Promise<{ success: boolean; orders?: TrendyolOrder[]; error?: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Trendyol credentials not configured',
      };
    }

    try {
      const queryParams = new URLSearchParams({
        page: (params?.page || 0).toString(),
        size: (params?.size || 50).toString(),
        ...(params?.startDate && { startDate: params.startDate.toString() }),
        ...(params?.endDate && { endDate: params.endDate.toString() }),
        ...(params?.status && { status: params.status }),
      });

      const response = await fetch(
        `${this.baseUrl}/${this.config.supplierId}/orders?${queryParams}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Trendyol API error: ${error}`);
      }

      const data = await response.json();

      return {
        success: true,
        orders: data.content || [],
      };
    } catch (error: any) {
      console.error('Trendyol get orders error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch Trendyol orders',
      };
    }
  }

  async getOrderDetails(orderNumber: string): Promise<{ success: boolean; order?: TrendyolOrder; error?: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Trendyol credentials not configured',
      };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/${this.config.supplierId}/orders/${orderNumber}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Trendyol API error: ${error}`);
      }

      const data = await response.json();

      return {
        success: true,
        order: data,
      };
    } catch (error: any) {
      console.error('Trendyol get order details error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch order details',
      };
    }
  }

  async updateCargoInfo(
    orderNumber: string,
    cargoTrackingNumber: string,
    cargoProviderName: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Trendyol credentials not configured',
      };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/${this.config.supplierId}/orders/${orderNumber}/cargo-tracking-number`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            cargoTrackingNumber,
            cargoProviderName,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Trendyol API error: ${error}`);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Trendyol update cargo error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update cargo info',
      };
    }
  }

  async syncOrders(onProgress?: (current: number, total: number) => void): Promise<{
    success: boolean;
    syncedCount?: number;
    error?: string;
  }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Trendyol credentials not configured',
      };
    }

    try {
      const endDate = Date.now();
      const startDate = endDate - 30 * 24 * 60 * 60 * 1000;

      const result = await this.getOrders({
        startDate,
        endDate,
        size: 100,
      });

      if (!result.success || !result.orders) {
        throw new Error(result.error || 'Failed to fetch orders');
      }

      let syncedCount = 0;

      for (let i = 0; i < result.orders.length; i++) {
        if (onProgress) {
          onProgress(i + 1, result.orders.length);
        }
        syncedCount++;
      }

      return {
        success: true,
        syncedCount,
      };
    } catch (error: any) {
      console.error('Trendyol sync error:', error);
      return {
        success: false,
        error: error.message || 'Failed to sync orders',
      };
    }
  }

  isConfigured(): boolean {
    return !!(this.config.supplierId && this.config.apiKey && this.config.apiSecret);
  }

  getConfigStatus(): { configured: boolean; missing: string[] } {
    const missing: string[] = [];

    if (!this.config.supplierId) missing.push('VITE_TRENDYOL_SUPPLIER_ID');
    if (!this.config.apiKey) missing.push('VITE_TRENDYOL_API_KEY');
    if (!this.config.apiSecret) missing.push('VITE_TRENDYOL_API_SECRET');

    return {
      configured: missing.length === 0,
      missing,
    };
  }
}

export const trendyolService = new TrendyolService();
