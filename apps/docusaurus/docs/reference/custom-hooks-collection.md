# 실무에서 자주 사용하는 커스텀 훅 모음 🎣

실제 프로젝트에서 반복적으로 사용되는 유용한 커스텀 훅들을 정리했습니다. 복사해서 바로 사용할 수 있도록 완전한 코드와 사용 예시를 포함했습니다.

## 🔧 상태 관리 훅

### 1. useLocalStorage - 로컬 스토리지 동기화

```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 초기값을 로컬 스토리지에서 가져오거나 기본값 사용
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 상태 업데이트 시 로컬 스토리지에도 저장
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// 사용 예시
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [preferences, setPreferences] = useLocalStorage('preferences', {
    notifications: true,
    autoSave: false,
  });

  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        현재 테마: {theme}
      </button>
      
      <label>
        <input
          type="checkbox"
          checked={preferences.notifications}
          onChange={(e) =>
            setPreferences(prev => ({
              ...prev,
              notifications: e.target.checked
            }))
          }
        />
        알림 받기
      </label>
    </div>
  );
}
```

### 2. useToggle - 불린 상태 토글

```typescript
import { useState, useCallback } from 'react';

export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const set = useCallback((newValue: boolean) => setValue(newValue), []);

  return [value, toggle, set];
}

// 사용 예시
function Modal() {
  const [isOpen, toggleOpen, setOpen] = useToggle(false);

  return (
    <div>
      <button onClick={toggleOpen}>
        {isOpen ? '모달 닫기' : '모달 열기'}
      </button>
      
      {isOpen && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-content">
            <h2>모달 내용</h2>
            <button onClick={() => setOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## 🌐 네트워크 및 API 훅

### 3. useFetch - 데이터 페칭

```typescript
import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface FetchOptions {
  immediate?: boolean;
  dependencies?: any[];
}

export function useFetch<T>(
  url: string,
  options: FetchOptions = {}
): FetchState<T> & { refetch: () => Promise<void> } {
  const { immediate = true, dependencies = [] } = options;
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      });
    }
  }, [url]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate, ...dependencies]);

  return {
    ...state,
    refetch: fetchData,
  };
}

// 사용 예시
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error, refetch } = useFetch<User>(
    `/api/users/${userId}`,
    { 
      dependencies: [userId] // userId가 변경될 때마다 다시 페치
    }
  );

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;
  if (!user) return <div>사용자를 찾을 수 없습니다.</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={refetch}>새로고침</button>
    </div>
  );
}
```

### 4. useDebounce - 디바운스 처리

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 클린업 함수로 이전 타이머 취소
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 사용 예시
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const { data: results, loading } = useFetch<SearchResult[]>(
    `/api/search?q=${debouncedSearchTerm}`,
    {
      immediate: false,
      dependencies: [debouncedSearchTerm]
    }
  );

  // 실제 API 호출은 사용자가 타이핑을 멈춘 후 500ms 뒤에 실행
  useEffect(() => {
    if (debouncedSearchTerm) {
      // 검색 실행
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어를 입력하세요..."
      />
      
      {loading && <div>검색 중...</div>}
      
      {results && (
        <ul>
          {results.map(result => (
            <li key={result.id}>{result.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## 🎯 이벤트 및 인터랙션 훅

### 5. useClickOutside - 외부 클릭 감지

```typescript
import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(
  callback: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [callback]);

  return ref;
}

// 사용 예시
function Dropdown() {
  const [isOpen, , setOpen] = useToggle(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setOpen(false));

  return (
    <div ref={dropdownRef} className="dropdown">
      <button onClick={() => setOpen(!isOpen)}>
        메뉴 {isOpen ? '▲' : '▼'}
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <button>항목 1</button>
          <button>항목 2</button>
          <button>항목 3</button>
        </div>
      )}
    </div>
  );
}
```

### 6. useKeyPress - 키보드 이벤트

```typescript
import { useState, useEffect } from 'react';

export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}

// 향상된 버전: 여러 키 조합 지원
export function useKeyCombo(keys: string[]): boolean {
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      setKeysPressed(prev => new Set([...prev, event.key]));
    };

    const upHandler = (event: KeyboardEvent) => {
      setKeysPressed(prev => {
        const newSet = new Set(prev);
        newSet.delete(event.key);
        return newSet;
      });
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return keys.every(key => keysPressed.has(key));
}

// 사용 예시
function KeyboardShortcuts() {
  const escapePressed = useKeyPress('Escape');
  const enterPressed = useKeyPress('Enter');
  const saveCombo = useKeyCombo(['Control', 's']); // Ctrl+S
  const [isModalOpen, , setModalOpen] = useToggle(false);

  useEffect(() => {
    if (escapePressed) {
      setModalOpen(false);
    }
  }, [escapePressed, setModalOpen]);

  useEffect(() => {
    if (saveCombo) {
      console.log('저장 단축키가 눌렸습니다!');
      // 저장 로직 실행
    }
  }, [saveCombo]);

  return (
    <div>
      <p>ESC: 모달 닫기</p>
      <p>Ctrl+S: 저장</p>
      <p>현재 상태: {escapePressed ? 'ESC 눌림' : '대기 중'}</p>
    </div>
  );
}
```

## 📱 반응형 및 미디어 훅

### 7. useMediaQuery - 미디어 쿼리

```typescript
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// 편의를 위한 프리셋 훅들
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(max-width: 1024px)');
export const useIsDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');

