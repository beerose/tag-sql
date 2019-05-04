// @types/mysql QueryOptions
export type QueryOptions = {
  sql: string;
  values: unknown[];
};

const brand = Symbol('sql-brand');

interface InterpolationResult extends QueryOptions {
  [brand]: typeof brand;
}

function isInterpolationResult(x: unknown): x is InterpolationResult {
  return typeof x === 'object' && x !== null && (x as any)[brand] === brand;
}

export function sql(
  strings: TemplateStringsArray,
  ...keys: unknown[]
): InterpolationResult {
  const sqlParts: string[] = [];
  const values: unknown[] = [];

  // tslint:disable-next-line:no-increment-decrement
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    if (isInterpolationResult(key)) {
      sqlParts.push(strings[i], key.sql);
      values.push(...key.values);
    } else {
      sqlParts.push(strings[i], '?');
      values.push(key);
    }
  }

  sqlParts.push(strings[keys.length]);

  return {
    values,
    [brand]: brand,
    sql: sqlParts.join(''),
  };
}

sql.empty = sql``;
