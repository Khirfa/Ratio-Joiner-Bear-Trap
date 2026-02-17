import { CalculatorInput } from "@shared/schema";

// Constants from reference logic
const KERA_SKILL = {
  1: 1500, 2: 3000, 3: 4500, 4: 6000, 5: 7500, 
  6: 9000, 7: 10500, 8: 12000, 9: 13500, 10: 15000
} as const;

const CYRILLE_SKILL = {
  1: 3000, 2: 6000, 3: 9000, 4: 12000, 5: 15000, 
  6: 18000, 7: 21000, 8: 24000, 9: 27000, 10: 30000
} as const;

export interface CalculationResult {
  bonuses: {
    kera: number;
    cyrille: number;
    totalBonus: number;
  };
  openRally: {
    totalCap: number;
    infantry: number;
    lancer: number;
    marksman: number;
  };
  remaining: {
    infantry: number;
    lancer: number;
    marksman: number;
  };
  basePerMarch: {
    infantry: number;
    lancer: number;
    marksman: number;
  };
  ratios: {
    withHero: {
      infantry: number;
      lancer: number;
      marksman: number;
      capacity: number;
    };
    noHero: {
      infantry: number;
      lancer: number;
      marksman: number;
      capacity: number;
    };
  };
}

export function calculateBearTrap(input: CalculatorInput): CalculationResult {
  // 1. Get bonuses
  const bonusKera = KERA_SKILL[input.keraLevel as keyof typeof KERA_SKILL] || 0;
  const bonusCyrille = CYRILLE_SKILL[input.cyrilleLevel as keyof typeof CYRILLE_SKILL] || 0;
  const totalBonus = bonusKera + bonusCyrille;

  // 2. Total Hero Capacity for Open Rally
  // Note: Reference says "Open Rally uses Kera + Cyrille bonus"
  const totalHeroCap = input.heroCapacity + totalBonus;

  // 3. Open Rally Troops
  const openInf = Math.floor(totalHeroCap * (input.rallyRatios.infantry / 100));
  const openLan = Math.floor(totalHeroCap * (input.rallyRatios.lancer / 100));
  const openMar = Math.floor(totalHeroCap * (input.rallyRatios.marksman / 100));

  // 4. Remaining Troops (for Joiners)
  const remInf = Math.max(0, input.infantry - openInf);
  const remLan = Math.max(0, input.lancer - openLan);
  const remMar = Math.max(0, input.marksman - openMar);

  // 5. Per March Avg (Joiner Base)
  // Avoid division by zero
  const marches = Math.max(1, input.totalMarches);
  const baseInf = remInf / marches;
  const baseLan = remLan / marches;
  const baseMar = remMar / marches;

  // 6. Calculate Ratios
  // Helper to calculate percentages based on a specific capacity
  // Reference logic: adds bonuses to the passed capacity before calculating %
  const calculateRatioForCap = (baseCap: number) => {
    // According to prompt: hitungRasio(kapasitasDasar) adds bonuses to get total
    const effectiveCap = baseCap + totalBonus;
    return {
      infantry: Math.floor((baseInf / effectiveCap) * 100),
      lancer: Math.floor((baseLan / effectiveCap) * 100),
      marksman: Math.floor((baseMar / effectiveCap) * 100),
      capacity: effectiveCap
    };
  };

  const withHeroRatios = calculateRatioForCap(input.heroCapacity);
  const noHeroRatios = calculateRatioForCap(input.noHeroCapacity);

  return {
    bonuses: {
      kera: bonusKera,
      cyrille: bonusCyrille,
      totalBonus
    },
    openRally: {
      totalCap: totalHeroCap,
      infantry: openInf,
      lancer: openLan,
      marksman: openMar
    },
    remaining: {
      infantry: remInf,
      lancer: remLan,
      marksman: remMar
    },
    basePerMarch: {
      infantry: Math.floor(baseInf),
      lancer: Math.floor(baseLan),
      marksman: Math.floor(baseMar)
    },
    ratios: {
      withHero: withHeroRatios,
      noHero: noHeroRatios
    }
  };
}
