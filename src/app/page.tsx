'use client';

import { useFootballData } from '@/hooks/useFootballData';
import { AreaCard } from '@/components/ui/AreaCard';

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
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Football Competitions
        </h1>
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
