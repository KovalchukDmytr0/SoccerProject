'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '@/lib/api-config';
import { ScorersResponse } from '@/types/football';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';

export default function ScorersPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const resolvedParams = use(params);
  const { data, isLoading, error } = useQuery<ScorersResponse>({
    queryKey: ['scorers', resolvedParams.code],
    queryFn: () => fetchFromAPI(`/competitions/${resolvedParams.code}/scorers`),
  });

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
        <div className="text-red-500 text-xl">Error loading scorers. Please try again later.</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/"
            className="text-emerald-400 hover:text-emerald-300 transition-colors mb-4 inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Competitions
          </Link>
          <div className="flex items-center gap-4 mt-4">
            {data?.competition.emblem && (
              <Image
                src={data.competition.emblem}
                alt={data.competition.name}
                width={64}
                height={64}
                className="object-contain"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold text-white">
                {data?.competition.name} - Top Scorers
              </h1>
              <p className="text-slate-400">
                Season {new Date(data?.season.startDate || '').getFullYear()} - {new Date(data?.season.endDate || '').getFullYear()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-slate-700/50">
            {data?.scorers.map((scorer, index) => (
              <div key={scorer.player.id} className="p-6 hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="text-2xl font-bold text-emerald-400 w-8">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <Image
                        src={scorer.team.crest}
                        alt={scorer.team.name}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {scorer.player.name}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {scorer.team.name}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-sm text-slate-400">Goals</p>
                        <p className="text-xl font-bold text-emerald-400">{scorer.goals}</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-sm text-slate-400">Assists</p>
                        <p className="text-xl font-bold text-emerald-400">{scorer.assists}</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-sm text-slate-400">Penalties</p>
                        <p className="text-xl font-bold text-emerald-400">{scorer.penalties}</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-sm text-slate-400">Matches</p>
                        <p className="text-xl font-bold text-emerald-400">{scorer.playedMatches}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 