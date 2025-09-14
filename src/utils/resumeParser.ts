interface ParsedResume {
  name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  summary: string | null;
  education: Array<{
    degree: string;
    institution: string;
    start: string | null;
    end: string | null;
  }>;
  experience: Array<{
    title: string;
    company: string;
    start: string | null;
    end: string | null;
    description: string | null;
    achievements: string[];
  }>;
  core_skills: string[];
  soft_skills: string[];
  projects: Array<{
    name: string;
    description: string;
    tech_stack: string[];
    link: string | null;
  }>;
  certifications: Array<{
    name: string;
    authority: string | null;
    year: string | null;
  }>;
  achievements: string[];
  resume_rating: number;
  improvement_areas: string[];
  upskill_suggestions: string[];
}

export function parseResumeToJSON(text: string): ParsedResume {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Extract personal information
  const name = extractName(text);
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const location = extractLocation(text);
  const linkedin = extractLinkedIn(text);
  
  // Extract sections
  const summary = extractSummary(text);
  const education = extractEducation(text);
  const experience = extractExperience(text);
  const coreSkills = extractCoreSkills(text);
  const softSkills = extractSoftSkills(text);
  const projects = extractProjects(text);
  const certifications = extractCertifications(text);
  const achievements = extractAchievements(text);
  
  // Calculate rating and recommendations
  const resumeRating = calculateResumeRating({
    name, email, phone, summary, education, experience, coreSkills, certifications, projects, achievements
  });
  
  const improvementAreas = getImprovementAreas({
    name, email, phone, location, summary, education, experience, coreSkills, projects, certifications, achievements
  });
  
  const upskillSuggestions = getUpskillSuggestions(coreSkills, experience, education);

  return {
    name,
    email,
    phone,
    location,
    linkedin,
    summary,
    education,
    experience,
    core_skills: coreSkills,
    soft_skills: softSkills,
    projects,
    certifications,
    achievements,
    resume_rating: resumeRating,
    improvement_areas: improvementAreas,
    upskill_suggestions: upskillSuggestions
  };
}

function extractName(text: string): string | null {
  const lines = text.split('\n').map(line => line.trim());
  
  // Look for name patterns in the first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    
    // Skip empty lines and lines that look like headers
    if (!line || line.toLowerCase().includes('resume') || line.toLowerCase().includes('cv')) {
      continue;
    }
    
    // Skip lines that look like contact info
    if (line.includes('@') || line.includes('linkedin') || line.includes('github') || 
        line.includes('(') || line.includes('+') || line.toLowerCase().includes('phone')) {
      continue;
    }
    
    // Look for name-like patterns (2-4 words, mostly letters)
    const namePattern = /^[A-Za-z\s\.]{2,50}$/;
    if (namePattern.test(line) && line.split(' ').length >= 2 && line.split(' ').length <= 4) {
      return line;
    }
  }
  
  return null;
}

function extractEmail(text: string): string | null {
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailPattern);
  return match ? match[0] : null;
}

function extractPhone(text: string): string | null {
  const phonePatterns = [
    /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    /\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    /\+\d{1,3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/
  ];
  
  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  
  return null;
}

function extractLocation(text: string): string | null {
  const locationPatterns = [
    /([A-Za-z\s]+),\s*([A-Z]{2})\s*\d{5}/,
    /([A-Za-z\s]+),\s*([A-Z]{2})/,
    /Location:\s*([A-Za-z\s,]+)/i,
    /Address:\s*([A-Za-z\s,]+)/i
  ];
  
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }
  
  return null;
}

function extractLinkedIn(text: string): string | null {
  const linkedinPattern = /(?:linkedin\.com\/in\/|linkedin\.com\/profile\/view\?id=)([A-Za-z0-9-]+)/i;
  const match = text.match(linkedinPattern);
  return match ? `linkedin.com/in/${match[1]}` : null;
}

