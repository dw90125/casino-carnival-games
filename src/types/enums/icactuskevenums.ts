export interface ICactusKevEnums {
  readonly CARD_VALUES: Record<string, number>;
  readonly FLUSHES: number[];
  readonly UNIQUES: number[];
  readonly PRODUCTS: number[];
  readonly VALUES: number[];
  readonly HAND_NAMES: (eqv: number) => string;
}
