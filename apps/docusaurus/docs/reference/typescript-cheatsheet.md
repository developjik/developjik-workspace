---
title: "TypeScript 실무 치트시트"
description: "React 개발에 필요한 TypeScript 패턴과 실무 타입 정의 모음"
tags: [TypeScript, 타입, Interface, Generic, React]
keywords: [TypeScript 치트시트, React TypeScript, 타입 정의, 인터페이스, 제네릭]
last_update:
  date: 2024-08-24
  author: developjik
---

# TypeScript 실무 치트시트

:::tip 🎯 실무 중심 정리
React 프로젝트에서 자주 사용하는 TypeScript 패턴들을 실무 관점에서 정리했습니다.
:::

## 📋 목차

- [기본 타입](#기본-타입)
- [React 컴포넌트 타입](#react-컴포넌트-타입)
- [Hook 타입](#hook-타입)
- [API & 비동기 타입](#api--비동기-타입)
- [유틸리티 타입](#유틸리티-타입)
- [고급 패턴](#고급-패턴)
- [에러 타입](#에러-타입)
- [실무 팁](#실무-팁)

## 🔢 기본 타입

### 기본 타입 정의

```typescript
// 프리미티브 타입
let id: string = 'user-123';
let age: number = 25;
let isActive: boolean = true;
let data: any = { anything: true }; // 피하는 것이 좋음
let nothing: null = null;
let notDefined: undefined = undefined;

// 배열 타입
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ['a', 'b', 'c'];
let mixed: (string | number)[] = [1, 'hello', 2];

// 객체 타입
let user: {
  id: string;
  name: string;
  age?: number; // 선택적 프로퍼티
  readonly email: string; // 읽기 전용
} = {
  id: '123',
  name: 'John',
  email: 'john@example.com'
};

// 함수 타입
let calculateAge: (birthYear: number) => number = (year) => 2024 - year;
let handleClick: (event: MouseEvent) => void = (e) => console.log(e);

// 리터럴 타입
type Theme = 'light' | 'dark';
type Status = 'pending' | 'success' | 'error';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
```

### 인터페이스 vs 타입

```typescript
// 인터페이스 (확장 가능)
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  permissions: string[];
}

interface User {
  email?: string; // 선언 병합 가능
}

// 타입 별칭 (유니온, 복잡한 타입에 적합)
type Theme = 'light' | 'dark';
type Status = 'loading' | 'success' | 'error';
type EventHandler<T> = (event: T) => void;

// 언제 어떤 것을 사용할까?
// - Interface: 객체 구조, 확장 가능성, 선언 병합 필요시
// - Type: 유니온, 교집합, 조건부 타입, 프리미티브 별칭
```

## ⚛️ React 컴포넌트 타입

### 함수형 컴포넌트 Props

```typescript
import { ReactNode, MouseEvent, ChangeEvent } from 'react';

// 기본 Props 인터페이스
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

// HTML 속성 상속
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// 제네릭 컴포넌트
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string;
  onItemClick?: (item: T) => void;
}

function List<T>({ items, renderItem, keyExtractor, onItemClick }: ListProps<T>) {
  return (
    <div>
      {items.map((item, index) => (
        <div key={keyExtractor(item)} onClick={() => onItemClick?.(item)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

// 컴포넌트 타입 정의
const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
};

// forwardRef 타입
interface FancyInputProps {
  placeholder?: string;
}

const FancyInput = React.forwardRef<HTMLInputElement, FancyInputProps>(
  ({ placeholder }, ref) => {
    return <input ref={ref} placeholder={placeholder} className="fancy-input" />;
  }
);
```

### 이벤트 타입

```typescript
import { 
  MouseEvent, 
  ChangeEvent, 
  FormEvent, 
  KeyboardEvent, 
  FocusEvent 
} from 'react';

function EventHandlers() {
  // 마우스 이벤트
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked:', e.currentTarget.value);
  };

  const handleDivClick = (e: MouseEvent<HTMLDivElement>) => {
    console.log('Div clicked:', e.clientX, e.clientY);
  };

  // 입력 이벤트
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('Input value:', e.target.value);
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    console.log('Textarea value:', e.target.value);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log('Selected value:', e.target.value);
  };

  // 폼 이벤트
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  // 키보드 이벤트
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
    }
  };

  // 포커스 이벤트
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    console.log('Input focused');
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    console.log('Input blurred');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <button onClick={handleClick}>Click me</button>
    </form>
  );
}
```

## 🪝 Hook 타입

### useState 타입

```typescript
import { useState } from 'react';

// 기본 타입 추론
const [count, setCount] = useState(0); // number 타입 추론
const [name, setName] = useState(''); // string 타입 추론

// 명시적 타입 지정
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<Item[]>([]);

// 복합 상태 타입
interface AppState {
  isLoading: boolean;
  error: string | null;
  data: any[];
}

const [state, setState] = useState<AppState>({
  isLoading: false,
  error: null,
  data: []
});

// 함수형 업데이트 타입
const updateUser = (updates: Partial<User>) => {
  setUser(prev => prev ? { ...prev, ...updates } : null);
};
```

### useEffect 타입

```typescript
import { useEffect, useRef } from 'react';

function EffectTypes() {
  // cleanup 함수 타입
  useEffect(() => {
    const timer: NodeJS.Timeout = setInterval(() => {
      console.log('tick');
    }, 1000);

    // cleanup 함수는 void 또는 함수 반환
    return () => clearInterval(timer);
  }, []);

  // async 효과 (직접 async 사용 불가)
  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        const data = await api.getData();
        if (!isCancelled) {
          setData(data);
        }
      } catch (error) {
        if (!isCancelled) {
          setError(error as Error);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, []);
}
```

### 커스텀 Hook 타입

```typescript
import { useState, useEffect, useCallback } from 'react';

// 제네릭 커스텀 훅
function useApi<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const result: T = await response.json();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// 로컬스토리지 훅
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('localStorage error:', error);
    }
  };

  return [storedValue, setValue];
}

// 사용 예시
function UserProfile() {
  const { data: user, loading, error } = useApi<User>('/api/user/me');
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'userPrefs',
    { theme: 'light', language: 'ko' }
  );

  // ...
}
```

## 🌐 API & 비동기 타입

### API 응답 타입

```typescript
// API 응답 기본 구조
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 구체적인 API 타입들
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

// API 함수 타입
type ApiFunction<TParams = void, TResponse = unknown> = 
  TParams extends void 
    ? () => Promise<TResponse>
    : (params: TParams) => Promise<TResponse>;

// API 클라이언트 타입 정의
interface UserApiClient {
  getUsers: ApiFunction<{ page?: number; limit?: number }, PaginatedResponse<User>>;
  getUser: ApiFunction<{ id: string }, ApiResponse<User>>;
  createUser: ApiFunction<CreateUserRequest, ApiResponse<User>>;
  updateUser: ApiFunction<{ id: string } & UpdateUserRequest, ApiResponse<User>>;
  deleteUser: ApiFunction<{ id: string }, ApiResponse<void>>;
}

// 실제 API 구현
const userApi: UserApiClient = {
  getUsers: async (params) => {
    const response = await fetch(`/api/users?${new URLSearchParams(params)}`);
    return response.json();
  },
  
  getUser: async ({ id }) => {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  },
  
  createUser: async (userData) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },
  
  // ... 나머지 구현
};
```

### 에러 처리 타입

```typescript
// 에러 타입 정의
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

interface ValidationError extends ApiError {
  code: 'VALIDATION_ERROR';
  field: string;
  value: any;
}

interface NetworkError extends ApiError {
  code: 'NETWORK_ERROR';
  status?: number;
}

type AppError = ValidationError | NetworkError | ApiError;

// 결과 타입 (Result pattern)
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// 안전한 API 호출
async function safeApiCall<T>(
  apiCall: () => Promise<T>
): Promise<Result<T, AppError>> {
  try {
    const data = await apiCall();
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      return { 
        success: false, 
        error: { 
          code: 'UNKNOWN_ERROR', 
          message: error.message 
        } 
      };
    }
    return { 
      success: false, 
      error: { 
        code: 'UNEXPECTED_ERROR', 
        message: 'An unexpected error occurred' 
      } 
    };
  }
}

// 사용 예시
async function fetchUserSafely(id: string) {
  const result = await safeApiCall(() => userApi.getUser({ id }));
  
  if (result.success) {
    console.log('User data:', result.data);
  } else {
    console.error('Error:', result.error);
  }
}
```

## 🛠️ 유틸리티 타입

### 내장 유틸리티 타입

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

// Partial - 모든 프로퍼티를 선택적으로
type PartialUser = Partial<User>;
// { id?: string; name?: string; email?: string; age?: number; isActive?: boolean; }

// Required - 모든 프로퍼티를 필수로
interface OptionalUser {
  id?: string;
  name?: string;
  email?: string;
}
type RequiredUser = Required<OptionalUser>;
// { id: string; name: string; email: string; }

// Pick - 특정 프로퍼티만 선택
type UserBasicInfo = Pick<User, 'id' | 'name' | 'email'>;
// { id: string; name: string; email: string; }

// Omit - 특정 프로퍼티 제외
type UserWithoutId = Omit<User, 'id'>;
// { name: string; email: string; age: number; isActive: boolean; }

// Record - 키-값 쌍 타입 생성
type UserRole = 'admin' | 'user' | 'guest';
type RolePermissions = Record<UserRole, string[]>;
// { admin: string[]; user: string[]; guest: string[]; }

// Exclude - 유니온에서 특정 타입 제외
type Theme = 'light' | 'dark' | 'auto';
type ManualTheme = Exclude<Theme, 'auto'>;  // 'light' | 'dark'

// Extract - 유니온에서 특정 타입만 추출
type Status = 'pending' | 'success' | 'error' | 'loading';
type FinalStatus = Extract<Status, 'success' | 'error'>;  // 'success' | 'error'

// ReturnType - 함수의 반환 타입 추출
function getUser() {
  return { id: '123', name: 'John' };
}
type UserReturnType = ReturnType<typeof getUser>;  // { id: string; name: string; }

// Parameters - 함수의 매개변수 타입 추출
function updateUser(id: string, data: Partial<User>) {
  // ...
}
type UpdateUserParams = Parameters<typeof updateUser>;  // [string, Partial<User>]
```

### 커스텀 유틸리티 타입

```typescript
// DeepPartial - 중첩 객체도 모두 선택적으로
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// NonNullable - null과 undefined 제거
type NonNullableString = NonNullable<string | null | undefined>;  // string

// 키로부터 값 타입 추출
type ValueOf<T> = T[keyof T];

interface ApiEndpoints {
  users: '/api/users';
  posts: '/api/posts';
  comments: '/api/comments';
}
type EndpointUrl = ValueOf<ApiEndpoints>;  // '/api/users' | '/api/posts' | '/api/comments'

// 함수 오버로드 타입
type Overloaded<T> = T extends {
  (...args: infer A1): infer R1;
  (...args: infer A2): infer R2;
  (...args: infer A3): infer R3;
} ? {
  (...args: A1): R1;
  (...args: A2): R2;
  (...args: A3): R3;
} : T extends {
  (...args: infer A1): infer R1;
  (...args: infer A2): infer R2;
} ? {
  (...args: A1): R1;
  (...args: A2): R2;
} : T extends (...args: infer A) => infer R ? (...args: A) => R : never;

// 조건부 타입
type IsString<T> = T extends string ? true : false;
type Test1 = IsString<string>;   // true
type Test2 = IsString<number>;   // false

// 템플릿 리터럴 타입
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<'click'>;  // 'onClick'
type HoverEvent = EventName<'hover'>;  // 'onHover'
```

## 🔧 고급 패턴

### 조건부 타입과 매핑된 타입

```typescript
// 이벤트 핸들러 자동 생성
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]?: (value: T[K]) => void;
};

interface FormData {
  name: string;
  email: string;
  age: number;
}

type FormHandlers = EventHandlers<FormData>;
// {
//   onName?: (value: string) => void;
//   onEmail?: (value: string) => void;
//   onAge?: (value: number) => void;
// }

// 데이터 변환 타입
type Serialized<T> = {
  [K in keyof T]: T[K] extends Date 
    ? string 
    : T[K] extends object 
    ? Serialized<T[K]>
    : T[K];
};

interface UserWithDate {
  id: string;
  name: string;
  createdAt: Date;
  profile: {
    birthDate: Date;
    preferences: {
      theme: string;
    };
  };
}

type SerializedUser = Serialized<UserWithDate>;
// {
//   id: string;
//   name: string;
//   createdAt: string;  // Date -> string
//   profile: {
//     birthDate: string; // Date -> string
//     preferences: {
//       theme: string;
//     };
//   };
// }

// 분산 조건부 타입
type ToArray<T> = T extends any ? T[] : never;
type StringOrNumberArray = ToArray<string | number>;  // string[] | number[]

// 타입 가드 함수
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value
  );
}

// 사용 예시
function processValue(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // value는 string으로 추론됨
  }
  
  if (isUser(value)) {
    console.log(value.name); // value는 User로 추론됨
  }
}
```

### 제네릭 고급 패턴

```typescript
// 제약 조건이 있는 제네릭
interface Identifiable {
  id: string;
}

function updateEntity<T extends Identifiable>(
  entities: T[],
  id: string,
  updates: Partial<T>
): T[] {
  return entities.map(entity =>
    entity.id === id ? { ...entity, ...updates } : entity
  );
}

// 조건부 제네릭
type ApiResponse<T, E extends boolean = false> = E extends true
  ? { success: true; data: T }
  : { success: boolean; data: T | null; error?: string };

// 사용법
type SuccessResponse = ApiResponse<User, true>;   // { success: true; data: User }
type GeneralResponse = ApiResponse<User>;         // { success: boolean; data: User | null; error?: string }

// 매핑된 타입과 제네릭
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

type UserWithOptionalAge = Optional<User, 'age'>;
// { id: string; name: string; email: string; age?: number }

// 함수 제네릭 패턴
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // 구현
    return null;
  }
  
  async findAll(): Promise<User[]> {
    // 구현
    return [];
  }
  
  async create(userData: Omit<User, 'id'>): Promise<User> {
    // 구현
    return { id: 'new-id', ...userData };
  }
  
  async update(id: string, updates: Partial<User>): Promise<User> {
    // 구현
    const existing = await this.findById(id);
    return { ...existing!, ...updates };
  }
  
  async delete(id: string): Promise<void> {
    // 구현
  }
}
```

## ❌ 에러 타입

```typescript
// 에러 타입 계층 구조
abstract class AppError extends Error {
  abstract readonly code: string;
  
  constructor(message: string, public readonly details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR';
  
  constructor(
    message: string,
    public readonly field: string,
    public readonly value: unknown
  ) {
    super(message, { field, value });
  }
}

class NetworkError extends AppError {
  readonly code = 'NETWORK_ERROR';
  
  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string
  ) {
    super(message, { status, url });
  }
}

class BusinessLogicError extends AppError {
  readonly code = 'BUSINESS_LOGIC_ERROR';
}

// 에러 핸들링 타입
type ErrorHandler<E extends AppError = AppError> = (error: E) => void;

// 에러 타입 가드
function isValidationError(error: Error): error is ValidationError {
  return error instanceof ValidationError;
}

function isNetworkError(error: Error): error is NetworkError {
  return error instanceof NetworkError;
}

// 사용 예시
function handleError(error: Error) {
  if (isValidationError(error)) {
    console.error(`Validation error in field ${error.field}:`, error.message);
  } else if (isNetworkError(error)) {
    console.error(`Network error (${error.status}) at ${error.url}:`, error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## 💡 실무 팁

### 타입 안전한 환경 변수

```typescript
// 환경 변수 타입 정의
interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  API_BASE_URL: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  PORT?: string;
}

// 환경 변수 검증 함수
function getEnvVar<K extends keyof EnvironmentVariables>(
  key: K
): EnvironmentVariables[K] {
  const value = process.env[key];
  
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  
  return value as EnvironmentVariables[K];
}

// 사용법
const apiUrl = getEnvVar('API_BASE_URL');  // string 타입
const nodeEnv = getEnvVar('NODE_ENV');     // 'development' | 'production' | 'test' 타입
```

### 타입 안전한 이벤트 시스템

```typescript
// 이벤트 타입 정의
interface EventMap {
  'user:login': { userId: string; timestamp: Date };
  'user:logout': { userId: string };
  'order:created': { orderId: string; amount: number };
  'order:updated': { orderId: string; status: string };
}

// 타입 안전한 이벤트 에미터
class TypedEventEmitter<T extends Record<string, any>> {
  private listeners = new Map<keyof T, Array<(data: any) => void>>();

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }
}

// 사용법
const eventEmitter = new TypedEventEmitter<EventMap>();

eventEmitter.on('user:login', (data) => {
  console.log(`User ${data.userId} logged in at ${data.timestamp}`);
});

eventEmitter.emit('user:login', {
  userId: '123',
  timestamp: new Date()
});
```

### 타입 안전한 상태 관리

```typescript
// 상태 타입 정의
interface AppState {
  user: User | null;
  posts: Post[];
  loading: {
    user: boolean;
    posts: boolean;
  };
  error: {
    user: string | null;
    posts: string | null;
  };
}

// 액션 타입
type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'SET_LOADING'; payload: { key: keyof AppState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof AppState['error']; value: string | null } };

// 타입 안전한 리듀서
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'CLEAR_USER':
      return { ...state, user: null };
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value }
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: { ...state.error, [action.payload.key]: action.payload.value }
      };
    default:
      return state;
  }
}
```

---

:::tip 🎯 활용 가이드
실무에서는 너무 복잡한 타입보다는 읽기 쉽고 유지보수하기 좋은 타입을 작성하는 것이 중요합니다!
:::

## 🔗 관련 문서

- [TypeScript 고급 패턴](/docs/study/typescript-advanced-patterns)
- [React 치트시트](/docs/reference/react-cheatsheet)
- [React Suspense 가이드](/docs/study/react-suspense-advanced-guide)