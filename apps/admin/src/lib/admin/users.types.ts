export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';

export interface AdminRole {
  readonly id: string;
  readonly name: string;
  readonly type: 'SYSTEM' | 'CUSTOM';
}

export interface AdminUserSummary {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName?: string | null;
  readonly avatarUrl?: string | null;
  readonly status: UserStatus;
  readonly emailVerifiedAt?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly role: AdminRole;
  readonly _count: {
    readonly sessions: number;
  };
}

export interface AdminUserDetail extends AdminUserSummary {
  readonly _count: {
    readonly sessions: number;
    readonly otpVerifications: number;
  };
}

export interface PaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
}

export interface AdminUsersResponse {
  readonly users: readonly AdminUserSummary[];
  readonly pagination: PaginationMeta;
}

export interface AdminStatsResponse {
  readonly users: {
    readonly total: number;
    readonly active: number;
    readonly suspended: number;
    readonly verified: number;
    readonly newThisWeek: number;
    readonly newThisMonth: number;
  };
  readonly roles: {
    readonly total: number;
  };
  readonly sessions: {
    readonly active: number;
  };
}

export interface AdminListUsersParams {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
  readonly status?: UserStatus;
  readonly roleId?: string;
  readonly sortBy?: 'createdAt' | 'email' | 'firstName' | 'status';
  readonly sortOrder?: 'asc' | 'desc';
}

export interface AdminUpdateUserPayload {
  readonly roleId?: string;
  readonly status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  readonly firstName?: string;
  readonly lastName?: string | null;
  readonly email?: string;
  readonly password?: string;
}

export interface CreateUserPayload {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName?: string | null;
  readonly roleId: string;
  readonly status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface UserSessionSummary {
  readonly id: string;
  readonly status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  readonly ipAddress?: string | null;
  readonly userAgent?: string | null;
  readonly lastActiveAt: string;
  readonly expiresAt: string;
  readonly createdAt: string;
}
