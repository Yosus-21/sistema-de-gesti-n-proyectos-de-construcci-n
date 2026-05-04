import { rangesOverlap } from './date-overlap.util';

describe('rangesOverlap', () => {
  it('retorna true cuando los rangos se solapan', () => {
    expect(
      rangesOverlap(
        new Date('2026-05-10T00:00:00.000Z'),
        new Date('2026-05-15T00:00:00.000Z'),
        new Date('2026-05-14T00:00:00.000Z'),
        new Date('2026-05-20T00:00:00.000Z'),
      ),
    ).toBe(true);
  });

  it('retorna false cuando los rangos no se solapan', () => {
    expect(
      rangesOverlap(
        new Date('2026-05-10T00:00:00.000Z'),
        new Date('2026-05-15T00:00:00.000Z'),
        new Date('2026-05-16T00:00:00.000Z'),
        new Date('2026-05-20T00:00:00.000Z'),
      ),
    ).toBe(false);
  });

  it('considera solapamiento cuando los bordes son iguales', () => {
    expect(
      rangesOverlap(
        new Date('2026-05-10T00:00:00.000Z'),
        new Date('2026-05-15T00:00:00.000Z'),
        new Date('2026-05-15T00:00:00.000Z'),
        new Date('2026-05-20T00:00:00.000Z'),
      ),
    ).toBe(true);
  });
});
