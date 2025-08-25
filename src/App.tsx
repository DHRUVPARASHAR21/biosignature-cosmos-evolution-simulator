
import React, { useState, useEffect, useCallback } from 'react';
import { environments } from './constants';
import { parseFasta } from './utils/fastaParser';
import { simulateEvolution } from './utils/evolutionSimulator';
import { getEvolutionExplanation } from './services/geminiService';
import type { EvolutionChange, EnvironmentName } from './types';
import VisualSpecimen from './components/VisualSpecimen';
import MarkdownRenderer from './components/MarkdownRenderer';
import LoadingSpinner from './components/LoadingSpinner';
import EvolutionaryInsight from './components/EvolutionaryInsight';

const App: React.FC = () => {
  const [fastaInput, setFastaInput] = useState<string>('');
  const [originalSequence, setOriginalSequence] = useState<string>('');
  const [originalHeader, setOriginalHeader] = useState<string>('');
  const [evolvedSequence, setEvolvedSequence] = useState<string>('');
  const [evolutionChanges, setEvolutionChanges] = useState<EvolutionChange[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<EnvironmentName>('Mars');
  const [simulationYears, setSimulationYears] = useState<number>(1000000);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFastaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFastaInput(content);
        const { header, sequence } = parseFasta(content);
        setOriginalHeader(header);
        setOriginalSequence(sequence);
        setError('');
      };
      reader.readAsText(file);
    }
  };

  const handleManualFastaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setFastaInput(content);
    const { header, sequence } = parseFasta(content);
    setOriginalHeader(header);
    setOriginalSequence(sequence);
    setError('');
  };

  const runSimulation = useCallback(async () => {
    if (!originalSequence) {
      setError('Please provide a FASTA sequence to simulate.');
      return;
    }
    setIsLoading(true);
    setError('');
    setExplanation('');
    setEvolvedSequence('');
    setEvolutionChanges([]);

    const { evolvedSequence: newEvolvedSequence, changes: newChanges } = simulateEvolution(
      originalSequence,
      selectedEnvironment,
      simulationYears
    );
    setEvolvedSequence(newEvolvedSequence);
    setEvolutionChanges(newChanges);

    const explanationText = await getEvolutionExplanation(
      originalSequence,
      newEvolvedSequence,
      newChanges,
      selectedEnvironment,
      simulationYears
    );
    setExplanation(explanationText);
    setIsLoading(false);
  }, [originalSequence, selectedEnvironment, simulationYears]);

  useEffect(() => {
    if (originalSequence) {
      const handler = setTimeout(() => {
        runSimulation();
      }, 500);
      return () => clearTimeout(handler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEnvironment, simulationYears, originalSequence]);

  const highlightSequenceChanges = (original: string, evolved: string, isOriginal: boolean) => {
    if (!original || !evolved) return isOriginal ? original : evolved;
    return original.split('').map((char, index) => {
      const evolvedChar = evolved[index];
      if (evolvedChar && char !== evolvedChar) {
        return (
          <span key={index} className="bg-yellow-300 text-black px-0.5 rounded-sm">
            {isOriginal ? char : evolvedChar}
          </span>
        );
      }
      return <span key={index}>{isOriginal ? char : evolvedChar}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 text-white font-inter p-4 sm:p-8">
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-10 border border-indigo-700">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          🧬 Biosignature Evolution Simulator 🚀
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col">
            <label htmlFor="fasta-input" className="text-xl font-medium mb-3 text-blue-300">
              Upload or Paste FASTA Sequence:
            </label>
            <input
              type="file"
              id="fasta-file-upload"
              accept=".fasta,.txt"
              onChange={handleFastaUpload}
              className="mb-4 text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-medium
                file:bg-indigo-600 file:text-white
                hover:file:bg-indigo-700 cursor-pointer"
            />
            <textarea
              id="fasta-input"
              className="w-full p-4 h-48 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-mono text-sm"
              placeholder=">My_Sequence_1
ATGCGTACGTACGTACGTACGTACG
TACGTACGTACGTACGTAGCTAGCT"
              value={fastaInput}
              onChange={handleManualFastaInput}
            ></textarea>
            {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
          </div>

          <div className="flex flex-col space-y-6">
            <div>
              <label htmlFor="environment-select" className="text-xl font-medium mb-3 block text-blue-300">
                Select Extraterrestrial Environment:
              </label>
              <select
                id="environment-select"
                className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md"
                value={selectedEnvironment}
                onChange={(e) => setSelectedEnvironment(e.target.value as EnvironmentName)}
              >
                {environments.map((env) => (
                  <option key={env.name} value={env.name}>
                    {env.name} - {env.description}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="time-slider" className="text-xl font-medium mb-3 block text-blue-300">
                Simulated Evolution Time: {simulationYears.toLocaleString()} Years
              </label>
              <input
                type="range"
                id="time-slider"
                min="100000"
                max="100000000"
                step="100000"
                value={simulationYears}
                onChange={(e) => setSimulationYears(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-thumb-blue-500"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>100K years</span>
                <span>100M years</span>
              </div>
            </div>
            <button
              onClick={runSimulation}
              disabled={isLoading || !originalSequence}
              className={`w-full py-3 px-6 rounded-lg text-lg font-bold transition-all duration-300
                ${isLoading || !originalSequence ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'}`}
            >
              {isLoading ? <LoadingSpinner text="Simulating..." /> : 'Run Simulation'}
            </button>
          </div>
        </div>

        <hr className="my-10 border-gray-700" />

        {(originalSequence || isLoading) && (
            <>
                <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-indigo-400">Simulation Results</h2>
                <p className="text-gray-300 text-lg">
                    See how your sequence might adapt to the extreme conditions of{' '}
                    <span className="font-medium text-purple-400">{selectedEnvironment}</span> over{' '}
                    <span className="font-medium text-blue-400">{simulationYears.toLocaleString()}</span> years.
                </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="bg-gray-700 p-6 rounded-lg shadow-lg border border-indigo-600">
                        <h3 className="text-2xl font-medium mb-4 text-green-400">Original Sequence (Earth)</h3>
                        <p className="text-gray-400 text-sm mb-3 font-mono">Header: {originalHeader}</p>
                        <div className="bg-gray-900 p-4 rounded-md text-gray-200 text-sm font-mono break-all max-h-96 overflow-auto">
                            {highlightSequenceChanges(originalSequence, evolvedSequence, true)}
                        </div>
                    </div>

                    <div className="bg-gray-700 p-6 rounded-lg shadow-lg border border-indigo-600 flex flex-col items-center justify-center h-full">
                        <h3 className="text-2xl font-medium mb-4 text-purple-300 text-center">Specimen Adaptation</h3>
                        <div className="flex justify-around w-full items-center">
                            <VisualSpecimen environment="Earth" simulationYears={0} />
                            <span className="text-5xl mx-4 text-gray-400">→</span>
                            {isLoading && !evolvedSequence ? (
                                <div className="flex flex-col items-center justify-center h-48 w-40 text-indigo-300">
                                   <LoadingSpinner text="Evolving..." />
                                </div>
                            ) : (
                                <VisualSpecimen environment={selectedEnvironment} simulationYears={simulationYears} />
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-700 p-6 rounded-lg shadow-lg border border-indigo-600">
                        <h3 className="text-2xl font-medium mb-4 text-yellow-300">Evolved Sequence ({selectedEnvironment})</h3>
                        <p className="text-gray-400 text-sm mb-3 font-mono">Simulated {simulationYears.toLocaleString()} years</p>
                        {isLoading && !evolvedSequence ? (
                            <div className="flex items-center justify-center h-48 text-indigo-300">
                                <LoadingSpinner text="Generating..." />
                            </div>
                        ) : (
                            <div className="bg-gray-900 p-4 rounded-md text-gray-200 text-sm font-mono break-all max-h-96 overflow-auto">
                            {highlightSequenceChanges(originalSequence, evolvedSequence, false)}
                            </div>
                        )}
                    </div>
                </div>
                 {!isLoading && (
                    <EvolutionaryInsight explanation={explanation} />
                )}
            </>
        )}
      </div>
    </div>
  );
}

export default App;
