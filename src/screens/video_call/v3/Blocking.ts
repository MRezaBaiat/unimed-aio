const blockers: { [key: string]: (() => Promise<any>)[] } = {};

export function block<T>(tag: string, cb: () => Promise<T>) {
  if (blockers[tag] && blockers[tag].length > 0) {
    return blockers[tag].push(cb);
  }
  blockers[tag] = blockers[tag] || [];
  blockers[tag].push(cb);
  run(tag, cb);
}

function run(tag, cb: () => Promise<any>) {
  cb().finally(() => {
    blockers[tag].splice(blockers[tag].indexOf(cb), 1);
    if (blockers[tag].length > 0) {
      run(tag, blockers[tag][0]);
    }
  });
}

export default {
  block,
};
