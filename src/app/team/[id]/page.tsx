'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '@/lib/api-config';
import { TeamDetails } from '@/types/football';
import { getTeamColors } from '@/utils/team-colors';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';

export default function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data, isLoading, error } = useQuery<TeamDetails>({
    queryKey: ['team', resolvedParams.id],
    queryFn: () => fetchFromAPI(`/teams/${resolvedParams.id}`),
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
        <div className="text-red-500 text-xl">Error loading team details. Please try again later.</div>
      </div>
    );
  }

  const teamColors = getTeamColors(data.id);

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
          Back to Home
        </Link>

        <div className="flex gap-4 mb-8">
          <Link
            href={`/team/${resolvedParams.id}/matches`}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v6.5l5-3.5" />
              <path d="M12 2v6.5l-5-3.5" />
              <path d="M12 15.5V22" />
              <path d="M17 8.5V15" />
              <path d="M7 8.5V15" />
              <path d="M17 8.5a5 5 0 1 1-10 0" />
            </svg>
            View Team Matches
          </Link>
        </div>

        <div className="bg-slate-800/50 rounded-xl overflow-hidden shadow-xl">
          {/* Hero Section */}
          <div 
            className="p-8"
            style={{
              background: `linear-gradient(to right, ${teamColors.from}, ${teamColors.to})`,
            }}
          >
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <Image
                  src={data.crest}
                  alt={data.name}
                  fill
                  className="object-contain"
                  sizes="128px"
                  priority
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{data.name}</h1>
                <p className="text-white/90">{data.venue}</p>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Club Information */}
            <div className="bg-slate-700/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Club Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400">Founded</p>
                  <p className="text-white">{data.founded}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Club Colors</p>
                  <p className="text-white">{data.clubColors}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Address</p>
                  <p className="text-white">{data.address}</p>
                </div>
                {data.website && (
                  <div>
                    <p className="text-sm text-slate-400">Website</p>
                    <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">
                      {data.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Coach Information */}
            {data.coach && (
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Coach</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-400">Name</p>
                    <p className="text-white">{data.coach.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Nationality</p>
                    <p className="text-white">{data.coach.nationality}</p>
                  </div>
                  {data.coach.contract && (
                    <div>
                      <p className="text-sm text-slate-400">Contract</p>
                      <p className="text-white">
                        {new Date(data.coach.contract.start).getFullYear()} - {new Date(data.coach.contract.until).getFullYear()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Squad */}
            <div className="md:col-span-2 bg-slate-700/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Squad</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.squad.map((player) => (
                  <Link
                    key={player.id}
                    href={`/person/${player.id}`}
                    className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
                  >
                    <h3 className="font-medium text-white hover:text-emerald-400 transition-colors">
                      {player.name}
                    </h3>
                    <p className="text-sm text-slate-400">{player.position}</p>
                    <p className="text-xs text-slate-500">{player.nationality}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Competitions */}
            <div className="md:col-span-2 bg-slate-700/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Current Competitions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.runningCompetitions.map((competition) => (
                  <div key={competition.id} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                    {competition.emblem && (
                      <div className="relative w-8 h-8">
                        <Image
                          src={competition.emblem}
                          alt={competition.name}
                          fill
                          className="object-contain"
                          sizes="32px"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-white">{competition.name}</p>
                      <p className="text-sm text-slate-400">{competition.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 