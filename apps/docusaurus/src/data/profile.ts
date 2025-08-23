export interface Skill {
  name: string;
  level: number; // 1-10
  category: 'frontend' | 'backend' | 'devops' | 'design' | 'tools';
  experience: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
  achievements: string[];
  techStack: string[];
  type: 'work' | 'education' | 'project';
}

export interface Interest {
  title: string;
  description: string;
  icon: string;
}

export const personalInfo = {
  name: 'DevelopJik',
  title: 'Frontend Developer',
  location: '대한민국',
  email: 'contact@example.com',
  github: 'https://github.com/developjik',
  avatar: 'https://github.com/developjik.png',
  bio: '현대적인 웹 기술을 사랑하는 프론트엔드 개발자입니다. React, Next.js, TypeScript를 주력으로 사용하며, 사용자 경험을 중시하는 애플리케이션을 만드는 것에 열정을 가지고 있습니다.',
  tagline: '사용자 중심의 현대적인 웹 애플리케이션을 만드는 개발자',
  yearsOfExperience: 3
};

export const skills: Skill[] = [
  // Frontend
  {
    name: 'React',
    level: 9,
    category: 'frontend',
    experience: '3년',
    description: 'Hooks, Context API, Custom Hooks, Performance Optimization'
  },
  {
    name: 'Next.js',
    level: 8,
    category: 'frontend',
    experience: '2년',
    description: 'App Router, Server Components, API Routes, SSR/SSG'
  },
  {
    name: 'TypeScript',
    level: 8,
    category: 'frontend',
    experience: '2년',
    description: 'Advanced Types, Generic, Interface Design, Type Guards'
  },
  {
    name: 'JavaScript (ES6+)',
    level: 9,
    category: 'frontend',
    experience: '4년',
    description: 'Modern JavaScript, Async/Await, Modules, DOM API'
  },
  {
    name: 'HTML/CSS',
    level: 8,
    category: 'frontend',
    experience: '4년',
    description: 'Semantic HTML, CSS Grid/Flexbox, Responsive Design'
  },
  {
    name: 'Tailwind CSS',
    level: 7,
    category: 'frontend',
    experience: '1년',
    description: 'Utility-first CSS, Custom Components, Responsive Design'
  },
  
  // Backend
  {
    name: 'Node.js',
    level: 6,
    category: 'backend',
    experience: '1년',
    description: 'Express.js, RESTful API, Authentication'
  },
  {
    name: 'Prisma',
    level: 6,
    category: 'backend',
    experience: '1년',
    description: 'Database ORM, Schema Design, Migration'
  },
  
  // DevOps & Tools
  {
    name: 'Git',
    level: 8,
    category: 'devops',
    experience: '3년',
    description: 'Branch Strategy, Code Review, Git Flow'
  },
  {
    name: 'Docker',
    level: 5,
    category: 'devops',
    experience: '6개월',
    description: 'Container, Docker Compose, Basic Deployment'
  },
  {
    name: 'Vercel',
    level: 7,
    category: 'devops',
    experience: '2년',
    description: 'Serverless Functions, Edge Functions, Deployment'
  },
  
  // Tools
  {
    name: 'Storybook',
    level: 7,
    category: 'tools',
    experience: '1년',
    description: 'Component Documentation, Visual Testing, Design System'
  },
  {
    name: 'Figma',
    level: 6,
    category: 'design',
    experience: '2년',
    description: 'UI Design, Prototyping, Design System'
  },
  {
    name: 'Turborepo',
    level: 7,
    category: 'tools',
    experience: '1년',
    description: 'Monorepo Management, Build Optimization, Caching'
  }
];

export const experiences: Experience[] = [
  {
    id: 'study-2024',
    company: '개인 학습',
    position: '프론트엔드 개발 학습',
    period: '2024.01 - 현재',
    description: 'React 19와 Next.js 15 등 최신 프론트엔드 기술 스택을 심도있게 학습하고 있습니다.',
    achievements: [
      'React 19의 Actions와 use() hook 마스터',
      'Turborepo를 활용한 모노레포 구축 경험',
      '재사용 가능한 컴포넌트 라이브러리 개발',
      'TypeScript 고급 패턴 학습 및 적용'
    ],
    techStack: ['React 19', 'Next.js 15', 'TypeScript', 'Turborepo', 'Storybook'],
    type: 'education'
  },
  {
    id: 'freelance-2023',
    company: '프리랜서',
    position: '프론트엔드 개발자',
    period: '2023.06 - 2023.12',
    description: '다양한 웹 프로젝트를 통해 실무 경험을 쌓았습니다.',
    achievements: [
      '5개 이상의 웹사이트 개발 완료',
      'React와 Next.js를 활용한 SPA 구축',
      '반응형 디자인 구현 및 모바일 최적화',
      '클라이언트 요구사항에 맞춘 맞춤형 솔루션 제공'
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    type: 'work'
  },
  {
    id: 'bootcamp-2023',
    company: '코딩 부트캠프',
    position: '프론트엔드 과정',
    period: '2023.01 - 2023.05',
    description: '체계적인 프론트엔드 개발 교육을 받았습니다.',
    achievements: [
      'JavaScript 기초부터 고급까지 완주',
      'React 기반 5개 이상의 프로젝트 완성',
      '팀 프로젝트를 통한 협업 경험',
      '우수 수료생 선정 (상위 10%)'
    ],
    techStack: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    type: 'education'
  }
];

export const interests: Interest[] = [
  {
    title: '🚀 최신 기술 탐구',
    description: 'React, Next.js 등의 최신 기능과 트렌드를 빠르게 학습하고 적용합니다.'
  },
  {
    title: '🎨 사용자 경험',
    description: '직관적이고 아름다운 사용자 인터페이스 설계에 관심이 많습니다.'
  },
  {
    title: '⚡ 성능 최적화',
    description: '빠르고 효율적인 웹 애플리케이션을 만드는 것에 열정을 가지고 있습니다.'
  },
  {
    title: '📝 지식 공유',
    description: '배운 것을 문서화하고 다른 개발자들과 공유하는 것을 좋아합니다.'
  },
  {
    title: '🛠️ 개발 도구',
    description: '개발 생산성을 향상시키는 도구와 워크플로우를 연구합니다.'
  },
  {
    title: '🌱 지속적 학습',
    description: '새로운 기술과 개념을 지속적으로 학습하고 성장하려 노력합니다.'
  }
];

export const getSkillsByCategory = (category: Skill['category']) => {
  return skills.filter(skill => skill.category === category);
};

export const getExperiencesByType = (type: Experience['type']) => {
  return experiences.filter(exp => exp.type === type);
};