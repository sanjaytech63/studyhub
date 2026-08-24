export type ProfileStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';

export interface ProfileRole {
  readonly id: string;
  readonly name: string;
}

export interface Profile {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string | null;

  readonly status: ProfileStatus;

  readonly emailVerifiedAt: string | null;

  readonly createdAt: string;
  readonly updatedAt: string;

  readonly role: ProfileRole;
}

export interface UpdateProfilePayload {
  readonly firstName: string;
  readonly lastName?: string | null;
}
