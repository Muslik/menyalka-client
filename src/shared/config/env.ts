export const PORT = Number.parseInt(import.meta.env.VITE_PORT ?? '3000', 10);
export const IS_DEBUG = Boolean(import.meta.env.VITE_DEBUG);

export const IS_DEV_ENV = import.meta.env.DEV;
export const IS_PROD_ENV = import.meta.env.PROD;

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:4000';
