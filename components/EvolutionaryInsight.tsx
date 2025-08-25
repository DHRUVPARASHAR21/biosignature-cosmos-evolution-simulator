import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface EvolutionaryInsightProps {
  explanation: string;
}

const EvolutionaryInsight: React.FC<EvolutionaryInsightProps> = ({ explanation }) => {
  if (!explanation) {
    return null;
  }

  return (
    <div className="mt-12 bg-gray-700 p-6 rounded-lg shadow-lg border border-indigo-600">
      <h3 className="text-2xl font-bold mb-4 text-purple-400">Evolutionary Insight</h3>
      <div className="prose prose-invert text-gray-200">
        <MarkdownRenderer text={explanation} />
      </div>
    </div>
  );
};

export default EvolutionaryInsight;
