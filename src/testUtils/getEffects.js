import { isEqual } from 'lodash';
/**
 * getEffect(prereqs, reactModule)
 * Returns the callbacks passed to useEffect mock call with the given prerequisites key,
 * or null if none match.
 *
 * @param {any[]} prereqs - unique prerequisite list identifying the target useEffect call
 * @param {object} reactModule - react module to be mocked.
 * @return {function} - callback method passed for the effect hook.
 */
const getEffects = (prereqs, reactModule) => {
  const { calls } = reactModule.useEffect.mock;
  const match = calls.filter(call => isEqual(call[1], prereqs));
  return match.length ? match[0] : null;
};

export default getEffects;
