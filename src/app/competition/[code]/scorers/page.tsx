'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '@/lib/api-config';
import { ScorersResponse } from '@/types/football';
import { ScorersTable } from '@/components/ScorersTable';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';
import Link from 'next/link';

interface PageProps {
  params: { code: string };
}

export default function CompetitionScorersPage({ params }: PageProps) {
  const { data, isLoading, error } = useQuery<ScorersResponse>({
    queryKey: ['scorers', params.code],
    queryFn: () => fetchFromAPI(`/competitions/${params.code}/scorers`),
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    retry: 1, // Only retry once if the request fails
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <Alert variant="destructive" className="max-w-lg">
          <div className="flex flex-col gap-4">
            <p>Error loading competition scorers. Please try again later.</p>
            <Link href="/" className="text-sm text-white hover:text-slate-200 transition-colors">
              Return to Home
            </Link>
          </div>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link 
          href={`/competition/${params.code}`}
          className="text-emerald-400 hover:text-emerald-300 transition-colors mb-8 inline-flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Competition
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Top Scorers</h1>
          <p className="text-slate-400">
            {data.competition.name} - {data.season.startDate.split('-')[0]}/{data.season.endDate.split('-')[0]}
          </p>
        </div>

        <ScorersTable scorers={data.scorers} />
      </div>
    </main>
  );
} 