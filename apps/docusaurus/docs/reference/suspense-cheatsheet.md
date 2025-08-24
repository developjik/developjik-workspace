# React Suspense 치트시트

## 🚀 빠른 시작

### 기본 구조
```tsx
import { Suspense, lazy } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

## 📖 핵심 API

| API | 설명 | 예제 |
|-----|------|------|
| `<Suspense>` | 컴포넌트 래퍼 | `<Suspense fallback={<Loader />}>` |
| `lazy()` | 동적 import | `lazy(() => import('./Component'))` |
| `startTransition()` | 논블로킹 업데이트 | `startTransition(() => setState(newState))` |

## ✅ Do's

### 올바른 사용법
```tsx
// ✅ 의미 있는 fallback
<Suspense fallback={<UserCardSkeleton />}>
  <UserCard />
</Suspense>

// ✅ 적절한 그루핑
<Suspense fallback={<SectionLoader />}>
  <Header />
  <Content />
  <Footer />
</Suspense>

// ✅ Error Boundary와 함께
<ErrorBoundary>
  <Suspense fallback={<Loading />}>
    <DataComponent />
  </Suspense>
</ErrorBoundary>
```

## ❌ Don'ts

### 피해야 할 패턴
```tsx
// ❌ 너무 많은 Suspense 경계
{items.map(item => (
  <Suspense key={item.id} fallback={<Loader />}>
    <Item data={item} />
  </Suspense>
))}

// ❌ 의미 없는 fallback
<Suspense fallback={<div>Loading...</div>}>

// ❌ Suspense 없이 lazy 사용
const LazyComponent = lazy(() => import('./Component'));
// 이렇게 사용하면 에러!
<LazyComponent />
```

## 🔧 디버깅 체크리스트

- [ ] Suspense로 lazy 컴포넌트를 감쌌는가?
- [ ] fallback UI가 의미 있는가?
- [ ] Error Boundary가 설정되었는가?
- [ ] 불필요하게 세분화되지 않았는가?
- [ ] 성능 개선이 실제로 있는가?

## 📱 반응형 Suspense

```tsx
// 모바일에서는 더 간단한 fallback
function ResponsiveSuspense({ children }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <Suspense fallback={isMobile ? <SimpleSkeleton /> : <DetailedSkeleton />}>
      {children}
    </Suspense>
  );
}
```

## 🎯 성능 최적화 팁

1. **번들 분석**: `webpack-bundle-analyzer` 사용
2. **지연 로딩 기준**: 50KB 이상 컴포넌트
3. **중첩 최소화**: 3단계 이내 권장
4. **캐싱 활용**: 브라우저 캐시와 CDN 활용

## 🐛 일반적인 문제들

### 문제: "Suspense boundary없이 lazy 컴포넌트 사용"
```tsx
// 해결: Suspense로 감싸기
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

### 문제: "무한 로딩 상태"
```tsx
// 원인: Promise가 resolve되지 않음
// 해결: import 경로와 export 확인
```

### 문제: "fallback이 너무 오래 표시됨"
```tsx
// 해결: 최소 표시 시간 설정
const [minTimeElapsed, setMinTimeElapsed] = useState(false);
useEffect(() => {
  const timer = setTimeout(() => setMinTimeElapsed(true), 300);
  return () => clearTimeout(timer);
}, []);
```