import { sql, QueryOptions } from '../src/index';
import { isDeepStrictEqual } from 'util';

declare global {
  namespace jest {
    interface Matchers<R> {
      equalQueries(a: QueryOptions): R;
    }
  }
}

expect.extend({
  equalQueries(received: QueryOptions, expected: QueryOptions) {
    const pass =
      isDeepStrictEqual(received.sql, expected.sql) &&
      isDeepStrictEqual(received.values, expected.values);
    if (pass) {
      return {
        message: () =>
          `expected: ${JSON.stringify(expected)}, got: ${JSON.stringify(
            received
          )}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected: ${JSON.stringify(expected)}, got: ${JSON.stringify(
            received
          )}`,
        pass: false,
      };
    }
  },
});

describe('sql tag', () => {
  it('should work for query with no parameters', () => {
    expect(sql`SELECT * FROM users;`).equalQueries({
      sql: `SELECT * FROM users;`,
      values: [],
    });
  });

  it('should add values for query with parameters', () => {
    expect(sql`SELECT * FROM users WHERE id = ${1};`).equalQueries({
      sql: `SELECT * FROM users WHERE id = ?;`,
      values: [1],
    });
  });

  it('should build nested query', () => {
    const userId: number | undefined = 1;
    const actual = sql`
    SELECT *
    FROM events
    ${
      userId
        ? sql`JOIN users_events ue
              ON (ue.event_id = events.id)
              WHERE ue.user_id = ${userId}`
        : ''
    }
    ORDER BY created_at DESC;`;

    const expected = {
      sql: `
    SELECT *
    FROM events
    ${
      userId
        ? `JOIN users_events ue
              ON (ue.event_id = events.id)
              WHERE ue.user_id = ?`
        : ''
    }
    ORDER BY created_at DESC;`,
      values: [userId],
    };

    expect(actual).equalQueries(expected);
  });

  it('should properly build query with an array parameter', () => {
    const actual = sql`
      SELECT *
      FROM users
      WHERE id IN (${[1, 2, 3]})
      ORDER BY created_at DESC;`;
    const expected = {
      sql: `
      SELECT *
      FROM users
      WHERE id IN (?)
      ORDER BY created_at DESC;`,
      values: [[1, 2, 3]],
    };
    expect(actual).equalQueries(expected);
  });
});
