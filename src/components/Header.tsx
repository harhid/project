import React from 'react';
import { FileText, Github, Star } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-blue-800/30 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Deepklarity</h2>
              <p className="text-sm text-blue-300">Resume Parser & Analyzer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Assignment Demo</span>
            </div>
            <button className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">View Code</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;