import { NextResponse } from "next/server";
import { API_KEY } from "@/lib/api-config";

interface Params {
  code: string;
}

export async function GET(
  request: Request,
  context: { params: Params }
): Promise<NextResponse> {
  const { code } = context.params;

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${code}`,
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
    console.error("Error fetching competition details:", error);
    return NextResponse.json(
      { error: "Failed to fetch competition details" },
      { status: 500 }
    );
  }
}
