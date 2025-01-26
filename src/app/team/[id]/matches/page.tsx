'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '@/lib/api-config';
import { TeamMatchesResponse, TeamDetails } from '@/types/football';
import { useState } from 'react';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';

const SEASONS = [
  { label: '2023/24', value: '2024' },
  { label: '2022/23', value: '2023' },
  { label: '2021/22', value: '2022' },
];

interface PageProps {
  params: { id: string };
}

export default function TeamMatchesPage({
  params,
}: PageProps) {
  const [selectedSeason, setSelectedSeason] = useState(SEASONS[0].value);

  const { data: teamData, isLoading: isTeamLoading, error: teamError } = useQuery<TeamDetails>({
    queryKey: ['team', params.id],
    queryFn: () => fetchFromAPI(`/metrx/teams/${params.id}`),
    staleTime: 30 * 1000,
    retry: 1,
  });

  const { data: matchesData, isLoading: isMatchesLoading, error: matchesError } = useQuery<TeamMatchesResponse>({
    queryKey: ['team-matches', params.id, selectedSeason],
    queryFn: async () => {
      try {
        const response = await fetchFromAPI(`/metrx/teams/${params.id}/matches?season=${selectedSeason}`);
        if (!response) {
          throw new Error('No data received from API');
        }
        return response;
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Failed to fetch team matches');
      }
    },
    staleTime: 30 * 1000,
    retry: 1,
  });

  if (isTeamLoading || isMatchesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (teamError || matchesError) {
    return (
      <Alert variant="destructive" className="m-4">
        Error loading data: {(teamError || matchesError)?.message}
        <Link href="/" className="block mt-2 text-blue-500 hover:underline">
          Return to Home
        </Link>
      </Alert>
    );
  }

  if (!teamData || !matchesData) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link 
          href={`/team/${params.id}`}
          className="text-emerald-400 hover:text-emerald-300 transition-colors mb-8 inline-flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Team Profile
        </Link>

        <div className="bg-slate-800 rounded-xl shadow-xl mb-8 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-white text-center md:text-left mb-4">
                  {teamData.name} - Matches
                </h1>
                <div className="flex items-center gap-4">
                  <label htmlFor="season" className="text-white">Season:</label>
                  <select
                    id="season"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="bg-slate-700 text-white rounded px-3 py-1 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {SEASONS.map((season) => (
                      <option key={season.value} value={season.value}>
                        {season.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {matchesData.matches.map((match) => (
            <Link
              key={match.id}
              href={`/match/${match.id}`}
              className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition-colors group"
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <span className="text-white font-semibold">{match.homeTeam.name}</span>
                    {match.homeTeam.crest && (
                      <img
                        src={match.homeTeam.crest}
                        alt={match.homeTeam.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-emerald-400 text-sm mb-2">
                    {new Date(match.utcDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-white">
                      {match.score.fullTime.home ?? '-'}
                    </span>
                    <span className="text-slate-400">vs</span>
                    <span className="text-2xl font-bold text-white">
                      {match.score.fullTime.away ?? '-'}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 mt-2">
                    {match.competition.name}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    {match.awayTeam.crest && (
                      <img
                        src={match.awayTeam.crest}
                        alt={match.awayTeam.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <span className="text-white font-semibold">{match.awayTeam.name}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 