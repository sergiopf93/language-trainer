// Test adapter only: execute the production SQL and Worker against SQLite.
// This does not claim compatibility validation of the Cloudflare runtime.
import { DatabaseSync } from 'node:sqlite';
import type { D1Database } from '@cloudflare/workers-types';
export class SqliteD1 {
  readonly sqlite = new DatabaseSync(':memory:');
  constructor() {
    this.sqlite.exec('PRAGMA foreign_keys=ON');
  }
  prepare(sql: string) {
    return new Statement(this.sqlite, sql);
  }
  async batch(statements: Statement[]) {
    this.sqlite.exec('BEGIN');
    try {
      const results = [];
      for (const statement of statements) results.push(await statement.all());
      this.sqlite.exec('COMMIT');
      return results;
    } catch (error) {
      this.sqlite.exec('ROLLBACK');
      throw error;
    }
  }
  binding() {
    return this as unknown as D1Database;
  }
  close() {
    this.sqlite.close();
  }
}
class Statement {
  constructor(
    private db: DatabaseSync,
    private sql: string,
    private values: (string | number | null)[] = [],
  ) {}
  bind(...values: (string | number | null)[]) {
    return new Statement(this.db, this.sql, values);
  }
  async all() {
    const statement = this.db.prepare(this.sql);
    const results = statement.all(...this.values);
    return { success: true, results, meta: {} };
  }
  async run() {
    return this.all();
  }
  async first(column?: string) {
    const row = this.db.prepare(this.sql).get(...this.values);
    return row ? (column ? row[column] : row) : null;
  }
}
