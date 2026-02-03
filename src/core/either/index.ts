import * as E from 'fp-ts/Either';

export { E };

// Re-export commonly used functions for convenience
export const { left, right, isLeft, isRight, fold, map, mapLeft, chain } = E;

// Type aliases
export type Either<L, R> = E.Either<L, R>;
export type Left<L> = E.Left<L>;
export type Right<R> = E.Right<R>;
