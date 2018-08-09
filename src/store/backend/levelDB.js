let db = null;
export default async function getLevelDB() {
  const level = await import('level-js');
  const levelup = await import('levelup');
  const encode = await import('encoding-down');
  if (!db) {
    db = levelup(encode(level('pants-control', { prefix: '', version: 2 }), { valueEncoding: 'json' }));
    await db.open();
  }
  return db;
}
