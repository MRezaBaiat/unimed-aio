import localForage from 'localforage';
import { AbstractCallMetric } from 'api';
const storage = localForage.createInstance({
  name: 'offline-packets',
  storeName: 'offline-packets',
  driver: localForage.INDEXEDDB,
  version: 1.0,
});

let cache: any[] = [];

const initialize = async () => {
  await storage.ready();
  cache = await readRecords();
};

const readRecords = async () => {
  const data = await storage.getItem('offline-packets');
  if (!data) {
    return [];
  }
  return JSON.parse(data);
};

const saveRecords = async (records: any[]) => {
  await storage.setItem('offline-packets', JSON.stringify(records));
  cache = records;
};

const insert = async (record: AbstractCallMetric<any>) => {
  if (cache.includes(record)) {
    return;
  }
  await saveRecords([...cache, record]);
};

const getFirst = async (): Promise<AbstractCallMetric<any> | undefined> => {
  return cache[0];
};

const getAll = async (): Promise<AbstractCallMetric<any>[]> => {
  return cache;
};

const remove = async (record) => {
  cache.splice(cache.indexOf(record), 1);
  await saveRecords(cache);
};

const clear = async () => {
  await storage.removeItem('offline-packets');
  cache = [];
};

export default {
  initialize,
  remove,
  getFirst,
  insert,
  getAll,
  clear,
};
