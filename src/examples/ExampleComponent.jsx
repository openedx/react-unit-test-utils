import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';

import { Form } from '@openedx/paragon';

import { StrictDict } from 'utils';
import ImportedComponent from './ImportedComponent';
import messages from './messages';
import useExampleComponentData from './hooks';

export const testIds = StrictDict({
  fileControl: 'file-control',
});

export const ExampleComponent = () => {
  const {
    fileInputRef,
    handleClickImportedComponent,
    handleFileInputChange,
    formAction,
  } = useExampleComponentData();
  const { formatMessage } = useIntl();
  return (
    <>
      <Form action={formAction} method="post">
        <Form.Group controlId="csv">
          <Form.Control
            type="file"
            data-testid={testIds.fileControl}
            label={formatMessage(messages.fileControlLabel)}
            onChange={handleFileInputChange}
            ref={fileInputRef}
          />
        </Form.Group>
      </Form>
      <ImportedComponent
        className="imported-component"
        label={messages.importedComponentLabel}
        onClick={handleClickImportedComponent}
      />
      <div>
        <h1>{formatMessage(messages.heading)}</h1>
        <span>{formatMessage(messages.span)}</span>
      </div>
    </>
  );
};
ExampleComponent.propTypes = {};

export default ExampleComponent;
