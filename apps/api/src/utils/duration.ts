const UNIT_MULTIPLIERS = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
} as const;

type DurationUnit = keyof typeof UNIT_MULTIPLIERS;

export const durationToSeconds = (value: string): number => {
  const match = value.trim().match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(`Invalid duration format: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = match[2] as DurationUnit;

  return amount * UNIT_MULTIPLIERS[unit];
};

export const durationToMilliseconds = (value: string): number => {
  return durationToSeconds(value) * 1000;
};

export const getExpirationDate = (value: string): Date => {
  return new Date(Date.now() + durationToMilliseconds(value));
};
