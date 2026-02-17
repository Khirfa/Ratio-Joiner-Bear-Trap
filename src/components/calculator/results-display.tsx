import { CalculationResult } from "@/lib/calculator";
import { cn } from "@/lib/utils";
import { Users, Shield, Sword, Crosshair, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface ResultsDisplayProps {
  results: CalculationResult | null;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-muted-foreground border border-white/5 rounded-lg bg-black/20">
        <AlertTriangle className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm font-mono uppercase tracking-widest opacity-50">Awaiting Data Input</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total Bonus" value={results.bonuses.totalBonus.toLocaleString()} icon={<Users className="w-4 h-4" />} />
        <MetricCard label="Ape Bonus" value={results.bonuses.kera.toLocaleString()} />
        <MetricCard label="Cyrille Bonus" value={results.bonuses.cyrille.toLocaleString()} />
        <MetricCard label="Rally Cap" value={results.openRally.totalCap.toLocaleString()} active />
      </div>

      {/* Main Results Table */}
      <div className="rounded-lg overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
        <div className="bg-primary/10 border-b border-primary/20 p-4">
          <h3 className="text-lg font-bold font-display uppercase tracking-widest text-primary text-glow flex items-center gap-2">
            <Sword className="w-5 h-5" />
            Combat Formation Analysis
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 text-left font-bold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="p-4 text-right text-blue-400">Infantry</th>
                <th className="p-4 text-right text-red-400">Lancer</th>
                <th className="p-4 text-right text-green-400">Marksman</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-foreground">Open Rally Troops</td>
                <td className="p-4 text-right">{results.openRally.infantry.toLocaleString()}</td>
                <td className="p-4 text-right">{results.openRally.lancer.toLocaleString()}</td>
                <td className="p-4 text-right">{results.openRally.marksman.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-foreground">Remaining Troops</td>
                <td className="p-4 text-right">{results.remaining.infantry.toLocaleString()}</td>
                <td className="p-4 text-right">{results.remaining.lancer.toLocaleString()}</td>
                <td className="p-4 text-right">{results.remaining.marksman.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors bg-white/[0.02]">
                <td className="p-4 font-medium text-primary">Avg Per March</td>
                <td className="p-4 text-right text-white font-bold">{results.basePerMarch.infantry.toLocaleString()}</td>
                <td className="p-4 text-right text-white font-bold">{results.basePerMarch.lancer.toLocaleString()}</td>
                <td className="p-4 text-right text-white font-bold">{results.basePerMarch.marksman.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Joiner Ratios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RatioCard 
          title="WITH Hero" 
          subtitle={`Capacity: ${results.ratios.withHero.capacity.toLocaleString()}`}
          ratios={results.ratios.withHero}
          variant="primary"
        />
        <RatioCard 
          title="WITHOUT Hero" 
          subtitle={`Capacity: ${results.ratios.noHero.capacity.toLocaleString()}`}
          ratios={results.ratios.noHero}
          variant="secondary"
        />
      </div>

      <div className="text-xs text-muted-foreground bg-black/30 p-4 rounded border border-white/5 space-y-2">
        <p><strong className="text-primary">NOTE:</strong> Prioritize the marksman ratio; adjust according to the results. For infantry and lancers, it's best to keep it within the normal range of 1-10% to avoid destroying other members' bear trap rally ratios.</p>
        <p className="italic text-[10px] opacity-70">— Note by Khirfa</p>
        <p>Ratios are calculated based on remaining troops divided by total marches, then applied against the specific march capacity (including skill bonuses).</p>
      </div>
    </motion.div>
  );
}

function MetricCard({ label, value, icon, active }: { label: string, value: string, icon?: React.ReactNode, active?: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded bg-secondary/50 border border-white/5 flex flex-col gap-1",
      active && "border-primary/50 bg-primary/5 shadow-[0_0_10px_-4px_rgba(76,175,80,0.3)]"
    )}>
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[10px] uppercase tracking-wider font-bold">{label}</span>
        {icon}
      </div>
      <span className={cn("text-lg font-mono font-bold", active ? "text-primary" : "text-foreground")}>
        {value}
      </span>
    </div>
  );
}

function RatioCard({ title, subtitle, ratios, variant }: { title: string, subtitle: string, ratios: { infantry: number, lancer: number, marksman: number }, variant: 'primary' | 'secondary' }) {
  const isPrimary = variant === 'primary';
  
  return (
    <div className={cn(
      "rounded-lg border p-6 space-y-4 relative overflow-hidden",
      isPrimary ? "bg-primary/10 border-primary/30" : "bg-secondary/40 border-white/10"
    )}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className={cn("text-lg font-bold font-display uppercase tracking-widest", isPrimary ? "text-primary" : "text-foreground")}>
            {title}
          </h4>
          <p className="text-xs font-mono text-muted-foreground mt-1">{subtitle}</p>
        </div>
        {isPrimary ? <Shield className="w-5 h-5 text-primary opacity-50" /> : <Users className="w-5 h-5 text-muted-foreground opacity-50" />}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-black/20 rounded border border-white/5">
          <div className="text-xs text-blue-400 mb-1 font-bold">INF</div>
          <div className="text-xl font-mono font-bold">{ratios.infantry}%</div>
        </div>
        <div className="p-2 bg-black/20 rounded border border-white/5">
          <div className="text-xs text-red-400 mb-1 font-bold">LAN</div>
          <div className="text-xl font-mono font-bold">{ratios.lancer}%</div>
        </div>
        <div className="p-2 bg-black/20 rounded border border-white/5">
          <div className="text-xs text-green-400 mb-1 font-bold">MM</div>
          <div className="text-xl font-mono font-bold">{ratios.marksman}%</div>
        </div>
      </div>
    </div>
  );
}
