type Zero = "zero";
type Succ<N> = { prev: N };

type One = Succ<Zero>;
type Two = Succ<One>;
type Three = Succ<Two>;
type Four = Succ<Three>;

type Add<A, B> = A extends Zero
  ? B
  : A extends Succ<infer R>
  ? Succ<Add<R, B>>
  : never;
type Subtract<A, B> = B extends Zero
  ? A
  : A extends Succ<infer RA>
  ? B extends Succ<infer RB>
    ? Subtract<RA, RB>
    : never
  : never;

// Умножение
type Multiply<A, B> = A extends Zero
  ? Zero
  : A extends Succ<infer R>
  ? Add<B, Multiply<R, B>>
  : never;

// Деление (целочисленное)
type Divide<A, B> = B extends Zero
  ? never
  : A extends Zero
  ? Zero
  : Subtract<A, B> extends infer D extends Zero
  ? Succ<Divide<D, B>>
  : Zero;

type Equals<A, B> = A extends B ? (B extends A ? "success" : never) : never;

export type OnePlusOneTest = Equals<Add<One, One>, Two>;
export type TwoMinusOneTest = Equals<Subtract<Two, One>, One>;
export type TwoTimesTwoTest = Equals<Multiply<Two, Two>, Four>;
export type FourDividedByTwoTest = Equals<Divide<Four, Two>, Two>;
