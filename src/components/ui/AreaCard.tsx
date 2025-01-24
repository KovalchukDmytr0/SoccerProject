'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Area, Competition } from '@/types/football';
import { motion, AnimatePresence } from 'framer-motion';

interface AreaCardProps {
  area: Area;
  competitions: Competition[];
}

export const AreaCard = ({ area, competitions }: AreaCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      className="w-full max-w-2xl bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between group cursor-pointer"
      >
        <div className="flex items-center gap-4">
          {area.flag && (
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700">
              <Image
                src={area.flag}
                alt={`${area.name} flag`}
                fill
                className="object-cover"
              />
            </div>
          )}
          <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
            {area.name}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-slate-400 group-hover:text-emerald-400"
        >
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
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 grid gap-4">
              {competitions.map((competition) => (
                <div
                  key={competition.id}
                  className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex-1 flex items-center gap-4">
                    {competition.emblem && (
                      <div className="relative w-10 h-10">
                        <Image
                          src={competition.emblem}
                          alt={`${competition.name} emblem`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-white">{competition.name}</h4>
                      {competition.currentSeason && (
                        <p className="text-sm text-slate-400">
                          Season: {new Date(competition.currentSeason.startDate).getFullYear()} - {new Date(competition.currentSeason.endDate).getFullYear()}
                        </p>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/competition/${competition.code}/scorers`}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    View Scorers
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 