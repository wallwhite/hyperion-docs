import { z } from 'zod';

const COMMON_FIELDS = {
  NEXT_PUBLIC_IS_PROD: z.boolean(),
} as const;

const SERVER_FIELDS = {
  KROKI_BASE_URL: z.string().min(1),
} as const;

const CLIENT_ENV_SCHEMA = z.object({
  ...COMMON_FIELDS,
});

const SERVER_ENV_SCHEMA = z.object({
  ...COMMON_FIELDS,
  ...SERVER_FIELDS,
});

const createEnv = <T extends z.ZodSchema>(schema: T, values: Record<string, string | boolean | number>) => {
  const result = schema.safeParse(values);

  if (!result.success) {
    throw new Error(`[ENV] Config validation error: ${result.error.message}`);
  }

  const { data } = result;

  return data as z.infer<T>;
};

export const SERVER_ENV = () => {
  if (typeof window !== 'undefined') {
    throw new TypeError('SERVER_ENV can only be used on the server');
  }

  return createEnv(SERVER_ENV_SCHEMA, {
    KROKI_BASE_URL: process.env.KROKI_BASE_URL ?? '',
    NEXT_PUBLIC_IS_PROD: process.env.NODE_ENV === 'production',
  });
};

export const CLIENT_ENV = () => {
  return createEnv(CLIENT_ENV_SCHEMA, {
    NEXT_PUBLIC_IS_PROD: process.env.NODE_ENV === 'production',
  });
};
