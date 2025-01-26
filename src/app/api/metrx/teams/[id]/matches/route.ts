import { NextResponse } from "next/server";
import { API_KEY } from "@/lib/api-config";

interface RouteContext {
  params: { id: string };
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = context.params;
    const url = new URL(request.url);
    const season = url.searchParams.get("season") || "2024";

    const response = await fetch(
      `https://api.football-data.org/v4/teams/${id}/matches?season=${season}`,
      {
        headers: {
          "X-Auth-Token": API_KEY,
        },
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching team matches:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch team matches",
      },
      { status: 500 }
    );
  }
}
