
import type { FastaSequence } from '../types';

export const parseFasta = (fastaContent: string): FastaSequence => {
  const lines = fastaContent.split('\n').filter(line => line.trim() !== '');
  let sequence = '';
  let header = 'Unknown Sequence';
  if (lines.length > 0 && lines[0].startsWith('>')) {
    header = lines[0].substring(1).trim();
    sequence = lines.slice(1).map(line => line.trim()).join('');
  } else {
    sequence = lines.map(line => line.trim()).join('');
  }
  return { header, sequence: sequence.toUpperCase().replace(/[^ACGTUYZQWERTYPISDFGHJKLNMVX]/g, '') };
};
