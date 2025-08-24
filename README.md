# Modern React Lab - 학습 및 개발 허브

React 19, TypeScript, 고급 패턴에 중점을 둔 풍부한 Docusaurus 문서 사이트, 공유 컴포넌트 라이브러리, 광범위한 학습 자료를 특징으로 하는 현대적인 React 학습 및 개발을 위해 설계된 포괄적인 **Turborepo 모노레포**입니다.

## 🚀 빠른 시작

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작 (Docusaurus 포트 3002)
pnpm dev

# 모든 패키지 빌드
pnpm build
```

## 📦 구성 요소

이 Turborepo는 다음 패키지/앱을 포함합니다:

### 앱과 패키지

- **`docusaurus`**: 광범위한 React 문서, 튜토리얼, 실습 프로젝트, 다국어 지원을 갖춘 풍부한 기능의 [Docusaurus](https://docusaurus.io/) 학습 허브
- **`@repo/ui`**: TypeScript, Vitest 테스팅, 현대적 패턴을 갖춘 포괄적인 React 19 컴포넌트 라이브러리
- **`@repo/eslint-config`**: 현대적인 React와 TypeScript 개발에 최적화된 공유 ESLint 구성
- **`@repo/typescript-config`**: 모노레포 전반에 걸친 엄격한 설정을 가진 중앙화된 TypeScript 구성

모든 패키지는 React 19, TypeScript 5.9.2를 사용하며 현대적인 개발 관행을 따릅니다.

## 🛠 개발 도구

이 모노레포는 사전 구성된 현대적인 개발 도구를 제공합니다:

- **[TypeScript](https://www.typescriptlang.org/) 5.9.2** - 고급 패턴을 위한 엄격한 타입 검사
- **[ESLint](https://eslint.org/) 9.x** - 제로 경고 정책을 가진 현대적인 린팅
- **[Prettier](https://prettier.io) 3.6.2** - 일관된 코드 포맷팅
- **[Vitest](https://vitest.dev/)** - 초고속 단위 테스트 프레임워크
- **[React Testing Library](https://testing-library.com/react)** - 컴포넌트 테스팅 베스트 프랙티스
- **[Turborepo](https://turborepo.com/) 2.5.6** - 고성능 모노레포 빌드 시스템
- **[React](https://react.dev/) 19.x** - 동시성 기능을 갖춘 최신 React
- **[Docusaurus](https://docusaurus.io/) 3.8.1** - 현대적인 문서화 플랫폼

## 🏗 개발 명령어

### 루트 레벨 명령어

```bash
# 개발
pnpm dev                # Docusaurus 개발 서버 시작 (포트 3002)

# 빌드
pnpm build             # 모든 패키지와 앱 빌드
pnpm check-types       # 전체 모노레포에서 타입 검사

# 코드 품질
pnpm lint              # 모든 패키지를 제로 경고로 린트
pnpm format            # Prettier로 코드 포맷팅

# 테스팅
pnpm test              # UI 컴포넌트 단위 테스트 실행
```

### 패키지별 명령어

```bash
# 특정 패키지 빌드
turbo build --filter=docusaurus
turbo build --filter=@repo/ui

# 특정 패키지 개발
turbo dev --filter=docusaurus

# 특정 패키지 테스트
turbo test --filter=@repo/ui

# 새 UI 컴포넌트 생성
pnpm --filter=@repo/ui generate:component
```

### Docusaurus 전용

```bash
cd apps/docusaurus

pnpm dev          # 개발 서버 시작
pnpm build        # 프로덕션용 빌드
pnpm serve        # 로컬에서 빌드된 사이트 서빙
pnpm clear        # Docusaurus 캐시 지우기
pnpm swizzle      # Docusaurus 컴포넌트 커스터마이징
```

## 🏛 아키텍처

```
├── apps/
│   └── docusaurus/           # 학습 허브 및 문서 (포트 3002)
│       ├── docs/            # 광범위한 학습 자료
│       │   ├── hands-on/    # 인터랙티브 프로젝트 및 연습
│       │   ├── learning/    # 심층 튜토리얼
│       │   ├── projects/    # 프로젝트 쇼케이스
│       │   ├── tutorials/   # 단계별 가이드
│       │   └── snippets/    # 재사용 가능한 코드 패턴
│       ├── blog/            # 기술 블로그 포스트
│       ├── src/
│       │   ├── components/  # 커스텀 React 컴포넌트
│       │   ├── data/        # 프로필 및 프로젝트 데이터
│       │   └── pages/       # 커스텀 페이지 (소개, 포트폴리오)
│       └── static/          # 정적 자원
│
├── packages/
│   ├── ui/                  # React 19 컴포넌트 라이브러리
│   │   ├── src/            # 현대적 패턴을 가진 컴포넌트
│   │   └── __tests__/      # 포괄적인 테스트 스위트
│   ├── eslint-config/      # 현대적인 ESLint 구성
│   └── typescript-config/  # 엄격한 TypeScript 설정
│
├── .github/workflows/      # 포괄적인 테스팅을 가진 CI/CD
└── turbo.json             # 최적화된 빌드 파이프라인
```

## 🧪 테스팅

UI 컴포넌트 라이브러리는 Vitest와 React Testing Library를 사용한 포괄적인 테스팅을 포함합니다:

```bash
# 모든 UI 컴포넌트 테스트 실행
pnpm test

