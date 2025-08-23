# Next.js 15 성능 최적화 마스터 가이드 ⚡

Next.js 15의 최신 기능들을 활용해서 웹 애플리케이션의 성능을 극대화하는 방법을 학습해보겠습니다.

## 📖 학습 개요

**학습 기간**: 2주 (집중 학습)  
**난이도**: 중급 → 고급  
**선행 지식**: Next.js 기본, React 18+  

### 🎯 학습 목표
- [ ] Next.js 15의 새로운 성능 기능 이해
- [ ] Core Web Vitals 최적화 실습
- [ ] 번들 크기 최적화 기법 마스터
- [ ] 실시간 성능 모니터링 구축
- [ ] 캐싱 전략 수립 및 적용

## 🚀 Next.js 15 새로운 기능들

### 1. Turbopack 안정화

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 모드에서 Turbopack 활성화
  experimental: {
    turbo: {
      // 커스텀 로더 설정
      loaders: {
        '.svg': ['@svgr/webpack'],
      },
      // 해결 별칭
      resolveAlias: {
        '@': './src',
        '@/components': './src/components',
      },
    },
  },
};

module.exports = nextConfig;
```

#### 성능 비교 결과
```bash
# Webpack (기존)
✓ Ready in 2.3s
✓ Hot reload: 150-300ms

# Turbopack (Next.js 15)  
✓ Ready in 0.8s  
✓ Hot reload: 10-50ms

# 약 5-10배 빠른 개발 경험! 🚄
```

### 2. 향상된 App Router 최적화

```typescript
// app/layout.tsx - 최적화된 루트 레이아웃
import { Inter } from 'next/font/google';
import { ViewTransitions } from 'next/view-transitions';

const inter = Inter({ 
  subsets: ['latin'],
  // 폰트 로딩 최적화
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        {/* 리소스 힌트 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://api.example.com" />
        
        {/* Critical CSS 인라인 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body { font-family: var(--font-inter); }
            .loading { opacity: 0.5; }
          `
        }} />
      </head>
      <body>
        <ViewTransitions>
          {children}
        </ViewTransitions>
      </body>
    </html>
  );
}
```

### 3. Server Components 고급 활용

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { getUserData, getMetrics, getNotifications } from '@/lib/api';

// 병렬 데이터 페칭을 위한 Server Component
async function UserProfile({ userId }: { userId: string }) {
  const user = await getUserData(userId);
  
  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} loading="lazy" />
      <h2>{user.name}</h2>
    </div>
  );
}

async function MetricsChart({ userId }: { userId: string }) {
  const metrics = await getMetrics(userId);
  
  return (
    <div className="metrics">
      {/* 차트 컴포넌트는 클라이언트에서 hydrate */}
      <ClientChart data={metrics} />
    </div>
  );
}

async function NotificationList({ userId }: { userId: string }) {
  const notifications = await getNotifications(userId);
  
  return (
    <ul className="notifications">
      {notifications.map(notification => (
        <li key={notification.id}>{notification.message}</li>
      ))}
    </ul>
  );
}

// 메인 페이지 - 병렬 데이터 로딩
export default async function DashboardPage({ 
  params 
}: { 
  params: { userId: string } 
}) {
  // 병렬로 데이터 페칭 시작
  const userPromise = getUserData(params.userId);
  const metricsPromise = getMetrics(params.userId);
  const notificationsPromise = getNotifications(params.userId);
  
  return (
    <div className="dashboard">
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfile userId={params.userId} />
      </Suspense>
      
      <div className="dashboard-grid">
        <Suspense fallback={<ChartSkeleton />}>
          <MetricsChart userId={params.userId} />
        </Suspense>
        
        <Suspense fallback={<NotificationSkeleton />}>
          <NotificationList userId={params.userId} />
        </Suspense>
      </div>
    </div>
  );
}
```

## 📊 Core Web Vitals 최적화

### 1. Largest Contentful Paint (LCP) 개선

```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';
import { getPlaiceholder } from 'plaiceholder';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export async function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false 
}: OptimizedImageProps) {
  // 블러 placeholder 생성
  const { base64 } = await getPlaiceholder(src);
  
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      placeholder="blur"
      blurDataURL={base64}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{
        objectFit: 'cover',
        // layout shift 방지
        aspectRatio: `${width}/${height}`,
      }}
    />
  );
}
```

### 2. Cumulative Layout Shift (CLS) 최적화

```css
/* styles/layout-stable.css */