function extractSummary(text: string): string | null {
  const summaryKeywords = ['summary', 'profile', 'objective', 'about', 'professional summary'];
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();
    
    for (const keyword of summaryKeywords) {
      if (line.includes(keyword) && !line.includes('experience') && !line.includes('education')) {
        // Found summary section, extract content
        let summaryText = '';
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim();
          
          // Stop if we hit another section
          if (isNewSection(nextLine)) break;
          
          if (nextLine) {
            summaryText += nextLine + ' ';
          }
        }
        
        return summaryText.trim() || null;
      }
    }
  }
  
  return null;
}

function extractEducation(text: string): Array<{degree: string, institution: string, start: string | null, end: string | null}> {
  const education: Array<{degree: string, institution: string, start: string | null, end: string | null}> = [];
  const lines = text.split('\n');
  
  let inEducationSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.toLowerCase().includes('education') && line.length < 20) {
      inEducationSection = true;
      continue;
    }
    
    if (inEducationSection) {
      if (isNewSection(line)) break;
      
      // Look for degree patterns
      const degreePatterns = [
        /(?:Bachelor|Master|PhD|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|MBA|MS|BS|BA|MA|Ph\.?D\.?)\s+.*?(?:\s+\|\s+|\s+at\s+|\s+-\s+)([^|]+)/i,
        /([^|]+?)\s*\|\s*([^|]+)\s*\|\s*(\d{4}(?:-\d{4})?|\d{4}-\w+)/,
        /(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)/
      ];
      
      for (const pattern of degreePatterns) {
        const match = line.match(pattern);
        if (match && match[1] && match[2]) {
          const dates = extractDatesFromString(line);
          education.push({
            degree: match[1].trim(),
            institution: match[2].trim(),
            start: dates.start,
            end: dates.end
          });
          break;
        }
      }
    }
  }
  
  return education;
}

function extractExperience(text: string): Array<{
  title: string,
  company: string,
  start: string | null,
  end: string | null,
  description: string | null,
  achievements: string[]
}> {
  const experience: Array<{
    title: string,
    company: string,
    start: string | null,
    end: string | null,
    description: string | null,
    achievements: string[]
  }> = [];
  
  const lines = text.split('\n');
  let inExperienceSection = false;
  let currentJob: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if ((line.toLowerCase().includes('experience') || line.toLowerCase().includes('employment')) && line.length < 30) {
      inExperienceSection = true;
      continue;
    }
    
    if (inExperienceSection) {
      if (isNewSection(line) && !line.toLowerCase().includes('experience')) {
        if (currentJob) experience.push(currentJob);
        break;
      }
      
      // Look for job title patterns
      const jobPattern = /(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)/;
      const match = line.match(jobPattern);
      
      if (match && match[1] && match[2]) {
        // Save previous job
        if (currentJob) experience.push(currentJob);
        
        const dates = extractDatesFromString(line);
        currentJob = {
          title: match[1].trim(),
          company: match[2].trim(),
          start: dates.start,
          end: dates.end,
          description: null,
          achievements: []
        };
      } else if (currentJob && (line.startsWith('•') || line.startsWith('-'))) {
        // Achievement/responsibility
        currentJob.achievements.push(line.replace(/^[•\-]\s*/, '').trim());
      } else if (currentJob && line && !line.includes('|') && line.length > 20) {
        // Description
        if (!currentJob.description) currentJob.description = '';
        currentJob.description += line + ' ';
      }
    }
  }
  
  if (currentJob) experience.push(currentJob);
  
  return experience;
}

