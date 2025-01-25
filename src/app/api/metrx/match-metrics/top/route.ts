import { NextResponse } from "next/server";
import {
  METRX_API_BASE_URL,
  METRX_API_KEY,
  METRX_API_HOST,
} from "@/lib/metrx-api-config";

export async function GET(request: Request) {
  try {
    const response = await fetch(
      `${METRX_API_BASE_URL}/match-metrics/top?metric=abs(sub(TIH%2CTIA))&start=U&projections=MD%2CTI%2CXG&maxCount=10&order=DESC`,
      {
        headers: {
          "x-rapidapi-host": METRX_API_HOST,
          "x-rapidapi-key": METRX_API_KEY,
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
    console.error("Error fetching match metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch match metrics" },
      { status: 500 }
    );
  }
}
