import { NextResponse } from "next/server";
import { API_KEY } from "@/lib/api-config";

export async function GET(
  request: Request,
  context: { params: { code: string } }
) {
  const { code } = context.params;
  const { searchParams } = new URL(request.url);
  const season = searchParams.get("season") || "2024";

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${code}/teams?season=${season}`,
      {
        headers: {
          "X-Auth-Token": API_KEY,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching competition teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch competition teams" },
      { status: 500 }
    );
  }
}
