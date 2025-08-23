// Types
export * from './types';

// Hooks
export * from './hooks/use-auth';

// Providers
export * from './providers/auth-provider';

// Utils
export { JWTService } from './utils/jwt';
export { CryptoService } from './utils/crypto';

// Re-export commonly used types for convenience
export type {
  User,
  Permission,
  Role,
  AuthSession,
  LoginCredentials,
  RegisterData,
  AuthError,
  AuthState,
  AuthContextType,
  JWTPayload,
  TwoFactorSetup,
} from './types';