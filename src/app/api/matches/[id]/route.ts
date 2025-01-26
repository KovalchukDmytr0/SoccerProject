import { NextResponse } from "next/server";
import { API_KEY } from "@/lib/api-config";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `https://api.football-data.org/v4/matches/${params.id}`,
      {
        headers: {
          "X-Auth-Token": API_KEY,
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching match details:", error);
    return NextResponse.json(
      { error: "Failed to fetch match details" },
      { status: 500 }
    );
  }
}
