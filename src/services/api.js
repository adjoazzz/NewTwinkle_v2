// src/services/api.js

const API_BASE_URL = 'https://wallpaper-backend-ihsi.onrender.com';

console.log('🌐 API Base URL:', API_BASE_URL);

export const pinterestAPI = {
  scrapeBoard: async (url, limit = 15) => {
    try {
      console.log('📡 Fetching from:', `${API_BASE_URL}/api/scrape-board/`);
      console.log('⏰ This may take up to 60 seconds on first load...');
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch(`${API_BASE_URL}/api/scrape-board/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, limit }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Log the response status and headers
      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', response.headers);

      // Get the raw text first to see what we're actually getting
      const rawText = await response.text();
      console.log('📄 Raw response (first 200 chars):', rawText.substring(0, 200));

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        console.error('❌ JSON parse failed. Full response:', rawText);
        throw new Error('Server returned invalid response. It might be an HTML error page.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch images');
      }

      console.log('✅ Success! Fetched', data.image_count, 'images');
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('⏱️ Request timed out after 60 seconds');
        throw new Error('The server is taking too long to respond. Please try again in a moment.');
      }
      console.error('❌ API Error:', error);
      throw error;
    }
  }
};

export const checkAPIHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/`, {
      method: 'HEAD',
    });
    return response.ok;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
};