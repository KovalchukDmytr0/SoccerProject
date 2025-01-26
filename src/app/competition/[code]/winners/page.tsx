'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '@/lib/api-config';
import { CompetitionDetails } from '@/types/football';
import Image from 'next/image';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';

function formatSeasonYear(dateString: string) {
  return new Date(dateString).getFullYear();
}

interface PageProps {
  params: { code: string };
}

export default function CompetitionWinnersPage({
  params,
}: PageProps) {
  const { data, isLoading, error } = useQuery<CompetitionDetails>({
    queryKey: ['competition', params.code],
    queryFn: () => fetchFromAPI(`/competitions/${params.code}`),
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
        Error loading competition details: {error.message}
        <Link href="/" className="block mt-2 text-blue-500 hover:underline">
          Return to Home
        </Link>
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  // Filter seasons with winners
  const seasonsWithWinners = data.seasons
    .filter(season => season.winner)
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

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

        <div className="mb-8 flex items-center gap-6">
          {data.emblem && (
            <div className="relative w-24 h-24">
              <Image
                src={data.emblem}
                alt={data.name}
                fill
                className="object-contain"
                sizes="96px"
                priority
              />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {data.name} - Hall of Champions
            </h1>
            <div className="flex items-center gap-3">
              {data.area.flag && (
                <div className="relative w-6 h-6">
                  <Image
                    src={data.area.flag}
                    alt={data.area.name}
                    fill
                    className="object-cover rounded-full"
                    sizes="24px"
                  />
                </div>
              )}
              <p className="text-slate-400">{data.area.name}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {seasonsWithWinners.map((season) => (
            <div 
              key={season.id}
              className="bg-slate-800/50 rounded-xl overflow-hidden shadow-xl hover:bg-slate-800/70 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-white mb-2">
                    Season {formatSeasonYear(season.startDate)}-{formatSeasonYear(season.endDate)}
                  </div>
                  {season.winner && (
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={season.winner.crest}
                          alt={season.winner.name}
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {season.winner.name}
                        </h3>
                        <Link
                          href={`/team/${season.winner.id}`}
                          className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm inline-flex items-center gap-1"
                        >
                          View Team Details
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"/>
                            <path d="m12 5 7 7-7 7"/>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm">
                    Champion
                  </div>
                  {season.currentMatchday && (
                    <p className="text-slate-400 text-sm mt-2">
                      Matchday: {season.currentMatchday}
                    </p>
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