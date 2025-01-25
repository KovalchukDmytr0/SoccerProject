'use client';

import { useFootballData } from '@/hooks/useFootballData';
import { AreaCard } from '@/components/ui/AreaCard';
import Link from 'next/link';

export default function Home() {
  const { organizedData, isLoading, error } = useFootballData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-red-500 text-xl">Error loading data. Please try again later.</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Football Competitions
          </h1>
          <Link
            href="/live-scores"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Live Scores
          </Link>
        </div>
        <p className="text-slate-400 text-center mb-12">
          Explore competitions by region
        </p>
        <div className="grid gap-6 md:gap-8">
          {Object.entries(organizedData).map(([areaName, { area, competitions }]) => (
            <AreaCard key={area.id} area={area} competitions={competitions} />
          ))}
        </div>
      </div>
    </main>
  );
}
