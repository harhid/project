import React, { useState } from 'react';
import { Download, Copy, Check, Star, TrendingUp, AlertTriangle, BookOpen, Code } from 'lucide-react';

interface ResultsDisplayProps {
  data: any;
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const copyToClipboard = () => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadJSON = () => {
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-analysis-${data.name || 'candidate'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-400';
    if (rating >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 8) return 'bg-green-500/20 border-green-500/30';
    if (rating >= 6) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Analyzing Resume...</h3>
          <p className="text-blue-300">AI is processing your resume and generating insights</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Ready to Analyze</h3>
          <p className="text-blue-300">Paste your resume text and click "Parse & Analyze" to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Analysis Results</h3>
              <p className="text-sm text-blue-300">Comprehensive resume evaluation</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors text-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
            <button
              onClick={downloadJSON}
              className="flex items-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* Resume Rating */}
        <div className={`p-4 rounded-xl border ${getRatingBg(data.resume_rating)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">Resume Quality Score</h4>
              <p className="text-sm text-slate-300">Based on industry best practices and ATS compatibility</p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getRatingColor(data.resume_rating)}`}>
                {data.resume_rating}/10
              </div>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < data.resume_rating ? getRatingColor(data.resume_rating) : 'text-slate-600'}`}
                    fill={i < data.resume_rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-blue-500/20">
        <div className="flex">
          {[
            { id: 'overview', label: 'Overview', icon: Star },
            { id: 'improvements', label: 'Improvements', icon: AlertTriangle },
            { id: 'upskilling', label: 'Upskilling', icon: BookOpen },
            { id: 'json', label: 'Raw JSON', icon: Code },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Personal Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Personal Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-400">Name:</span>
                  <span className="text-white ml-2">{data.name || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span>
                  <span className="text-white ml-2">{data.email || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Phone:</span>
                  <span className="text-white ml-2">{data.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Location:</span>
                  <span className="text-white ml-2">{data.location || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Core Skills</h4>
              <div className="flex flex-wrap gap-2">
                {data.core_skills?.length > 0 ? (
                  data.core_skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 text-sm">No skills identified</span>
                )}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Experience Summary</h4>
              <div className="text-sm text-slate-300">
                {data.experience?.length > 0 ? (
                  <p>{data.experience.length} positions found</p>
                ) : (
                  <p>No experience entries found</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'improvements' && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Improvement Recommendations</h4>
            {data.improvement_areas?.length > 0 ? (
              <ul className="space-y-3">
                {data.improvement_areas.map((improvement: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-200">{improvement}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400">No specific improvements identified</p>
            )}
          </div>
        )}

        {activeTab === 'upskilling' && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Upskilling Recommendations</h4>
            {data.upskill_suggestions?.length > 0 ? (
              <ul className="space-y-3">
                {data.upskill_suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                    <BookOpen className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-200">{suggestion}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400">No specific upskilling recommendations available</p>
            )}
          </div>
        )}

        {activeTab === 'json' && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Raw JSON Output</h4>
            <pre className="bg-slate-900/50 p-4 rounded-lg text-xs text-slate-300 overflow-x-auto border border-slate-700">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;