---
title: "React 메모리 누수 3일간 추적기"
description: "애플리케이션에서 발생한 심각한 메모리 누수를 Chrome DevTools로 추적하고 해결한 과정"
tags: [트러블슈팅, 메모리누수, Chrome DevTools, React, 디버깅]
keywords: [메모리 누수, React 메모리 관리, Chrome DevTools, 성능 디버깅]
last_update:
  date: 2024-08-24
  author: developjik
---

# 🕵️ React 메모리 누수 3일간 추적기

:::danger ⚠️ 긴급 이슈
**발생일**: 2024.07.15  
**심각도**: Critical  
**증상**: 브라우저 탭이 30분 후 다운, 사용자 업무 중단  
**영향**: 전체 사용자 대상 긴급 패치 필요
:::

## 🚨 문제 발생

### 월요일 오전 9시, 급작스러운 장애 신고
```bash
# Sentry 알림이 폭주하기 시작
💥 Error Rate: 15% → 67% (30분간)
📱 User Reports: "브라우저가 계속 멈춰요"
💾 Memory Usage: 300MB → 2.1GB (계속 증가)
```

### 초기 대응 상황
- **오전 9:15** - 첫 번째 장애 신고 접수
- **오전 9:30** - 5명의 추가 신고, 긴급 회의 소집  
- **오전 10:00** - 임시 방편으로 페이지 새로고침 안내
- **목표**: 24시간 내 근본 원인 해결

## 🔍 1일차: 문제 파악 단계

### Chrome DevTools Memory 탭 첫 분석
```javascript
// Memory Snapshot 비교 결과
Initial Load:    45MB
After 5 min:    120MB  
After 15 min:   340MB
After 30 min:   1.2GB ⚠️ 
```

### 의심 구간 1: 이벤트 리스너
```jsx
// 🚨 문제가 될 것 같았던 코드 (하지만 아니었음)
function ChatComponent() {
  useEffect(() => {
    const handleResize = () => {
      console.log('Window resized');
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}
```

### 1일차 결론: 🤔 예상과 다른 결과
- 이벤트 리스너는 정상적으로 cleanup됨
- WebSocket 연결도 문제없음  
- 뭔가 더 깊숙한 곳에 문제가 있는 듯

## 🔬 2일차: 깊이 있는 분석

### Memory Profiler로 Heap Snapshot 비교
```bash
# Chrome DevTools > Memory > Heap Snapshot
1. 페이지 로드 직후 스냅샷
2. 5분 사용 후 스냅샷  
3. 15분 사용 후 스냅샷

# 비교 결과: Detached DOM nodes가 계속 증가! 🎯
```

### 범인 발견: Intersection Observer
```jsx
// 🚨 진짜 문제였던 코드
function LazyImage({ src, alt }) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 🚨 여기가 문제! observer를 disconnect하지 않음
        }
      });
    });
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    // 🚨 cleanup에서 disconnect 누락!
    return () => {
      // observer.disconnect(); <- 이게 없었음!
    };
  }, []);

  return (
    <div ref={imgRef}>
      {isVisible ? <img src={src} alt={alt} /> : <div>Loading...</div>}
    </div>
  );
}
```

### 문제의 심각성 파악
- **LazyImage 컴포넌트**: 화면에 200개 이상 존재
- **페이지 이동**: 컴포넌트는 언마운트되지만 Observer는 계속 살아있음
- **누적 효과**: 페이지를 이동할 때마다 Observer 객체 200개씩 누적

## ⚡ 3일차: 해결 및 검증

### 수정된 코드
```jsx
// ✅ 문제 해결된 코드
function LazyImage({ src, alt }) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();
  const observerRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 한 번 보이면 더 이상 관찰할 필요 없음
          observer.disconnect();
        }
      });
    });
    
    observerRef.current = observer;
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    // ✅ 제대로 된 cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div ref={imgRef}>
      {isVisible ? <img src={src} alt={alt} /> : <div>Loading...</div>}
    </div>
  );
}
```

### 커스텀 훅으로 재사용성 개선
```jsx
// ✅ 더 안전한 커스텀 훅으로 리팩토링
function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options.once !== false) {
          observer.disconnect(); // 기본적으로 한 번만 실행
        }
      }
    }, options);
    
    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [options]);
  
  return [elementRef, isVisible];
}

// 사용법
function LazyImage({ src, alt }) {
  const [ref, isVisible] = useIntersectionObserver({ once: true });
  
  return (
    <div ref={ref}>
      {isVisible ? <img src={src} alt={alt} /> : <div>Loading...</div>}
    </div>
  );
}
```

