# TypeScript 고급 패턴 완전 정복 💪

TypeScript의 고급 기능들을 실무에서 어떻게 활용할 수 있는지 깊이 있게 탐구해보겠습니다.

## 📚 학습 목표

이 학습 노트를 통해 다음을 익힐 수 있습니다:

- [ ] 고급 타입 시스템 이해하기
- [ ] 유틸리티 타입 마스터하기
- [ ] 조건부 타입과 매핑된 타입 활용하기
- [ ] 타입 가드와 타입 단언 패턴
- [ ] 실무 프로젝트에 적용하기

## 🎯 핵심 개념

### 1. 조건부 타입 (Conditional Types)

조건부 타입은 입력 타입에 따라 다른 타입을 반환하는 강력한 기능입니다.

```typescript
// 기본 문법
type ConditionalType<T> = T extends string ? string[] : number[];

// 실용적인 예제: NonNullable 구현
type MyNonNullable<T> = T extends null | undefined ? never : T;

// 사용 예
type A = MyNonNullable<string | null>; // string
type B = MyNonNullable<number | undefined>; // number
```

#### 실무 적용: API 응답 타입 변환
```typescript
type ApiResponse<T> = T extends string 
  ? { message: T; status: 'success' }
  : T extends Error
  ? { error: T; status: 'error' }
  : { data: T; status: 'success' };

// 사용
type SuccessResponse = ApiResponse<{ users: User[] }>; 
// { data: { users: User[] }; status: 'success' }

type ErrorResponse = ApiResponse<Error>; 
// { error: Error; status: 'error' }
```

### 2. 매핑된 타입 (Mapped Types)

기존 타입을 기반으로 새로운 타입을 생성하는 패턴입니다.

```typescript
// 모든 속성을 선택적으로 만들기
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 모든 속성을 필수로 만들기
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// 실무 예제: Form 상태 관리
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type UserFormState = {
  [K in keyof User]: {
    value: User[K];
    error?: string;
    touched: boolean;
  };
};

// 결과
const userForm: UserFormState = {
  id: { value: 1, touched: false },
  name: { value: '', error: '이름을 입력하세요', touched: true },
  email: { value: '', touched: false },
  age: { value: 0, touched: false }
};
```

### 3. 템플릿 리터럴 타입

TypeScript 4.1에서 도입된 강력한 기능입니다.

```typescript
// 기본 사용법
type Greeting = `Hello, ${string}!`;
type Welcome = `Welcome, ${'user' | 'admin' | 'guest'}`;

// 실무 예제: 이벤트 타입 생성
type EventType = 'click' | 'scroll' | 'resize';
type ElementType = 'button' | 'input' | 'div';
type EventHandler = `on${Capitalize<EventType>}${Capitalize<ElementType>}`;

// 'onClickButton' | 'onScrollInput' | 'onResizeDiv' | ...
```

#### 실무 적용: CSS 클래스명 타입 안전성
```typescript
type Size = 'sm' | 'md' | 'lg';
type Color = 'primary' | 'secondary' | 'danger';
type Variant = 'solid' | 'outline' | 'ghost';

type ButtonClass = `btn-${Size}-${Color}-${Variant}`;

function createButton(className: ButtonClass) {
  return `<button class="${className}">Click me</button>`;
}

// 타입 안전한 사용
createButton('btn-md-primary-solid'); // ✅
createButton('btn-xl-blue-filled'); // ❌ 컴파일 에러
```

## 🛠️ 실무 패턴

### 1. 타입 가드 패턴

```typescript
// 사용자 정의 타입 가드
interface Dog {
  type: 'dog';
  breed: string;
  bark(): void;
}

interface Cat {
  type: 'cat';
  color: string;
  meow(): void;
}

type Pet = Dog | Cat;

// 타입 가드 함수
function isDog(pet: Pet): pet is Dog {
  return pet.type === 'dog';
}

function isCat(pet: Pet): pet is Cat {
  return pet.type === 'cat';
}

// 실무 사용
function handlePet(pet: Pet) {
  if (isDog(pet)) {
    pet.bark(); // TypeScript가 pet을 Dog로 인식
    console.log(`This is a ${pet.breed}`);
  } else if (isCat(pet)) {
    pet.meow(); // TypeScript가 pet을 Cat으로 인식
    console.log(`This cat is ${pet.color}`);
  }
}
```

### 2. 브랜드 타입 패턴

```typescript
// 브랜드 타입으로 타입 안전성 강화
type UserId = string & { readonly brand: unique symbol };
type ProductId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createProductId(id: string): ProductId {
  return id as ProductId;
}

// 함수에서 잘못된 ID 타입 사용 방지
function getUser(userId: UserId): User {
  // 사용자 조회 로직
}

function getProduct(productId: ProductId): Product {
  // 제품 조회 로직
}

// 사용
const userId = createUserId('user-123');
const productId = createProductId('prod-456');

getUser(userId); // ✅
getUser(productId); // ❌ 타입 에러!
```

