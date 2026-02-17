import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculatorInputSchema, type CalculatorInput } from "@shared/schema";
import { CyberInput } from "@/components/ui/cyber-input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Calculator, Save, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface CalculatorFormProps {
  defaultValues?: Partial<CalculatorInput>;
  onCalculate: (data: CalculatorInput) => void;
  onSave: (data: CalculatorInput) => void;
  isSaving: boolean;
}

const initialValues: CalculatorInput = {
  infantry: 0,
  lancer: 0,
  marksman: 0,
  heroCapacity: 0,
  noHeroCapacity: 0,
  totalMarches: 1,
  keraLevel: 10,
  cyrilleLevel: 10,
  rallyRatios: {
    infantry: 10,
    lancer: 45,
    marksman: 45,
  },
};

export function CalculatorForm({ defaultValues, onCalculate, onSave, isSaving }: CalculatorFormProps) {
  const form = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorInputSchema),
    defaultValues: defaultValues || initialValues,
    mode: "onChange", // Calculate on change
  });

  // Watch all fields to trigger real-time calculation
  const values = form.watch();

  // Trigger calculation whenever valid values change
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      // Small debounce could be added here if needed
      form.handleSubmit(onCalculate)();
    });
    return () => subscription.unsubscribe();
  }, [form, onCalculate]);

  // Load default values if they change (from history selection)
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const onSubmit = (data: CalculatorInput) => {
    onCalculate(data);
  };

  const handleSave = () => {
    form.handleSubmit(onSave)();
  };

  return (
    <div className="bg-secondary/30 backdrop-blur-sm border border-white/5 p-6 rounded-lg shadow-xl relative overflow-hidden">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/50" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/50" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/50" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/50" />

      <div className="flex items-center gap-2 mb-6 text-primary border-b border-white/10 pb-4">
        <Calculator className="w-5 h-5" />
        <h2 className="text-lg font-bold font-display uppercase tracking-widest text-glow">
          Mission Parameters
        </h2>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Total Troops */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold border-l-2 border-primary pl-2">
            Total Troops Available
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CyberInput
              type="number"
              label="Infantry"
              {...form.register("infantry", { valueAsNumber: true })}
              onFocus={(e) => e.target.select()}
              error={form.formState.errors.infantry?.message}
            />
            <CyberInput
              type="number"
              label="Lancer"
              {...form.register("lancer", { valueAsNumber: true })}
              onFocus={(e) => e.target.select()}
              error={form.formState.errors.lancer?.message}
            />
            <CyberInput
              type="number"
              label="Marksman"
              {...form.register("marksman", { valueAsNumber: true })}
              onFocus={(e) => e.target.select()}
              error={form.formState.errors.marksman?.message}
            />
          </div>
        </div>

        {/* Section 2: March Capacities */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold border-l-2 border-primary pl-2">
            March Capacities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CyberInput
              type="number"
              label="With Hero"
              {...form.register("heroCapacity", { valueAsNumber: true })}
              onFocus={(e) => e.target.select()}
              error={form.formState.errors.heroCapacity?.message}
            />
            <CyberInput
              type="number"
              label="No Hero"
              {...form.register("noHeroCapacity", { valueAsNumber: true })}
              onFocus={(e) => e.target.select()}
              error={form.formState.errors.noHeroCapacity?.message}
            />
            <CyberInput
              type="number"
              label="Total Marches (Max 6)"
              {...form.register("totalMarches", { valueAsNumber: true })}
              onFocus={(e) => e.target.select()}
              error={form.formState.errors.totalMarches?.message}
            />
          </div>
        </div>

        {/* Section 3: Skills & Rally Ratios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold border-l-2 border-primary pl-2">
              Skill Levels (1-10)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <CyberInput
                type="number"
                label="Ape Level"
                min={0}
                max={10}
                {...form.register("keraLevel", { valueAsNumber: true })}
                onFocus={(e) => e.target.select()}
                error={form.formState.errors.keraLevel?.message}
              />
              <CyberInput
                type="number"
                label="Cyrille Level"
                min={0}
                max={10}
                {...form.register("cyrilleLevel", { valueAsNumber: true })}
                onFocus={(e) => e.target.select()}
                error={form.formState.errors.cyrilleLevel?.message}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold border-l-2 border-primary pl-2">
              Rally Ratios (%)
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <CyberInput
                type="number"
                label="INF %"
                {...form.register("rallyRatios.infantry", { valueAsNumber: true })}
                onFocus={(e) => e.target.select()}
                error={form.formState.errors.rallyRatios?.infantry?.message}
              />
              <CyberInput
                type="number"
                label="LAN %"
                {...form.register("rallyRatios.lancer", { valueAsNumber: true })}
                onFocus={(e) => e.target.select()}
                error={form.formState.errors.rallyRatios?.lancer?.message}
              />
              <CyberInput
                type="number"
                label="MM %"
                {...form.register("rallyRatios.marksman", { valueAsNumber: true })}
                onFocus={(e) => e.target.select()}
                error={form.formState.errors.rallyRatios?.marksman?.message}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 border-primary/20 hover:border-primary hover:bg-primary/10 text-primary"
            onClick={() => form.reset(initialValues)}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button 
            type="button" 
            className="flex-[2] bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wider shadow-[0_0_15px_-3px_rgba(76,175,80,0.6)]"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Config"}
          </Button>
        </div>
      </form>
    </div>
  );
}
