import * as z from 'zod';

import { createRule } from './createZodRule';

type Params = {
  message?: string;
};

export const rules = {
  minLength: (min: number, params?: Params) =>
    createRule({
      name: 'minLength',
      schema: z.string().min(min, { message: params?.message }),
    }),
  maxLength: (max: number, params?: Params) =>
    createRule({
      name: 'maxLength',
      schema: z.string().max(max, { message: params?.message }),
    }),
  regex: (regex: RegExp, params?: Params) =>
    createRule({
      name: 'regex',
      schema: z.string().regex(regex, { message: params?.message }),
    }),
  refine: (fn: (value: string) => boolean, params?: Params) =>
    createRule({
      name: 'refine',
      schema: z.string().refine(fn, { message: params?.message }),
    }),
};
