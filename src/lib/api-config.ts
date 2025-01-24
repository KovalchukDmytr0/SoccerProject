export const API_BASE_URL = "https://api.football-data.org/v4";
export const API_KEY = "1d5f567d60da491da8e34d9c763ac903";

export const fetchFromAPI = async (endpoint: string) => {
  const response = await fetch(`/api${endpoint}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};
