import * as jose from 'jose';
import type { JWTPayload, User } from '../types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

const JWT_ALGORITHM = 'HS256';

export class JWTService {
  static async generateToken(user: User, expiresIn: string = '24h'): Promise<string> {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles,
      permissions: user.permissions.map(p => `${p.resource}:${p.action}`),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.getExpirationTime(expiresIn),
      aud: 'modern-react-nextjs-lab',
      iss: 'auth-service',
    };

    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(JWT_SECRET);
  }

  static async generateRefreshToken(userId: string): Promise<string> {
    const payload = {
      sub: userId,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
    };

    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(JWT_SECRET);
  }

  static async verifyToken(token: string): Promise<JWTPayload> {
    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
        algorithms: [JWT_ALGORITHM],
      });

      return payload as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static async refreshTokens(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const { payload } = await jose.jwtVerify(refreshToken, JWT_SECRET);
      
      if (payload.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }

      // In a real application, you would fetch the user from database
      // For now, we'll return new tokens with the same user ID
      const userId = payload.sub as string;
      
      // Generate new tokens
      const newToken = await this.generateToken({
        id: userId,
        email: '', // Would be fetched from database
        username: '',
        firstName: '',
        lastName: '',
        roles: [],
        permissions: [],
        isEmailVerified: true,
        isTwoFactorEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const newRefreshToken = await this.generateRefreshToken(userId);

      return {
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jose.decodeJwt(token);
      const currentTime = Math.floor(Date.now() / 1000);
      
      return (decoded.exp || 0) <= currentTime;
    } catch {
      return true;
    }
  }

  static getTokenPayload(token: string): JWTPayload | null {
    try {
      return jose.decodeJwt(token) as JWTPayload;
    } catch {
      return null;
    }
  }

  private static getExpirationTime(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));
    
    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 24 * 60 * 60; // Default to 24 hours
    }
  }
}