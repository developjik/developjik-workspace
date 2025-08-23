import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

export class CryptoService {
  // Password hashing
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Symmetric encryption for sensitive data
  static encrypt(text: string, secretKey?: string): string {
    const key = secretKey || process.env.ENCRYPTION_KEY || 'default-key-change-this';
    return CryptoJS.AES.encrypt(text, key).toString();
  }

  static decrypt(encryptedText: string, secretKey?: string): string {
    const key = secretKey || process.env.ENCRYPTION_KEY || 'default-key-change-this';
    const bytes = CryptoJS.AES.decrypt(encryptedText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Generate secure random tokens
  static generateSecureToken(length: number = 32): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
  }

  // Generate backup codes for 2FA
  static generateBackupCodes(count: number = 8): string[] {
    const codes = [];
    
    for (let i = 0; i < count; i++) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      codes.push(code);
    }
    
    return codes;
  }

  // Hash sensitive data (one-way)
  static hashData(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  // Generate TOTP secret for 2FA
  static generateTOTPSecret(): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    
    for (let i = 0; i < 32; i++) {
      secret += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    
    return secret;
  }

  // Validate password strength
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Check length
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password must be at least 8 characters long');
    }

    // Check for uppercase
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain at least one uppercase letter');
    }

    // Check for lowercase
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain at least one lowercase letter');
    }

    // Check for numbers
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain at least one number');
    }

    // Check for special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain at least one special character');
    }

    // Check for common patterns
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /admin/i,
      /letmein/i,
    ];

    if (commonPatterns.some(pattern => pattern.test(password))) {
      score -= 1;
      feedback.push('Password contains common patterns and may be easily guessed');
    }

    return {
      isValid: score >= 4 && feedback.length === 0,
      score: Math.max(0, score),
      feedback,
    };
  }

  // Rate limiting helpers
  static generateRateLimitKey(identifier: string, action: string): string {
    return `ratelimit:${action}:${CryptoJS.SHA256(identifier).toString()}`;
  }

  // Session management
  static generateSessionId(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }
}