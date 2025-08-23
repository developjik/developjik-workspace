# React 19 심화 학습 🚀

React 19의 핵심 기능들을 깊이 있게 탐구하고 실제 사용 사례를 정리합니다.

## Actions와 useActionState

### 기본 개념
Actions는 비동기 작업을 처리하는 새로운 방식입니다. 특히 폼 처리와 서버 통신에 최적화되어 있습니다.

```jsx
import { useActionState } from 'react';

async function submitAction(prevState, formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    });
    
    if (response.ok) {
      return { success: true, message: '전송 완료!' };
    } else {
      return { success: false, message: '전송 실패' };
    }
  } catch (error) {
    return { success: false, message: '네트워크 오류' };
  }
}

function ContactForm() {
  const [state, action, isPending] = useActionState(submitAction, null);
  
  return (
    <form action={action}>
      <input name="name" placeholder="이름" required />
      <input name="email" type="email" placeholder="이메일" required />
      
      <button disabled={isPending}>
        {isPending ? '전송 중...' : '전송하기'}
      </button>
      
      {state?.message && (
        <p className={state.success ? 'success' : 'error'}>
          {state.message}
        </p>
      )}
    </form>
  );
}
```

### 장점
- **선언적**: UI와 비즈니스 로직의 명확한 분리
- **타입 안전성**: TypeScript와 완벽한 호환
- **접근성**: 자동으로 ARIA 속성 처리
- **성능**: 불필요한 리렌더링 최소화

## use() Hook

### Promise 처리
```jsx
import { use, Suspense, useState } from 'react';

// 데이터 fetcher
async function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}

function UserProfile({ userId }) {
  // use()로 Promise를 직접 처리
  const user = use(fetchUserData(userId));
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <img src={user.avatar} alt={user.name} />
    </div>
  );
}

function App() {
  const [selectedUserId, setSelectedUserId] = useState(1);
  
  return (
    <div>
      <select onChange={(e) => setSelectedUserId(Number(e.target.value))}>
        <option value={1}>User 1</option>
        <option value={2}>User 2</option>
      </select>
      
      <Suspense fallback={<div>사용자 정보 로딩 중...</div>}>
        <UserProfile userId={selectedUserId} />
      </Suspense>
    </div>
  );
}
```

### Context와 함께 사용
```jsx
import { createContext, use } from 'react';

const ThemeContext = createContext();

function Button({ children }) {
  // useContext 대신 use() 사용 가능
  const theme = use(ThemeContext);
  
  return (
    <button style={{ 
      background: theme.primary, 
      color: theme.text 
    }}>
      {children}
    </button>
  );
}
```

## React Compiler

### 자동 최적화
React Compiler는 코드를 분석해서 자동으로 최적화를 적용합니다.

```jsx
// 컴파일러 없이 - 수동 최적화 필요
function ExpensiveList({ items, filter, onItemClick }) {
  const filteredItems = useMemo(() => 
    items.filter(item => item.category === filter)
  , [items, filter]);
  
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);
  
  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}

// 컴파일러와 함께 - 자동 최적화!
function ExpensiveList({ items, filter, onItemClick }) {
  // 자동으로 메모화됨
  const filteredItems = items.filter(item => item.category === filter);
  
  // 자동으로 useCallback 적용
  const handleClick = (id) => {
    onItemClick(id);
  };
  
  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

### 컴파일러 설정
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

module.exports = nextConfig;
```

## 실전 적용 팁

### 1. 점진적 도입
- 새로운 컴포넌트부터 React 19 기능 적용
- 기존 코드는 단계적으로 마이그레이션

### 2. 타입스크립트 활용
```tsx
import { useActionState } from 'react';

type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

type FormAction = (
  prevState: FormState | null, 
  formData: FormData
) => Promise<FormState>;

const submitForm: FormAction = async (prevState, formData) => {
  // 타입 안전한 폼 처리
  return { success: true, message: '성공!' };
};
```

### 3. 에러 처리
```jsx
import { use, Suspense } from 'react';

function DataComponent({ dataPromise }) {
  try {
    const data = use(dataPromise);
    return <div>{data.content}</div>;
  } catch (error) {
    // Error Boundary에서 처리됨
    throw error;
  }
}

function App() {
  return (
    <ErrorBoundary fallback={<div>오류 발생</div>}>
      <Suspense fallback={<div>로딩 중...</div>}>
        <DataComponent dataPromise={fetchData()} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## 다음 단계

- Next.js 15와 React 19 통합 경험
- 성능 최적화 실전 사례
- 테스팅 전략 변화