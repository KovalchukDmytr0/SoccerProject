'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '@/lib/api-config';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';
import { getTeamColors } from '@/utils/team-colors';

interface PersonDetails {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  position: string;
  shirtNumber?: number;
  currentTeam?: {
    id: number;
    name: string;
    crest: string;
  };
}

interface PageProps {
  params: { id: string };
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

export default function PersonPage({ params }: PageProps) {
  const { data, isLoading, error } = useQuery<PersonDetails>({
    queryKey: ['person', params.id],
    queryFn: () => fetchFromAPI(`/persons/${params.id}`),
    staleTime: 30 * 1000,
    retry: 1,
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
            <p>Error loading person details. Please try again later.</p>
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

  const teamColors = data.currentTeam ? getTeamColors(data.currentTeam.id) : getTeamColors(0);

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
          {/* Header Section */}
          <div 
            className="p-8"
            style={{
              background: `linear-gradient(to right, ${teamColors.from}, ${teamColors.to})`
            }}
          >
            <div className="flex items-center gap-6">
              {data.currentTeam ? (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm">
                  <Image
                    src={data.currentTeam.crest}
                    alt={data.currentTeam.name}
                    fill
                    className="object-contain p-2"
                    sizes="128px"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-6xl font-bold text-white/50">{data.name[0]}</span>
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{data.name}</h1>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                    {data.position}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                    {data.nationality}
                  </span>
                  {data.shirtNumber && (
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                      #{data.shirtNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-400">Full Name</p>
                    <p className="text-white">{data.firstName} {data.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Date of Birth</p>
                    <p className="text-white">
                      {format(new Date(data.dateOfBirth), 'PPP')}
                      <span className="text-slate-400 text-sm ml-2">
                        ({calculateAge(data.dateOfBirth)} years)
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Nationality</p>
                    <p className="text-white">{data.nationality}</p>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Professional Details</h3>
                <div className="space-y-4">
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
                  {data.currentTeam && (
                    <div>
                      <p className="text-sm text-slate-400">Current Team</p>
                      <Link 
                        href={`/team/${data.currentTeam.id}`}
                        className="text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-2"
                      >
                        <div className="relative w-6 h-6">
                          <Image
                            src={data.currentTeam.crest}
                            alt={data.currentTeam.name}
                            fill
                            className="object-contain"
                            sizes="24px"
                          />
                        </div>
                        {data.currentTeam.name}
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-4">
                  <Link
                    href={`/person/${params.id}/matches`}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2 w-full justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v6.5l5-3.5"/>
                      <path d="M12 2v6.5l-5-3.5"/>
                      <path d="M12 15.5V22"/>
                      <path d="M17 8.5V15"/>
                      <path d="M7 8.5V15"/>
                      <path d="M17 8.5a5 5 0 1 1-10 0"/>
                    </svg>
                    View Matches
                  </Link>
                  {data.currentTeam && (
                    <Link
                      href={`/team/${data.currentTeam.id}`}
                      className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2 w-full justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      View Team
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}