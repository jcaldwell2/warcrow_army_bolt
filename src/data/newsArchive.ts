
import { translations } from "@/i18n/translations";
import { fetchNewsItems } from "@/utils/newsUtils";

export type NewsItem = {
  id: string;
  date: string;
  key: string; // Key in translations object
};

// Default news items that can be used when database fetch fails or is too slow
const DEFAULT_NEWS_ITEMS: NewsItem[] = [
  {
    id: "default-news-1",
    date: new Date().toISOString(),
    key: "news.default.latest"
  },
  {
    id: "default-news-2",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    key: "news.default.previous"
  }
];

// This will be populated from the database on initial load
export let newsItems: NewsItem[] = [...DEFAULT_NEWS_ITEMS];

// Try to get news from localStorage
const tryLoadFromLocalStorage = (): NewsItem[] => {
  try {
    const cachedNews = localStorage.getItem('cached_news_items');
    if (cachedNews) {
      const parsed = JSON.parse(cachedNews);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`Loaded ${parsed.length} news items from localStorage`);
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading news from localStorage:', e);
  }
  return [];
};

// Initialize with localStorage data if available
const localStorageNews = tryLoadFromLocalStorage();
if (localStorageNews.length > 0) {
  newsItems = localStorageNews;
}

// Initialize news items from database with timeout
export const initializeNewsItems = async (): Promise<NewsItem[]> => {
  try {
    console.log("Initializing news items from database...");
    
    // First check localStorage for immediate display
    const cachedNews = tryLoadFromLocalStorage();
    if (cachedNews.length > 0) {
      // Update the global variable immediately for instant access
      newsItems = cachedNews;
      console.log("Using cached news items from localStorage while fetching latest");
    }
    
    // Set up a very short timeout for the fetch (reduced to 700ms for faster fallback)
    const timeoutPromise = new Promise<NewsItem[]>((resolve) => {
      setTimeout(() => {
        console.log("Database fetch timeout, using cached or default news");
        // Return localStorage data or default items if timeout
        resolve(cachedNews.length > 0 ? cachedNews : DEFAULT_NEWS_ITEMS);
      }, 700); // Reduced to 700ms for faster fallback
    });
    
    // Actual fetch
    const fetchPromise = fetchNewsItems()
      .then(items => {
        console.log(`Fetched ${items.length} news items from database`);
        
        if (items.length === 0) {
          console.log("No news items returned from database, using cached or defaults");
          return cachedNews.length > 0 ? cachedNews : DEFAULT_NEWS_ITEMS;
        }
        
        // Cache in localStorage for future use
        try {
          localStorage.setItem('cached_news_items', JSON.stringify(items));
          console.log('Cached news items in localStorage');
        } catch (e) {
          console.error('Failed to cache news items:', e);
        }
        
        // Update the global variable
        newsItems = items;
        
        return items;
      })
      .catch(error => {
        console.error("Error fetching news items:", error);
        // Use localStorage on error
        if (cachedNews.length > 0) {
          console.log('Using cached news after fetch error');
          return cachedNews;
        }
        console.log('No cached news available, using defaults');
        return DEFAULT_NEWS_ITEMS;
      });
    
    // Race between the timeout and the fetch
    const result = await Promise.race([fetchPromise, timeoutPromise]);
    
    // Make sure we have at least the default items
    if (!result || result.length === 0) {
      console.log("No news items from any source, using defaults");
      return DEFAULT_NEWS_ITEMS;
    }
    
    return result;
  } catch (error) {
    console.error("Error initializing news items:", error);
    
    // Try localStorage on error
    const cachedNews = tryLoadFromLocalStorage();
    if (cachedNews.length > 0) {
      console.log('Using cached news after initialization error');
      newsItems = cachedNews;
      return cachedNews;
    }
    
    // Return default items on error
    console.log('Using default news items after error');
    return DEFAULT_NEWS_ITEMS;
  }
};

// Function to add a new news item locally (after DB update)
export const addNewsItem = (id: string, date: string, key: string) => {
  // Add news item to the beginning of the array (newest first)
  newsItems.unshift({
    id,
    date,
    key
  });
  
  // Update localStorage
  try {
    localStorage.setItem('cached_news_items', JSON.stringify(newsItems));
  } catch (e) {
    console.error('Failed to update news cache:', e);
  }
};

// Function to update an existing news item locally (after DB update)
export const updateNewsItemInArchive = (id: string, date: string, key: string) => {
  const index = newsItems.findIndex(item => item.id === id);
  if (index !== -1) {
    newsItems[index] = {
      id,
      date,
      key
    };
    
    // Update localStorage
    try {
      localStorage.setItem('cached_news_items', JSON.stringify(newsItems));
    } catch (e) {
      console.error('Failed to update news cache:', e);
    }
    
    return true;
  }
  return false;
};

// Function to delete a news item locally (after DB delete)
export const deleteNewsItemFromArchive = (id: string) => {
  const index = newsItems.findIndex(item => item.id === id);
  if (index !== -1) {
    newsItems.splice(index, 1);
    
    // Update localStorage
    try {
      localStorage.setItem('cached_news_items', JSON.stringify(newsItems));
    } catch (e) {
      console.error('Failed to update news cache:', e);
    }
    
    return true;
  }
  return false;
};