# 개발을 위한 워치 모드에서 테스트 실행
pnpm --filter=@repo/ui test:watch

# 특정 컴포넌트에 대한 테스트 실행
pnpm --filter=@repo/ui test button

# 전체 모노레포에서 타입 검사 실행
pnpm check-types
```

## 🔧 컴포넌트 개발

### 새 컴포넌트 생성

```bash
# 보일러플레이트와 테스트를 가진 새 컴포넌트 생성
cd packages/ui
pnpm generate:component

# 또는 루트 디렉토리에서
pnpm --filter=@repo/ui generate:component
```

### 사용 가능한 컴포넌트

`@repo/ui` 라이브러리는 현대적인 React 컴포넌트들을 포함합니다:

- **Button** - 다양한 변형을 가진 유연한 버튼 컴포넌트
- **Card** - 콘텐츠 그룹핑을 위한 컨테이너 컴포넌트
- **Input** - 검증 지원을 가진 폼 입력
- **Modal** - 접근 가능한 모달 다이얼로그 컴포넌트
- **LoadingSpinner** - 로딩 상태 컴포넌트
- **Code** - 코드 블록을 위한 구문 하이라이팅

### 공유 컴포넌트 사용

```typescript
// 공유 라이브러리에서 컴포넌트 가져오기
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Modal } from "@repo/ui/modal";
import { LoadingSpinner } from "@repo/ui/loading-spinner";

export function MyPage() {
  return (
    <Card>
      <Button variant="primary">클릭하세요</Button>
      <LoadingSpinner />
    </Card>
  );
}
```

## 🚢 CI/CD 파이프라인

프로젝트는 포괄적인 GitHub Actions 워크플로를 포함합니다:

- **코드 품질**: 제로 경고 정책을 가진 ESLint 9.x
- **타입 안전성**: TypeScript 5.9.2 엄격 모드 검사
- **테스팅**: UI 컴포넌트에 대한 Vitest 단위 테스트
- **빌드**: 지능적 캐싱을 가진 Turborepo 프로덕션 빌드
- **보안**: 의존성 취약점 스캐닝을 위한 pnpm audit
- **성능**: 아티팩트 보관을 가진 최적화된 빌드

## 📚 학습 콘텐츠

Docusaurus 사이트는 풍부한 교육 자료를 제공합니다:

### 콘텐츠 카테고리

- **📖 Learning**: React 19, TypeScript 패턴, Next.js 최적화에 대한 심층 튜토리얼
- **🛠️ Hands-on**: 인터랙티브 프로젝트와 실용적인 연습
- **📁 Projects**: 구현 사례와 케이스 스터디 쇼케이스
- **📝 Tutorials**: 단계별 개발 가이드
- **⚡ Snippets**: 재사용 가능한 코드 패턴과 유틸리티
- **🔍 Quick Reference**: 치트 시트와 빠른 참조

### 주요 토픽

- React 19 심층 분석과 새로운 기능
- React Suspense 패턴과 구현
- TypeScript 고급 패턴
- Next.js 15 성능 최적화
- 현대적 프론트엔드 개발 로드맵

## 📁 주요 구성 파일

- **`turbo.json`**: 지능적 캐싱을 가진 최적화된 빌드 파이프라인
- **`pnpm-workspace.yaml`**: 모노레포 워크스페이스 구조
- **`package.json`**: 루트 스크립트와 개발 의존성
- **`CLAUDE.md`**: 포괄적인 개발 가이던스와 패턴
- **`docusaurus.config.ts`**: 다국어 설정을 가진 Docusaurus 구성
- **`vercel.json`**: 프로덕션 배포 구성

## 🚀 배포

프로젝트는 Vercel 배포를 위해 구성되어 있습니다:

- **정적 사이트 생성**: 최적화된 Docusaurus 빌드
- **성능**: 내장된 캐싱과 최적화
- **다국어**: 한국어/영어 콘텐츠를 위한 자동 라우팅
- **커스텀 도메인**: 프로덕션 배포 준비 완료

## 🔗 유용한 링크

사용된 기술과 패턴에 대해 더 자세히 알아보기:

- [React 19 Documentation](https://react.dev/blog/2025/12/05/react-19) - 최신 React 기능
- [Turborepo Documentation](https://turbo.build/repo/docs) - 모노레포 빌드 시스템
- [Docusaurus Documentation](https://docusaurus.io/docs) - 문서화 플랫폼
- [Vitest Documentation](https://vitest.dev/guide) - 테스팅 프레임워크
- [TypeScript Handbook](https://www.typescriptlang.org/docs) - 타입 시스템 가이드
- [pnpm Workspaces](https://pnpm.io/workspaces) - 패키지 관리

---

🚀 **Modern React Lab** - React 19, TypeScript, 현대적인 개발 패턴을 마스터하기 위한 포괄적인 학습 환경