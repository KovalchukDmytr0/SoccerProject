'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchFromAPI } from "@/lib/api-config";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { use, useState } from "react";

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

interface PlayerMatchesResponse {
  matches: Match[];
  person: {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    position: string;
    shirtNumber: number;
  };
}

const SEASONS = [
  { value: '2024', label: '2023/24' },
  { value: '2023', label: '2022/23' },
  { value: '2022', label: '2021/22' },
];

export default function PlayerMatchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [selectedSeason, setSelectedSeason] = useState(SEASONS[0].value);

  const { data, isLoading, error } = useQuery<PlayerMatchesResponse>({
    queryKey: ["playerMatches", resolvedParams.id, selectedSeason],
    queryFn: () => fetchFromAPI(`/persons/${resolvedParams.id}/matches?season=${selectedSeason}`),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-red-500">Error loading player matches</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href={`/person/${resolvedParams.id}`}
            className="text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-2"
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
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Profile
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {data.person.name}'s Matches
          </h1>
          <p className="text-slate-400">
            Position: {data.person.position} | Nationality: {data.person.nationality}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2">
            <label htmlFor="season" className="text-white font-medium">
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

        <div className="space-y-6">
          {data.matches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No matches found for the selected season.</p>
            </div>
          ) : (
            data.matches.map((match) => (
              <div
                key={match.id}
                className="bg-slate-800/50 rounded-xl p-6 shadow-xl hover:bg-slate-800/70 transition-colors"
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
                      {format(new Date(match.utcDate), "PPP")} - {match.stage}
                    </p>
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
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
} 