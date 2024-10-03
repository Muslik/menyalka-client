export type Request = {
  path: string;
  method: 'post' | 'get' | 'delete' | 'put' | 'patch';
  body?: Record<string, unknown> | null;
  query?: Record<string, string | number>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export type Answer = {
  ok: boolean;
  body: unknown;
  status: number;
  headers: Record<string, string>;
};