function extractCoreSkills(text: string): string[] {
  const skillKeywords = ['skills', 'technical skills', 'technologies', 'programming languages', 'frontend', 'backend', 'tools'];
  const lines = text.split('\n');
  let skills: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();
    
    for (const keyword of skillKeywords) {
      if (line.includes(keyword) && line.length < 50) {
        // Found skills section
        for (let j = i + 1; j < lines.length; j++) {
          const skillLine = lines[j].trim();
          
          if (isNewSection(skillLine)) break;
          
          if (skillLine) {
            // Parse skills from the line
            const lineSkills = skillLine
              .split(/[,;|•\-]/)
              .map(skill => skill.trim())
              .filter(skill => skill.length > 1 && skill.length < 30)
              .filter(skill => !skill.match(/^\d+[\+\-]/)); // Remove experience indicators
            
            skills = [...skills, ...lineSkills];
          }
        }
        break;
      }
    }
  }
  
  // Clean and deduplicate skills
  skills = skills
    .map(skill => skill.replace(/[:•\-]/g, '').trim())
    .filter(skill => skill.length > 1)
    .filter((skill, index, arr) => arr.indexOf(skill) === index);
  
  return skills.slice(0, 25); // Limit to top 25 skills
}

function extractSoftSkills(text: string): string[] {
  const softSkillsKeywords = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
    'creative', 'adaptable', 'organized', 'detail-oriented', 'collaborative',
    'mentoring', 'project management', 'agile', 'scrum'
  ];
  
  const foundSkills: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const skill of softSkillsKeywords) {
    if (lowerText.includes(skill)) {
      foundSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  }
  
  return foundSkills;
}

function extractProjects(text: string): Array<{
  name: string,
  description: string,
  tech_stack: string[],
  link: string | null
}> {
  const projects: Array<{
    name: string,
    description: string,
    tech_stack: string[],
    link: string | null
  }> = [];
  
  const lines = text.split('\n');
  let inProjectSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.toLowerCase().includes('project') && line.length < 20) {
      inProjectSection = true;
      continue;
    }
    
    if (inProjectSection) {
      if (isNewSection(line)) break;
      
      // Look for project patterns
      const projectPattern = /(.+?)\s*\|\s*(.+)/;
      const match = line.match(projectPattern);
      
      if (match && match[1]) {
        const name = match[1].trim();
        let description = '';
        let techStack: string[] = [];
        let link = null;
        
        // Look for description in following lines
        for (let j = i + 1; j < lines.length && j < i + 5; j++) {
          const descLine = lines[j].trim();
          if (isNewSection(descLine) || descLine.includes('|')) break;
          
          if (descLine.startsWith('•') || descLine.startsWith('-')) {
            description += descLine.replace(/^[•\-]\s*/, '').trim() + ' ';
          } else if (descLine.toLowerCase().includes('technologies:')) {
            techStack = descLine.replace(/technologies:/i, '').split(',').map(tech => tech.trim());
          } else if (descLine.includes('github.com') || descLine.includes('http')) {
            link = descLine;
          }
        }
        
        projects.push({
          name,
          description: description.trim() || match[2]?.trim() || '',
          tech_stack: techStack,
          link
        });
      }
    }
  }
  
  return projects;
}

function extractCertifications(text: string): Array<{
  name: string,
  authority: string | null,
  year: string | null
}> {
  const certifications: Array<{
    name: string,
    authority: string | null,
    year: string | null
  }> = [];
  
  const lines = text.split('\n');
  let inCertSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if ((line.toLowerCase().includes('certification') || line.toLowerCase().includes('certificate')) && line.length < 30) {
      inCertSection = true;
      continue;
    }
    
    if (inCertSection) {
      if (isNewSection(line)) break;
      
      const certPattern = /(.+?)\s*\|\s*(.+?)\s*\|\s*(\d{4})/;
      const match = line.match(certPattern);
      
      if (match && match[1]) {
        certifications.push({
          name: match[1].trim(),
          authority: match[2]?.trim() || null,
          year: match[3]?.trim() || null
        });
      }
    }
  }
  
  return certifications;
}

