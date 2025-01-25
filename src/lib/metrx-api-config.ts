export const METRX_API_BASE_URL = "https://metrx-factory.p.rapidapi.com/v1";
export const METRX_API_KEY =
  "20cb62d8a4msh116a3e6366bc134p180f39jsnce82b2e47130";
export const METRX_API_HOST = "metrx-factory.p.rapidapi.com";

export const fetchFromMetrxAPI = async (endpoint: string) => {
  const response = await fetch(`/api/metrx${endpoint}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};
