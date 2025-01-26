import { NextResponse } from "next/server";
import { API_KEY } from "@/lib/api-config";

interface RouteContext {
  params: { id: string };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = context.params;

    const response = await fetch(
      `https://api.football-data.org/v4/teams/${id}`,
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
    console.error("Error fetching team details:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch team details",
      },
      { status: 500 }
    );
  }
}
