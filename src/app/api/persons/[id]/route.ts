import { NextResponse } from "next/server";
import { API_KEY } from "@/lib/api-config";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `https://api.football-data.org/v4/persons/${params.id}`,
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
    console.error("Error fetching person details:", error);
    return NextResponse.json(
      { error: "Failed to fetch person details" },
      { status: 500 }
    );
  }
}
