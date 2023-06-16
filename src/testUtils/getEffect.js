import React from 'react';
import { isEqual } from 'lodash';

/**
 * getEffect(prereqs)
 * Returns the callback passed to useEffect mock call with the given prerequisites key,
 * or null if none match.
 *
 * @param {any[]} prereqs - unique prerequisite list identifying the target useEffect call
 * @return {function} - callback method passed for the effect hook.
 */
const getEffect = (prereqs) => {
  const { calls } = React.useEffect.mock;
  const match = calls.filter(call => isEqual(call[1], prereqs));
  return match.length ? match[0][0] : null;
};

export default getEffect;