// 사용 예시
function ResponsiveComponent() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const prefersDark = useIsDarkMode();

  return (
    <div className={prefersDark ? 'dark-theme' : 'light-theme'}>
      <h1>반응형 컴포넌트</h1>
      
      {isMobile && <MobileNav />}
      {isTablet && !isMobile && <TabletNav />}
      {!isTablet && <DesktopNav />}
      
      <main>
        <p>현재 디바이스: {isMobile ? '모바일' : isTablet ? '태블릿' : '데스크톱'}</p>
        <p>테마 설정: {prefersDark ? '다크 모드' : '라이트 모드'}</p>
      </main>
    </div>
  );
}
```

### 8. useWindowSize - 윈도우 크기 추적

```typescript
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // 초기값 설정
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

// 사용 예시
function AdaptiveGrid() {
  const { width } = useWindowSize();
  
  const getColumns = () => {
    if (width < 768) return 1;
    if (width < 1024) return 2;
    if (width < 1440) return 3;
    return 4;
  };

  const columns = getColumns();

  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1rem'
      }}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="grid-item">
          아이템 {i + 1}
        </div>
      ))}
    </div>
  );
}
```

## ⏱️ 시간 및 타이머 훅

### 9. useInterval - 인터벌 타이머

```typescript
import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  // 최신 콜백을 기억
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 인터벌 설정
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// 사용 예시
function Timer() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(
    () => setCount(count + 1),
    isRunning ? 1000 : null // null이면 인터벌 중지
  );

  return (
    <div>
      <h1>타이머: {count}초</h1>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? '정지' : '시작'}
      </button>
      <button onClick={() => setCount(0)}>리셋</button>
    </div>
  );
}
```

### 10. useCountdown - 카운트다운

```typescript
import { useState, useEffect } from 'react';

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function useCountdown(targetDate: Date): CountdownResult {
  const [timeLeft, setTimeLeft] = useState<CountdownResult>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

// 사용 예시
function ProductLaunch() {
  const launchDate = new Date('2024-12-31T23:59:59');
  const { days, hours, minutes, seconds, isExpired } = useCountdown(launchDate);

  if (isExpired) {
    return <h1>🎉 제품이 출시되었습니다!</h1>;
  }

  return (
    <div className="countdown">
      <h1>제품 출시까지</h1>
      <div className="countdown-grid">
        <div className="countdown-item">
          <span className="number">{days}</span>
          <span className="label">일</span>
        </div>
        <div className="countdown-item">
          <span className="number">{hours}</span>
          <span className="label">시간</span>
        </div>
        <div className="countdown-item">
          <span className="number">{minutes}</span>
          <span className="label">분</span>
        </div>
        <div className="countdown-item">
          <span className="number">{seconds}</span>
          <span className="label">초</span>
        </div>
      </div>
    </div>
  );
}
```

## 📋 폼 및 입력 훅

### 11. useForm - 폼 상태 관리

```typescript
import { useState, useCallback } from 'react';

type ValidationRule<T> = (value: T) => string | null;

interface FormConfig<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule<T[keyof T]>>>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
}: FormConfig<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // 실시간 유효성 검사
    if (validationRules[field]) {
      const error = validationRules[field]!(value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [validationRules]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validateAll = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field as keyof T];
      if (rule) {
        const error = rule(values[field as keyof T]);
        if (error) {
          newErrors[field as keyof T] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}

// 사용 예시
interface UserForm {
  name: string;
  email: string;
  age: number;
}

function UserRegistrationForm() {
  const {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateAll,
    reset,
    isValid,
  } = useForm<UserForm>({
    initialValues: {
      name: '',
      email: '',
      age: 0,
    },
    validationRules: {
      name: (value) => value.length < 2 ? '이름은 2글자 이상이어야 합니다' : null,
      email: (value) => 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
          ? '유효한 이메일을 입력하세요' 
          : null,
      age: (value) => value < 18 ? '18세 이상이어야 합니다' : null,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateAll()) {
      console.log('폼 제출:', values);
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          value={values.name}
          onChange={(e) => setValue('name', e.target.value)}
          onBlur={() => setFieldTouched('name')}
          placeholder="이름"
        />
        {touched.name && errors.name && (
          <span className="error">{errors.name}</span>
        )}
      </div>

      <div>
        <input
          type="email"
          value={values.email}
          onChange={(e) => setValue('email', e.target.value)}
          onBlur={() => setFieldTouched('email')}
          placeholder="이메일"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>

      <div>
        <input
          type="number"
          value={values.age}
          onChange={(e) => setValue('age', parseInt(e.target.value) || 0)}
          onBlur={() => setFieldTouched('age')}
          placeholder="나이"
        />
        {touched.age && errors.age && (
          <span className="error">{errors.age}</span>
        )}
      </div>

      <button type="submit" disabled={!isValid}>
        등록하기
      </button>
      
      <button type="button" onClick={reset}>
        초기화
      </button>
    </form>
  );
}
```

## 🎉 사용 팁

### 성능 최적화
- `useCallback`과 `useMemo`를 적절히 활용하여 불필요한 리렌더링 방지
- 복잡한 계산은 `useMemo`로 캐싱
- 이벤트 리스너는 적절한 클린업 함수로 메모리 누수 방지

### 타입 안전성
- 제네릭을 활용하여 타입 안전한 훅 작성
- 반환 타입을 명시적으로 정의
- 선택적 매개변수에는 기본값 제공

### 재사용성
- 훅을 작고 집중된 기능으로 분리
- 설정 가능한 옵션 제공
- 명확한 네이밍과 문서화

이 커스텀 훅들을 프로젝트에 복사해서 사용하시고, 필요에 따라 수정하여 활용하세요! 🚀