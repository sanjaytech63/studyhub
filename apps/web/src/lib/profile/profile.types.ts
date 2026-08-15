export interface Profile {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly bio: string;
  readonly location: string;
  readonly avatarUrl?: string;
}

export interface UpdateProfilePayload {
  readonly name: string;
  readonly email: string;
  readonly bio: string;
  readonly location: string;
}
