import React from 'react';
import { formatMessage, shallow } from 'testUtils';
import { Form } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import ImportedComponent from './ImportedComponent';
import useExampleComponentData from './hooks';
import ExampleComponent, { testIds } from './ExampleComponent';
import messages from './messages';

jest.mock('./ImportedComponent', () => 'ImportedComponent');
jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));

let el;
let inst;
let hookProps;
describe('ExampleComponent component', () => {
  beforeAll(() => {
    hookProps = {
      fileInputRef: { current: null },
      gradeExportUrl: 'test-grade-export-url',
      handleClickImportGrades: jest.fn().mockName('hooks.handleClickImportGrades'),
      handleFileInputChange: jest.fn().mockName('hooks.handleFileInputChange'),
    };
    useExampleComponentData.mockReturnValue(hookProps);
    el = shallow(<ExampleComponent />);
  });
  describe('behavior', () => {
    it('initializes hooks', () => {
      expect(useExampleComponentData).toHaveBeenCalledWith();
      expect(useIntl).toHaveBeenCalledWith();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el.snapshot).toMatchSnapshot();
    });
    describe('output', () => {
      beforeEach(() => {
        inst = el.instance;
      });
      /*
      test('Form', () => {
        const control = inst.findByType(Form)[0];
        expect(control.props.action).toEqual(hookProps.formAction);
      });
      */
      test('FileControl', () => {
        const control = inst.findByTestId(testIds.fileControl)[0];
        expect(control.props.onChange).toEqual(hookProps.handleFileInputChange);
      });
      /*
      test('imported component', () => {
        const control = inst.findByType(ImportedComponent)[0];
        expect(control.props.onClick).toEqual(hookProps.handleClickImportedComponent);
      });
      test('random', () => {
        const control = inst.findByType('div')[0];
        expect(control.matches(shallow(
          <div>
            <h1>{formatMessage(messages.heading)}</h1>
            <span>{formatMessage(messages.span)}</span>
          </div>,
        ))).toEqual(true);
      });
      */
    });
  });
});
