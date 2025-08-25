
export interface AminoAcidProperty {
  type: string;
  size: string;
  stability: string;
  flexibility?: string;
}

export type AminoAcidProperties = Record<string, AminoAcidProperty>;

export interface Environment {
  name: string;
  description: string;
}

export interface EvolutionChange {
  index: number;
  original: string;
  evolved: string;
  reason: string;
}

export interface FastaSequence {
  header: string;
  sequence: string;
}

export interface SimulationResult {
  evolvedSequence: string;
  changes: EvolutionChange[];
}

export type EnvironmentName = 'Mars' | 'Europa' | 'Enceladus' | 'Titan' | 'Earth';
