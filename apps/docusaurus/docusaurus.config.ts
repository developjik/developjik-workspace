import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Developjik Frontend 연구실',
  tagline: 'Modren React and Next.js Lab with practical examples',
  favicon: 'img/favicon.ico', 

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
    experimental_faster: true, // Enable Docusaurus Faster for improved build performance
  },

  // Enable Mermaid diagrams
  markdown: {
    mermaid: true,
  },

  // Set the production url of your site here
  url: 'https://developjik-workspace-docusaurus-developjiks-projects.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'developjik', // Usually your GitHub org/user name.
  projectName: 'developjik-workspace', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn', 

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko','en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  // Enable Mermaid diagrams
  markdown: {
    mermaid: true,
  },

  plugins: [],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Developjik Frontend 연구실',
      logo: {
        alt: 'Developjik Frontend 연구실 Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '📚 문서',
        },
        {to: '/blog', label: '✍️ 블로그', position: 'left'},
        {to: '/portfolio', label: '🚀 포트폴리오', position: 'left'},
        {to: '/about', label: '👋 소개', position: 'left'},
        {
          href: 'https://github.com/developjik/modern-react-nextjs-lab',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '콘텐츠',
          items: [
            {
              label: '문서',
              to: '/docs/intro',
            },
            {
              label: '블로그',
              to: '/blog',
            },
            {
              label: '포트폴리오',
              to: '/portfolio',
            },
            {
              label: '소개',
              to: '/about',
            },
          ],
        },
        {
          title: '소셜',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/developjik',
            },
            {
              label: 'Email',
              href: 'mailto:contact@example.com',
            },
          ],
        },
        {
          title: '학습 자료',
          items: [
            {
              label: 'React 19 문서',
              href: 'https://react.dev',
            },
            {
              label: 'Next.js 문서',
              href: 'https://nextjs.org/docs',
            },
            {
              label: 'TypeScript 문서',
              href: 'https://www.typescriptlang.org/docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} DevelopJik. Built with Docusaurus ❤️`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
