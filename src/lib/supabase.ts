import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          business_name: string;
          phone: string | null;
          subscription_tier: 'trial' | 'baslangic' | 'profesyonel' | 'enterprise';
          subscription_status: 'trial' | 'active' | 'expired' | 'cancelled';
          trial_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          business_name: string;
          phone?: string | null;
          subscription_tier?: 'trial' | 'baslangic' | 'profesyonel' | 'enterprise';
          subscription_status?: 'trial' | 'active' | 'expired' | 'cancelled';
          trial_ends_at?: string | null;
        };
        Update: {
          business_name?: string;
          phone?: string | null;
          subscription_tier?: 'trial' | 'baslangic' | 'profesyonel' | 'enterprise';
          subscription_status?: 'trial' | 'active' | 'expired' | 'cancelled';
          trial_ends_at?: string | null;
        };
      };
      customers: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          phone: string;
          email: string | null;
          total_orders: number;
          total_spent: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          business_id: string;
          customer_id: string;
          order_number: string;
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          items: any[];
          total_amount: number;
          shipping_address: string | null;
          tracking_number: string | null;
          marketplace: 'whatsapp' | 'trendyol' | 'n11' | 'hepsiburada' | 'other';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      integrations: {
        Row: {
          id: string;
          business_id: string;
          platform: 'whatsapp' | 'trendyol' | 'n11' | 'hepsiburada';
          api_key: string | null;
          api_secret: string | null;
          is_active: boolean;
          config: any;
          created_at: string;
          updated_at: string;
        };
      };
      message_templates: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          type: 'order_confirmation' | 'shipping_update' | 'delivery_notification' | 'custom';
          content: string;
          is_active: boolean;
          created_at: string;
        };
      };
      analytics: {
        Row: {
          id: string;
          business_id: string;
          date: string;
          total_orders: number;
          total_revenue: number;
          new_customers: number;
          messages_sent: number;
          created_at: string;
        };
      };
    };
  };
};
