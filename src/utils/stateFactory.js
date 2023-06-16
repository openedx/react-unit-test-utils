import React from 'react';
import StrictDict from './StrictDict';

const stateFactory = (mapping) => StrictDict(Object.keys(StrictDict(mapping)).reduce(
  (curr, stateKey) => ({ ...curr, [stateKey]: (val) => React.useState(val) }),
  {},
));

export default stateFactory;
