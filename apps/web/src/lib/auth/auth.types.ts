export interface LoginPayload {
  readonly email: string;
  readonly password: string;
}

export interface RegisterPayload {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export interface VerifyOtpPayload {
  readonly email: string;
  readonly otp: string;
}

export interface ForgotPasswordPayload {
  readonly email: string;
}

export interface ResetPasswordPayload {
  readonly token: string;
  readonly password: string;
}

export interface AuthResponse {
  readonly accessToken?: string;
  readonly message?: string;
}

export interface VerifyOtpResponse {
  readonly verified: boolean;
  readonly message?: string;
}

export interface ResetPasswordResponse {
  readonly message?: string;
}