/* 이미지 컨테이너 - aspect ratio로 공간 예약 */
.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9; /* CLS 방지 */
}

/* 폰트 로딩 최적화 */
@font-face {
  font-family: 'Inter';
  font-display: swap; /* FOIT 방지 */
  src: url('/fonts/inter.woff2') format('woff2');
}

/* 동적 콘텐츠용 스켈레톤 */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 3. First Input Delay (FID) / Interaction to Next Paint (INP) 최적화

```typescript
// hooks/useOptimizedHandler.ts
import { useCallback, useTransition } from 'react';

export function useOptimizedHandler() {
  const [isPending, startTransition] = useTransition();
  
  const handleClick = useCallback((callback: () => void) => {
    // 무거운 작업을 transition으로 감싸기
    startTransition(() => {
      callback();
    });
  }, []);
  
  return { handleClick, isPending };
}

// components/SearchInput.tsx
import { useDeferredValue, useState } from 'react';
import { useOptimizedHandler } from '@/hooks/useOptimizedHandler';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const { handleClick, isPending } = useOptimizedHandler();
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요..."
      />
      
      {/* 지연된 값으로 무거운 컴포넌트 렌더링 */}
      <SearchResults query={deferredQuery} />
      
      {isPending && <div>검색 중...</div>}
    </div>
  );
}
```

## 🎯 번들 최적화 전략

### 1. 동적 임포트와 코드 분할

```typescript
// components/LazyComponents.tsx
import { lazy, Suspense } from 'react';

// 컴포넌트 레벨 코드 분할
const HeavyChart = lazy(() => 
  import('./HeavyChart').then(module => ({
    default: module.HeavyChart
  }))
);

const AdminPanel = lazy(() => 
  import('./AdminPanel')
);

// 조건부 로딩
export function ConditionalComponents({ userRole }: { userRole: string }) {
  return (
    <div>
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart />
      </Suspense>
      
      {userRole === 'admin' && (
        <Suspense fallback={<AdminSkeleton />}>
          <AdminPanel />
        </Suspense>
      )}
    </div>
  );
}

// 라이브러리 레벨 코드 분할
export async function loadDatePicker() {
  const { DatePicker } = await import('react-datepicker');
  return DatePicker;
}
```

### 2. Bundle Analyzer 활용

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  experimental: {
    // 최신 번들링 최적화
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns',
    ],
  },
  
  webpack: (config, { buildId, dev, isServer }) => {
    // 개발 모드가 아닐 때만 최적화 적용
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // 벤더 라이브러리 분할
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
          },
          // 공통 컴포넌트 분할
          common: {
            minChunks: 2,
            name: 'common',
            priority: 5,
          },
        },
      };
    }
    
    return config;
  },
});
```

### 3. Tree Shaking 최적화

```typescript
// utils/optimized-imports.ts

// ❌ 잘못된 방법 - 전체 라이브러리 임포트
import _ from 'lodash';
import * as dateUtils from 'date-fns';

// ✅ 올바른 방법 - 필요한 함수만 임포트
import { debounce, throttle } from 'lodash-es';
import { format, parseISO } from 'date-fns';

// 커스텀 유틸리티 함수로 번들 크기 줄이기
export const formatDate = (date: string) => format(parseISO(date), 'yyyy-MM-dd');

export const createDebounced = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T => debounce(fn, delay) as T;
```

## 🚀 캐싱 전략

### 1. App Router 캐싱 최적화

```typescript
// lib/cache-config.ts
export const cacheConfig = {
  // 정적 데이터 - 오랫동안 캐시
  static: {
    revalidate: 86400, // 24시간
  },
  
  // 동적 데이터 - 짧은 캐시
  dynamic: {
    revalidate: 60, // 1분
  },
  
  // 사용자별 데이터 - 캐시 안함
  user: {
    revalidate: 0,
  },
};

// app/api/posts/route.ts
export async function GET() {
  const posts = await fetch('https://api.example.com/posts', {
    // Next.js 캐싱 설정
    next: { 
      revalidate: cacheConfig.static.revalidate,
      tags: ['posts'] 
    }
  });
  
  return Response.json(await posts.json());
}

// 캐시 무효화
import { revalidateTag } from 'next/cache';

