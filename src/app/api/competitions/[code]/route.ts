import { NextResponse } from "next/server";
import { API_KEY } from "@/lib/api-config";

type Props = {
  params: {
    code: string;
  };
};

export async function GET(
  _request: Request,
  { params }: Props
): Promise<NextResponse> {
  const { code } = params;

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
