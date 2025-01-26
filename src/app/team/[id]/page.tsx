'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '@/lib/api-config';
import { TeamDetails } from '@/types/football';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';
import { getTeamGradientStyle } from '@/utils/team-colors';

interface PageProps {
  params: { id: string };
}

export default function TeamPage({
  params,
}: PageProps) {
  const { data, isLoading, error } = useQuery<TeamDetails>({
    queryKey: ['team', params.id],
    queryFn: () => fetchFromAPI(`/metrx/teams/${params.id}`),
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
      <Alert variant="destructive" className="m-4">
        Error loading team details: {error.message}
        <Link href="/" className="block mt-2 text-blue-500 hover:underline">
          Return to Home
        </Link>
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  const headerStyle = getTeamGradientStyle(parseInt(params.id));

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

        <div className="rounded-xl shadow-xl mb-8 overflow-hidden">
          <div style={headerStyle} className="p-8 relative">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {data.crest && (
                  <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-xl p-4 flex-shrink-0">
                    <img
                      src={data.crest}
                      alt={`${data.name} crest`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-bold text-white mb-2">{data.name}</h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                    <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm">
                      {data.area.name}
                    </span>
                    {data.venue && (
                      <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm">
                        {data.venue}
                      </span>
                    )}
                  </div>
                  <div className="text-white/80">
                    <p>Founded: {data.founded}</p>
                    {data.website && (
                      <p className="mt-1">
                        Website: <a href={data.website} target="_blank" rel="noopener noreferrer" className="hover:text-white">{data.website}</a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href={`/team/${params.id}/matches`}
                className="bg-slate-700 hover:bg-slate-600 transition-colors rounded-xl p-4 text-white flex items-center justify-between group"
              >
                <span>View Matches</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {data.squad && data.squad.length > 0 && (
          <div className="bg-slate-800 rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Squad</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.squad.map((player) => (
                <Link
                  key={player.id}
                  href={`/person/${player.id}`}
                  className="bg-slate-700 hover:bg-slate-600 transition-colors rounded-xl p-4 flex items-center justify-between group"
                >
                  <div>
                    <h3 className="text-white font-medium">{player.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-sm text-white/60">{player.position}</span>
                      {player.shirtNumber && (
                        <span className="text-sm text-white/60">#{player.shirtNumber}</span>
                      )}
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 transform group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {data.coach && (
          <div className="bg-slate-800 rounded-xl shadow-xl p-8 mt-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Coach</h2>
            <div className="bg-slate-700 rounded-xl p-4">
              <h3 className="text-white font-medium">{data.coach.name}</h3>
              <div className="flex gap-2 mt-1">
                <span className="text-sm text-white/60">{data.coach.nationality}</span>
                {data.coach.contract?.start && data.coach.contract?.until && (
                  <span className="text-sm text-white/60">
                    Contract: {new Date(data.coach.contract.start).getFullYear()} - {new Date(data.coach.contract.until).getFullYear()}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 