import React, { useState } from 'react';
import { Upload, FileText, Zap, AlertCircle } from 'lucide-react';

interface ResumeParserProps {
  onParse: (resumeText: string) => void;
  isLoading: boolean;
  error: string;
}

const ResumeParser: React.FC<ResumeParserProps> = ({ onParse, isLoading, error }) => {
  const [resumeText, setResumeText] = useState('');

  const handleParse = async () => {
    onParse(resumeText);
  };

  const handleSampleResume = () => {
    const sampleText = `Sarah Johnson
Email: sarah.johnson@email.com
Phone: (555) 987-6543
Location: New York, NY
LinkedIn: linkedin.com/in/sarahjohnson
GitHub: github.com/sarahjohnson

PROFESSIONAL SUMMARY
Senior Software Engineer with 6+ years of experience developing scalable web applications using React, Node.js, Python, and cloud technologies. Proven track record of leading cross-functional teams and delivering high-impact solutions that improved user engagement by 45% and reduced system latency by 35%. Expert in full-stack development with strong problem-solving skills.

EXPERIENCE

Lead Software Engineer | TechFlow Solutions | Mar 2022 - Present
• Lead development of microservices architecture serving 2M+ daily users
• Implemented CI/CD pipeline reducing deployment time by 60%
• Mentored 8 junior developers and improved team productivity by 30%
• Built real-time analytics dashboard using React, TypeScript, and D3.js
• Architected scalable backend systems using Node.js and PostgreSQL

Senior Software Engineer | InnovateTech | Jun 2020 - Feb 2022
• Developed full-stack web applications using React, Python Django, and PostgreSQL
• Optimized database queries improving response times by 55%
• Collaborated with product team to define technical requirements and user stories
• Implemented responsive design supporting mobile, tablet, and desktop users
• Led migration from monolithic to microservices architecture

Software Engineer | WebSolutions LLC | Aug 2018 - May 2020
• Built customer-facing features using HTML, CSS, JavaScript, React, and Node.js
• Participated in code reviews and maintained coding standards
• Fixed critical bugs and improved application stability by 40%
• Worked in Agile environment with bi-weekly sprints
• Developed RESTful APIs and integrated third-party services

EDUCATION
Master of Science in Computer Science | MIT | 2016-2018
• GPA: 3.8/4.0
• Thesis: "Scalable Machine Learning Systems for Real-time Data Processing"

Bachelor of Science in Computer Science | UC Berkeley | 2012-2016
• GPA: 3.6/4.0
• Relevant Coursework: Data Structures, Algorithms, Database Systems, Software Engineering, Machine Learning

TECHNICAL SKILLS
Programming Languages: JavaScript, TypeScript, Python, Java, Go, SQL
Frontend: React, Vue.js, Angular, HTML5, CSS3, Sass, Tailwind CSS
Backend: Node.js, Express, Django, Flask, Spring Boot, FastAPI
Databases: PostgreSQL, MongoDB, Redis, MySQL, Elasticsearch
Cloud & DevOps: AWS, Azure, Docker, Kubernetes, CI/CD, Jenkins, Terraform
Tools: Git, Jira, Figma, VS Code, Postman, Webpack, Jest

PROJECTS
Real-time Chat Application | Personal Project | 2023
• Built scalable real-time chat application supporting 10,000+ concurrent users
• Technologies: React, Node.js, Socket.io, Redis, PostgreSQL, AWS
• Features: Real-time messaging, file sharing, video calls, user authentication
• GitHub: github.com/sarahjohnson/realtime-chat

AI-Powered Code Review Tool | Open Source | 2022
• Developed AI-powered code review tool using machine learning
• Technologies: Python, TensorFlow, React, FastAPI, PostgreSQL
• 1,200+ GitHub stars and 80+ contributors
• Integrated with GitHub and GitLab APIs

CERTIFICATIONS
AWS Certified Solutions Architect - Professional | Amazon Web Services | 2023
Google Cloud Professional Cloud Architect | Google Cloud | 2022
Certified Kubernetes Administrator (CKA) | Cloud Native Computing Foundation | 2022
Certified Scrum Master | Scrum Alliance | 2021

ACHIEVEMENTS
• Winner of company-wide hackathon 2023 - "Best Innovation Award"
• Speaker at React Conference 2023 and PyCon 2022
• Open source contributor with 2,500+ GitHub contributions
• Led team that won "Technical Excellence Award" for microservices migration
• Published research paper on "Scalable Real-time Systems" in IEEE conference
• Mentored 15+ junior developers through various programs`;

    setResumeText(sampleText);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Resume Input</h3>
            <p className="text-sm text-blue-300">Paste complete resume text for analysis</p>
          </div>
        </div>
        
        <button
          onClick={handleSampleResume}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors px-3 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20"
        >
          Load Sample Resume
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your complete resume text here... Include all sections: contact information, professional summary, work experience, education, technical skills, projects, certifications, and achievements."
            className="w-full h-80 p-4 rounded-xl bg-slate-800/50 border border-blue-500/30 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-400">
            {resumeText.length} characters
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          onClick={handleParse}
          disabled={isLoading || !resumeText.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Resume...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Parse Resume to JSON</span>
            </>
          )}
        </button>

        <div className="text-xs text-slate-400 bg-slate-800/30 p-4 rounded-lg">
          <p className="font-medium mb-2">📋 Assignment Requirements:</p>
          <ul className="space-y-1 ml-2">
            <li>• Extract ALL structured details from resume text</li>
            <li>• Analyze resume quality and provide rating (1-10)</li>
            <li>• Suggest clear, actionable improvement points</li>
            <li>• Recommend specific upskilling paths (not generic)</li>
            <li>• Return ONLY valid JSON format</li>
            <li>• Use YYYY-MM or YYYY-MM-DD date formats</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumeParser;