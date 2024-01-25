import React from 'react';
import { render } from '@testing-library/react';

import useExampleComponentData from './hooks';
import ExampleComponent from './ExampleComponent';

jest.unmock('react');
jest.unmock('@openedx/paragon');
jest.mock('./ImportedComponent', () => 'imported-component');
jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));

const props = {
  fileInputRef: { current: { click: jest.fn() }, useRef: jest.fn() },
  formAction: 'test-form-action',
  handleClickImportGrades: jest.fn(),
  handleFileInputChange: jest.fn(),
};
useExampleComponentData.mockReturnValue(props);

let el;
describe('ImportGradesButton ref test', () => {
  it('loads ref from hook', () => {
    el = render(<ExampleComponent />);
    const input = el.getByTestId('file-control');
    expect(input).toEqual(props.fileInputRef.current);
  });
});
