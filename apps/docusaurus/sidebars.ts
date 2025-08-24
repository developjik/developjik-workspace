import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main documentation sidebar - Personal Portfolio Structure
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '📖 학습 & 연구',
      collapsed: false,
      items: [
      
        'study/react-19-advanced-guide',
        'study/nextjs-15-performance-optimization',
        'study/typescript-advanced-patterns',
        'study/react-suspense-advanced-guide' 
      ],
    },
    {
      type: 'category',
      label: '🏗️ 실무 적용기',
      collapsed: false,
      items: [
        'production-stories/performance-improvement-case',
      ],
    },
    {
      type: 'category',
      label: '🚀 개인 프로젝트 & 실험',
      items: [
        'personal-projects/modern-react-lab',
      ],
    },
    {
      type: 'category',
      label: '💡 트러블슈팅 기록',
      items: [
        'troubleshooting/memory-leak-debugging',
      ],
    },
    {
      type: 'category',
      label: '📋 개인 레퍼런스',
      collapsed: true,
      items: [
        'reference/react-cheatsheet',
        'reference/typescript-cheatsheet',
        'reference/suspense-cheatsheet',
        {
          type: 'category',
          label: '코드 스니펫',
          items: [
            'reference/custom-hooks-collection',
            'reference/utility-functions',
          ],
        },
      ],
    },
  ],
};

export default sidebars;