'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchFromAPI } from "@/lib/api-config";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { use, useState } from "react";
import { motion } from 'framer-motion';

interface Match {
  id: number;
  competition: {
    id: number;
    name: string;
    emblem: string;
  };
  utcDate: string;
  status: string;
  stage: string;
  homeTeam: {
    id: number;
    name: string;
    crest: string;
    score: number;
  };
  awayTeam: {
    id: number;
    name: string;
    crest: string;
    score: number;
  };
}

interface TeamMatchesResponse {
  matches: Match[];
  resultSet: {
    count: number;
    competitions: string[];
    first: string;
    last: string;
  };
}

const SEASONS = [
  { value: '2024', label: '2023/24' },
  { value: '2023', label: '2022/23' },
  { value: '2022', label: '2021/22' },
];

export default function TeamMatchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [selectedSeason, setSelectedSeason] = useState(SEASONS[0].value);

  const { data, isLoading, error } = useQuery<TeamMatchesResponse>({
    queryKey: ['team-matches', resolvedParams.id, selectedSeason],
    queryFn: () => fetchFromAPI(`/teams/${resolvedParams.id}/matches?season=${selectedSeason}`),
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
        <div className="text-red-500 text-xl">Error loading team matches. Please try again later.</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link 
          href={`/team/${resolvedParams.id}`}
          className="text-emerald-400 hover:text-emerald-300 transition-colors mb-8 inline-flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Team Profile
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-xl overflow-hidden shadow-xl"
        >
          {/* Season Selector */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-4">
              <label htmlFor="season" className="text-slate-400 font-medium">
                Season:
              </label>
              <select
                id="season"
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {SEASONS.map((season) => (
                  <option key={season.value} value={season.value}>
                    {season.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Matches List */}
          <div className="p-6">
            <div className="space-y-4">
              {data.matches.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400">No matches found for the selected season.</p>
                </div>
              ) : (
                data.matches.map((match) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      href={`/match/${match.id}`}
                      className="block bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-12 h-12">
                          <Image
                            src={match.competition.emblem}
                            alt={match.competition.name}
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{match.competition.name}</h3>
                          <p className="text-slate-400 text-sm">
                            {format(new Date(match.utcDate), "EEEE, MMMM d, yyyy")}
                          </p>
                          <p className="text-emerald-400 text-sm">{match.stage}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 items-center gap-4">
                        <div className="col-span-3 flex items-center gap-3 justify-end">
                          <span className="text-white font-medium">{match.homeTeam.name}</span>
                          <div className="relative w-8 h-8">
                            <Image
                              src={match.homeTeam.crest}
                              alt={match.homeTeam.name}
                              fill
                              className="object-contain"
                              sizes="32px"
                            />
                          </div>
                        </div>

                        <div className="col-span-1 text-center">
                          <div className="text-white font-bold text-xl">
                            {match.status === "FINISHED" && typeof match.homeTeam.score === 'number' && typeof match.awayTeam.score === 'number'
                              ? `${match.homeTeam.score} - ${match.awayTeam.score}`
                              : match.status === "SCHEDULED" ? "vs" : "TBD"}
                          </div>
                          <div className="text-emerald-400 text-sm">
                            {match.status === "FINISHED" ? "FULL TIME" : match.status}
                          </div>
                        </div>

                        <div className="col-span-3 flex items-center gap-3">
                          <div className="relative w-8 h-8">
                            <Image
                              src={match.awayTeam.crest}
                              alt={match.awayTeam.name}
                              fill
                              className="object-contain"
                              sizes="32px"
                            />
                          </div>
                          <span className="text-white font-medium">{match.awayTeam.name}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 