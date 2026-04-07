import { createId } from "@paralleldrive/cuid2";

/** Generate a new cuid2 ID */
export const generateId = createId;

/** Generate multiple IDs at once */
export function generateIds(count: number): string[] {
  return Array.from({ length: count }, () => createId());
}
