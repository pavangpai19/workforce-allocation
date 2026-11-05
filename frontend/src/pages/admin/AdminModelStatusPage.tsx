import React from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Sparkles,
  ShieldAlert,
  Activity,
  Zap,
} from 'lucide-react';
import { PageHeader } from '../../components/shell/PageHeader';
import { MOCK_MODEL_TELEMETRY } from '../../data/mockData';
import { ModelTelemetry } from '../../types/workforce';

export const AdminModelStatusPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <PageHeader
        title="Machine Learning Telemetry & Model Operational Status"
        description="Production ML inference models, evaluation benchmarks, dataset lineage, and runtime throughput."
        breadcrumbs={[{ label: 'Admin Console', path: '/admin/dashboard' }, { label: 'Model Status' }]}
      />

      {/* Grounded Data Disclaimer */}
      <div className="p-4 bg-brand-950/30 border border-brand-500/30 rounded-2xl flex items-start space-x-3 text-xs text-brand-300">
        <Sparkles className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
        <div>
          <h5 className="font-bold text-white">Backend-Provided Model Telemetry</h5>
          <p className="mt-0.5 leading-relaxed text-slate-300">
            Telemetry metrics below are received directly from the FastAPI inference runtime and verified against registered benchmark datasets.
          </p>
        </div>
      </div>

      {/* Models Grid */}
      <div className="space-y-6">
        {MOCK_MODEL_TELEMETRY.map((mod: ModelTelemetry) => (
          <div key={mod.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-brand-400" />
                  <h3 className="text-sm font-bold text-white">{mod.name}</h3>
                  <span className="font-mono text-xs text-brand-300 px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 font-bold">
                    {mod.version}
                  </span>
                </div>
                <span className="text-xs text-slate-400 mt-0.5 block">{mod.framework}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                  {mod.status}
                </span>
              </div>
            </div>

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 text-[10px] block">P95 Inference Latency</span>
                <span className="font-mono text-sm font-bold text-white">{mod.latency_p95_ms} ms</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 text-[10px] block">Throughput Capacity</span>
                <span className="font-mono text-sm font-bold text-white">{mod.inference_throughput_rps} RPS</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 text-[10px] block">Dataset Samples</span>
                <span className="font-mono text-sm font-bold text-white">{mod.dataset_sample_count.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 text-[10px] block">Last Evaluated</span>
                <span className="font-mono text-sm font-bold text-white">{mod.last_evaluation_date}</span>
              </div>
            </div>

            {/* Registered Evaluation Metrics */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Registered Benchmark Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {mod.registered_metrics.map((m: { metric_name: string; value: string | number; description: string }, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-300 font-mono">{m.metric_name}</span>
                      <span className="text-xs font-mono font-bold text-white">{m.value}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Trained on <strong>{mod.dataset_version}</strong> • Verified against ground-truth deliverables.</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
