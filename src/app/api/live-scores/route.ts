import { NextResponse } from "next/server";

const RAPID_API_KEY = "20cb62d8a4msh116a3e6366bc134p180f39jsnce82b2e47130";
const RAPID_API_HOST = "livescore6.p.rapidapi.com";

export async function GET(request: Request) {
  try {
    // Get timezone from query parameter or default to -7
    const { searchParams } = new URL(request.url);
    const timezone = searchParams.get("timezone") || "-7";

    const response = await fetch(
      `https://livescore6.p.rapidapi.com/matches/v2/list-live?Category=soccer&Timezone=${timezone}`,
      {
        headers: {
          "x-rapidapi-host": RAPID_API_HOST,
          "x-rapidapi-key": RAPID_API_KEY,
        },
        next: { revalidate: 60 }, // Cache for 1 minute since it's live data
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching live scores:", error);
    return NextResponse.json(
      { error: "Failed to fetch live scores" },
      { status: 500 }
    );
  }
}
