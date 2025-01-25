'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { fetchFromAPI } from '@/lib/api-config';
import { useState } from 'react';

interface LiveScore {
  Sid: string;
  Snm: string; // Stage name
  Cnm: string; // Competition name
  Scd: string; // Stage code
  T1: {
    Nm: string; // Team 1 name
    ID: string;
    Img: string; // Team 1 image
  };
  T2: {
    Nm: string; // Team 2 name
    ID: string;
    Img: string; // Team 2 image
  };
  Tr1: string; // Team 1 score
  Tr2: string; // Team 2 score
  Eps: string; // Match status (e.g., "1H" for first half)
  Esd: number; // Start time timestamp
  Esid: number; // Stage ID
  Pid: number; // Period ID
}

interface LiveScoreResponse {
  Stages: {
    Sid: string;
    Snm: string;
    Scd: string;
    Cid: string;
    Cnm: string;
    Events: LiveScore[];
  }[];
}

// Define available timezones
const TIMEZONES = [
  { value: '-12', label: '(GMT-12:00) International Date Line West' },
  { value: '-11', label: '(GMT-11:00) Midway Island, Samoa' },
  { value: '-10', label: '(GMT-10:00) Hawaii' },
  { value: '-9', label: '(GMT-09:00) Alaska' },
  { value: '-8', label: '(GMT-08:00) Pacific Time (US & Canada)' },
  { value: '-7', label: '(GMT-07:00) Mountain Time (US & Canada)' },
  { value: '-6', label: '(GMT-06:00) Central Time (US & Canada)' },
  { value: '-5', label: '(GMT-05:00) Eastern Time (US & Canada)' },
  { value: '-4', label: '(GMT-04:00) Atlantic Time (Canada)' },
  { value: '-3', label: '(GMT-03:00) Buenos Aires, Georgetown' },
  { value: '-2', label: '(GMT-02:00) Mid-Atlantic' },
  { value: '-1', label: '(GMT-01:00) Azores, Cape Verde Islands' },
  { value: '0', label: '(GMT) Western Europe Time, London' },
  { value: '1', label: '(GMT+01:00) Berlin, Rome, Paris' },
  { value: '2', label: '(GMT+02:00) Eastern Europe, Cairo' },
  { value: '3', label: '(GMT+03:00) Moscow, St. Petersburg' },
  { value: '4', label: '(GMT+04:00) Abu Dhabi, Muscat' },
  { value: '5', label: '(GMT+05:00) Islamabad, Karachi' },
  { value: '6', label: '(GMT+06:00) Almaty, Dhaka' },
  { value: '7', label: '(GMT+07:00) Bangkok, Hanoi' },
  { value: '8', label: '(GMT+08:00) Beijing, Hong Kong' },
  { value: '9', label: '(GMT+09:00) Tokyo, Seoul' },
  { value: '10', label: '(GMT+10:00) Eastern Australia, Guam' },
  { value: '11', label: '(GMT+11:00) Magadan, Solomon Islands' },
  { value: '12', label: '(GMT+12:00) Auckland, Wellington' },
];

export default function LiveScoresPage() {
  // Get user's timezone offset and find the closest matching timezone
  const [selectedTimezone, setSelectedTimezone] = useState(() => {
    const userOffset = -(new Date().getTimezoneOffset() / 60);
    const closestTimezone = TIMEZONES.reduce((prev, curr) => {
      return Math.abs(parseInt(curr.value) - userOffset) < Math.abs(parseInt(prev.value) - userOffset)
        ? curr
        : prev;
    });
    return closestTimezone.value;
  });

  const { data, isLoading, error } = useQuery<LiveScoreResponse>({
    queryKey: ['live-scores', selectedTimezone],
    queryFn: () => fetchFromAPI(`/live-scores?timezone=${selectedTimezone}`),
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-red-500 text-xl">Failed to load live scores</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
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
          </Link>
          <h1 className="text-4xl font-bold text-white">Live Scores</h1>
        </div>

        {/* Timezone Selector */}
        <div className="mb-8">
          <label htmlFor="timezone" className="block text-sm font-medium text-slate-400 mb-2">
            Select Timezone
          </label>
          <select
            id="timezone"
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            className="bg-slate-800 text-white rounded-lg px-4 py-2 w-full max-w-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {TIMEZONES.map((timezone) => (
              <option key={timezone.value} value={timezone.value}>
                {timezone.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4">
          {data?.Stages?.length > 0 ? (
            data.Stages.map((stage) => (
              <div key={`stage-${stage.Sid}-${stage.Cid}`} className="space-y-4">
                <h2 className="text-xl font-semibold text-emerald-400">
                  {stage.Cnm} - {stage.Snm}
                </h2>
                <div className="grid gap-4">
                  {stage.Events?.map((match, index) => (
                    <div
                      key={`match-${stage.Sid}-${match.Esd}-${index}`}
                      className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-white font-semibold">
                            {match.T1.Nm}
                          </div>
                          <div className="text-slate-400">{match.Tr1}</div>
                        </div>
                        <div className="px-4">
                          <div className="text-emerald-400 font-medium">
                            {match.Eps}
                          </div>
                        </div>
                        <div className="flex-1 text-right">
                          <div className="text-white font-semibold">
                            {match.T2.Nm}
                          </div>
                          <div className="text-slate-400">{match.Tr2}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400">
              No live matches at the moment
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 