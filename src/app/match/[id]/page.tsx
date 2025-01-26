'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '@/lib/api-config';
import { MatchDetails } from '@/types/football';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';

interface PageProps {
  params: { id: string };
}

export default function MatchDetailsPage({
  params,
}: PageProps) {
  const { data, isLoading, error } = useQuery<MatchDetails>({
    queryKey: ['match', params.id],
    queryFn: () => fetchFromAPI(`/matches/${params.id}`),
    staleTime: 30 * 1000,
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
        Error loading match details: {error.message}
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
          Back to Home
        </Link>

        <div className="bg-slate-800 rounded-xl shadow-xl mb-8 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              {data.competition.emblem && (
                <img
                  src={data.competition.emblem}
                  alt={data.competition.name}
                  className="w-12 h-12 object-contain"
                />
              )}
              <div className="text-center">
                <h2 className="text-white text-xl font-semibold">{data.competition.name}</h2>
                <p className="text-slate-400">{data.season.startDate.split('-')[0]}/{data.season.endDate.split('-')[0]}</p>
              </div>
            </div>

            <div className="grid grid-cols-11 items-center gap-4">
              <div className="col-span-4 text-right">
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-bold text-white">{data.homeTeam.name}</span>
                  <span className="text-sm text-slate-400">{data.homeTeam.shortName}</span>
                </div>
              </div>

              <div className="col-span-1 flex justify-end">
                {data.homeTeam.crest && (
                  <img
                    src={data.homeTeam.crest}
                    alt={data.homeTeam.name}
                    className="w-12 h-12 object-contain"
                  />
                )}
              </div>

              <div className="col-span-1 flex justify-center">
                <div className="text-3xl font-bold text-white">
                  {data.score.fullTime.home ?? '-'}
                </div>
              </div>

              <div className="col-span-1 flex justify-center">
                <span className="text-slate-400">vs</span>
              </div>

              <div className="col-span-1 flex justify-center">
                <div className="text-3xl font-bold text-white">
                  {data.score.fullTime.away ?? '-'}
                </div>
              </div>

              <div className="col-span-1">
                {data.awayTeam.crest && (
                  <img
                    src={data.awayTeam.crest}
                    alt={data.awayTeam.name}
                    className="w-12 h-12 object-contain"
                  />
                )}
              </div>

              <div className="col-span-4">
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-white">{data.awayTeam.name}</span>
                  <span className="text-sm text-slate-400">{data.awayTeam.shortName}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Match Information</h3>
                <div className="space-y-2">
                  <p className="text-slate-300">
                    <span className="text-slate-400">Date:</span>{' '}
                    {new Date(data.utcDate).toLocaleDateString()}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Status:</span>{' '}
                    {data.status}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Stage:</span>{' '}
                    {data.stage}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Matchday:</span>{' '}
                    {data.matchday}
                  </p>
                </div>
              </div>

              {data.referees && data.referees.length > 0 && (
                <div className="bg-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Match Officials</h3>
                  <div className="space-y-2">
                    {data.referees.map((referee) => (
                      <p key={referee.id} className="text-slate-300">
                        <span className="text-slate-400">{referee.role}:</span>{' '}
                        {referee.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 