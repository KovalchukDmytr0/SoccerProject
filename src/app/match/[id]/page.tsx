import { fetchFromAPI } from "@/lib/api-config";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

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
    winner: string;
    duration: string;
    fullTime: {
      home: number;
      away: number;
    };
    halfTime: {
      home: number;
      away: number;
    };
  };
  venue: string;
  referees: {
    id: number;
    name: string;
    type: string;
    nationality: string;
  }[];
}

export default function MatchDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const data = use(fetchFromAPI(`/matches/${resolvedParams.id}`));

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 mb-6"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Competitions
      </Link>

      {/* Competition Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-12 h-12">
          <Image
            src={data.area.flag}
            alt={data.area.name}
            fill
            className="object-cover rounded-lg"
            sizes="48px"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <span>{data.competition.name}</span>
            <div className="relative w-8 h-8">
              <Image
                src={data.competition.emblem}
                alt={data.competition.name}
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
          </h1>
          <p className="text-slate-400">
            {format(new Date(data.utcDate), "MMMM d, yyyy")} -{" "}
            {format(new Date(data.utcDate), "HH:mm")} UTC
          </p>
        </div>
      </div>

      {/* Match Score */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Home Team */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image
                src={data.homeTeam.crest}
                alt={data.homeTeam.name}
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
            <h2 className="text-xl font-semibold">{data.homeTeam.name}</h2>
          </div>

          {/* Score */}
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {data.score.fullTime.home} - {data.score.fullTime.away}
            </div>
            <div className="text-sm text-slate-400">
              Half-time: {data.score.halfTime.home} - {data.score.halfTime.away}
            </div>
            <div className="mt-2 text-emerald-400 text-sm">
              {data.status === "FINISHED" ? "Full Time" : data.status}
            </div>
          </div>

          {/* Away Team */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image
                src={data.awayTeam.crest}
                alt={data.awayTeam.name}
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
            <h2 className="text-xl font-semibold">{data.awayTeam.name}</h2>
          </div>
        </div>
      </div>

      {/* Match Details */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Match Information */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Match Information</h3>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-slate-400">Competition</dt>
              <dd>{data.competition.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Stage</dt>
              <dd>{data.stage.replace(/_/g, " ")}</dd>
            </div>
            {data.group && (
              <div className="flex justify-between">
                <dt className="text-slate-400">Group</dt>
                <dd>{data.group}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-slate-400">Matchday</dt>
              <dd>{data.matchday}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Venue</dt>
              <dd>{data.venue}</dd>
            </div>
          </dl>
        </div>

        {/* Referees */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Match Officials</h3>
          <div className="space-y-4">
            {data.referees.map((referee) => (
              <div key={referee.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{referee.name}</div>
                  <div className="text-sm text-slate-400">{referee.type}</div>
                </div>
                <div className="text-sm text-slate-400">{referee.nationality}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 