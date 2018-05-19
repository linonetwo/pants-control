import level from 'level-js';
import { promisifyAll } from 'bluebird';

let db = null;
export default function getLevelDB() {
  if (!db) {
    db = level('pants-control');
    promisifyAll(db);
  }
  return db;
}