## 📊 해결 후 성과 측정

### Memory Usage 비교
```bash
# 수정 전
Initial:     45MB
5 min:      340MB
15 min:     1.2GB 🚨
30 min:     브라우저 크래시

# 수정 후  
Initial:     45MB
5 min:       52MB ✅
15 min:      58MB ✅
30 min:      61MB ✅ (안정적 유지)
```

### 사용자 피드백
- **장애 신고**: 0건 (3일간 모니터링)
- **페이지 반응속도**: 평균 40% 향상
- **브라우저 크래시**: 완전 해결

## 🎓 이 경험에서 배운 점

### 기술적 교훈
1. **Cleanup의 중요성**: 모든 구독은 반드시 해제해야 함
2. **Memory Profiling**: Chrome DevTools 활용법 완전 숙달
3. **Detached DOM**: 가비지 컬렉션 동작 원리 이해

### 디버깅 프로세스 개선
```javascript
// 앞으로 사용할 메모리 누수 체크 패턴
const useMemoryLeakCheck = (componentName) => {
  useEffect(() => {
    console.log(`${componentName} mounted`);
    
    return () => {
      console.log(`${componentName} cleanup`);
      // 개발 모드에서 cleanup 실행 확인
    };
  }, [componentName]);
};
```

### 팀 프로세스 개선
1. **Code Review 체크리스트**에 "Observer cleanup 확인" 추가
2. **ESLint Rule** 커스텀 규칙으로 useEffect cleanup 강제화
3. **Memory Testing** 정기적인 메모리 프로파일링 도입

## 🛠️ 예방책 마련

### 1. ESLint 커스텀 룰 작성
```javascript
// eslint-plugin-custom/rules/require-effect-cleanup.js
module.exports = {
  create(context) {
    return {
      'CallExpression[callee.name="useEffect"]'(node) {
        const callback = node.arguments[0];
        if (!hasReturnStatement(callback)) {
          context.report({
            node,
            message: 'useEffect should return cleanup function'
          });
        }
      }
    };
  }
};
```

### 2. 메모리 모니터링 대시보드
```typescript
// 실시간 메모리 사용량 추적
class MemoryMonitor {
  static track() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log({
        used: Math.round(memory.usedJSHeapSize / 1048576),
        total: Math.round(memory.totalJSHeapSize / 1048576),
        limit: Math.round(memory.jsHeapSizeLimit / 1048576)
      });
    }
  }
  
  static startMonitoring() {
    setInterval(() => {
      this.track();
    }, 30000); // 30초마다 체크
  }
}
```

### 3. 안전한 Hook 라이브러리 구축
```jsx
// 팀 내부 useObserver 표준 훅
export function useIntersectionObserver(
  ref: RefObject<Element>,
  options: IntersectionObserverInit & { once?: boolean } = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const { once = true, ...observerOptions } = options;
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      
      if (entry.isIntersecting && once) {
        observer.disconnect();
      }
    }, observerOptions);
    
    observer.observe(element);
    
    return () => observer.disconnect(); // 항상 cleanup!
  }, [ref, once, JSON.stringify(observerOptions)]);
  
  return isIntersecting;
}
```

## 🎯 결론 및 다음 액션

### 성과 요약
- **문제 해결 시간**: 3일 (목표 달성)
- **메모리 사용량**: 95% 감소 
- **사용자 만족도**: 장애 완전 해결
- **팀 역량**: 메모리 디버깅 스킬 대폭 향상

### 장기적 개선 계획
1. **자동화된 메모리 테스트**: E2E 테스트에 메모리 체크 추가
2. **성능 예산**: Bundle size 뿐만 아니라 Memory usage도 CI에서 체크
3. **교육 강화**: 팀 내 메모리 관리 베스트 프랙티스 세미나

---

:::tip 💡 핵심 교훈
**"작은 누수도 모이면 큰 장애가 된다"**  

한 줄의 `observer.disconnect()` 누락이 전체 서비스 장애로 이어질 수 있음을 경험했습니다. 앞으로는 모든 리소스 할당에 대해 cleanup을 의무적으로 고려하는 습관을 갖게 되었습니다.
:::

## 🔗 관련 자료

- [React 19 Deep Dive](/docs/study/react-19-deep-dive)
- [React 치트시트](/docs/reference/react-cheatsheet)
- [성능 최적화 사례](/docs/production-stories/performance-improvement-case)