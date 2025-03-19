// API base URL
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

/**
 * Get teams from the server
 */
export async function getTeams() {
  console.log(`Fetching teams from ${API_URL}/teams`);
  
  try {
    const response = await fetch(`${API_URL}/teams`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response not OK:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Teams data received successfully');
    return data;
  } catch (error) {
    console.error('Failed to fetch teams:', error);
    
    // Return mock data during development when API is unavailable
    if (process.env.NODE_ENV !== 'production') {
      console.log('Using mock data as fallback');
      return [
        { team_number: 1234, nickname: "Mock Team 1" },
        { team_number: 5678, nickname: "Mock Team 2" },
        { team_number: 9012, nickname: "Mock Team 3" }
      ];
    }
    
    throw error;
  }
}

/**
 * Check server health
 */
export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'Server unavailable', error: error.message };
  }
}

/**
 * Get matches from the server
 */
export async function getMatches() {
  console.log(`Fetching matches from ${API_URL}/matches`);
  
  try {
    const response = await fetch(`${API_URL}/matches`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response not OK:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Matches data received successfully');
    return data;
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    
    // Return mock data during development when API is unavailable
    if (process.env.NODE_ENV !== 'production') {
      console.log('Using mock match data as fallback');
    }
    
    throw error;
  }
}