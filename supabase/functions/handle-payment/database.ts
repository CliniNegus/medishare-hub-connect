
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { PaystackInitializeResponse } from './types.ts';

export class DatabaseService {
  private supabase: any;

  constructor() {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (supabaseUrl && supabaseServiceKey) {
      this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
    }
  }

  async updateTransaction(reference: string, paystackResponse: PaystackInitializeResponse, metadata: any) {
    if (!this.supabase) {
      console.log('Supabase client not initialized');
      return;
    }

    const { error: updateError } = await this.supabase
      .from('transactions')
      .update({ 
        paystack_reference: paystackResponse.data.reference,
        metadata: {
          ...metadata,
          access_code: paystackResponse.data.access_code,
          authorization_url: paystackResponse.data.authorization_url
        }
      })
      .eq('reference', reference);

    if (updateError) {
      console.error('Failed to update transaction:', updateError);
    } else {
      console.log('Transaction updated with Paystack details');
    }
  }
}
