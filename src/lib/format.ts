export const formatPrice = (cents: number): string => {
  return `$${((cents || 0) / 100).toFixed(2)}`;
};

export const PROJECT_ID = '6a2502df6d2d5ba36acdc0a1';
export const SHIPPING_RULES = 'Free shipping on all orders';
