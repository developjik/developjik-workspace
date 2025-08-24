---
title: "React 완전 치트시트"
description: "React 개발에 필요한 모든 패턴과 API를 한눈에 보는 실무 치트시트"
tags: [React, 치트시트, Quick Reference, Hook, Component]
keywords: [React 치트시트, React Hook 치트시트, useState, useEffect, 컴포넌트 패턴]
last_update:
  date: 2024-08-24
  author: developjik
---

# React 완전 치트시트

:::tip 💡 사용법
개발 중 빠르게 찾아보고 복사해서 사용할 수 있는 실무 패턴들을 정리했습니다.
:::

## 📋 목차

- [컴포넌트 기본](#컴포넌트-기본)
- [Hook 완전 정리](#hook-완전-정리)  
- [이벤트 처리](#이벤트-처리)
- [조건부 렌더링](#조건부-렌더링)
- [리스트 렌더링](#리스트-렌더링)
- [폼 처리](#폼-처리)
- [성능 최적화](#성능-최적화)
- [에러 처리](#에러-처리)
- [커스텀 Hook 패턴](#커스텀-hook-패턴)

## 🧩 컴포넌트 기본

### 함수형 컴포넌트 템플릿

```tsx
import React from 'react';

// Props 타입 정의
interface ComponentProps {
  title: string;
  count?: number;
  onAction?: (data: any) => void;
  children?: React.ReactNode;
}

// 기본값 설정 방법 1 (destructuring default)
function MyComponent({ 
  title, 
  count = 0, 
  onAction, 
  children 
}: ComponentProps) {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {count > 0 && <span>Count: {count}</span>}
      <button onClick={() => onAction?.('clicked')}>
        Action
      </button>
      {children}
    </div>
  );
}

// 기본값 설정 방법 2 (defaultProps)
MyComponent.defaultProps = {
  count: 0
};

export default MyComponent;
```

### 고차 컴포넌트 (HOC)

```tsx
import React, { ComponentType } from 'react';

// HOC 타입 정의
function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return function WithLoadingComponent(
    props: P & { isLoading?: boolean }
  ) {
    const { isLoading, ...restProps } = props;
    
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    return <WrappedComponent {...(restProps as P)} />;
  };
}

// 사용법
const UserListWithLoading = withLoading(UserList);

function App() {
  return (
    <UserListWithLoading 
      isLoading={loading} 
      users={users} 
    />
  );
}
```

## 🪝 Hook 완전 정리

### useState 패턴들

```tsx
import { useState, useCallback } from 'react';

// 기본 사용
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<Item[]>([]);

// 함수형 업데이트 (prev state 활용)
const increment = () => setCount(prev => prev + 1);
const addItem = (newItem: Item) => setItems(prev => [...prev, newItem]);
const updateItem = (id: string, updates: Partial<Item>) => 
  setItems(prev => prev.map(item => 
    item.id === id ? { ...item, ...updates } : item
  ));

// 객체 상태 업데이트
const [form, setForm] = useState({ name: '', email: '' });
const updateForm = (field: string, value: string) => 
  setForm(prev => ({ ...prev, [field]: value }));

// lazy initial state (비용이 큰 초기값)
const [expensiveValue] = useState(() => {
  return computeExpensiveInitialValue();
});
```

### useEffect 완전 활용

```tsx
import { useEffect, useRef } from 'react';

function EffectPatterns() {
  // 마운트 시에만 실행
  useEffect(() => {
    console.log('Component mounted');
  }, []);

  // 의존성이 변경될 때마다 실행
  useEffect(() => {
    fetchData(userId);
  }, [userId]);

  // 정리(cleanup) 함수
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 이전 값과 비교
  const prevUserId = useRef<string>();
  useEffect(() => {
    if (prevUserId.current !== userId) {
      console.log('User ID changed:', prevUserId.current, '->', userId);
      prevUserId.current = userId;
    }
  }, [userId]);

  // 조건부 effect
  useEffect(() => {
    if (shouldFetch && userId) {
      fetchUserData(userId);
    }
  }, [shouldFetch, userId]);

  return <div>Effect patterns demo</div>;
}
```

### useMemo & useCallback 최적화

```tsx
import { useMemo, useCallback, memo } from 'react';

function OptimizedComponent({ items, filter, onItemClick }) {
  // 비용이 큰 계산 메모이제이션
  const filteredItems = useMemo(() => {
    console.log('Filtering items...'); // 디버깅용
    return items.filter(item => item.category === filter);
  }, [items, filter]);

  const expensiveValue = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + complexCalculation(item);
    }, 0);
  }, [items]);

  // 함수 메모이제이션
  const handleItemClick = useCallback((itemId: string) => {
    onItemClick(itemId);
  }, [onItemClick]);

  const handleSubmit = useCallback((data: FormData) => {
    // 폼 제출 로직
    submitData(data);
  }, []); // 의존성 없음

  return (
    <div>
      <div>Total: {expensiveValue}</div>
      {filteredItems.map(item => (
        <ItemCard 
          key={item.id} 
          item={item}
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
}

// React.memo로 컴포넌트 메모이제이션
const ItemCard = memo(({ item, onClick }) => {
  return (
    <div onClick={() => onClick(item.id)}>
      {item.name}
    </div>
  );
});
```

### useRef 활용 패턴

```tsx
import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

function RefPatterns() {
  // DOM 요소 참조
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 값 저장 (리렌더링 유발하지 않음)
  const countRef = useRef(0);
  const previousValueRef = useRef<any>();

  // 타이머 ID 저장
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // DOM 요소에 포커스
    inputRef.current?.focus();

    // 스크롤 위치 제어
    containerRef.current?.scrollTo(0, 100);

    // 이전 값 저장
    previousValueRef.current = someValue;
  }, []);

  const startTimer = () => {
    timerRef.current = setTimeout(() => {
      console.log('Timer completed');
    }, 1000);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return (
    <div ref={containerRef}>
      <input ref={inputRef} />
      <button onClick={startTimer}>Start Timer</button>
    </div>
  );
}

// forwardRef 사용
const FancyInput = forwardRef<HTMLInputElement, { placeholder: string }>(
  (props, ref) => {
    return <input ref={ref} {...props} className="fancy-input" />;
  }
);

// useImperativeHandle로 메서드 노출
const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    clear: () => {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }));

  return <input ref={inputRef} {...props} />;
});
```

## 🎯 이벤트 처리

### 이벤트 핸들러 패턴

```tsx
import { useState, ChangeEvent, FormEvent, KeyboardEvent } from 'react';

function EventHandling() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState<string[]>([]);

  // 입력값 변경 처리
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // 폼 제출 처리
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      setItems(prev => [...prev, value]);
      setValue('');
    }
  };

  // 키보드 이벤트 처리
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  // 동적 이벤트 핸들러
  const createClickHandler = (itemId: string) => () => {
    console.log('Clicked item:', itemId);
  };

  // 이벤트 위임
  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const itemId = target.dataset.itemId;
    
    if (itemId) {
      console.log('Clicked item:', itemId);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Enter item"
        />
        <button type="submit">Add</button>
      </form>

      <div onClick={handleContainerClick}>
        {items.map((item, index) => (
          <div key={index} data-item-id={index}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## ❓ 조건부 렌더링

```tsx
function ConditionalRendering({ user, isLoading, error, items }) {
  // 기본 조건부 렌더링
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div>
      {/* 단순 조건부 */}
      {user.isAdmin && <AdminPanel />}
      
      {/* 삼항 연산자 */}
      {user.avatar ? (
        <img src={user.avatar} alt="Avatar" />
      ) : (
        <div className="default-avatar">{user.name[0]}</div>
      )}

      {/* 복합 조건 */}
      {user.isAuthenticated && user.hasPermission && (
        <SecretContent />
      )}

      {/* 배열 길이 조건 */}
      {items.length > 0 ? (
        <ItemList items={items} />
      ) : (
        <EmptyState message="No items found" />
      )}

      {/* Switch case 패턴 */}
      {(() => {
        switch (user.role) {
          case 'admin':
            return <AdminDashboard />;
          case 'user':
            return <UserDashboard />;
          case 'guest':
            return <GuestView />;
          default:
            return <DefaultView />;
        }
      })()}
    </div>
  );
}
```

## 📝 리스트 렌더링

```tsx
interface Item {
  id: string;
  name: string;
  category: string;
  tags: string[];
}

function ListRendering({ items }: { items: Item[] }) {
  return (
    <div>
      {/* 기본 리스트 렌더링 */}
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      {/* 인덱스와 함께 */}
      {items.map((item, index) => (
        <div key={item.id}>
          {index + 1}. {item.name}
        </div>
      ))}

      {/* 필터링과 함께 */}
      {items
        .filter(item => item.category === 'featured')
        .map(item => (
          <FeaturedItem key={item.id} item={item} />
        ))}

      {/* 그룹화 */}
      {Object.entries(
        items.reduce((groups, item) => {
          const category = item.category;
          if (!groups[category]) groups[category] = [];
          groups[category].push(item);
          return groups;
        }, {} as Record<string, Item[]>)
      ).map(([category, categoryItems]) => (
        <div key={category}>
          <h3>{category}</h3>
          {categoryItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ))}

      {/* 중첩 리스트 */}
      {items.map(item => (
        <div key={item.id}>
          <h4>{item.name}</h4>
          <div className="tags">
            {item.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 📋 폼 처리

```tsx
import { useState, useCallback } from 'react';

interface FormData {
  name: string;
  email: string;
  age: number;
  interests: string[];
  agreedToTerms: boolean;
}

function FormHandling() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    age: 0,
    interests: [],
    agreedToTerms: false
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // 단일 필드 업데이트
  const updateField = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 에러 클리어
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }

    if (formData.age < 18) {
      newErrors.age = 'Must be 18 or older';
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'Must agree to terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await submitFormData(formData);
      // 성공 처리
      setFormData({
        name: '',
        email: '',
        age: 0,
        interests: [],
        agreedToTerms: false
      });
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  // 체크박스 배열 처리
  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 텍스트 입력 */}
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => updateField('name', e.target.value)}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      {/* 이메일 입력 */}
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={e => updateField('email', e.target.value)}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      {/* 숫자 입력 */}
      <div>
        <label>Age:</label>
        <input
          type="number"
          value={formData.age}
          onChange={e => updateField('age', parseInt(e.target.value) || 0)}
        />
      </div>

      {/* 체크박스 그룹 */}
      <div>
        <label>Interests:</label>
        {['Music', 'Sports', 'Technology', 'Art'].map(interest => (
          <label key={interest}>
            <input
              type="checkbox"
              checked={formData.interests.includes(interest)}
              onChange={e => handleInterestChange(interest, e.target.checked)}
            />
            {interest}
          </label>
        ))}
      </div>

      {/* 동의 체크박스 */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.agreedToTerms}
            onChange={e => updateField('agreedToTerms', e.target.checked)}
          />
          I agree to the terms and conditions
        </label>
        {errors.agreedToTerms && (
          <span className="error-message">{errors.agreedToTerms}</span>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

## ⚡ 성능 최적화

```tsx
import { memo, useMemo, useCallback, lazy, Suspense } from 'react';

// 컴포넌트 메모이제이션
const ExpensiveComponent = memo(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: heavyCalculation(item)
    }));
  }, [data]);

  const handleAction = useCallback((id: string) => {
    onAction(id);
  }, [onAction]);

  return (
    <div>
      {processedData.map(item => (
        <ItemComponent 
          key={item.id}
          item={item}
          onAction={handleAction}
        />
      ))}
    </div>
  );
});

// 지연 로딩
const HeavyModal = lazy(() => import('./HeavyModal'));
const AdminPanel = lazy(() => 
  import('./AdminPanel').then(module => ({
    default: module.AdminPanel
  }))
);

function OptimizedApp() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <MainContent />
      
      {/* 조건부 지연 로딩 */}
      {showModal && (
        <Suspense fallback={<div>Loading modal...</div>}>
          <HeavyModal onClose={() => setShowModal(false)} />
        </Suspense>
      )}

      {/* 관리자 기능 */}
      <Suspense fallback={<div>Loading admin panel...</div>}>
        <AdminPanel />
      </Suspense>
    </div>
  );
}

// 가상화 (react-window 사용)
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ItemComponent item={items[index]} />
    </div>
  );

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

## 🚨 에러 처리

```tsx
import { Component, ErrorInfo, ReactNode } from 'react';

// Error Boundary 클래스형 컴포넌트
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // 에러 로깅 서비스로 전송
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 에러 처리 훅
function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    setError(error);
    logErrorToService(error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}

// 비동기 에러 처리
function AsyncComponent() {
  const { error, handleError } = useErrorHandler();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await api.getData();
      setData(result);
    } catch (err) {
      handleError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchData} />;
  }

  return (
    <div>
      {loading && <div>Loading...</div>}
      {data && <DataDisplay data={data} />}
    </div>
  );
}
```

## 🔧 커스텀 Hook 패턴

```tsx
// 로컬 스토리지 훅
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}

// 비동기 데이터 패칭 훅
function useAsyncData<T>(asyncFunction: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

// 디바운스 훅
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 이전 값 추적 훅
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// 마운트 상태 훅
function useIsMounted(): boolean {
  const isMountedRef = useRef(false);
  const [, forceUpdate] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef.current;
}

// 사용 예시
function ExampleUsage() {
  const [name, setName] = useLocalStorage('username', '');
  const debouncedName = useDebounce(name, 300);
  const previousName = usePrevious(name);
  const isMounted = useIsMounted();
  
  const { data: userData, loading } = useAsyncData(
    () => fetchUserData(debouncedName),
    [debouncedName]
  );

  return (
    <div>
      <input 
        value={name} 
        onChange={e => setName(e.target.value)}
        placeholder="Enter name"
      />
      
      {previousName && (
        <div>Previous: {previousName}</div>
      )}
      
      {loading && <div>Loading...</div>}
      {userData && <UserCard user={userData} />}
    </div>
  );
}
```

---

:::tip 💡 활용 팁
이 치트시트를 북마크해두고, 프로젝트에서 필요한 패턴을 빠르게 찾아 사용하세요!
:::

## 🔗 관련 문서

- [React 19 새 기능](/docs/study/react-19-deep-dive)
- [TypeScript 고급 패턴](/docs/study/typescript-advanced-patterns)
- [React Suspense 고급 가이드](/docs/study/react-suspense-advanced-guide)