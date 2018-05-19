import level from 'level-js';
import Promise from 'bluebird';

let db = null;
export default async function getLevelDB() {
  if (!db) {
    db = level('pants-control');
    Promise.promisifyAll(db);
    await db.openAsync();
  }
  return db;
}
