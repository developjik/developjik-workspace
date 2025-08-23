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
  // Main documentation sidebar
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '📖 학습 노트',
      items: [
        'learning/react-19-deep-dive',
        'learning/typescript-advanced-patterns',
        'learning/nextjs-15-performance-optimization',
      ],
    },
    {
      type: 'category',
      label: '🚀 프로젝트',
      items: [
        'projects/modern-react-lab',
      ],
    },
    {
      type: 'category',
      label: '📋 코드 스니펫',
      items: [
        'snippets/custom-hooks-collection',
        'snippets/utility-functions',
      ],
    },
    {
      type: 'category',
      label: '📝 튜토리얼',
      items: [
        'tutorials/turborepo-setup-guide',
      ],
    },
  ],
};

export default sidebars;
