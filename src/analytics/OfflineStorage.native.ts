import { AbstractCallMetric } from 'api';
import Storage from '../helpers/Storage';

let cache: any[] = [];

const initialize = async () => {
  cache = await readRecords();
};

const readRecords = async () => {
  const data = Storage.get('offline-packets');
  if (!data) {
    return [];
  }
  return JSON.parse(data);
};

const saveRecords = async (records: any[]) => {
  try {
    Storage.set('offline-packets', JSON.stringify(records));
    cache = records;
  } catch (e) {
    console.log(e);
    console.log('error inserting ', records);
  }
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
  Storage.remove('offline-packets');
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
