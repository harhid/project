import React, { useState } from 'react';
import { FileText, Brain, Target, TrendingUp, Upload, Zap } from 'lucide-react';
import ResumeParser from './components/ResumeParser';
import ResultsDisplay from './components/ResultsDisplay';
import Header from './components/Header';
import { parseResumeToJSON } from './utils/resumeParser';

function App() {
  const [parsedData, setParsedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleParseResume = async (resumeText: string) => {
    if (!resumeText.trim()) {
      setError('Please provide resume text to parse');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = parseResumeToJSON(resumeText);
      setParsedData(result);
    } catch (err) {
      setError('Failed to parse resume. Please check the format and try again.');
      console.error('Resume parsing error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Deepklarity Resume Parser
            </h1>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              Expert resume parsing and analysis system with intelligent field extraction, quality assessment, and actionable improvement recommendations
            </p>
            
            <div className="flex justify-center items-center gap-8 mb-8">
              <div className="flex items-center gap-2 text-blue-300">
                <FileText className="w-5 h-5" />
                <span>Structured Extraction</span>
              </div>
              <div className="flex items-center gap-2 text-blue-300">
                <Brain className="w-5 h-5" />
                <span>Quality Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-blue-300">
                <Target className="w-5 h-5" />
                <span>Improvement Areas</span>
              </div>
              <div className="flex items-center gap-2 text-blue-300">
                <TrendingUp className="w-5 h-5" />
                <span>Upskilling Paths</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <ResumeParser 
              onParse={handleParseResume}
              isLoading={isLoading}
              error={error}
            />
            <ResultsDisplay 
              data={parsedData}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;