import React from 'react';
import { Clock, CheckCircle2, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type?: 'decision' | 'proposal' | 'alert' | 'system';
  actor?: string;
}

export interface ActivityTimelineProps {
  events: TimelineEvent[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ events }) => {
  return (
    <div className="space-y-4">
      {events.map((event, idx) => (
        <div key={event.id} className="relative pl-6 pb-4 border-l border-slate-800 last:pb-0">
          {/* Dot */}
          <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-slate-900 border-2 border-brand-500" />
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">{event.title}</span>
            <span className="text-[11px] text-slate-500">{event.timestamp}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{event.description}</p>
          {event.actor && (
            <span className="inline-block mt-1 text-[10px] text-brand-300 font-semibold bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
              {event.actor}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
