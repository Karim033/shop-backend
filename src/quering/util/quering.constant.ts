export const DefaultPageSize = {
  USER: 10,
  ORDERS: 5,
  CATEGORY: 30,
  PRODUCT: 20,
} as const satisfies Record<string, number>;
