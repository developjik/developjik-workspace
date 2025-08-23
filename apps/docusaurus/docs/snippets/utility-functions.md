# 실무 필수 유틸리티 함수 모음 🛠️

프로젝트에서 자주 사용되는 유틸리티 함수들을 카테고리별로 정리했습니다. 모든 함수는 TypeScript로 작성되어 타입 안전성을 보장합니다.

## 📝 문자열 처리

### 1. 문자열 포맷팅

```typescript
// 카멜케이스를 케밥케이스로 변환
export const camelToKebab = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
};

// 케밥케이스를 카멜케이스로 변환
export const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

// 스네이크케이스를 카멜케이스로 변환
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// 첫 글자 대문자로 변환
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// 각 단어의 첫 글자를 대문자로 변환
export const titleCase = (str: string): string => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

// 사용 예시
console.log(camelToKebab('backgroundColor')); // 'background-color'
console.log(kebabToCamel('background-color')); // 'backgroundColor'
console.log(capitalize('hello world')); // 'Hello world'
console.log(titleCase('hello world')); // 'Hello World'
```

### 2. 텍스트 유틸리티

```typescript
// 텍스트 자르기 (말줄임표 포함)
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

// 단어 단위로 텍스트 자르기
export const truncateWords = (text: string, maxWords: number): string => {
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
};

// 문자열에서 HTML 태그 제거
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

// 문자열을 URL 슬러그로 변환
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 특수문자 제거
    .replace(/[\s_-]+/g, '-') // 공백과 언더스코어를 하이픈으로
    .replace(/^-+|-+$/g, ''); // 양쪽 끝 하이픈 제거
};

// 랜덤 문자열 생성
export const generateRandomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 사용 예시
console.log(truncate('긴 텍스트입니다', 5)); // '긴 텍스...'
console.log(slugify('Hello World! 안녕하세요')); // 'hello-world-안녕하세요'
console.log(generateRandomString(10)); // 'aBcDe12345' (랜덤)
```

## 🔢 숫자 및 수학

### 3. 숫자 포맷팅

```typescript
// 숫자를 천 단위로 구분하여 표시
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ko-KR').format(num);
};

// 통화 포맷
export const formatCurrency = (
  amount: number, 
  currency: string = 'KRW'
): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
  }).format(amount);
};

// 퍼센트 포맷
export const formatPercent = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

// 파일 크기 포맷 (바이트를 읽기 쉬운 형태로)
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${Math.round(size * 100) / 100} ${sizes[i]}`;
};

// 사용 예시
console.log(formatNumber(1234567)); // '1,234,567'
console.log(formatCurrency(1000)); // '₩1,000'
console.log(formatPercent(0.1234, 2)); // '12.34%'
console.log(formatFileSize(1024000)); // '1000 KB'
```

### 4. 수학 유틸리티

```typescript
// 범위 내에서 숫자 제한
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// 두 값 사이의 선형 보간
export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

// 값을 다른 범위로 매핑
export const mapRange = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number => {
  return toMin + ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin);
};

// 배열의 평균값 계산
export const average = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

// 배열의 중앙값 계산
export const median = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  
  return sorted[middle];
};

// 사용 예시
console.log(clamp(150, 0, 100)); // 100
console.log(lerp(0, 100, 0.5)); // 50
console.log(mapRange(50, 0, 100, 0, 1)); // 0.5
console.log(average([1, 2, 3, 4, 5])); // 3
console.log(median([1, 2, 3, 4, 5])); // 3
```

## 📅 날짜 및 시간

### 5. 날짜 포맷팅

```typescript
// 상대적 시간 표시 (예: "2시간 전")
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return '방금 전';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}일 전`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}개월 전`;
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}년 전`;
};

// 날짜 포맷팅
export const formatDate = (
  date: Date, 
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  
  return new Intl.DateTimeFormat('ko-KR', defaultOptions).format(date);
};

// 시간 범위 확인
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isThisWeek = (date: Date): boolean => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return date >= oneWeekAgo && date <= now;
};

export const isThisMonth = (date: Date): boolean => {
  const now = new Date();
  return date.getMonth() === now.getMonth() && 
         date.getFullYear() === now.getFullYear();
};

// 날짜 계산
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getDaysBetween = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// 사용 예시
const pastDate = new Date('2024-01-01');
console.log(getRelativeTime(pastDate)); // '23일 전' (예시)
console.log(formatDate(new Date(), { weekday: 'long' })); // '화요일, 2024년 1월 23일'
console.log(isToday(new Date())); // true
console.log(getDaysBetween(new Date(), pastDate)); // 23 (예시)
```

## 🎨 배열 처리

### 6. 배열 유틸리티