function extractAchievements(text: string): string[] {
  const achievements: string[] = [];
  const lines = text.split('\n');
  
  let inAchievementSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.toLowerCase().includes('achievement') && line.length < 30) {
      inAchievementSection = true;
      continue;
    }
    
    if (inAchievementSection) {
      if (isNewSection(line)) break;
      
      if (line.startsWith('•') || line.startsWith('-')) {
        achievements.push(line.replace(/^[•\-]\s*/, '').trim());
      }
    }
    
    // Also look for achievements in experience section
    if (line.includes('%') || line.includes('award') || line.includes('winner') || 
        line.includes('improved') || line.includes('increased') || line.includes('reduced')) {
      achievements.push(line.trim());
    }
  }
  
  return achievements.slice(0, 10);
}

function extractDatesFromString(text: string): {start: string | null, end: string | null} {
  const datePatterns = [
    /(\d{4})-(\d{4})/,
    /(\w+ \d{4}) - (\w+ \d{4})/,
    /(\d{1,2}\/\d{4}) - (\d{1,2}\/\d{4})/,
    /(\w+ \d{4}) - Present/i
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        start: formatDate(match[1]),
        end: match[2] && match[2].toLowerCase() !== 'present' ? formatDate(match[2]) : null
      };
    }
  }
  
  return {start: null, end: null};
}

function formatDate(dateStr: string): string | null {
  if (!dateStr) return null;
  
  // If already in YYYY format
  if (/^\d{4}$/.test(dateStr)) {
    return dateStr;
  }
  
  // If in MM/YYYY format
  const monthYearMatch = dateStr.match(/(\d{1,2})\/(\d{4})/);
  if (monthYearMatch) {
    return `${monthYearMatch[2]}-${monthYearMatch[1].padStart(2, '0')}`;
  }
  
  // If in "Month YYYY" format
  const monthNameMatch = dateStr.match(/(\w+)\s+(\d{4})/);
  if (monthNameMatch) {
    const months: {[key: string]: string} = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
      january: '01', february: '02', march: '03', april: '04',
      june: '06', july: '07', august: '08', september: '09',
      october: '10', november: '11', december: '12'
    };
    
    const monthName = monthNameMatch[1].toLowerCase();
    const month = months[monthName];
    if (month) {
      return `${monthNameMatch[2]}-${month}`;
    }
  }
  
  return null;
}

function isNewSection(line: string): boolean {
  const sectionKeywords = [
    'experience', 'education', 'skills', 'projects', 'certifications',
    'achievements', 'summary', 'objective', 'employment', 'work history',
    'technical skills', 'programming languages'
  ];
  
  const lowerLine = line.toLowerCase().trim();
  
  return sectionKeywords.some(keyword => 
    lowerLine.includes(keyword) && 
    lowerLine.length < 50 && 
    !lowerLine.includes('|') &&
    !lowerLine.startsWith('•') &&
    !lowerLine.startsWith('-')
  );
}

function calculateResumeRating(data: any): number {
  let score = 0;
  
  // Contact information (2 points)
  if (data.name) score += 0.5;
  if (data.email) score += 0.5;
  if (data.phone) score += 0.5;
  if (data.location) score += 0.5;
  
  // Professional summary (2 points)
  if (data.summary && data.summary.length > 100) score += 2;
  else if (data.summary && data.summary.length > 50) score += 1.5;
  else if (data.summary) score += 1;
  
  // Experience (3 points)
  if (data.experience?.length >= 3) score += 3;
  else if (data.experience?.length >= 2) score += 2;
  else if (data.experience?.length >= 1) score += 1;
  
  // Education (1 point)
  if (data.education?.length > 0) score += 1;
  
  // Skills (1.5 points)
  if (data.coreSkills?.length >= 10) score += 1.5;
  else if (data.coreSkills?.length >= 5) score += 1;
  else if (data.coreSkills?.length > 0) score += 0.5;
  
  // Projects (1 point)
  if (data.projects?.length >= 2) score += 1;
  else if (data.projects?.length >= 1) score += 0.5;
  
  // Certifications (1 point)
  if (data.certifications?.length >= 2) score += 1;
  else if (data.certifications?.length >= 1) score += 0.5;
  
  // Achievements (1 point)
  if (data.achievements?.length >= 3) score += 1;
  else if (data.achievements?.length >= 1) score += 0.5;
  
  return Math.min(Math.round(score), 10);
}

