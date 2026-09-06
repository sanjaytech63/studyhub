export interface UserSession {
  readonly id: string;
  readonly ipAddress: string | null;
  readonly userAgent: string | null;
  readonly lastActiveAt: string;
  readonly expiresAt: string;
  readonly createdAt: string;
}

export interface SessionsResponse {
  readonly sessions: readonly UserSession[];
}

export interface ChangeEmailPayload {
  readonly newEmail: string;
}

export interface VerifyEmailChangePayload {
  readonly otp: string;
}

export interface ResendEmailChangePayload {
  readonly newEmail: string;
}
