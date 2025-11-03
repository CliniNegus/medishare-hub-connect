import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting cleanup of deleted accounts...');

    // Find accounts that are past their restoration period
    const { data: expiredAccounts, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('is_deleted', true)
      .lt('can_restore_until', new Date().toISOString());

    if (fetchError) {
      console.error('Error fetching expired accounts:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${expiredAccounts?.length || 0} expired accounts to delete`);

    let deletedCount = 0;
    let errorCount = 0;

    // Delete each expired account permanently
    for (const account of expiredAccounts || []) {
      try {
        const { error: deleteError } = await supabase.rpc('permanent_delete_account', {
          target_user_id: account.id
        });

        if (deleteError) {
          console.error(`Error deleting account ${account.email}:`, deleteError);
          errorCount++;
        } else {
          console.log(`Successfully deleted account: ${account.email}`);
          deletedCount++;
        }
      } catch (err) {
        console.error(`Exception deleting account ${account.email}:`, err);
        errorCount++;
      }
    }

    const result = {
      success: true,
      message: `Cleanup completed. Deleted ${deletedCount} accounts. ${errorCount} errors.`,
      deletedCount,
      errorCount,
      timestamp: new Date().toISOString()
    };

    console.log('Cleanup result:', result);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Cleanup function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
