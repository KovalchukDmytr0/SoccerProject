'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '@/lib/api-config';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { use } from 'react';

interface MatchDetails {
  area: {
    name: string;
    code: string;
    flag: string;
  };
  competition: {
    name: string;
    emblem: string;
  };
  season: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
  };
  utcDate: string;
  status: string;
  matchday: number;
  stage: string;
  group: string | null;
  lastUpdated: string;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  score: {
    winner: string | null;
    duration: string;
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime: {
      home: number | null;
      away: number | null;
    };
  };
  odds: {
    homeWin: number | null;
    draw: number | null;
    awayWin: number | null;
  };
  venue: string;
  referees: Array<{
    id: number;
    name: string;
    type: string;
    nationality: string;
  }>;
}

export default function MatchDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data, isLoading, error } = useQuery<MatchDetails>({
    queryKey: ['match', resolvedParams.id],
    queryFn: () => fetchFromAPI(`/matches/${resolvedParams.id}`),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-red-500 text-xl">Error loading match details. Please try again later.</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FINISHED':
        return 'text-emerald-400';
      case 'SCHEDULED':
        return 'text-blue-400';
      case 'LIVE':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-xl overflow-hidden shadow-xl"
        >
          {/* Competition Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={data.competition.emblem}
                  alt={data.competition.name}
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">
                    {data.competition.name}
                  </h1>
                  <div className="relative w-6 h-6 flex-shrink-0">
                    <Image
                      src={data.area.flag}
                      alt={data.area.name}
                      fill
                      className="object-cover rounded-full"
                      sizes="24px"
                    />
                  </div>
                </div>
                <p className="text-slate-400 mt-1">
                  {format(new Date(data.utcDate), "EEEE, MMMM d, yyyy 'at' HH:mm")} UTC
                </p>
              </div>
            </div>
          </div>

          {/* Match Score */}
          <div className="p-8 bg-slate-900/50">
            <div className="grid grid-cols-7 gap-4 items-center">
              {/* Home Team */}
              <div className="col-span-3 flex items-center justify-end gap-4">
                <div className="text-right">
                  <Link href={`/team/${data.homeTeam.id}`} className="group">
                    <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {data.homeTeam.name}
                    </h2>
                    <p className="text-slate-400 text-sm">
                      {data.homeTeam.shortName}
                    </p>
                  </Link>
                </div>
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={data.homeTeam.crest}
                    alt={data.homeTeam.name}
                    fill
                    className="object-contain"
                    sizes="64px"
                  />
                </div>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-white">
                    {data.score.fullTime.home ?? '-'}
                  </div>
                  <div className="text-4xl font-bold text-white">-</div>
                  <div className="text-4xl font-bold text-white">
                    {data.score.fullTime.away ?? '-'}
                  </div>
                </div>
                <span className={`font-medium mt-2 ${getStatusColor(data.status)}`}>
                  {data.status}
                </span>
              </div>

              {/* Away Team */}
              <div className="col-span-3 flex items-center justify-start gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={data.awayTeam.crest}
                    alt={data.awayTeam.name}
                    fill
                    className="object-contain"
                    sizes="64px"
                  />
                </div>
                <div className="text-left">
                  <Link href={`/team/${data.awayTeam.id}`} className="group">
                    <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {data.awayTeam.name}
                    </h2>
                    <p className="text-slate-400 text-sm">
                      {data.awayTeam.shortName}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Match Details Grid */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Match Information */}
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Match Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Competition</span>
                  <span className="text-white">{data.competition.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stage</span>
                  <span className="text-white">{data.stage.replace(/_/g, ' ')}</span>
                </div>
                {data.group && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Group</span>
                    <span className="text-white">{data.group}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Matchday</span>
                  <span className="text-white">{data.matchday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Venue</span>
                  <span className="text-white">{data.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Updated</span>
                  <span className="text-white">{format(new Date(data.lastUpdated), 'PPp')}</span>
                </div>
              </div>
            </div>

            {/* Score Details */}
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Score Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Half Time</span>
                  <span className="text-white">
                    {data.score.halfTime.home ?? '-'} - {data.score.halfTime.away ?? '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Full Time</span>
                  <span className="text-white">
                    {data.score.fullTime.home ?? '-'} - {data.score.fullTime.away ?? '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Winner</span>
                  <span className="text-emerald-400">
                    {data.score.winner ? data.score.winner : 'Not Determined'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration</span>
                  <span className="text-white">{data.score.duration}</span>
                </div>
              </div>
            </div>

            {/* Match Officials */}
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Match Officials</h3>
              <div className="space-y-4">
                {data.referees.map((referee) => (
                  <div key={referee.id} className="flex justify-between items-center">
                    <div>
                      <div className="text-white">{referee.name}</div>
                      <div className="text-sm text-slate-400">{referee.type}</div>
                    </div>
                    <div className="text-slate-400">{referee.nationality}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Odds */}
            {(data.odds.homeWin || data.odds.draw || data.odds.awayWin) && (
              <div className="bg-slate-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Match Odds</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Home Win</span>
                    <span className="text-white">{data.odds.homeWin ?? '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Draw</span>
                    <span className="text-white">{data.odds.draw ?? '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Away Win</span>
                    <span className="text-white">{data.odds.awayWin ?? '-'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
} 