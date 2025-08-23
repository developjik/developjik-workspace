export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  techStack: string[];
  status: 'completed' | 'in-progress' | 'planned';
  startDate: string;
  endDate?: string;
  githubUrl?: string;
  demoUrl?: string;
  documentUrl?: string;
  highlights: string[];
}

export const projects: Project[] = [
  {
    id: 'modern-react-lab',
    title: 'Modern React & Next.js Lab',
    description: '최신 React와 Next.js 기술 스택을 활용한 모노레포 학습 프로젝트',
    longDescription: 'React 19와 Next.js 15의 최신 기능들을 탐구하고, Turborepo를 활용한 효율적인 모노레포를 구축하는 종합적인 학습 프로젝트입니다. 재사용 가능한 컴포넌트 라이브러리부터 성능 모니터링까지 현대적인 프론트엔드 개발의 모든 영역을 다룹니다.',
    image: '/img/projects/modern-react-lab.png',
    tags: ['학습', '모노레포', '오픈소스'],
    techStack: ['React 19', 'Next.js 15', 'TypeScript', 'Turborepo', 'Storybook'],
    status: 'in-progress',
    startDate: '2024-01',
    githubUrl: 'https://github.com/developjik/modern-react-nextjs-lab',
    demoUrl: 'https://modern-react-lab.vercel.app',
    documentUrl: '/docs/projects/modern-react-lab',
    highlights: [
      'React 19의 Actions와 use() hook 실전 적용',
      'Turborepo를 활용한 효율적인 모노레포 구축',
      '재사용 가능한 컴포넌트 라이브러리 개발',
      '성능 모니터링 시스템 구축'
    ]
  },
  {
    id: 'component-library',
    title: 'React Component Library',
    description: '재사용 가능하고 접근성을 고려한 React 컴포넌트 라이브러리',
    longDescription: '일관된 디자인 시스템을 기반으로 한 React 컴포넌트 라이브러리입니다. 접근성(a11y)을 중시하며, TypeScript로 완전한 타입 안전성을 제공합니다. Storybook을 통해 컴포넌트를 문서화하고 테스트합니다.',
    image: '/img/projects/component-library.png',
    tags: ['라이브러리', 'UI/UX', '오픈소스'],
    techStack: ['React', 'TypeScript', 'Storybook', 'CSS Modules', 'Vitest'],
    status: 'completed',
    startDate: '2023-11',
    endDate: '2024-01',
    githubUrl: 'https://github.com/developjik/react-component-library',
    demoUrl: 'https://components.developjik.dev',
    highlights: [
      '30+ 재사용 가능한 컴포넌트 제작',
      'WCAG 2.1 AA 접근성 기준 준수',
      '100% TypeScript 타입 커버리지',
      'Storybook을 활용한 컴포넌트 문서화'
    ]
  },
  {
    id: 'task-management-app',
    title: 'Smart Task Manager',
    description: '팀 협업을 위한 스마트 태스크 관리 애플리케이션',
    longDescription: '현대적인 프로젝트 관리 도구로, 직관적인 UI와 실시간 협업 기능을 제공합니다. 드래그 앤 드롭, 실시간 알림, 고급 필터링 등의 기능으로 팀의 생산성을 향상시킵니다.',
    image: '/img/projects/task-manager.png',
    tags: ['웹앱', '협업도구', '생산성'],
    techStack: ['Next.js', 'React', 'Prisma', 'PostgreSQL', 'Socket.io', 'Tailwind CSS'],
    status: 'completed',
    startDate: '2023-08',
    endDate: '2023-12',
    githubUrl: 'https://github.com/developjik/smart-task-manager',
    demoUrl: 'https://tasks.developjik.dev',
    highlights: [
      '실시간 협업 기능 구현',
      '드래그 앤 드롭 태스크 관리',
      '고급 필터링 및 검색 기능',
      '모바일 반응형 디자인'
    ]
  },
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    description: '풀스택 이커머스 플랫폼 (기획 중)',
    longDescription: 'Next.js 14와 최신 기술 스택을 활용한 현대적인 이커머스 플랫폼입니다. 마이크로서비스 아키텍처와 결제 시스템 통합, 실시간 재고 관리 등의 기능을 포함합니다.',
    image: '/img/projects/ecommerce-platform.png',
    tags: ['이커머스', '풀스택', '마이크로서비스'],
    techStack: ['Next.js 14', 'Node.js', 'GraphQL', 'Redis', 'Docker', 'AWS'],
    status: 'planned',
    startDate: '2024-03',
    highlights: [
      '마이크로서비스 아키텍처 설계',
      '실시간 재고 관리 시스템',
      '다중 결제 게이트웨이 통합',
      '고성능 검색 엔진 구현'
    ]
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getProjectsByStatus = (status: Project['status']): Project[] => {
  return projects.filter(project => project.status === status);
};

export const getProjectsByTag = (tag: string): Project[] => {
  return projects.filter(project => project.tags.includes(tag));
};