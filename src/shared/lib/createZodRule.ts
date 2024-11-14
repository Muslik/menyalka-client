import { Rule } from 'effector-forms';
import * as z from 'zod';

export function createRule<V, T = any>({
  schema,
  name,
}: {
  schema: z.Schema<T>;
  name: string;
}): Rule<V> {
  return {
    name,
    validator: (v: V) => {
      const parsed = schema.safeParse(v);
      if (parsed.success) {
        return {
          isValid: true,
          value: v,
        };
      }

      return {
        isValid: false,
        value: v,
        errorText: parsed.error.errors[0].message,
      };
    },
  };
}
