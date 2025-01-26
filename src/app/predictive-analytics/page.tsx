'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFromMetrxAPI } from '@/lib/metrx-api-config';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Team {
  name: string;
  shortName: string;
  id: string;
  type: string;
  country: {
    name: string;
    id: string;
  };
}

interface CompetitionStage {
  name: string;
  id: string;
  mode: string;
  competition: {
    name: string;
    id: string;
    domestic: boolean;
  };
}

interface Match {
  id: string;
  start: string;
  schedule: string;
  competitionStage: CompetitionStage;
  homeTeam: Team;
  awayTeam: Team;
  result: number[];
}

interface Performance {
  format: string;
  homeTeam: {
    index: number;
    rank: number;
  };
  awayTeam: {
    index: number;
    rank: number;
  };
}

interface Scores {
  period: string;
  goals: {
    quality: number;
    expected: {
      home: number;
      away: number;
    };
    expectedVenueAdvantage: {
      home: number;
      away: number;
    };
    actual: number[] | null;
    probabilities: number[];
  };
}

interface MatchData {
  match: Match;
  performance: Performance;
  scores: Scores;
}

interface ApiResponse {
  success: boolean;
  bill: {
    charge: number;
  };
  result: MatchData[];
}

export default function PredictiveAnalyticsPage() {
  const { data: apiResponse, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['match-metrics'],
    queryFn: () => fetchFromMetrxAPI('/match-metrics/top?metric=abs(sub(TIH%2CTIA))&start=U&projections=MD%2CTI%2CXG&maxCount=10&order=DESC'),
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const matches = apiResponse?.result || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <Link 
            href="/"
            className="text-emerald-400 hover:text-emerald-300 transition-colors mb-8 inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Home
          </Link>

          <div className="mt-6">
            <h1 className="text-4xl font-bold text-white mb-4">
              Match Predictions & Analytics
            </h1>
            <p className="text-slate-400 max-w-2xl">
              Advanced match metrics and predictions powered by AI. Our analytics provide insights into expected goals, team performance indices, and venue advantages.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
            Error loading match metrics. Please try again later.
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 rounded-xl p-6"
              >
                <h3 className="text-slate-400 text-sm mb-2">Matches Analyzed</h3>
                <p className="text-3xl font-bold text-white">{matches.length}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800/50 rounded-xl p-6"
              >
                <h3 className="text-slate-400 text-sm mb-2">Average Match Quality</h3>
                <p className="text-3xl font-bold text-white">
                  {matches.length > 0
                    ? (matches.reduce((acc, match) => 
                        acc + (match.scores?.goals?.quality ?? 0), 0
                      ) / matches.length).toFixed(2)
                    : '0.00'
                  }
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/50 rounded-xl p-6"
              >
                <h3 className="text-slate-400 text-sm mb-2">Average Expected Goals</h3>
                <p className="text-3xl font-bold text-emerald-400">
                  {matches.length > 0
                    ? (matches.reduce((acc, match) => 
                        acc + match.scores.goals.expected.home + match.scores.goals.expected.away, 0
                      ) / matches.length).toFixed(2)
                    : '0.00'
                  }
                </p>
              </motion.div>
            </div>

            {/* Match Cards */}
            <div className="grid gap-6">
              {matches.map((matchData, index) => (
                <motion.div
                  key={matchData.match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 rounded-xl overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col gap-6">
                      {/* Match Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-emerald-400">
                          {matchData.match.competitionStage.competition.name}
                        </span>
                        <span className="text-sm text-slate-400">•</span>
                        <span className="text-sm text-slate-400">
                          {formatDate(matchData.match.start)}
                        </span>
                      </div>

                      {/* Teams Section */}
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Home Team */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-semibold text-white">
                              {matchData.match.homeTeam.name}
                            </h3>
                            <p className="text-sm text-slate-400">
                              {matchData.match.homeTeam.country.name}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-400">Performance Index</span>
                              <span className="text-emerald-400 font-medium">
                                {matchData.performance.homeTeam.index.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-400">Global Rank</span>
                              <span className="text-white font-medium">
                                #{matchData.performance.homeTeam.rank}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-400">Expected Goals</span>
                              <span className="text-emerald-400 font-medium">
                                {matchData.scores.goals.expected.home.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-400">Venue Advantage</span>
                              <span className="text-blue-400 font-medium">
                                {matchData.scores.goals.expectedVenueAdvantage.home.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Match Info */}
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="text-center">
                            <div className="text-sm text-slate-400 mb-2">Match Quality</div>
                            <div className="text-3xl font-bold text-white">
                              {(matchData.scores?.goals?.quality ?? 0).toFixed(2)}
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                              {matchData.match.schedule === 'N' ? 'Normal Schedule' : matchData.match.schedule}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                              {matchData.match.competitionStage.name}
                            </span>
                          </div>
                        </div>

                        {/* Away Team */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-semibold text-white text-right">
                              {matchData.match.awayTeam.name}
                            </h3>
                            <p className="text-sm text-slate-400 text-right">
                              {matchData.match.awayTeam.country.name}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-400">Performance Index</span>
                              <span className="text-emerald-400 font-medium">
                                {matchData.performance.awayTeam.index.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-400">Global Rank</span>
                              <span className="text-white font-medium">
                                #{matchData.performance.awayTeam.rank}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-400">Expected Goals</span>
                              <span className="text-emerald-400 font-medium">
                                {matchData.scores.goals.expected.away.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-400">Venue Advantage</span>
                              <span className="text-blue-400 font-medium">
                                {matchData.scores.goals.expectedVenueAdvantage.away.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 