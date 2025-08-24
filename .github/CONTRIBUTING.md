# 🤝 Contributing Guide

**DevelopJik Frontend 연구실**에 기여해 주셔서 감사합니다! 이 문서는 프로젝트에 효과적으로 기여할 수 있도록 도움을 드립니다.

## 📋 목차

- [🤝 Contributing Guide](#-contributing-guide)
  - [📋 목차](#-목차)
  - [🎯 기여 방식](#-기여-방식)
  - [🏃‍♂️ 시작하기](#️-시작하기)
    - [개발 환경 설정](#개발-환경-설정)
    - [프로젝트 실행](#프로젝트-실행)
  - [🔄 기여 워크플로우](#-기여-워크플로우)
  - [💻 코딩 가이드라인](#-코딩-가이드라인)
    - [코드 스타일](#코드-스타일)
    - [커밋 메시지 규칙](#커밋-메시지-규칙)
    - [브랜치 명명 규칙](#브랜치-명명-규칙)
  - [🧪 테스트](#-테스트)
  - [📚 문서 기여](#-문서-기여)
  - [🐛 버그 리포트](#-버그-리포트)
  - [✨ 기능 제안](#-기능-제안)
  - [🔒 보안 이슈](#-보안-이슈)
  - [❓ 질문과 지원](#-질문과-지원)
  - [📜 행동 규범](#-행동-규범)
  - [🏆 인정과 크레딧](#-인정과-크레딧)

## 🎯 기여 방식

다음과 같은 방식으로 프로젝트에 기여할 수 있습니다:

- 🐛 **버그 수정**: 버그를 발견하고 수정하는 PR
- ✨ **새로운 기능**: 유용한 기능 추가
- 📚 **문서 개선**: 문서 작성, 번역, 오탈자 수정
- 🎨 **UI/UX 개선**: 사용자 경험 향상
- ⚡ **성능 최적화**: 코드 최적화 및 성능 개선
- 🧪 **테스트 추가**: 테스트 커버리지 향상
- 📝 **블로그 포스트**: 기술 학습 자료 작성
- 💡 **아이디어 제안**: GitHub Discussions에서 아이디어 공유
- 🔍 **코드 리뷰**: 다른 기여자의 PR 리뷰

## 🏃‍♂️ 시작하기

### 개발 환경 설정

1. **Repository Fork & Clone**
   ```bash
   # Fork the repository on GitHub first
   git clone https://github.com/your-username/developjik-workspace.git
   cd developjik-workspace
   ```

2. **Node.js 및 패키지 매니저 설정**
   ```bash
   # Node.js 18+ 필요
   node --version  # v18.0.0 이상 확인
   
   # pnpm 설치 (권장)
   npm install -g pnpm
   ```

3. **의존성 설치**
   ```bash
   pnpm install
   ```

4. **환경 설정**
   ```bash
   # 개발 환경용 설정이 필요한 경우 .env.example 참고
   cp .env.example .env.local  # 필요시
   ```

### 프로젝트 실행

```bash
# 개발 서버 시작 (Docusaurus)
pnpm dev

# 전체 빌드 테스트
pnpm build

# 린트 검사
pnpm lint

# 타입 체크
pnpm check-types

# 테스트 실행
pnpm test
```

## 🔄 기여 워크플로우

1. **이슈 확인**
   - 기존 이슈를 확인하여 중복을 방지합니다
   - 새로운 기능의 경우 먼저 이슈를 생성하여 논의합니다

2. **브랜치 생성**
   ```bash
   git checkout -b feature/your-feature-name
   # 또는
   git checkout -b fix/issue-number-description
   ```

3. **개발 및 테스트**
   - 코딩 가이드라인을 따릅니다
   - 필요한 테스트를 작성합니다
   - 로컬에서 충분히 테스트합니다

4. **커밋 및 푸시**
   ```bash
   git add .
   git commit -m "feat: add user authentication system"
   git push origin feature/your-feature-name
   ```

5. **Pull Request 생성**
   - GitHub에서 PR을 생성합니다
   - PR 템플릿을 충실히 작성합니다
   - 관련 이슈를 연결합니다

6. **코드 리뷰 및 수정**
   - 리뷰어의 피드백을 반영합니다
   - CI/CD 검사를 통과시킵니다
   - 승인 후 메인테이너가 머지합니다

## 💻 코딩 가이드라인

### 코드 스타일

- **ESLint**: 프로젝트 ESLint 설정을 따릅니다
- **Prettier**: 코드 포맷팅은 Prettier로 자동 처리됩니다
- **TypeScript**: 가능한 한 강한 타입을 사용합니다

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ❌ Avoid
const user: any = { ... };
```

- **React Patterns**: 현대적인 React 패턴을 사용합니다

```tsx
// ✅ Good - 함수형 컴포넌트 + Hooks
const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  if (!user) return <LoadingSkeleton />;
  
  return <UserCard user={user} />;
};

// ❌ Avoid - 클래스 컴포넌트 (특별한 이유가 없는 한)
class UserProfile extends React.Component { ... }
```

### 커밋 메시지 규칙

[Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다:

```bash
# 형식
<type>(<scope>): <description>

# 예시
feat(auth): add user login functionality
fix(ui): resolve button styling issue in mobile
docs(readme): update installation instructions
perf(api): optimize user data fetching
test(utils): add unit tests for helper functions
```

**타입 분류:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 의미에 영향을 주지 않는 변경사항
- `refactor`: 버그를 수정하거나 기능을 추가하지 않는 코드 변경
- `perf`: 성능을 개선하는 코드 변경
- `test`: 테스트 추가 또는 기존 테스트 수정
- `chore`: 빌드 부분 혹은 패키지 매니저 수정사항

### 브랜치 명명 규칙

```bash
# 기능 개발
feature/user-authentication
feature/blog-post-editor
feature/responsive-design

# 버그 수정
fix/login-redirect-issue
fix/mobile-layout-bug
fix/api-error-handling

# 문서 작업
docs/contributing-guide
docs/api-documentation

# 성능 개선
perf/image-optimization
perf/bundle-size-reduction

# 리팩토링
refactor/auth-module
refactor/component-structure
```

## 🧪 테스트

- **유닛 테스트**: 새로운 기능에는 적절한 테스트를 추가합니다
- **통합 테스트**: API나 컴포넌트 간 상호작용을 테스트합니다
- **E2E 테스트**: 중요한 사용자 플로우는 E2E 테스트로 검증합니다

```bash
# 테스트 실행
pnpm test

# 테스트 커버리지 확인
pnpm test:coverage

# 특정 테스트 파일 실행
pnpm test UserProfile.test.tsx
```

**테스트 작성 예시:**

```typescript
// __tests__/UserProfile.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import UserProfile from '../UserProfile';

describe('UserProfile', () => {
  it('displays user information correctly', async () => {
    render(<UserProfile userId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });
});
```

## 📚 문서 기여

문서는 프로젝트의 중요한 부분입니다:

- **README**: 프로젝트 소개 및 기본 사용법
- **API 문서**: 자동 생성되는 API 문서 확인
- **가이드**: 단계별 튜토리얼 및 가이드
- **블로그**: 기술 학습 자료 및 경험 공유

```markdown
<!-- 문서 작성 예시 -->
# React 19 Advanced Guide

## 개요
React 19의 새로운 기능과 최적화 방법에 대해 알아봅니다.

## 주요 특징
- Server Components
- Concurrent Rendering
- New Hooks
```

## 🐛 버그 리포트

버그를 발견하셨나요? 다음 단계를 따라주세요:

1. **기존 이슈 확인**: 이미 보고된 버그인지 확인합니다
2. **재현 가능한 예제**: 최소한의 재현 가능한 예제를 준비합니다
3. **상세한 정보**: 환경, 브라우저, 버전 정보를 포함합니다
4. **Issue Template 사용**: Bug Report 템플릿을 사용하여 이슈를 생성합니다

## ✨ 기능 제안

새로운 기능을 제안하고 싶으시다면:

1. **Discussion 시작**: GitHub Discussions에서 아이디어를 먼저 논의합니다
2. **사용 사례 설명**: 구체적인 사용 사례와 이점을 설명합니다
3. **Feature Request 생성**: Feature Request 템플릿을 사용합니다
4. **구현 계획**: 가능하다면 구현 방향을 제안합니다

## 🔒 보안 이슈

보안 관련 문제는 특별한 주의가 필요합니다:

- **공개 금지**: 심각한 보안 문제는 공개적으로 이슈를 생성하지 마세요
- **비공개 신고**: Security Advisories 또는 이메일을 통해 신고합니다
- **협력**: 보안 문제 해결을 위해 협력합니다

## ❓ 질문과 지원

도움이 필요하시다면:

1. **문서 확인**: 먼저 문서와 FAQ를 확인해 보세요
2. **GitHub Discussions**: 일반적인 질문이나 아이디어 논의
3. **Issue 생성**: 구체적인 문제나 버그 관련 질문
4. **Community**: Discord나 다른 커뮤니티 채널 활용

## 📜 행동 규범

우리는 모든 기여자가 존중받는 환경을 만들기 위해 노력합니다:

- **존중**: 모든 사람을 존중하며 포용적인 태도를 유지합니다
- **건설적**: 비판은 건설적이고 도움이 되는 방향으로 합니다
- **협력**: 함께 더 나은 결과를 만들기 위해 협력합니다
- **학습**: 실수를 통해 배우는 문화를 지향합니다

## 🏆 인정과 크레딧

기여해 주신 모든 분들을 소중히 여깁니다:

- **Contributors 목록**: README에 기여자 목록이 자동으로 업데이트됩니다
- **릴리즈 노트**: 주요 기여는 릴리즈 노트에 언급됩니다
- **SNS 공유**: 훌륭한 기여는 SNS에서 소개할 수 있습니다
- **추천**: LinkedIn이나 다른 플랫폼에서 기여를 인정할 수 있습니다

---

## 🎉 마무리

DevelopJik Frontend 연구실에 관심을 가져주셔서 감사합니다! 

- 💬 **질문이 있으시다면**: [Discussions](https://github.com/developjik/developjik-workspace/discussions)에서 언제든 질문해 주세요
- 🐛 **버그를 발견하셨다면**: [Issues](https://github.com/developjik/developjik-workspace/issues)에서 신고해 주세요
- 💡 **아이디어가 있으시다면**: Feature Request를 통해 제안해 주세요

함께 더 나은 프로젝트를 만들어 나가요! 🚀

**Happy Contributing!** ✨