# Turborepo 모노레포 완벽 구축 가이드 🚀

실무에서 사용할 수 있는 Turborepo 모노레포를 처음부터 끝까지 구축하는 완전한 가이드입니다. 이 튜토리얼을 따라하면 확장 가능한 현대적인 모노레포를 만들 수 있습니다.

## 🎯 학습 목표

- [ ] Turborepo의 핵심 개념 이해
- [ ] 모노레포 프로젝트 구조 설계
- [ ] 공유 패키지와 앱 구성
- [ ] 빌드 파이프라인 최적화
- [ ] 개발 워크플로우 구축

## 📋 사전 요구사항

- Node.js 18+ 설치
- pnpm 8+ 설치 (권장)
- Git 기본 지식
- React/Next.js 기본 지식

## 🏗️ 1단계: 프로젝트 초기 설정

### 1.1 프로젝트 생성

```bash
# 새 디렉토리 생성
mkdir my-turborepo-project
cd my-turborepo-project

# Git 초기화
git init

# pnpm workspace 초기화
npm init -y
```

### 1.2 기본 파일 구조 생성

```bash
# 디렉토리 구조 생성
mkdir -p apps/web
mkdir -p apps/docs  
mkdir -p packages/ui
mkdir -p packages/config/eslint-config
mkdir -p packages/config/typescript-config
mkdir -p packages/utils
```

### 1.3 루트 package.json 설정

```json
{
  "name": "my-turborepo-project",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "@turbo/gen": "^1.13.0",
    "eslint": "^8.57.0",
    "prettier": "^3.2.5",
    "turbo": "^1.13.0",
    "typescript": "^5.3.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

### 1.4 pnpm 워크스페이스 설정

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
  - "packages/config/*"
```

### 1.5 Turbo 설정

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

## 🏢 2단계: TypeScript 설정 패키지

### 2.1 Base TypeScript 설정

```json
// packages/config/typescript-config/base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", ".next"]
}
```

### 2.2 Next.js TypeScript 설정

```json
// packages/config/typescript-config/nextjs.json
{
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "src/**/*",
    "next-env.d.ts",
    ".next/types/**/*.ts"
  ]
}
```

### 2.3 React TypeScript 설정

```json
// packages/config/typescript-config/react-library.json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "declaration": true,
    "outDir": "dist"
  }
}
```

### 2.4 TypeScript 패키지 설정

```json
// packages/config/typescript-config/package.json
{
  "name": "@repo/typescript-config",
  "version": "0.0.0",
  "private": true,
  "files": [
    "base.json",
    "nextjs.json", 
    "react-library.json"
  ]
}
```

## 🎨 3단계: ESLint 설정 패키지

### 3.1 Base ESLint 설정

```javascript
// packages/config/eslint-config/base.js
const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
  },
};
```

### 3.2 Next.js ESLint 설정

```javascript
// packages/config/eslint-config/next.js
const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: [
    "./base.js",
    "next/core-web-vitals",
  ],
  parserOptions: {
    project,
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
};
```

### 3.3 React Library ESLint 설정

```javascript
// packages/config/eslint-config/react-internal.js
const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: [
    "./base.js",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["react", "react-hooks"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
  parserOptions: {
    project,
  },
};
```

### 3.4 ESLint 패키지 설정

```json
// packages/config/eslint-config/package.json
{
  "name": "@repo/eslint-config",
  "version": "0.0.0",
  "private": true,
  "main": "./base.js",
  "files": [
    "base.js",
    "next.js",
    "react-internal.js"
  ],
  "dependencies": {
    "@next/eslint-plugin-next": "^14.1.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0"
  }
}
```

## 🧩 4단계: UI 컴포넌트 라이브러리

### 4.1 UI 패키지 구조 설정

```json
// packages/ui/package.json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./button": "./src/button.tsx",
    "./card": "./src/card.tsx",
    "./input": "./src/input.tsx"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint . --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@types/react": "^18.2.61",
    "@types/react-dom": "^18.2.19",
    "eslint": "^8.57.0",
    "react": "^18.2.0",
    "typescript": "^5.3.3"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  }
}
```

### 4.2 TypeScript 설정

```json
// packages/ui/tsconfig.json
{
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4.3 ESLint 설정

```javascript
// packages/ui/.eslintrc.js
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/react-internal"],
};
```

### 4.4 Button 컴포넌트 예시

```typescript
// packages/ui/src/button.tsx
import React from 'react';

export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg 
          className="mr-2 h-4 w-4 animate-spin" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4" 
            fill="none"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
```

### 4.5 Card 컴포넌트 예시

```typescript
// packages/ui/src/card.tsx
import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  shadow = 'md',
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };
  
  const classes = `bg-white rounded-lg border ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
```

## 🚀 5단계: Next.js 앱 설정

### 5.1 Web 앱 생성

