import { useState } from "react";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { ResultsDisplay } from "@/components/calculator/results-display";
import { HistorySidebar } from "@/components/calculator/history-sidebar";
import { calculateBearTrap, type CalculationResult } from "@/lib/calculator";
import { CalculatorInput, Calculation } from "@shared/schema";
import { useCreateCalculation } from "@/hooks/use-calculations";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Gamepad2 } from "lucide-react";

export default function Home() {
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [currentInput, setCurrentInput] = useState<CalculatorInput | null>(null);
  const [formData, setFormData] = useState<Partial<CalculatorInput> | undefined>(undefined);
  
  const createMutation = useCreateCalculation();

  const handleCalculate = (data: CalculatorInput) => {
    const res = calculateBearTrap(data);
    setResults(res);
    setCurrentInput(data);
  };

  const handleSave = (data: CalculatorInput) => {
    // Re-run calc to be sure we have latest results
    const res = calculateBearTrap(data);
    
    createMutation.mutate({
      name: `Mission ${new Date().toLocaleTimeString()}`,
      inputs: data,
      results: res as any, // Cast for JSONB compatibility
    });
  };

  const handleHistorySelect = (calc: Calculation) => {
    // Type assertion because JSONB comes back as any/unknown
    const inputs = calc.inputs as unknown as CalculatorInput;
    setFormData(inputs);
    handleCalculate(inputs);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden">
      {/* Mobile History Toggle */}
      <div className="md:hidden p-4 border-b border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-primary font-display font-bold uppercase">
          <Gamepad2 className="w-5 h-5" />
          <span>Bear Trap Calc</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="border-primary/50 text-primary">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 border-l border-white/10 w-80 bg-background/95 backdrop-blur-xl">
            <HistorySidebar onSelect={handleHistorySelect} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-65px)] md:h-screen p-4 md:p-8 relative">
        {/* Background elements */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent z-50 pointer-events-none opacity-50" />
        
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
          <header className="hidden md:flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-primary/10 rounded-lg border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(76,175,80,0.3)]">
              <Gamepad2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-white text-glow">
                Bear Trap <span className="text-primary">Calculator</span>
              </h1>
              <p className="text-sm font-mono text-muted-foreground tracking-wider">
                Tactical Ratio Analysis System v2.0
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Input Form */}
            <div className="lg:col-span-5 space-y-6">
              <CalculatorForm 
                defaultValues={formData}
                onCalculate={handleCalculate}
                onSave={handleSave}
                isSaving={createMutation.isPending}
              />
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-7">
              <ResultsDisplay results={results} />
            </div>
          </div>
        </div>
      </main>

      {/* Desktop History Sidebar */}
      <aside className="hidden md:block w-80 h-screen sticky top-0 shadow-2xl z-40">
        <HistorySidebar onSelect={handleHistorySelect} />
      </aside>
    </div>
  );
}
