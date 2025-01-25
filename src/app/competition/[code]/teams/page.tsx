'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '@/lib/api-config';
import { CompetitionTeamsResponse } from '@/types/football';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';

const AVAILABLE_SEASONS = ['2024', '2023', '2022'];

export default function CompetitionTeamsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const resolvedParams = use(params);
  const [selectedSeason, setSelectedSeason] = useState('2024');

  const { data, isLoading, error } = useQuery<CompetitionTeamsResponse>({
    queryKey: ['competition-teams', resolvedParams.code, selectedSeason],
    queryFn: () => fetchFromAPI(`/competitions/${resolvedParams.code}/teams?season=${selectedSeason}`),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-red-500 text-xl">Error loading competition teams. Please try again later.</div>
      </div>
    );
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

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            {data.competition.emblem && (
              <div className="relative w-24 h-24">
                <Image
                  src={data.competition.emblem}
                  alt={data.competition.name}
                  fill
                  className="object-contain"
                  sizes="96px"
                  priority
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {data.competition.name} Teams
              </h1>
              <div className="flex items-center gap-3">
                {data.competition.area?.flag && (
                  <div className="relative w-6 h-6">
                    <Image
                      src={data.competition.area.flag}
                      alt={data.competition.area.name}
                      fill
                      className="object-cover rounded-full"
                      sizes="24px"
                    />
                  </div>
                )}
                <p className="text-slate-400">{data.competition.area?.name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label htmlFor="season" className="text-white font-medium">
              Season:
            </label>
            <select
              id="season"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {AVAILABLE_SEASONS.map((season) => (
                <option key={season} value={season}>
                  {season}/{(parseInt(season) + 1).toString().slice(-2)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {data.season.winner && (
          <div className="mb-8 bg-emerald-500/10 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <Image
                  src={data.season.winner.crest}
                  alt={data.season.winner.name}
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
              <div>
                <div className="text-emerald-400 text-sm font-medium mb-1">Season Champion</div>
                <h3 className="text-xl font-semibold text-white">
                  {data.season.winner.name}
                </h3>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.teams.map((team) => (
            <div
              key={team.id}
              className="bg-slate-800/50 rounded-xl overflow-hidden shadow-xl hover:bg-slate-800/70 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {team.crest && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={team.crest}
                        alt={team.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <Link
                      href={`/team/${team.id}`}
                      className="text-white font-semibold text-lg hover:text-emerald-400 transition-colors block truncate"
                    >
                      {team.name}
                    </Link>
                    {team.website && (
                      <a
                        href={team.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 text-sm block truncate"
                      >
                        {team.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Founded:</span>
                    <span className="text-white">{team.founded || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Venue:</span>
                    <span className="text-white">{team.venue || 'N/A'}</span>
                  </div>
                  {team.clubColors && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Colors:</span>
                      <span className="text-white">{team.clubColors}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 