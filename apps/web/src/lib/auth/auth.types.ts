export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string | null;
  readonly roleId: string;
}

export interface AuthResponse {
  readonly user: AuthUser;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly sessionId: string;
}

export interface LoginPayload {
  readonly email: string;
  readonly password: string;
}

export interface RegisterPayload {
  readonly firstName: string;
  readonly lastName?: string;
  readonly email: string;
  readonly password: string;
}

export interface VerifyOtpPayload {
  readonly email: string;
  readonly otp: string;
}

export interface VerifyOtpResponse {
  readonly verified: boolean;
  readonly message?: string;
}

export interface ForgotPasswordPayload {
  readonly email: string;
}

export interface ResetPasswordPayload {
  readonly email: string;
  readonly otp: string;
  readonly password: string;
}

export interface ResetPasswordResponse {
  readonly message?: string;
}
