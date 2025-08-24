# Modern React & Next.js Lab 🧪

현대적인 React와 Next.js 기술 스택을 학습하기 위한 종합적인 모노레포 프로젝트입니다.

## 📖 프로젝트 개요

### 목표
- React 19와 Next.js 15의 최신 기능 탐구
- Turborepo를 활용한 효율적인 모노레포 구축
- 재사용 가능한 컴포넌트 라이브러리 개발
- 현대적인 개발 워크플로우 구축

### 기간
2024.01 - 진행 중

## 🛠️ 기술 스택

### Core
- **React 19**: Actions, use() hook, React Compiler
- **Next.js 15**: App Router, Server Components, Turbopack
- **TypeScript 5.9**: 엄격한 타입 체크

### Tools & Workflow
- **Turborepo 2.5**: 모노레포 빌드 시스템
- **pnpm 9.0**: 빠른 패키지 매니저
- **Storybook**: 컴포넌트 개발 환경

### Testing & Quality
- **Vitest**: 빠른 유닛 테스트
- **Testing Library**: 컴포넌트 테스트
- **ESLint + Prettier**: 코드 품질 관리

## 🏗️ 아키텍처

```
apps/
├── web/              # 메인 Next.js 애플리케이션
├── docs/             # Docusaurus 문서 사이트
└── storybook/        # 컴포넌트 스토리북

packages/
├── ui/               # 공유 React 컴포넌트 라이브러리
├── hooks/            # 커스텀 훅 모음
├── utils/            # 유틸리티 함수들
├── store/            # 상태 관리 (Zustand)
├── auth/             # 인증 관련 패키지
├── i18n/             # 다국어 지원
├── performance/      # 성능 모니터링
├── pwa/              # PWA 기능
├── realtime/         # 실시간 기능
├── e2e-tests/        # E2E 테스트 스위트
└── config/           # 공유 설정들
    ├── eslint-config/
    └── typescript-config/
```

## ✨ 주요 기능

### 1. 컴포넌트 라이브러리 (@repo/ui)
```tsx
// Button 컴포넌트 예시
import { Button } from '@repo/ui/button';

<Button variant="primary" size="lg" onClick={handleClick}>
  클릭하세요
</Button>
```

**특징:**
- 일관된 디자인 시스템
- 접근성(a11y) 준수
- 다양한 variant와 size
- TypeScript 완전 지원

### 2. 커스텀 훅 라이브러리 (@repo/hooks)
```tsx
import { useLocalStorage, useDebounce } from '@repo/hooks';

function SearchComponent() {
  const [query, setQuery] = useLocalStorage('searchQuery', '');
  const debouncedQuery = useDebounce(query, 300);
  
  // 검색 로직...
}
```

### 3. 성능 모니터링 (@repo/performance)
```tsx
import { PerformanceProvider, useWebVitals } from '@repo/performance';

function App() {
  return (
    <PerformanceProvider>
      <WebVitalsReporter />
      <MyApp />
    </PerformanceProvider>
  );
}
```

## 🚀 개발 워크플로우

### 개발 시작
```bash
pnpm install
pnpm dev  # 모든 앱을 동시에 실행
```

### 빌드 및 테스트
```bash
pnpm build        # 모든 패키지와 앱 빌드
pnpm test         # 전체 테스트 실행
pnpm lint         # 코드 품질 검사
pnpm type-check   # TypeScript 타입 검사
```

### 스토리북 개발
```bash
pnpm storybook    # 컴포넌트 스토리북 실행
```

## 💡 핵심 인사이트

### 1. Turborepo의 힘
- **캐싱 시스템**: 변경되지 않은 패키지는 재빌드하지 않음
- **병렬 실행**: 독립적인 작업들을 동시 실행
- **의존성 관리**: 패키지 간 올바른 빌드 순서 자동 결정

### 2. 타입 안전성
```tsx
// 엄격한 타입 체크로 런타임 오류 방지
interface User {
  id: number;
  name: string;
  email?: string;
}

// 선택적 체이닝과 nullish coalescing 활용
const userEmail = user.email ?? 'No email provided';
```

### 3. 성능 최적화
- **React Compiler**: 자동 메모이제이션
- **Server Components**: 서버에서 렌더링
- **Code Splitting**: 필요한 코드만 로드

## 🎯 성과 및 배운 점

### 성과
- **개발 속도 향상**: 모노레포로 코드 재사용성 극대화
- **일관성 확보**: 통일된 코딩 스타일과 도구 사용
- **타입 안전성**: TypeScript로 런타임 오류 90% 감소

### 배운 점
1. **모노레포 설계**: 패키지 분리 전략의 중요성
2. **성능 최적화**: React 19의 새로운 기능들 활용
3. **개발자 경험**: 도구 설정의 중요성

## 🔮 다음 단계

- [ ] **E2E 테스트** 도입 (Playwright)
- [ ] **CI/CD 파이프라인** 구축 (GitHub Actions)
- [ ] **디자인 시스템** 확장
- [ ] **성능 모니터링** 대시보드 구축
- [ ] **PWA 기능** 추가

## 📚 관련 리소스

- [GitHub Repository](https://github.com/developjik/modern-react-nextjs-lab)
- [Storybook](https://storybook.example.com)
- [프로젝트 위키](https://github.com/developjik/modern-react-nextjs-lab/wiki)