export const uniqueSuffix = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;