### 3. 빌더 패턴과 타입

```typescript
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username?: string;
  password?: string;
  ssl?: boolean;
}

class DatabaseConfigBuilder {
  private config: Partial<DatabaseConfig> = {};

  host(host: string): this {
    this.config.host = host;
    return this;
  }

  port(port: number): this {
    this.config.port = port;
    return this;
  }

  database(database: string): this {
    this.config.database = database;
    return this;
  }

  username(username: string): this {
    this.config.username = username;
    return this;
  }

  password(password: string): this {
    this.config.password = password;
    return this;
  }

  ssl(enabled: boolean = true): this {
    this.config.ssl = enabled;
    return this;
  }

  build(): DatabaseConfig {
    if (!this.config.host || !this.config.port || !this.config.database) {
      throw new Error('Missing required configuration');
    }
    return this.config as DatabaseConfig;
  }
}

// 사용법
const config = new DatabaseConfigBuilder()
  .host('localhost')
  .port(5432)
  .database('myapp')
  .username('admin')
  .password('secret')
  .ssl(true)
  .build();
```

## 🎨 고급 유틸리티 타입 만들기

### 1. 깊은 부분 타입 (Deep Partial)

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface Config {
  database: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
  cache: {
    enabled: boolean;
    ttl: number;
  };
}

// 모든 중첩된 속성이 선택적이 됨
const partialConfig: DeepPartial<Config> = {
  database: {
    host: 'localhost'
    // port와 credentials는 선택적
  }
  // cache 전체가 선택적
};
```

### 2. 키 추출 유틸리티

```typescript
type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

interface Person {
  name: string;
  age: number;
  isActive: boolean;
  scores: number[];
}

type StringKeys = KeysOfType<Person, string>; // 'name'
type NumberKeys = KeysOfType<Person, number>; // 'age'
type BooleanKeys = KeysOfType<Person, boolean>; // 'isActive'
type ArrayKeys = KeysOfType<Person, any[]>; // 'scores'
```

## 🔧 실전 프로젝트 적용

### React 컴포넌트 Props 타입

```typescript
import React from 'react';

// 기본 버튼 Props
interface BaseButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// 버튼 타입별 Props
type ButtonVariant = 
  | { variant: 'primary'; color?: never; }
  | { variant: 'secondary'; color?: never; }
  | { variant: 'custom'; color: string; };

// 이벤트 핸들러 타입
type ButtonEvents =
  | { onClick: () => void; href?: never; }
  | { href: string; onClick?: never; };

// 최종 Props 타입
type ButtonProps = BaseButtonProps & ButtonVariant & ButtonEvents;

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  color,
  onClick,
  href,
  disabled = false,
  loading = false,
  size = 'md'
}) => {
  // 구현...
};

// 사용 예시
const App = () => (
  <div>
    <Button variant="primary" onClick={() => console.log('clicked')}>
      Primary Button
    </Button>
    
    <Button variant="custom" color="#ff6b6b" href="/link">
      Custom Button
    </Button>
    
    {/* 이런 사용은 타입 에러 발생 */}
    {/* <Button variant="primary" color="red"> Invalid </Button> */}
  </div>
);
```

## 💡 성능과 디버깅 팁

### 1. 타입 별칭 vs 인터페이스

```typescript
// 성능: 인터페이스가 더 빠름 (선언 병합 가능)
interface User {
  id: number;
  name: string;
}

interface User {
  email: string; // 자동으로 병합됨
}

// 복잡한 타입 연산: 타입 별칭 사용
type ComplexType<T> = T extends string 
  ? { message: T } 
  : { data: T };
```

### 2. 타입 디버깅 도구

```typescript
// 타입이 무엇인지 확인하는 유틸리티
type Debug<T> = T extends infer R ? { [K in keyof R]: R[K] } : never;

// 사용
type UserFormDebug = Debug<UserFormState>;
//    ^? 마우스를 올려보면 전체 타입 구조를 볼 수 있음
```

## 🎯 마무리 체크리스트

- [ ] 조건부 타입으로 유연한 타입 시스템 구현
- [ ] 매핑된 타입으로 기존 타입 변환
- [ ] 템플릿 리터럴 타입으로 문자열 타입 제어
- [ ] 타입 가드로 런타임 타입 안전성 확보
- [ ] 브랜드 타입으로 의미 있는 타입 구분
- [ ] 실무 프로젝트에 고급 패턴 적용

## 🚀 다음 학습

- **Generic 심화**: 제약 조건과 기본값 활용
- **Decorator 패턴**: 메타데이터와 함께 사용하기
- **Module 시스템**: 타입 모듈화 전략

## 📚 참고 자료

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [Utility Types 공식 문서](https://www.typescriptlang.org/docs/handbook/utility-types.html)