export async function POST() {
  // 새 포스트 생성 로직...
  
  // 관련 캐시 무효화
  revalidateTag('posts');
  
  return Response.json({ success: true });
}
```

### 2. Redis 캐싱 구현

```typescript
// lib/redis-cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export class CacheManager {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
  
  static async set<T>(
    key: string, 
    value: T, 
    ttl: number = 3600
  ): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
  
  static async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidate error:', error);
    }
  }
}

// 사용 예시
export async function getCachedUserData(userId: string) {
  const cacheKey = `user:${userId}`;
  
  // 캐시에서 먼저 확인
  let userData = await CacheManager.get<User>(cacheKey);
  
  if (!userData) {
    // 캐시 미스 시 DB에서 조회
    userData = await fetchUserFromDB(userId);
    
    // 캐시에 저장 (1시간)
    await CacheManager.set(cacheKey, userData, 3600);
  }
  
  return userData;
}
```

## 📈 성능 모니터링

### 1. Web Vitals 추적

```typescript
// lib/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
}

export function trackWebVitals() {
  function sendToAnalytics(metric: VitalMetric) {
    // Google Analytics 또는 다른 분석 도구로 전송
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.rating,
        value: Math.round(metric.value),
        non_interaction: true,
      });
    }
    
    // 커스텀 API로 전송
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      body: JSON.stringify(metric),
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(console.error);
  }

  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);  
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}

// pages/_app.tsx 또는 app/layout.tsx에서 사용
export function reportWebVitals(metric: any) {
  trackWebVitals();
}
```

### 2. 실시간 성능 대시보드

```typescript
// components/PerformanceDashboard.tsx
import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  bundleSize: number;
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  
  useEffect(() => {
    // 실시간 메트릭 수집
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          // 네비게이션 타이밍 메트릭
          updateMetrics(entry);
        }
      }
    });
    
    observer.observe({ entryTypes: ['navigation', 'measure'] });
    
    return () => observer.disconnect();
  }, []);
  
  if (!metrics) return <div>메트릭 수집 중...</div>;
  
  return (
    <div className="performance-dashboard">
      <div className="metrics-grid">
        <MetricCard 
          title="LCP" 
          value={metrics.lcp} 
          unit="ms"
          threshold={2500}
        />
        <MetricCard 
          title="FID" 
          value={metrics.fid} 
          unit="ms"
          threshold={100}
        />
        <MetricCard 
          title="CLS" 
          value={metrics.cls} 
          unit=""
          threshold={0.1}
        />
        <MetricCard 
          title="TTFB" 
          value={metrics.ttfb} 
          unit="ms"
          threshold={600}
        />
      </div>
    </div>
  );
}
```

## 🎉 성능 최적화 체크리스트

### 🚀 로딩 성능
- [ ] 이미지 최적화 (Next.js Image 컴포넌트 사용)
- [ ] 폰트 최적화 (font-display: swap)
- [ ] 코드 분할 (동적 import 활용)
- [ ] 번들 크기 분석 및 최적화
- [ ] Critical CSS 인라인화

### ⚡ 런타임 성능  
- [ ] React 18+ 동시성 기능 활용
- [ ] 무거운 계산 작업 최적화
- [ ] 메모이제이션 적절히 적용
- [ ] Virtual scrolling 도입 (긴 목록)
- [ ] Web Workers 활용 (무거운 작업)

### 🎯 Core Web Vitals
- [ ] LCP < 2.5초
- [ ] FID < 100ms (또는 INP < 200ms)  
- [ ] CLS < 0.1
- [ ] TTFB < 600ms

### 📊 모니터링
- [ ] Real User Monitoring (RUM) 구축
- [ ] 성능 예산 설정
- [ ] 자동화된 성능 테스트
- [ ] 알림 시스템 구축

## 🔮 다음 단계

1. **고급 최적화 기법**
   - Service Worker 캐싱 전략
   - Edge Computing 활용
   - CDN 최적화

2. **성능 문화 구축**  
   - 성능 예산 도입
   - CI/CD 파이프라인에 성능 테스트 통합
   - 팀 성능 교육

3. **최신 기술 도입**
   - Partial Prerendering
   - Streaming SSR
   - Edge Runtime 활용

---

**학습 완료 시간**: 약 40-60시간  
**실전 프로젝트 적용**: 필수 ✅