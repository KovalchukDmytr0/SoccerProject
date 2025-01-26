'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '@/lib/api-config';
import { PersonDetails } from '@/types/football';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';
import { getTeamColors } from '@/utils/team-colors';

interface PageProps {
  params: { id: string };
}

function calculateAge(dateOfBirth: string) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function PersonPage({
  params,
}: PageProps) {
  const { data, isLoading, error } = useQuery<PersonDetails>({
    queryKey: ['person', params.id],
    queryFn: () => fetchFromAPI(`/persons/${params.id}`),
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
        Error loading person details: {error.message}
        <Link href="/" className="block mt-2 text-blue-500 hover:underline">
          Return to Home
        </Link>
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  const teamColors = data.currentTeam ? getTeamColors(data.currentTeam.id) : { from: '#1A472A', to: '#5C2D91' };

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

        <div 
          className="rounded-xl shadow-xl mb-8 overflow-hidden"
          style={{
            background: `linear-gradient(to right, ${teamColors.from}, ${teamColors.to})`
          }}
        >
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {data.currentTeam?.crest && (
                <div className="w-32 h-32 flex-shrink-0 bg-white rounded-lg p-2">
                  <img
                    src={data.currentTeam.crest}
                    alt={`${data.currentTeam.name} crest`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-grow text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-4">{data.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                  <div>
                    <p><span className="text-white/80">Position:</span> {data.position || 'N/A'}</p>
                    <p><span className="text-white/80">Date of Birth:</span> {data.dateOfBirth ? `${new Date(data.dateOfBirth).toLocaleDateString()} (${calculateAge(data.dateOfBirth)} years)` : 'N/A'}</p>
                    <p><span className="text-white/80">Nationality:</span> {data.nationality || 'N/A'}</p>
                  </div>
                  <div>
                    <p><span className="text-white/80">Current Team:</span> {data.currentTeam?.name || 'N/A'}</p>
                    <p><span className="text-white/80">Shirt Number:</span> {data.currentTeam?.shirtNumber || 'N/A'}</p>
                    <p><span className="text-white/80">Contract Until:</span> {data.currentTeam?.contract?.until ? new Date(data.currentTeam.contract.until).getFullYear() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            href={`/person/${params.id}/matches`}
            className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition-colors group shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Player Matches</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-400 group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
            <p className="text-slate-400 mt-2">
              View all matches for this player, including appearances and performance statistics
            </p>
          </Link>

          {data.currentTeam && (
            <Link
              href={`/team/${data.currentTeam.id}`}
              className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition-colors group shadow-xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Current Team</h2>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-400 group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
              <p className="text-slate-400 mt-2">
                View details about {data.currentTeam.name}, including squad, matches, and competitions
              </p>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}