function getImprovementAreas(data: any): string[] {
  const improvements: string[] = [];
  
  if (!data.name) {
    improvements.push("Add a clear, professional name at the top of your resume");
  }
  
  if (!data.email) {
    improvements.push("Include a professional email address for contact");
  }
  
  if (!data.phone) {
    improvements.push("Add a phone number for direct contact");
  }
  
  if (!data.location) {
    improvements.push("Include your location (city, state) for geographic context");
  }
  
  if (!data.summary || data.summary.length < 100) {
    improvements.push("Add a compelling professional summary (100+ words) highlighting your key strengths, experience, and career objectives");
  }
  
  if (!data.experience || data.experience.length === 0) {
    improvements.push("Include detailed work experience with specific achievements and quantifiable results");
  } else if (data.experience.length < 2) {
    improvements.push("Add more work experience entries to demonstrate career progression and growth");
  }
  
  if (!data.coreSkills || data.coreSkills.length < 10) {
    improvements.push("Expand your technical skills section with relevant technologies, programming languages, and tools (aim for 10+ skills)");
  }
  
  if (!data.education || data.education.length === 0) {
    improvements.push("Include your educational background with degree, institution, and graduation dates");
  }
  
  if (!data.projects || data.projects.length < 2) {
    improvements.push("Add 2-3 relevant projects to demonstrate practical application of your skills and technologies");
  }
  
  if (!data.certifications || data.certifications.length === 0) {
    improvements.push("Consider adding professional certifications to strengthen your credentials and show continuous learning");
  }
  
  if (!data.achievements || data.achievements.length < 3) {
    improvements.push("Include more specific achievements with quantifiable metrics (e.g., 'Increased performance by 40%', 'Led team of 8 developers')");
  }
  
  // Check for quantified achievements
  const hasQuantifiedAchievements = data.experience?.some((exp: any) => 
    exp.achievements?.some((achievement: string) => 
      achievement.includes('%') || achievement.match(/\d+/)
    )
  );
  
  if (!hasQuantifiedAchievements) {
    improvements.push("Add more quantified achievements with specific metrics and numbers to demonstrate impact");
  }
  
  return improvements.slice(0, 8);
}

