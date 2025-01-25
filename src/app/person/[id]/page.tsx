'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '@/lib/api-config';
import { PersonDetails } from '@/types/football';
import { getTeamColors } from '@/utils/team-colors';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function calculateAge(dateString: string) {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export default function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data, isLoading, error } = useQuery<PersonDetails>({
    queryKey: ['person', resolvedParams.id],
    queryFn: () => fetchFromAPI(`/persons/${resolvedParams.id}`),
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
        <div className="text-red-500 text-xl">Error loading player details. Please try again later.</div>
      </div>
    );
  }

  const teamColors = getTeamColors(data.currentTeam.id);

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

        <div className="bg-slate-800/50 rounded-xl overflow-hidden shadow-xl">
          <div 
            className="p-8"
            style={{
              background: `linear-gradient(to right, ${teamColors.from}, ${teamColors.to})`,
            }}
          >
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-700/50">
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white">
                  {data.name[0]}
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{data.name}</h1>
                <div className="flex items-center gap-3">
                  <div className="relative w-6 h-6">
                    <Image
                      src={data.currentTeam.crest}
                      alt={data.currentTeam.name}
                      fill
                      className="object-contain"
                      sizes="24px"
                    />
                  </div>
                  <p className="text-white/90">{data.currentTeam.name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {data.name}
                </h1>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="px-3 py-1 bg-slate-700/50 rounded-full text-sm">
                    {data.position}
                  </span>
                  <span className="px-3 py-1 bg-slate-700/50 rounded-full text-sm">
                    {data.nationality}
                  </span>
                </div>
              </div>
              {data.currentTeam && (
                <div className="text-right">
                  <h2 className="text-xl font-semibold text-white">
                    {data.currentTeam.name}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Contract until {formatDate(data.currentTeam.contract.until)}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-400">Date of Birth</p>
                    <p className="text-white">{formatDate(data.dateOfBirth)} ({calculateAge(data.dateOfBirth)} years)</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Birth Place</p>
                    <p className="text-white">{data.birthPlace || 'N/A'}, {data.birthCountry}</p>
                  </div>
                  {data.height && (
                    <div>
                      <p className="text-sm text-slate-400">Height</p>
                      <p className="text-white">{data.height}</p>
                    </div>
                  )}
                  {data.weight && (
                    <div>
                      <p className="text-sm text-slate-400">Weight</p>
                      <p className="text-white">{data.weight}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Professional Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-400">Position</p>
                    <p className="text-white">{data.position}</p>
                  </div>
                  {data.shirtNumber && (
                    <div>
                      <p className="text-sm text-slate-400">Shirt Number</p>
                      <p className="text-white">#{data.shirtNumber}</p>
                    </div>
                  )}
                  {data.marketValue && (
                    <div>
                      <p className="text-sm text-slate-400">Market Value</p>
                      <p className="text-white">{data.marketValue}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-slate-400">Last Updated</p>
                    <p className="text-white">{formatDate(data.lastUpdated)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Current Team</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-400">Team</p>
                    <div className="flex items-center gap-4">
                      <p className="text-white">{data.currentTeam.name}</p>
                      <Link
                        href={`/team/${data.currentTeam.id}`}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        View Team
                      </Link>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Contract Duration</p>
                    <p className="text-white">
                      {formatDate(data.currentTeam.contract.start)} - {formatDate(data.currentTeam.contract.until)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 