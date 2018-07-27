import level from 'level-js';
import levelup from 'levelup';

let db = null;
export default async function getLevelDB() {
  if (!db) {
    db = levelup(level('pants-control'));
    await db.open();
  }
  return db;
}