function getUpskillSuggestions(skills: string[], experience: any[], education: any[]): string[] {
  const suggestions: string[] = [];
  
  // Analyze current skills to suggest relevant upskilling
  const hasWebDev = skills.some(skill => 
    skill.toLowerCase().includes('javascript') || 
    skill.toLowerCase().includes('react') || 
    skill.toLowerCase().includes('html') || 
    skill.toLowerCase().includes('css') ||
    skill.toLowerCase().includes('vue') ||
    skill.toLowerCase().includes('angular')
  );
  
  const hasBackend = skills.some(skill => 
    skill.toLowerCase().includes('node') || 
    skill.toLowerCase().includes('python') || 
    skill.toLowerCase().includes('java') || 
    skill.toLowerCase().includes('api') ||
    skill.toLowerCase().includes('django') ||
    skill.toLowerCase().includes('flask') ||
    skill.toLowerCase().includes('spring')
  );
  
  const hasCloud = skills.some(skill => 
    skill.toLowerCase().includes('aws') || 
    skill.toLowerCase().includes('azure') || 
    skill.toLowerCase().includes('cloud') || 
    skill.toLowerCase().includes('docker') ||
    skill.toLowerCase().includes('kubernetes')
  );
  
  const hasDataSkills = skills.some(skill => 
    skill.toLowerCase().includes('sql') || 
    skill.toLowerCase().includes('python') || 
    skill.toLowerCase().includes('analytics') || 
    skill.toLowerCase().includes('data') ||
    skill.toLowerCase().includes('machine learning') ||
    skill.toLowerCase().includes('tensorflow')
  );
  
  const hasMobile = skills.some(skill => 
    skill.toLowerCase().includes('react native') || 
    skill.toLowerCase().includes('flutter') || 
    skill.toLowerCase().includes('ios') || 
    skill.toLowerCase().includes('android')
  );
  
  // Frontend development suggestions
  if (hasWebDev) {
    if (!skills.some(s => s.toLowerCase().includes('typescript'))) {
      suggestions.push("Master TypeScript for type-safe JavaScript development and better code maintainability");
    }
    if (!skills.some(s => s.toLowerCase().includes('next'))) {
      suggestions.push("Learn Next.js for server-side rendering, static site generation, and full-stack React applications");
    }
    if (!skills.some(s => s.toLowerCase().includes('tailwind'))) {
      suggestions.push("Adopt Tailwind CSS for utility-first styling and rapid UI development");
    }
  }
  
  // Backend development suggestions
  if (hasBackend) {
    if (!skills.some(s => s.toLowerCase().includes('microservices'))) {
      suggestions.push("Study microservices architecture patterns and containerization with Docker and Kubernetes");
    }
    if (!skills.some(s => s.toLowerCase().includes('graphql'))) {
      suggestions.push("Learn GraphQL for efficient API design, data fetching, and better client-server communication");
    }
    if (!skills.some(s => s.toLowerCase().includes('redis'))) {
      suggestions.push("Master Redis for caching, session management, and real-time applications");
    }
  }
  
  // Cloud and DevOps suggestions
  if (!hasCloud) {
    suggestions.push("Obtain AWS Solutions Architect or Azure Fundamentals certification for cloud infrastructure expertise");
    suggestions.push("Learn Docker and Kubernetes for containerization and orchestration of modern applications");
  } else {
    if (!skills.some(s => s.toLowerCase().includes('terraform'))) {
      suggestions.push("Learn Terraform for Infrastructure as Code (IaC) and automated cloud resource management");
    }
  }
  
  // Data science and AI suggestions
  if (hasDataSkills) {
    suggestions.push("Advance your machine learning skills with PyTorch or TensorFlow for deep learning applications");
    suggestions.push("Learn Apache Spark for big data processing and distributed computing");
    if (!skills.some(s => s.toLowerCase().includes('tableau') || s.toLowerCase().includes('power bi'))) {
      suggestions.push("Master data visualization tools like Tableau, Power BI, or D3.js for business intelligence");
    }
  } else {
    suggestions.push("Explore Python for data science with pandas, NumPy, and scikit-learn for analytics and machine learning");
  }
  
  // Mobile development suggestions
  if (!hasMobile && hasWebDev) {
    suggestions.push("Expand to mobile development with React Native or Flutter for cross-platform applications");
  }
  
  // Emerging technologies
  if (!skills.some(s => s.toLowerCase().includes('ai') || s.toLowerCase().includes('machine learning'))) {
    suggestions.push("Learn AI/ML fundamentals and prompt engineering for ChatGPT, Claude, and other LLMs");
  }
  
  // Security suggestions
  if (!skills.some(s => s.toLowerCase().includes('security'))) {
    suggestions.push("Study cybersecurity fundamentals and secure coding practices for application security");
  }
  
  // Leadership and soft skills based on experience level
  const seniorLevel = experience.some((exp: any) => 
    exp.title?.toLowerCase().includes('senior') || 
    exp.title?.toLowerCase().includes('lead') ||
    exp.title?.toLowerCase().includes('principal')
  );
  
  if (seniorLevel) {
    suggestions.push("Develop system design and architecture skills for scalable, high-performance applications");
    suggestions.push("Enhance technical leadership skills through courses on engineering management and team building");
  } else {
    suggestions.push("Build leadership experience through mentoring junior developers and leading small projects");
  }
  
  return suggestions.slice(0, 8);
}