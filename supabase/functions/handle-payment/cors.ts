
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function handleCorsRequest(): Response {
  return new Response('ok', { headers: corsHeaders });
}

export function createErrorResponse(message: string, status: number = 400): Response {
  return new Response(
    JSON.stringify({ 
      status: false,
      message: message,
      error: message 
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: status,
    },
  );
}

export function createSuccessResponse(data: any): Response {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    },
  );
}
