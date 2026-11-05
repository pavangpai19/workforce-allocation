import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  GitCommit,
  GraduationCap,
  Award,
  FileCheck,
  TrendingUp,
  X,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { MOCK_ACTIVITY_MAP } from '../../data/mockData';
import { ContributionActivityDay } from '../../types/workforce';

export interface ContributionActivityMapProps {
  title?: string;
  subtitle?: string;
}

export const ContributionActivityMap: React.FC<ContributionActivityMapProps> = ({
  title = 'Contribution Activity Map',
  subtitle = 'Verified engineering contributions, task deliveries, learning milestones, and skill evidence submissions.',
}) => {
  const [selectedDay, setSelectedDay] = useState<ContributionActivityDay | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  const days = MOCK_ACTIVITY_MAP;

  // Split into 12 columns of 7 days
  const weeks: ContributionActivityDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const totalTasks = days.reduce((acc, d) => acc + d.tasks_completed, 0);
  const totalContributions = days.reduce((acc, d) => acc + d.project_contributions, 0);
  const totalLearning = days.reduce((acc, d) => acc + d.learning_milestones, 0);
  const activeDaysCount = days.filter((d) => d.activity_level > 0).length;

  const levelColors = {
    0: 'bg-slate-900 border-slate-800/80 hover:border-slate-600',
    1: 'bg-emerald-950/80 border-emerald-800/40 hover:border-emerald-500 text-emerald-400',
    2: 'bg-emerald-800/80 border-emerald-600/60 hover:border-emerald-400 text-emerald-200',
    3: 'bg-emerald-600 border-emerald-400 hover:border-emerald-300 text-white shadow-glow-emerald',
    4: 'bg-emerald-400 border-emerald-300 hover:border-white text-slate-950 font-bold shadow-glow-emerald',
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
      {/* Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        {/* Aggregate Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-300">
            <strong className="text-emerald-400 font-mono">{activeDaysCount}</strong> active days
          </div>
          <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-300">
            <strong className="text-cyan-400 font-mono">{totalTasks}</strong> tasks delivered
          </div>
          <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-300">
            <strong className="text-indigo-400 font-mono">{totalContributions}</strong> repo commits
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col space-y-1.5 min-w-[700px]">
          {/* Weekday Row Container */}
          <div className="flex items-start space-x-2">
            {/* Weekday Labels Column */}
            <div className="flex flex-col space-y-1.5 text-[9px] font-mono text-slate-500 pr-1 pt-0.5">
              {dayLabels.map((lbl, idx) => (
                <span key={lbl} className="h-4 leading-4">
                  {idx % 2 === 1 ? lbl : ''}
                </span>
              ))}
            </div>

            {/* Weeks Grid */}
            <div className="flex space-x-1.5">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col space-y-1.5">
                  {week.map((day) => {
                    const isSelected = selectedDay?.date === day.date;
                    return (
                      <button
                        key={day.date}
                        onClick={() => setSelectedDay(day)}
                        title={`${day.date}: Level ${day.activity_level} activity`}
                        className={`w-4 h-4 rounded-md border transition-all transform hover:scale-125 focus:outline-none ${
                          levelColors[day.activity_level]
                        } ${isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-950 scale-125 z-10' : ''}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend and Time Range */}
          <div className="flex items-center justify-between pt-3 text-[10px] text-slate-400 border-t border-slate-800/80">
            <span>Last 12 Weeks (84 Days)</span>
            <div className="flex items-center space-x-1.5">
              <span>Less</span>
              <div className="w-3 h-3 rounded bg-slate-900 border border-slate-800" />
              <div className="w-3 h-3 rounded bg-emerald-950 border border-emerald-800/60" />
              <div className="w-3 h-3 rounded bg-emerald-800 border border-emerald-600" />
              <div className="w-3 h-3 rounded bg-emerald-600 border border-emerald-400" />
              <div className="w-3 h-3 rounded bg-emerald-400 border border-emerald-300" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Activity Inspection Panel */}
      {selectedDay && (
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white font-mono">
                Activity Details for {selectedDay.date}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                Level {selectedDay.activity_level} Intensity
              </span>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {selectedDay.details.length > 0 ? (
            <div className="space-y-2">
              {selectedDay.details.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800/80 flex items-start justify-between text-xs"
                >
                  <div className="flex items-start space-x-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono shrink-0">
                      {ev.type}
                    </span>
                    <div>
                      <h5 className="font-semibold text-white">{ev.title}</h5>
                      {ev.project && <p className="text-[11px] text-brand-400">{ev.project}</p>}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">{ev.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No specific milestone records logged on this date.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
