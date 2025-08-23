---
slug: turborepo-monorepo-setup
title: Turborepo로 모던 모노레포 구축하기
authors: [developjik]
tags: [turborepo, typescript, learning]
---

최근 프로젝트에서 **Turborepo**를 사용해 모노레포를 구축해보았습니다. 
여러 앱과 패키지를 효율적으로 관리할 수 있는 정말 강력한 도구라는 것을 깨달았어요!

## 🤔 왜 Turborepo인가?

기존에는 여러 프로젝트를 각각 관리하다보니 다음과 같은 문제들이 있었습니다:

- 공통 컴포넌트의 중복 개발
- 의존성 관리의 복잡성
- 일관성 없는 설정과 툴링

<!-- truncate -->

## 🏗️ 프로젝트 구조

```
apps/
├── web/          # 메인 Next.js 앱
├── docs/         # 문서화 앱 (Docusaurus)
└── storybook/    # 컴포넌트 스토리북

packages/
├── ui/           # 공유 컴포넌트 라이브러리
├── hooks/        # 커스텀 훅 모음
├── utils/        # 유틸리티 함수
└── config/       # 공유 설정들
```

## ⚡ 핵심 기능들

### 1. 병렬 빌드 및 캐싱
```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "lint": "turbo run lint"
  }
}
```

### 2. 의존성 그래프
Turborepo가 자동으로 패키지 간 의존성을 분석해서 올바른 순서로 빌드합니다.

### 3. 원격 캐싱
팀원들과 빌드 캐시를 공유할 수 있어 CI/CD 시간이 대폭 단축됩니다.

## 🎯 얻은 인사이트

1. **개발 속도 향상**: 변경된 부분만 다시 빌드
2. **일관성 확보**: 모든 패키지가 동일한 툴링 사용
3. **코드 재사용**: 공통 로직을 패키지로 추출

다음 포스트에서는 실제 컴포넌트 라이브러리 구축 과정을 다뤄보겠습니다! 💪