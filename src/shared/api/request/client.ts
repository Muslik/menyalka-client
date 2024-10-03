import { env } from '~/shared/config';

import { Answer, Request } from '../types';

export async function clientRequest<Response = unknown>({
  path,
  method,
  signal,
  ...options
}: Request): Promise<Answer> {
  const headers = new Headers(options.headers);
  if (options.body) {
    contentDefault(headers, 'application/json; charset=utf-8');
  }

  // Convert body object to JSON if it's not null
  const query = queryToString(convertToStrings(options.query));
  const body =
    contentIs(headers, 'application/json') && options.body
      ? JSON.stringify(options.body)
      : undefined;

  const response = await fetch(`${env.BACKEND_URL}${path}${query}`, {
    method,
    body,
    headers,
    credentials: 'include',
    signal,
  });

  const answer: Response = contentIs(response.headers, 'application/json')
    ? await response.json()
    : await response.text();

  const responder = {
    ok: response.ok,
    body: answer,
    status: response.status,
    headers: toObject(response.headers),
  };

  return responder;
}

/**
 * Check if content-type JSON
 */
function contentIs(headers: Headers, type: string): boolean {
  return headers.get('content-type')?.includes(type) ?? false;
}

function contentDefault(headers: Headers, type: string): Headers {
  if (!headers.has('content-type')) {
    headers.set('content-type', type);
  }

  return headers;
}

function toObject(headers: Headers): Record<string, string> {
  const target: Record<string, string> = {};
  headers.forEach((value, key) => {
    target[key] = value;
  });

  return target;
}

function convertToStrings(
  record?: Record<string, string | number>,
): Record<string, string> | undefined {
  if (!record) {
    return undefined;
  }
  const result: Record<string, string> = {};

  for (const key in record) {
    result[key] = String(record[key]);
  }

  return result;
}

function queryToString(query: Record<string, string> = {}) {
  let queryString = '';
  if (Object.keys(query).length > 0) {
    queryString = '?' + new URLSearchParams(query).toString();
  }

  return queryString;
}
