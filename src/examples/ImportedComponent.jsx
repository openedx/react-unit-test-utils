import React from 'react';

/** 
 * Arbitrarily complicated child component that we want to be able to render with args without
 * running its actual logic or imports.
 */
export const ImportedComponent = () => {
  React.useEffect(() => {
    throw new Error("I should be mocked out");
  }, []);
  return (
    <div className="imported-component" />
  );
}

export default ImportedComponent;
