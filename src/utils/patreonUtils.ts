import { supabase } from "@/integrations/supabase/client";

/**
 * Default Patreon Campaign ID to use
 */
export const DEFAULT_CAMPAIGN_ID = "13326151";

/**
 * Patron/Member types and interfaces
 */
export interface PatreonPatron {
  id: string;
  fullName: string;
  email?: string;
  imageUrl?: string;
  pledgeStart?: string;
  amountCents: number;
  status?: string;
  lastChargeDate?: string;
  // Legacy fields for backwards compatibility
  full_name?: string;
  pledge_relationship_start?: string;
}

/**
 * Campaign types and interfaces
 */
export interface PatreonCampaign {
  id: string;
  name: string;
  patron_count: number;
  created_at: string;
  url: string;
  summary?: string;
  tiers?: PatreonTier[]; // Added tiers property
}

/**
 * Post types and interfaces
 */
export interface PatreonPost {
  id: string;
  title: string;
  content: string;
  publishedAt: string; 
  url: string;
  excerpt?: string;
  date: string;
  isPublic?: boolean;
}

/**
 * Tier types and interfaces
 */
export interface PatreonTier {
  id: string;
  title: string;
  description: string;
  amountCents: number; // Ensure consistent camelCase naming
  userCount: number;
  imageUrl?: string;
  published?: boolean;
  // Legacy field for backwards compatibility
  amount_cents?: number;
}

/**
 * Gets the URL for the Patreon campaign
 */
export const getPatreonCampaignUrl = () => {
  return "https://www.patreon.com/warcrowarmybuilder";
};

/**
 * Gets information about the campaign including tiers, patron count, etc.
 */
export const getPatreonCampaignInfo = async (campaignId: string = DEFAULT_CAMPAIGN_ID) => {
  try {
    const campaigns = await getCreatorCampaigns();
    
    // Return the campaign with the specified ID if found
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      return campaign;
    }
    
    // Return the first campaign if any were found but not the specific one
    if (campaigns && campaigns.length > 0) {
      return campaigns[0];
    }
    
    // If API fails, return mock data for development purposes
    return {
      id: campaignId,
      name: "Warcrow Army Builder",
      patron_count: 5,
      created_at: "2025-01-01T00:00:00Z",
      url: "https://www.patreon.com/warcrowarmybuilder",
      tiers: [
        {
          id: "tier-1",
          title: "Supporter",
          description: "Basic support for the Warcrow Army Builder project.",
          amountCents: 300,
          userCount: 3,
          published: true
        },
        {
          id: "tier-2",
          title: "Enthusiast",
          description: "Get early access to new features and provide feedback.",
          amountCents: 500,
          userCount: 2,
          published: true
        },
        {
          id: "tier-3",
          title: "Champion",
          description: "Full support with exclusive perks and priority features.",
          amountCents: 1000,
          userCount: 0,
          published: true
        }
      ]
    };
  } catch (err) {
    console.error('Error fetching Patreon campaign info:', err);
    return null;
  }
};

/**
 * Formats a Patreon amount in cents to a display string
 * @param amountCents Amount in cents
 * @returns Formatted string (e.g., "$5 per month")
 */
export const formatPatreonAmount = (amountCents: number): string => {
  const dollars = (amountCents / 100).toFixed(0);
  return `$${dollars} per month`;
};

/**
 * Checks if Patreon API is operational
 */
export const checkPatreonApiStatus = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('patreon-api', {
      body: {
        endpoint: 'status'
      }
    });
    
    if (error) {
      console.error('Error checking Patreon API status:', error);
      return { status: 'down', error: error.message };
    }
    
    return { status: 'operational', data };
  } catch (err: any) {
    console.error('Error in checkPatreonApiStatus:', err);
    return { status: 'down', error: err.message };
  }
};

/**
 * Fetches the Patreon campaign information from the Supabase Edge Function
 * @returns Campaign information including ID, name, and patron count
 */
export const fetchPatreonCampaigns = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('patreon-api', {
      body: {
        endpoint: 'creator-campaigns'
      }
    });

    if (error) {
      console.error('Error fetching Patreon campaigns:', error);
      return { 
        success: false, 
        error: error.message, 
        campaigns: [] 
      };
    }

    return {
      success: true,
      campaigns: data.campaigns || []
    };
  } catch (err: any) {
    console.error('Error in fetchPatreonCampaigns:', err);
    return { 
      success: false, 
      error: err.message, 
      campaigns: [] 
    };
  }
};

/**
 * Get creator campaigns
 */
export const getCreatorCampaigns = async (): Promise<PatreonCampaign[]> => {
  try {
    const result = await fetchPatreonCampaigns();
    
    if (result.success && result.campaigns) {
      return result.campaigns;
    }
    
    // If API failed or returned no campaigns, return mock data with the default campaign ID
    return [{
      id: DEFAULT_CAMPAIGN_ID,
      name: "Gutz Studio",
      patron_count: 4,
      created_at: "2025-01-01T00:00:00Z",
      url: "https://www.patreon.com/gutz_studio"
    }];
  } catch (err) {
    console.error('Error in getCreatorCampaigns:', err);
    return [{
      id: DEFAULT_CAMPAIGN_ID,
      name: "Gutz Studio",
      patron_count: 4,
      created_at: "2025-01-01T00:00:00Z",
      url: "https://www.patreon.com/gutz_studio"
    }];
  }
};

