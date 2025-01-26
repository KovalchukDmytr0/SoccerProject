'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '@/lib/api-config';
import { CompetitionTeamsResponse } from '@/types/football';
import { useState } from 'react';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';

interface PageProps {
  params: { code: string };
}

export default function CompetitionTeamsPage({
  params,
}: PageProps) {
  const [selectedSeason, setSelectedSeason] = useState('2024');

  const { data, isLoading, error } = useQuery<CompetitionTeamsResponse>({
    queryKey: ['competition-teams', params.code, selectedSeason],
    queryFn: () => fetchFromAPI(`/competitions/${params.code}/teams?season=${selectedSeason}`),
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" className="m-4">
        Error loading teams: {error.message}
        <Link href="/" className="block mt-2 text-blue-500 hover:underline">
          Return to Home
        </Link>
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/"
          className="text-emerald-400 hover:text-emerald-300 transition-colors mb-8 inline-flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Competitions
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{data.competition.name} Teams</h1>
          <div className="flex items-center gap-4">
            <label htmlFor="season" className="text-white">Season:</label>
            <select
              id="season"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="bg-slate-700 text-white rounded px-3 py-1 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="2024">2023/24</option>
              <option value="2023">2022/23</option>
              <option value="2022">2021/22</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.teams.map((team) => (
            <Link
              key={team.id}
              href={`/team/${team.id}`}
              className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors group"
            >
              <div className="flex flex-col items-center text-center">
                {team.crest && (
                  <div className="w-24 h-24 mb-4 group-hover:scale-110 transition-transform">
                    <img
                      src={team.crest}
                      alt={`${team.name} crest`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <h2 className="text-xl font-semibold text-white mb-2">{team.name}</h2>
                <p className="text-slate-400 text-sm">{team.tla}</p>
                {team.venue && (
                  <p className="text-slate-400 text-sm mt-2">{team.venue}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 