export interface BuildListQueryOptions {
  filterKeys?: string[];
  searchFields?: string[];
}

export abstract class PrismaRepositoryBase {
  protected buildListQuery(
    params: Record<string, unknown> | undefined,
    options: BuildListQueryOptions,
  ): { where?: Record<string, unknown>; skip?: number; take?: number } {
    const safeParams = params ?? {};
    const where: Record<string, unknown> = {};

    for (const key of options.filterKeys ?? []) {
      const value = safeParams[key];

      if (value !== undefined) {
        where[key] = value;
      }
    }

    const busqueda =
      typeof safeParams.busqueda === 'string' ? safeParams.busqueda.trim() : '';

    if (busqueda && (options.searchFields?.length ?? 0) > 0) {
      where.OR = options.searchFields?.map((field) => ({
        [field]: {
          contains: busqueda,
          mode: 'insensitive',
        },
      }));
    }

    const pagina = this.parsePositiveInteger(safeParams.pagina);
    const limite = this.parsePositiveInteger(safeParams.limite);

    return {
      where: Object.keys(where).length > 0 ? where : undefined,
      skip: pagina && limite ? (pagina - 1) * limite : undefined,
      take: limite,
    };
  }

  protected omitUndefined<T extends Record<string, unknown>>(data: T): T {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as T;
  }

  private parsePositiveInteger(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsedValue = Number(value);

      if (Number.isInteger(parsedValue) && parsedValue > 0) {
        return parsedValue;
      }
    }

    return undefined;
  }
}
