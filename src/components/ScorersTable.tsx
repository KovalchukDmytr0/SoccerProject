'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Scorer {
  player: {
    id: number;
    name: string;
  };
  team: {
    name: string;
    crest: string;
  };
  goals: number;
  assists: number;
  penalties: number;
  playedMatches: number;
}

interface ScorersTableProps {
  scorers: Scorer[];
}

export function ScorersTable({ scorers }: ScorersTableProps) {
  return (
    <div className="bg-slate-800/50 rounded-xl overflow-hidden">
      <div className="grid grid-cols-1 divide-y divide-slate-700/50">
        {scorers.map((scorer, index) => (
          <div key={scorer.player.id} className="p-6 hover:bg-slate-700/30 transition-colors">
            <div className="flex items-center gap-6">
              <div className="text-2xl font-bold text-emerald-400 w-8">
                #{index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <Image
                    src={scorer.team.crest}
                    alt={scorer.team.name}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                  <div>
                    <Link 
                      href={`/person/${scorer.player.id}`}
                      className="group"
                    >
                      <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {scorer.player.name}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {scorer.team.name}
                      </p>
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <div className="bg-slate-800 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Goals</p>
                    <p className="text-xl font-bold text-emerald-400">{scorer.goals}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Assists</p>
                    <p className="text-xl font-bold text-emerald-400">{scorer.assists}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Penalties</p>
                    <p className="text-xl font-bold text-emerald-400">{scorer.penalties}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Matches</p>
                    <p className="text-xl font-bold text-emerald-400">{scorer.playedMatches}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 