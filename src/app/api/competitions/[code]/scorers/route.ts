import { NextResponse } from "next/server";
import { API_KEY } from "@/lib/api-config";

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const searchParams = new URL(request.url).searchParams;
  const season = searchParams.get("season") || "2024";
  const seasonParam = season ? `&season=${season}` : "";
  const code = await params.code;

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${code}/scorers?limit=10${seasonParam}`,
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
    console.error("Error fetching scorers:", error);
    return NextResponse.json(
      { error: "Failed to fetch scorers" },
      { status: 500 }
    );
  }
}
