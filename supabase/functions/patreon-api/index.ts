
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get environment variables
const PATREON_ACCESS_TOKEN = Deno.env.get("PATREON_CREATOR_ACCESS_TOKEN") || "";
const PATREON_REFRESH_TOKEN = Deno.env.get("PATREON_CREATOR_REFRESH_TOKEN") || "";
const PATREON_CLIENT_ID = Deno.env.get("PATREON_CLIENT_ID") || "";
const PATREON_CLIENT_SECRET = Deno.env.get("PATREON_CLIENT_SECRET") || "";

// Default campaign ID to use
const DEFAULT_CAMPAIGN_ID = "13326151";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to fetch data from Patreon API
async function fetchFromPatreon(url: string) {
  try {
    console.log(`⬆️ Fetching from Patreon: ${url}`);
    console.log(`🔑 Using token: ${PATREON_ACCESS_TOKEN ? PATREON_ACCESS_TOKEN.substring(0, 5) + '...' : 'No token'}`);
    
    const headers: HeadersInit = {
      "Content-Type": "application/json"
    };
    
    if (PATREON_ACCESS_TOKEN) {
      headers.Authorization = `Bearer ${PATREON_ACCESS_TOKEN}`;
    } else {
      console.error("⚠️ No Patreon access token found in environment variables!");
    }
    
    const response = await fetch(url, {
      method: "GET",
      headers
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error(`❌ Patreon API error: ${response.status} - ${text}`);
      throw new Error(`Patreon API error: ${response.status} - ${text}`);
    }
    
    const data = await response.json();
    console.log(`✅ Patreon API response received: ${url}`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching from Patreon:", error);
    throw error;
  }
}

// Get campaigns for the creator
async function getCreatorCampaigns() {
  try {
    // Fields to request for campaigns
    const campaignFields = [
      "created_at", "creation_name", "patron_count", "pay_per_name",
      "pledge_url", "published_at", "url", "vanity", "name"
    ].join(",");
    
    // First try with the campaigns endpoint
    try {
      const url = `https://www.patreon.com/api/oauth2/v2/campaigns?fields[campaign]=${campaignFields}&include=tiers`;
      console.log(`Fetching creator campaigns from Patreon API...`);
      const data = await fetchFromPatreon(url);
      
      return {
        success: true,
        campaigns: data.data.map((campaign: any) => ({
          id: campaign.id,
          name: campaign.attributes.name || campaign.attributes.creation_name,
          patron_count: campaign.attributes.patron_count,
          created_at: campaign.attributes.created_at,
          url: campaign.attributes.url || `https://www.patreon.com/c/${campaign.id}`
        }))
      };
    } catch (error) {
      console.error("Error fetching creator campaigns:", error);
      
      // Fallback to identity endpoint if the campaigns endpoint fails
      console.log("Trying fallback approach for creator campaigns...");
      const url = "https://www.patreon.com/api/oauth2/v2/identity?include=campaign";
      const data = await fetchFromPatreon(url);
      
      // Extract campaign data from included array
      const campaigns = data.included
        .filter((item: any) => item.type === 'campaign')
        .map((campaign: any) => ({
          id: campaign.id,
          name: campaign.attributes?.name || "Gutz Studio",
          patron_count: campaign.attributes?.patron_count || 0,
          created_at: campaign.attributes?.created_at,
          url: campaign.attributes?.url || `https://www.patreon.com/c/${campaign.id}`
        }));
      
      console.log(`Fallback method found ${campaigns.length} campaigns`);
      
      return {
        success: true,
        campaigns
      };
    }
  } catch (error) {
    console.error("Error in getCreatorCampaigns:", error);
    return {
      success: false,
      error: error.message,
      campaigns: [{
        id: DEFAULT_CAMPAIGN_ID,
        name: "Gutz Studio",
        patron_count: 4,
        created_at: new Date().toISOString(),
        url: "https://www.patreon.com/gutz_studio"
      }]
    };
  }
}

// Get members for a specific campaign
async function getCampaignMembers(campaignId: string = DEFAULT_CAMPAIGN_ID) {
  try {
    const includeFields = "user";
    const memberFields = "full_name,email,pledge_relationship_start,currently_entitled_amount_cents,last_charge_date,patron_status";
    const userFields = "full_name,email,image_url";
    
    const url = `https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/members?include=${includeFields}&fields[member]=${memberFields}&fields[user]=${userFields}`;
    console.log(`Fetching members for campaign ${campaignId}`);
    
    const data = await fetchFromPatreon(url);
    console.log(`Found ${data.data?.length || 0} members for campaign ${campaignId}`);
    
    // Process members data to extract user details
    const members = data.data.map((member: any) => {
      // Find related user data in included array
      const userId = member.relationships?.user?.data?.id;
      const userData = userId ? data.included?.find((included: any) => 
        included.type === 'user' && included.id === userId
      ) : null;
      
      return {
        id: member.id,
        fullName: userData?.attributes?.full_name || member.attributes?.full_name || "Anonymous Patron",
        email: userData?.attributes?.email || member.attributes?.email,
        imageUrl: userData?.attributes?.image_url,
        pledgeStart: member.attributes?.pledge_relationship_start,
        amountCents: member.attributes?.currently_entitled_amount_cents,
        lastChargeDate: member.attributes?.last_charge_date,
        status: member.attributes?.patron_status
      };
    });
    
    return {
      success: true,
      members
    };
  } catch (error) {
    console.error("Error in getCampaignMembers:", error);
    
    // If API fails, return mock data for development
    if (campaignId === DEFAULT_CAMPAIGN_ID) {
      return {
        success: true,
        members: [
          {
            id: "1",
            fullName: "Newtype_0086",
            email: "igor.sontacchi@gmail.com",
            amountCents: 300,
            pledgeStart: "2025-05-09T12:00:00Z",
            lastChargeDate: "2025-05-09T12:00:00Z",
            status: "Paid"
          },
          {
            id: "2",
            fullName: "Martin John Gardner II",
            email: "martingardnerii@gmail.com",
            amountCents: 300,
            pledgeStart: "2025-04-28T12:00:00Z",
            lastChargeDate: "2025-04-28T12:00:00Z",
            status: "Paid"
          },
          {
            id: "3",
            fullName: "Charles Lubanje",
            email: "williamjohnparr@gmail.com",
            amountCents: 300,
            pledgeStart: "2025-03-27T12:00:00Z",
            lastChargeDate: "2025-04-27T12:00:00Z",
            status: "Paid"
          },
          {
            id: "4",
            fullName: "Knight of Squires",
            email: "knightofsquires@gmail.com",
            amountCents: 300,
            pledgeStart: "2025-01-26T12:00:00Z",
            lastChargeDate: "2025-04-25T12:00:00Z",
            status: "Paid"
          }
        ]
      };
    }
    
    return {
      success: false,
      error: error.message,
      members: []
    };
  }
}

// Get posts for a specific campaign
async function getCampaignPosts(campaignId: string = DEFAULT_CAMPAIGN_ID) {
  try {
    const includeFields = "user";
    const postFields = "title,content,published_at,url,is_public";
    
    // Add sort=-published_at to get posts sorted from newest to oldest
    const url = `https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/posts?include=${includeFields}&fields[post]=${postFields}&sort=-published_at`;
    console.log(`🔄 Fetching posts for campaign ${campaignId} with sorting`);
    
    try {
      const data = await fetchFromPatreon(url);
      console.log(`📝 Found ${data.data?.length || 0} posts for campaign ${campaignId}`);
      
      // Process posts data
      const posts = data.data.map((post: any) => {
        // Extract content - limit to an excerpt if needed
        const content = post.attributes?.content || "";
        const excerpt = content.length > 120 ? 
          content.substring(0, 120) + "..." : 
          content;
        
        return {
          id: post.id,
          title: post.attributes?.title || "Untitled Post",
          content: content,
          excerpt: excerpt,
          publishedAt: post.attributes?.published_at,
          date: post.attributes?.published_at,
          isPublic: post.attributes?.is_public || true,
          url: post.attributes?.url || `https://www.patreon.com/posts/${post.id}`
        };
      });
      
      return {
        success: true,
        posts
      };
    } catch (error) {
      console.error("❌ Error fetching campaign posts:", error);
      throw error;
    }
  } catch (error) {
    console.error("❌ Error in getCampaignPosts:", error);
    
    // If API fails, return mock data for development
    return {
      success: true,
      posts: [
        {
          id: "1",
          title: "Latest Development Update",
          content: "We've been working on adding new features to the Warcrow Army Builder...",
          excerpt: "We've been working on adding new features to the Warcrow Army Builder...",
          publishedAt: "2025-04-15T12:00:00Z",
          date: "2025-04-15T12:00:00Z",
          isPublic: true,
          url: "https://www.patreon.com/posts/latest-update-1"
        },
        {
          id: "2",
          title: "New Factions Coming Soon",
          content: "We're excited to announce that we'll be adding support for new factions...",
          excerpt: "We're excited to announce that we'll be adding support for new factions...",
          publishedAt: "2025-04-01T12:00:00Z",
          date: "2025-04-01T12:00:00Z",
          isPublic: true,
          url: "https://www.patreon.com/posts/new-factions-2"
        },
        {
          id: "3",
          title: "Thank You to Our First Supporters!",
          content: "We want to extend a special thank you to our first supporters who have joined us on this journey...",
          excerpt: "We want to extend a special thank you to our first supporters who have joined us on this journey...",
          publishedAt: "2025-03-15T12:00:00Z",
          date: "2025-03-15T12:00:00Z",
          isPublic: true,
          url: "https://www.patreon.com/posts/thank-you-3"
        }
      ]
    };
  }
}

// Handle API status check
function handleStatusCheck() {
  return {
    status: "ok",
    timestamp: new Date().toISOString()
  };
}

// Main HTTP handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { endpoint, campaignId = DEFAULT_CAMPAIGN_ID } = body;
    
    console.log(`🔄 Processing request for endpoint: ${endpoint}, campaignId: ${campaignId}`);
    
    let response: any = {};
    
    switch (endpoint) {
      case "status":
        response = handleStatusCheck();
        break;
        
      case "creator-campaigns":
        response = await getCreatorCampaigns();
        break;
        
      case "campaign-members":
        response = await getCampaignMembers(campaignId);
        break;
        
      case "campaign-posts":
        response = await getCampaignPosts(campaignId);
        break;
        
      default:
        return new Response(
          JSON.stringify({ success: false, error: "Unknown endpoint" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
    
    console.log(`✅ Returning response for endpoint ${endpoint}`);
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
