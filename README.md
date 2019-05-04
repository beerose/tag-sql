# tag-sql

![npm](https://img.shields.io/npm/v/tag-sql.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/tag-sql.svg?color=purple)

Build sql queries for mysqljs in a safe and comfortable way 💥

---

**tag-sql** allows to pass query parameters directly to the query string.
It's the alternative for parametrized queries.

```js
const userId = 1;
sql`SELECT * FROM users WHERE id = ${userId};`;
```

It'll be converted to the the object of type `QueryOptions` that is accepted by **mysqljs**.

```js
{
  sql: SELECT * FROM users WHERE id = ?;,
  values: [userId],
}
```

## Instalation

```sh
yarn add tag-sql --dev
```

## Local Development

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Project will be rebuilt upon changes.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.