```typescript
// 배열을 청크로 나누기
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// 배열에서 중복 제거 (기본값)
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

// 객체 배열에서 특정 키 기준으로 중복 제거
export const uniqueBy = <T, K extends keyof T>(
  array: T[], 
  key: K
): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

// 배열 셔플 (Fisher-Yates 알고리즘)
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 배열에서 랜덤 요소 선택
export const sample = <T>(array: T[]): T | undefined => {
  return array[Math.floor(Math.random() * array.length)];
};

export const sampleSize = <T>(array: T[], size: number): T[] => {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(size, array.length));
};

// 배열을 키-값 객체로 그룹화
export const groupBy = <T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

// 배열 정렬 (다중 기준)
export const sortBy = <T>(
  array: T[],
  ...keyFns: Array<(item: T) => any>
): T[] => {
  return [...array].sort((a, b) => {
    for (const keyFn of keyFns) {
      const aKey = keyFn(a);
      const bKey = keyFn(b);
      
      if (aKey < bKey) return -1;
      if (aKey > bKey) return 1;
    }
    return 0;
  });
};

// 사용 예시
const numbers = [1, 2, 3, 4, 5, 6];
console.log(chunk(numbers, 2)); // [[1, 2], [3, 4], [5, 6]]
console.log(shuffle(numbers)); // [3, 1, 5, 2, 6, 4] (랜덤)

const users = [
  { name: '김철수', age: 30, department: '개발' },
  { name: '이영희', age: 25, department: '디자인' },
  { name: '박민수', age: 35, department: '개발' },
];

console.log(groupBy(users, user => user.department));
// { 개발: [김철수, 박민수], 디자인: [이영희] }

console.log(sortBy(users, user => user.age, user => user.name));
// 나이순, 이름순으로 정렬
```

## 🔧 객체 처리

### 7. 객체 유틸리티

```typescript
// 깊은 복사
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

// 객체 병합 (깊은 병합)
export const deepMerge = <T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T => {
  if (!sources.length) return target;
  const source = sources.shift();
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  
  return deepMerge(target, ...sources);
};

// 객체인지 확인하는 헬퍼 함수
const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// 객체에서 특정 키만 선택
export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

// 객체에서 특정 키 제외
export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj } as any;
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

// 객체의 빈 값 제거
export const removeEmpty = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const result: Partial<T> = {};
  
  for (const key in obj) {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        result[key] = value;
      } else if (isObject(value)) {
        const cleaned = removeEmpty(value);
        if (Object.keys(cleaned).length > 0) {
          result[key] = cleaned as T[Extract<keyof T, string>];
        }
      } else if (!Array.isArray(value)) {
        result[key] = value;
      }
    }
  }
  
  return result;
};

// 중첩된 객체 속성에 안전하게 접근
export const get = <T = any>(
  obj: any,
  path: string,
  defaultValue?: T
): T => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue as T;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : (defaultValue as T);
};

// 사용 예시
const user = {
  name: '김철수',
  age: 30,
  address: {
    city: '서울',
    district: '강남구'
  },
  hobbies: ['독서', '영화감상'],
  email: ''
};

console.log(pick(user, ['name', 'age'])); // { name: '김철수', age: 30 }
console.log(omit(user, ['email'])); // email 제외한 모든 속성
console.log(removeEmpty(user)); // email(빈 문자열) 제거됨
console.log(get(user, 'address.city')); // '서울'
console.log(get(user, 'address.zipcode', '미상')); // '미상' (기본값)
```

## 🔄 비동기 처리

### 8. 프로미스 유틸리티

```typescript
// 지연 실행
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 재시도 로직
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      await delay(delayMs * attempt); // 지수 백오프
    }
  }
  
  throw lastError!;
};

// 타임아웃이 있는 프로미스
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    )
  ]);
};

// 동시 실행 제한
export const pLimit = <T>(
  promises: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    let running = 0;
    let index = 0;
    let completed = 0;

    const run = async () => {
      if (index >= promises.length) return;
      
      const currentIndex = index++;
      running++;
      
      try {
        const result = await promises[currentIndex]();
        results[currentIndex] = result;
      } catch (error) {
        reject(error);
        return;
      }
      
      running--;
      completed++;
      
      if (completed === promises.length) {
        resolve(results);
      } else if (running < concurrency) {
        run();
      }
    };

    // 동시성 제한에 따라 초기 실행
    for (let i = 0; i < Math.min(concurrency, promises.length); i++) {
      run();
    }
  });
};

// 사용 예시
const fetchUserData = async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};

// 재시도와 타임아웃 적용
const getUserWithRetry = (id: string) => 
  withTimeout(
    retry(() => fetchUserData(id), 3, 1000),
    5000
  );

// 동시 실행 제한 (최대 3개씩)
const userIds = ['1', '2', '3', '4', '5'];
const fetchPromises = userIds.map(id => () => fetchUserData(id));
pLimit(fetchPromises, 3).then(users => {
  console.log('모든 사용자 데이터:', users);
});
```

## 🎯 폼 및 유효성 검사

### 9. 유효성 검사 유틸리티

