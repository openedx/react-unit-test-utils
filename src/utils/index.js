import React from 'react';

export { default as StrictDict } from './StrictDict';
export { default as keyStore } from './keyStore';

export const useKeyedState = (_, val) => React.useState(val);
