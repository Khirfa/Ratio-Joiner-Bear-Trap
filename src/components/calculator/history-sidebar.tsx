import { useCalculations, useDeleteCalculation } from "@/hooks/use-calculations";
import type { Calculation } from "@shared/schema";
import { format } from "date-fns";
import { Clock, Trash2, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HistorySidebarProps {
  onSelect: (calc: Calculation) => void;
  className?: string;
}

export function HistorySidebar({ onSelect, className }: HistorySidebarProps) {
  const { data: calculations, isLoading } = useCalculations();
  const deleteMutation = useDeleteCalculation();

  if (isLoading) {
    return <div className="p-4 text-muted-foreground text-sm font-mono animate-pulse">Loading data uplink...</div>;
  }

  return (
    <div className={cn("flex flex-col h-full border-l border-white/10 bg-black/20", className)}>
      <div className="p-4 border-b border-white/10 bg-black/40">
        <h3 className="font-display font-bold text-lg uppercase tracking-widest flex items-center gap-2 text-primary">
          <Clock className="w-4 h-4" />
          Mission Log
        </h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {calculations?.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8 opacity-50">No mission logs found.</p>
          )}
          
          {calculations?.map((calc) => (
            <div 
              key={calc.id}
              className="group relative bg-secondary/50 hover:bg-secondary border border-white/5 hover:border-primary/50 rounded p-3 transition-all duration-200 cursor-pointer"
              onClick={() => onSelect(calc)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {calc.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {calc.createdAt ? format(new Date(calc.createdAt), 'MMM d, HH:mm') : ''}
                </span>
              </div>
              
              <div className="text-[10px] text-muted-foreground font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Input Cap:</span>
                  <span className="text-white">
                    {/* Access inputs safely since it's JSONB */}
                    {(calc.inputs as any).heroCapacity?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Marches:</span>
                  <span className="text-white">{(calc.inputs as any).totalMarches}</span>
                </div>
              </div>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                 <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate(calc.id);
                    }}
                 >
                   <Trash2 className="w-3 h-3" />
                 </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