```json
// apps/web/package.json  
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "next build",
    "dev": "next dev --turbo",
    "lint": "eslint . --max-warnings 0",
    "start": "next start",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/utils": "workspace:*",
    "next": "^15.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@next/types": "^15.0.0",
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@types/node": "^20.11.24",
    "@types/react": "^18.2.61",
    "@types/react-dom": "^18.2.19",
    "eslint": "^8.57.0",
    "typescript": "^5.3.3"
  }
}
```

### 5.2 Next.js 설정

```javascript
// apps/web/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui", "@repo/utils"],
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
};

module.exports = nextConfig;
```

### 5.3 TypeScript 설정

```json
// apps/web/tsconfig.json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/ui/*": ["../../packages/ui/src/*"],
      "@/utils/*": ["../../packages/utils/src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ]
}
```

### 5.4 메인 페이지 예시

```typescript
// apps/web/src/app/page.tsx
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            🚀 Turborepo 모노레포
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            현대적인 모노레포 개발 환경입니다.
          </p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <h3 className="text-lg font-medium text-gray-900">
              ⚡ 빠른 빌드
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Turbo의 캐싱과 병렬 처리로 빠른 빌드를 경험하세요.
            </p>
            <div className="mt-4">
              <Button variant="primary">자세히 보기</Button>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-medium text-gray-900">
              🧩 모듈화
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              재사용 가능한 패키지로 코드를 효율적으로 관리합니다.
            </p>
            <div className="mt-4">
              <Button variant="secondary">패키지 보기</Button>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-medium text-gray-900">
              🎯 타입 안전성
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              TypeScript로 전체 모노레포의 타입 안전성을 보장합니다.
            </p>
            <div className="mt-4">
              <Button variant="danger">시작하기</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

## 📚 6단계: Utils 패키지

### 6.1 Utils 패키지 설정

```json
// packages/utils/package.json
{
  "name": "@repo/utils",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./format": "./src/format.ts",
    "./validation": "./src/validation.ts"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint . --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "eslint": "^8.57.0",
    "typescript": "^5.3.3"
  }
}
```

### 6.2 유틸리티 함수 예시

```typescript
// packages/utils/src/format.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ko-KR').format(date);
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
```

```typescript
// packages/utils/src/validation.ts
export const isEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^010-?([0-9]{4})-?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};
```

```typescript
// packages/utils/src/index.ts
export * from './format';
export * from './validation';
```

## 🔧 7단계: 개발 스크립트 및 도구

### 7.1 Git 설정

```gitignore
# .gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
.next/
.turbo/

# Environment variables
.env
.env.local
.env.production.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
pnpm-debug.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock
```

### 7.2 Prettier 설정

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### 7.3 VS Code 설정

```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.workingDirectories": [
    "apps/web",
    "packages/ui",
    "packages/utils"
  ]
}
```

### 7.4 개발 스크립트 추가

```json
// package.json (루트)
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,md,json}\"",
    "clean": "turbo run clean && rm -rf node_modules .turbo",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build --filter=web && changeset publish"
  }
}
```

## 🚀 8단계: 실행 및 테스트

### 8.1 종속성 설치

```bash
# 모든 패키지 설치
pnpm install
```

### 8.2 개발 서버 실행

```bash
# 모든 앱을 개발 모드로 실행
pnpm dev

# 특정 앱만 실행
pnpm --filter web dev
```

### 8.3 빌드 테스트

```bash
# 모든 패키지와 앱 빌드
pnpm build

# 특정 앱만 빌드  
pnpm --filter web build
```

### 8.4 린트 및 타입 체크

```bash
# 전체 프로젝트 린트
pnpm lint

# 타입 체크
pnpm type-check
```

## 🎯 9단계: 추가 최적화

### 9.1 Remote 캐싱 설정

```bash
# Turbo 계정 연결
npx turbo login

# Remote 캐싱 설정
npx turbo link
```

### 9.2 CI/CD 파이프라인 예시

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: 9.0.0

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Build
        run: pnpm build
```

## ✅ 완성 체크리스트

- [ ] 프로젝트 구조 생성
- [ ] TypeScript 설정 패키지 구성
- [ ] ESLint 설정 패키지 구성  
- [ ] UI 컴포넌트 라이브러리 생성
- [ ] Utils 패키지 생성
- [ ] Next.js 앱 설정
- [ ] 빌드 파이프라인 구성
- [ ] 개발 도구 설정
- [ ] Git 및 CI/CD 설정

## 🎉 다음 단계

### 확장 가능한 기능들

1. **테스트 설정**
   - Jest 또는 Vitest 설정
   - 각 패키지별 테스트 스위트

2. **Storybook 통합**
   - UI 컴포넌트 문서화
   - 디자인 시스템 구축

3. **버전 관리**
   - Changesets로 패키지 버전 관리
   - 자동화된 릴리스 파이프라인

4. **성능 모니터링**
   - Bundle analyzer 통합
   - 성능 메트릭 추적

이제 확장 가능한 현대적인 Turborepo 모노레포가 완성되었습니다! 🚀

프로젝트 요구사항에 맞게 패키지를 추가하고 설정을 조정하여 사용하세요.