```typescript
// 이메일 유효성 검사
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 한국 휴대폰 번호 유효성 검사
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^010-?([0-9]{4})-?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

// 주민등록번호 유효성 검사 (뒷자리는 *로 마스킹 가능)
export const isValidKoreanID = (id: string): boolean => {
  const idRegex = /^\d{6}-?[1-4*]\d{6}$|^\d{6}-?\*{7}$/;
  return idRegex.test(id);
};

// 비밀번호 강도 검사
export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('8자 이상이어야 합니다');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('소문자를 포함해야 합니다');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('대문자를 포함해야 합니다');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('숫자를 포함해야 합니다');

  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push('특수문자를 포함해야 합니다');

  return { score, feedback };
};

// URL 유효성 검사
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 신용카드 번호 유효성 검사 (Luhn 알고리즘)
export const isValidCreditCard = (cardNumber: string): boolean => {
  const number = cardNumber.replace(/\s|-/g, '');
  
  if (!/^\d+$/.test(number)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// 사용 예시
console.log(isValidEmail('user@example.com')); // true
console.log(isValidPhoneNumber('010-1234-5678')); // true
console.log(getPasswordStrength('weakpass')); // 낮은 점수와 피드백
console.log(getPasswordStrength('StrongPass123!')); // 높은 점수
```

## 🔒 보안 및 인코딩

### 10. 보안 유틸리티

```typescript
// 문자열을 HTML 엔티티로 이스케이프
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// 간단한 문자열 마스킹
export const maskString = (
  str: string,
  visibleStart: number = 2,
  visibleEnd: number = 2,
  maskChar: string = '*'
): string => {
  if (str.length <= visibleStart + visibleEnd) {
    return maskChar.repeat(str.length);
  }
  
  const start = str.substring(0, visibleStart);
  const end = str.substring(str.length - visibleEnd);
  const middle = maskChar.repeat(str.length - visibleStart - visibleEnd);
  
  return start + middle + end;
};

// 이메일 마스킹
export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@');
  const maskedLocal = maskString(localPart, 1, 1);
  return `${maskedLocal}@${domain}`;
};

// 전화번호 마스킹
export const maskPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
  }
  return maskString(phone, 3, 4);
};

// 간단한 해시 생성 (비밀번호용 아님!)
export const simpleHash = (str: string): string => {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32비트 정수로 변환
  }
  
  return Math.abs(hash).toString(36);
};

// Base64 인코딩/디코딩 (브라우저 환경)
export const base64Encode = (str: string): string => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => 
    String.fromCharCode(parseInt(p1, 16))
  ));
};

export const base64Decode = (str: string): string => {
  return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => 
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
};

// 사용 예시
console.log(maskEmail('user@example.com')); // 'u***@example.com'
console.log(maskPhoneNumber('01012345678')); // '010-****-5678'
console.log(maskString('1234567890', 2, 2)); // '12******90'
console.log(simpleHash('hello world')); // '1gqfih9' (예시)
```

## 🔧 성능 최적화

### 11. 성능 유틸리티

```typescript
// 디바운스 함수
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 스로틀 함수
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// 메모이제이션
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// 한 번만 실행되는 함수
export const once = <T extends (...args: any[]) => any>(fn: T): T => {
  let called = false;
  let result: ReturnType<T>;
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  }) as T;
};

// RAF를 사용한 애니메이션 프레임 최적화
export const rafSchedule = (callback: () => void): (() => void) => {
  let ticking = false;
  
  const update = () => {
    callback();
    ticking = false;
  };
  
  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };
  
  return requestTick;
};

// 사용 예시
const expensiveCalculation = memoize((x: number, y: number) => {
  console.log('계산 실행됨');
  return x * y * Math.random();
});

console.log(expensiveCalculation(10, 20)); // 계산 실행됨 + 결과
console.log(expensiveCalculation(10, 20)); // 캐시된 결과 (계산 실행 안됨)

const debouncedSearch = debounce((query: string) => {
  console.log('검색:', query);
}, 300);

// 300ms 내에 여러 번 호출해도 마지막 호출만 실행됨
debouncedSearch('a');
debouncedSearch('ab');
debouncedSearch('abc'); // 이것만 실행됨
```

## 🎉 사용 가이드

### 프로젝트에 통합하기

```typescript
// utils/index.ts
export * from './string-utils';
export * from './number-utils';  
export * from './date-utils';
export * from './array-utils';
export * from './object-utils';
export * from './async-utils';
export * from './validation-utils';
export * from './security-utils';
export * from './performance-utils';

// 사용할 때
import { 
  formatCurrency, 
  debounce, 
  isValidEmail,
  deepClone 
} from '@/utils';
```

### 타입 안전성 보장

모든 유틸리티 함수는 TypeScript로 작성되어 컴파일 타임에 타입 오류를 잡을 수 있습니다. 제네릭을 활용하여 입력과 출력 타입을 보장합니다.

### 성능 고려사항

- `deepClone`은 큰 객체에 대해 비용이 클 수 있으니 필요시에만 사용
- `memoize`는 메모리 사용량을 고려하여 사용
- 정규식은 복잡한 패턴의 경우 성능에 영향을 줄 수 있음

이 유틸리티 함수들을 프로젝트에 맞게 수정하여 사용하세요! 🚀