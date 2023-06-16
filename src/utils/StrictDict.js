/* eslint-disable no-console */
const strictGet = (target, name) => {
  if (name === Symbol.toStringTag) {
    return target;
  }

  if (name === '$$typeof') {
    return typeof target;
  }

  if (name in target || name === '_reactFragment') {
    return target[name];
  }

  console.log(name.toString());
  console.error({ target, name });
  const e = Error(`invalid property "${name.toString()}"`);
  console.error(e.stack);
  return undefined;
};

const StrictDict = (dict) => {
  if (Array.isArray(dict)) {
    return new Proxy(
      dict.reduce((obj, curr) => ({ ...obj, [curr]: curr }), {}),
      { get: strictGet },
    );
  }
  return new Proxy(dict, { get: strictGet });
};

export default StrictDict;
