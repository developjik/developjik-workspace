# Modern React/Next.js Learning Lab

A streamlined **Turborepo monorepo** focused on modern React development patterns, featuring a Docusaurus documentation site and shared component library.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build all packages
pnpm build
```

## 📦 What's Inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- **`docusaurus`**: A [Docusaurus](https://docusaurus.io/) documentation site with multi-language support (Korean/English)
- **`@repo/ui`**: A comprehensive React component library with TypeScript and testing setup
- **`@repo/eslint-config`**: Shared ESLint configurations supporting modern JavaScript/TypeScript patterns
- **`@repo/typescript-config`**: Centralized TypeScript configurations for consistent typing across the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/) with strict type checking enabled.

## 🛠 Development Tools

This monorepo comes with modern development tools pre-configured:

- **[TypeScript](https://www.typescriptlang.org/)** - Static type checking with strict settings
- **[ESLint](https://eslint.org/)** - Code linting with zero-warning policy
- **[Prettier](https://prettier.io)** - Code formatting
- **[Vitest](https://vitest.dev/)** - Fast unit testing for components
- **[React Testing Library](https://testing-library.com/react)** - Component testing utilities
- **[Turborepo](https://turborepo.com/)** - High-performance build system with caching

## 🏗 Development Commands

### Root Level Commands

```bash
# Development
pnpm dev                # Start Docusaurus dev server (port 3002)

# Building
pnpm build             # Build all packages and apps
pnpm check-types       # Type check across entire monorepo

# Code Quality
pnpm lint              # Lint all packages with zero warnings
pnpm format            # Format code with Prettier

# Testing
pnpm test              # Run unit tests for UI components
```

### Package-Specific Commands

```bash
# Build specific package
turbo build --filter=docusaurus
turbo build --filter=@repo/ui

# Develop specific package
turbo dev --filter=docusaurus

# Test specific package
turbo test --filter=@repo/ui

# Generate new UI component
pnpm --filter=@repo/ui generate:component
```

### Docusaurus Specific

```bash
cd apps/docusaurus

pnpm dev          # Start development server
pnpm build        # Build for production
pnpm serve        # Serve built site locally
pnpm clear        # Clear Docusaurus cache
pnpm swizzle      # Customize Docusaurus components
```

## 🏛 Architecture

```
├── apps/
│   └── docusaurus/           # Documentation site (port 3002)
│       ├── docs/            # Documentation content
│       ├── i18n/            # Internationalization files
│       └── src/             # Custom components and pages
│
├── packages/
│   ├── ui/                  # Shared React components
│   │   ├── src/            # Component source files
│   │   └── __tests__/      # Component tests
│   ├── eslint-config/      # Shared ESLint configurations
│   └── typescript-config/  # Shared TypeScript settings
│
├── .github/workflows/      # CI/CD pipeline
└── turbo.json             # Turborepo configuration
```

## 🧪 Testing

The UI component library includes comprehensive testing setup:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm --filter=@repo/ui test:watch

# Run tests for specific component
pnpm --filter=@repo/ui test button
```

## 🔧 Component Development

### Creating New Components

```bash
# Generate a new component with boilerplate
cd packages/ui
pnpm generate:component

# Or from root
pnpm --filter=@repo/ui generate:component
```

### Using Shared Components

```typescript
// Import components from the shared library
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Modal } from "@repo/ui/modal";

export function MyPage() {
  return (
    <Card>
      <Button variant="primary">Click me</Button>
    </Card>
  );
}
```

## 🚢 CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow:

- **Code Quality**: ESLint with zero-warning policy
- **Type Safety**: TypeScript strict mode checking
- **Testing**: Automated unit tests for components
- **Building**: Production builds with caching
- **Security**: Dependency vulnerability scanning
- **Performance**: Bundle size analysis

## 🌐 Multi-language Support

The Docusaurus app supports multiple languages:

- **Korean (ko)**: Primary language
- **English (en)**: Secondary language

Content is organized in `i18n/` directories with automatic locale routing.

## 📁 Key Configuration Files

- **`turbo.json`**: Build pipeline and caching strategy
- **`pnpm-workspace.yaml`**: Workspace structure definition
- **`package.json`**: Root scripts and dependencies
- **`CLAUDE.md`**: Development guidance for AI assistants

## 🔗 Useful Links

Learn more about the technologies used:

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Docusaurus Documentation](https://docusaurus.io/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Vitest Documentation](https://vitest.dev/guide)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

Built with ❤️ using modern React and TypeScript patterns.