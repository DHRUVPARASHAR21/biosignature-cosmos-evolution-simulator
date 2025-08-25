
import type { AminoAcidProperties, Environment } from './types';

export const aminoAcidProperties: AminoAcidProperties = {
  'A': { type: 'nonpolar', size: 'small', stability: 'moderate' },
  'R': { type: 'basic', size: 'large', stability: 'moderate' },
  'N': { type: 'polar', size: 'medium', stability: 'moderate' },
  'D': { type: 'acidic', size: 'medium', stability: 'moderate' },
  'C': { type: 'polar', size: 'small', stability: 'high-disulfide' },
  'E': { type: 'acidic', size: 'large', stability: 'moderate' },
  'Q': { type: 'polar', size: 'large', stability: 'moderate' },
  'G': { type: 'nonpolar', size: 'very-small', flexibility: 'high', stability: 'low-in-alpha-helix' },
  'H': { type: 'basic', size: 'medium', stability: 'moderate' },
  'I': { type: 'nonpolar', size: 'large', stability: 'high' },
  'L': { type: 'nonpolar', size: 'large', stability: 'high' },
  'K': { type: 'basic', size: 'large', stability: 'moderate' },
  'M': { type: 'nonpolar', size: 'medium', stability: 'moderate' },
  'F': { type: 'nonpolar', size: 'large', stability: 'high' },
  'P': { type: 'nonpolar', size: 'medium', flexibility: 'low', stability: 'high-turns' },
  'S': { type: 'polar', size: 'small', stability: 'moderate' },
  'T': { type: 'polar', size: 'medium', stability: 'moderate' },
  'W': { type: 'nonpolar', size: 'very-large', stability: 'moderate' },
  'Y': { type: 'polar', size: 'large', stability: 'moderate' },
  'V': { type: 'nonpolar', size: 'medium', stability: 'high' },
  'X': { type: 'unknown', size: 'unknown', stability: 'unknown' }
};

export const environments: Environment[] = [
    { name: 'Mars', description: 'Cold, dry, high radiation, thin atmosphere.' },
    { name: 'Europa', description: 'Icy moon, subsurface ocean, high pressure, extreme cold, dark.' },
    { name: 'Enceladus', description: 'Icy moon, subsurface ocean, hydrothermal vents (localized heat), high pressure.' },
    { name: 'Titan', description: 'Thick methane atmosphere/lakes, extreme cold, low oxygen, high hydrocarbons.' },
];
