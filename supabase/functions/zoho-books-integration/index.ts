
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Get Zoho credentials from environment variables
    const ZOHO_CLIENT_ID = Deno.env.get("ZOHO_CLIENT_ID")
    const ZOHO_CLIENT_SECRET = Deno.env.get("ZOHO_CLIENT_SECRET")
    const ZOHO_REFRESH_TOKEN = Deno.env.get("ZOHO_REFRESH_TOKEN")
    
    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
      throw new Error("Zoho credentials not configured")
    }

    const { action, data } = await req.json()
    
    // Get a new access token using the refresh token
    async function getAccessToken() {
      const tokenUrl = "https://accounts.zoho.com/oauth/v2/token"
      const tokenParams = new URLSearchParams({
        refresh_token: ZOHO_REFRESH_TOKEN,
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token"
      })
      
      const response = await fetch(`${tokenUrl}?${tokenParams}`, {
        method: "POST"
      })
      
      const tokenData = await response.json()
      
      if (!tokenData.access_token) {
        throw new Error("Failed to obtain Zoho access token")
      }
      
      return tokenData.access_token
    }
    
    // Handle different actions
    let result = null
    const accessToken = await getAccessToken()
    
    switch (action) {
      case "list_contacts":
        result = await listContacts(accessToken, data)
        break
      case "list_invoices":
        result = await listInvoices(accessToken, data)
        break
      case "create_invoice":
        result = await createInvoice(accessToken, data)
        break
      default:
        throw new Error(`Unknown action: ${action}`)
    }
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    console.error("Zoho Books integration error:", error)
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    })
  }
})

// Zoho Books API functions
async function listContacts(accessToken: string, data: any) {
  const response = await fetch("https://books.zoho.com/api/v3/contacts", {
    headers: {
      "Authorization": `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json"
    }
  })
  
  return await response.json()
}

async function listInvoices(accessToken: string, data: any) {
  const response = await fetch("https://books.zoho.com/api/v3/invoices", {
    headers: {
      "Authorization": `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json"
    }
  })
  
  return await response.json()
}

async function createInvoice(accessToken: string, data: any) {
  const response = await fetch("https://books.zoho.com/api/v3/invoices", {
    method: "POST",
    headers: {
      "Authorization": `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  
  return await response.json()
}
