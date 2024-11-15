import * as z from 'zod';

import { createRule } from './createZodRule';

type Params = {
  message?: string;
  ruleName?: string;
};

export const rules = {
  minLength: (min: number, params?: Params) =>
    createRule({
      name: 'MIN_LENGTH',
      schema: z.string().min(min, { message: params?.message }),
    }),
  maxLength: (max: number, params?: Params) =>
    createRule({
      name: 'MAX_LENGTH',
      schema: z.string().max(max, { message: params?.message }),
    }),
  regex: (regex: RegExp, params?: Params) =>
    createRule({
      name: params?.ruleName ?? 'regex',
      schema: z.string().regex(regex, { message: params?.message }),
    }),
  refine: (fn: (value: string) => boolean, params?: Params) =>
    createRule({
      name: params?.ruleName ?? 'refine',
      schema: z.string().refine(fn, { message: params?.message }),
    }),
};
