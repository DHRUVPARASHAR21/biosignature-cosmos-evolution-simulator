
import { aminoAcidProperties } from '../constants';
import type { SimulationResult, EnvironmentName } from '../types';

export const simulateEvolution = (originalSequence: string, environment: EnvironmentName, years: number): SimulationResult => {
  if (!originalSequence) return { evolvedSequence: '', changes: [] };

  let currentSequence = originalSequence.split('');
  const changes = [];
  const mutationRate = years / 1000000;

  const environmentalPressures = {
    'Mars': { radiation: 0.1, cold: 0.2, desiccation: 0.15 },
    'Europa': { pressure: 0.2, cold: 0.1, darkness: 0.05 },
    'Enceladus': { hydrothermal: 0.2, pressure: 0.1, cold: 0.05 },
    'Titan': { methane: 0.25, cold: 0.15, lowOxygen: 0.1 }
  };

  const pressure = environmentalPressures[environment];
  if (!pressure) return { evolvedSequence: originalSequence, changes: [] };

  for (let i = 0; i < currentSequence.length; i++) {
    if (Math.random() < mutationRate) {
      const originalAA = currentSequence[i];
      let newAA = originalAA;
      let changeReason: string[] = [];
      const originalAAProps = aminoAcidProperties[originalAA];

      if (pressure.radiation && Math.random() < pressure.radiation * 0.5) {
        const stableAAs = ['I', 'L', 'V', 'C', 'P'];
        newAA = stableAAs[Math.floor(Math.random() * stableAAs.length)];
        changeReason.push('Radiation-induced stability');
      }

      if (pressure.cold && Math.random() < pressure.cold * 0.5) {
        const flexibleAAs = ['G', 'A', 'S'];
        if (originalAAProps?.flexibility === 'low') {
          newAA = flexibleAAs[Math.floor(Math.random() * flexibleAAs.length)];
          changeReason.push('Cold adaptation for flexibility');
        } else {
          newAA = flexibleAAs[Math.floor(Math.random() * flexibleAAs.length)];
          changeReason.push('Cold adaptation for flexibility');
        }
      }

      if (pressure.pressure && Math.random() < pressure.pressure * 0.5) {
        const compactAAs = ['A', 'G', 'S', 'C'];
        if (originalAAProps?.size === 'large' || originalAAProps?.size === 'very-large') {
          newAA = compactAAs[Math.floor(Math.random() * compactAAs.length)];
          changeReason.push('Pressure adaptation for compactness');
        } else {
          newAA = compactAAs[Math.floor(Math.random() * compactAAs.length)];
          changeReason.push('Pressure adaptation for compactness');
        }
      }

      if (pressure.hydrothermal && Math.random() < pressure.hydrothermal * 0.5) {
        const stableHeatAAs = ['I', 'L', 'V', 'F', 'Y', 'W', 'R', 'K'];
        if (originalAAProps?.stability !== 'high') {
          newAA = stableHeatAAs[Math.floor(Math.random() * stableHeatAAs.length)];
          changeReason.push('Hydrothermal vent adaptation for thermal stability');
        }
      }

      if (pressure.methane && Math.random() < pressure.methane * 0.5) {
        const methaneCompatibleAAs = ['V', 'L', 'I', 'F', 'M'];
        if (originalAAProps?.type !== 'nonpolar') {
          newAA = methaneCompatibleAAs[Math.floor(Math.random() * methaneCompatibleAAs.length)];
          changeReason.push('Methane environment adaptation (hydrophobicity)');
        }
      }
      
      if (newAA === originalAA) {
        const allAAs = Object.keys(aminoAcidProperties).filter(aa => aa !== 'X');
        do {
          newAA = allAAs[Math.floor(Math.random() * allAAs.length)];
        } while (newAA === originalAA);
        changeReason.push('Random mutation');
      }

      if (newAA !== originalAA) {
        currentSequence[i] = newAA;
        changes.push({
          index: i,
          original: originalAA,
          evolved: newAA,
          reason: changeReason.join(', ')
        });
      }
    }
  }

  return { evolvedSequence: currentSequence.join(''), changes };
};
