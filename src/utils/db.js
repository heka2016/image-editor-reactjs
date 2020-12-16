import Dexie from 'dexie';

const db = new Dexie('myImages');
db.version(1).stores({
    images: `++id, name, data`
});

export default db;