/**
 * Fetches Patreon members (supporters) for a specific campaign
 * @param campaignId The Patreon campaign ID
 * @returns List of campaign members/supporters
 */
export const fetchCampaignMembers = async (campaignId: string = DEFAULT_CAMPAIGN_ID) => {
  try {
    const { data, error } = await supabase.functions.invoke('patreon-api', {
      body: {
        endpoint: 'campaign-members',
        campaignId
      }
    });

    if (error) {
      console.error('Error fetching campaign members:', error);
      return { 
        success: false, 
        error: error.message, 
        members: [] 
      };
    }

    return {
      success: true,
      members: data.members || []
    };
  } catch (err: any) {
    console.error('Error in fetchCampaignMembers:', err);
    return { 
      success: false, 
      error: err.message, 
      members: [] 
    };
  }
};

/**
 * Gets list of patrons for the given campaign
 * @param campaignId Optional campaign ID, will use the default if not specified
 */
export const getPatreonPatrons = async (campaignId: string = DEFAULT_CAMPAIGN_ID): Promise<PatreonPatron[]> => {
  try {
    const result = await fetchCampaignMembers(campaignId);
    
    if (result.success && result.members) {
      return result.members.map(member => ({
        id: member.id,
        fullName: member.fullName,
        email: member.email,
        imageUrl: member.imageUrl,
        pledgeStart: member.pledgeStart,
        amountCents: member.amountCents || 0,
        status: member.status,
        lastChargeDate: member.lastChargeDate,
        // Legacy fields for backwards compatibility
        full_name: member.fullName,
        pledge_relationship_start: member.pledgeStart
      }));
    }
    
    // If we couldn't get real data, return mock data based on user's details
    return [
      {
        id: "1",
        fullName: "Newtype_0086",
        email: "igor.sontacchi@gmail.com",
        amountCents: 300,
        pledgeStart: "2025-05-09T12:00:00Z",
        lastChargeDate: "2025-05-09T12:00:00Z",
        status: "Paid",
        full_name: "Newtype_0086",
        pledge_relationship_start: "2025-05-09T12:00:00Z"
      },
      {
        id: "2",
        fullName: "Martin John Gardner II",
        email: "martingardnerii@gmail.com",
        amountCents: 300,
        pledgeStart: "2025-04-28T12:00:00Z",
        lastChargeDate: "2025-04-28T12:00:00Z",
        status: "Paid",
        full_name: "Martin John Gardner II",
        pledge_relationship_start: "2025-04-28T12:00:00Z"
      },
      {
        id: "3",
        fullName: "Charles Lubanje",
        email: "williamjohnparr@gmail.com",
        amountCents: 300,
        pledgeStart: "2025-03-27T12:00:00Z",
        lastChargeDate: "2025-04-27T12:00:00Z",
        status: "Paid",
        full_name: "Charles Lubanje",
        pledge_relationship_start: "2025-03-27T12:00:00Z"
      },
      {
        id: "4",
        fullName: "Knight of Squires",
        email: "knightofsquires@gmail.com",
        amountCents: 300,
        pledgeStart: "2025-01-26T12:00:00Z",
        lastChargeDate: "2025-04-25T12:00:00Z",
        status: "Paid",
        full_name: "Knight of Squires",
        pledge_relationship_start: "2025-01-26T12:00:00Z"
      }
    ];
  } catch (err) {
    console.error('Error in getPatreonPatrons:', err);
    return [];
  }
};

/**
 * Fetches campaign posts from the Supabase Edge Function
 * @param campaignId The Patreon Campaign ID
 * @returns Posts from the campaign, sorted from newest to oldest
 */
export const fetchCampaignPosts = async (campaignId: string = DEFAULT_CAMPAIGN_ID) => {
  try {
    console.log(`📤 Calling Supabase function 'patreon-api' with campaignId: ${campaignId}`);
    
    const { data, error } = await supabase.functions.invoke('patreon-api', {
      body: {
        endpoint: 'campaign-posts',
        campaignId
      }
    });

    if (error) {
      console.error('❌ Error fetching Patreon posts:', error);
      return { 
        success: false, 
        error: error.message, 
        posts: [] 
      };
    }

    console.log('📥 Response from patreon-api function:', data);
    
    return {
      success: true,
      posts: data.posts || []
    };
  } catch (err: any) {
    console.error('❌ Error in fetchCampaignPosts:', err);
    return { 
      success: false, 
      error: err.message, 
      posts: [] 
    };
  }
};

/**
 * Gets recent posts from Patreon campaign
 * Posts are already sorted by the API from newest to oldest
 */
export const getPatreonPosts = async (campaignId: string = DEFAULT_CAMPAIGN_ID): Promise<PatreonPost[]> => {
  try {
    console.log(`🔄 Fetching Patreon posts for campaign: ${campaignId}`);
    const result = await fetchCampaignPosts(campaignId);
    
    if (result.success && result.posts && result.posts.length > 0) {
      console.log(`✅ Successfully retrieved ${result.posts.length} posts from Patreon API`);
      // Posts are already sorted by the API (sort=-published_at)
      return result.posts;
    }
    
    console.warn(`⚠️ Using mock data because: ${result.error || 'No posts received from API'}`);
    // Return mock data if API call failed
    return [
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
    ];
  } catch (err) {
    console.error('❌ Error in getPatreonPosts:', err);
    return [
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
      }
    ];
  }
};
