import { NextResponse } from "next/server";
import { API_KEY } from "@/lib/api-config";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const searchParams = new URL(request.url).searchParams;
  const season = searchParams.get("season") || "2024";
  const seasonParam = season ? `&season=${season}` : "";
  const id = await params.id;

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/teams/${id}/matches?limit=40${seasonParam}`,
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
    console.error("Error fetching team matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch team matches" },
      { status: 500 }
    );
  }
}
