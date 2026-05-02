export const expectAnyDate = (): Date => expect.any(Date) as unknown as Date;

export const expectAnyNumber = (): number =>
  expect.any(Number) as unknown as number;

export const expectAnyString = (): string =>
  expect.any(String) as unknown as string;

export const expectObjectContaining = <T extends object>(value: T): T =>
  expect.objectContaining(value) as unknown as T;
