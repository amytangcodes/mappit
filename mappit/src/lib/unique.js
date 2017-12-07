import uniq from 'lodash/uniq';

function uniqueByKey(data, key) {
  let values = uniq(data.map(x => x[key]));
  values.sort();
  return values;
}

export default uniqueByKey;
