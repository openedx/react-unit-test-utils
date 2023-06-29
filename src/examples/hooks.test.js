import React from 'react';
import * as axios from 'axios';
import { getEffects, mockUseKeyedState } from 'testUtils';

import * as hooks from './hooks';

const { useExampleComponentData } = hooks;
const state = mockUseKeyedState(hooks.stateKeys);

jest.mock('axios', () => ({ post: jest.fn() }));

let out;

// Simple fake api fetch method.
let postThen;
axios.post.mockReturnValue(new Promise(resolve => { postThen = resolve; }));

// Simple fake form data for submission.
const testFile = 'test-file';
const testFormData = new FormData();
testFormData.append('csv', testFile);

// Mock ref for shallow testing, to allow hooks to access as normal.
const ref = {
  current: { click: jest.fn(), files: [testFile], value: 'test-value' },
};

describe('ExampleComponent hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    React.useRef.mockReturnValue(ref);
  });
  describe('useExampleComponentData hook', () => {
    beforeEach(() => {
      /**
       * Mock state for all hooks that *use* state fields
       */
      state.mock();
      out = useExampleComponentData();
    });
    describe('behavior', () => {
      it('initializes state fields', () => {
        /**
         * Use expectInitializedWith to validate initialization calls
         */
        state.expectInitializedWith(state.keys.importedClicked, 0);
        state.expectInitializedWith(state.keys.fileInputChanged, null);
        state.expectInitializedWith(state.keys.loaded, false);
        state.expectInitializedWith(state.keys.numEvents, 0);
      });
      it('initializes react ref', () => {
        expect(React.useRef).toHaveBeenCalled();
      });
      it('sets loaded to true on initialization', () => {
        /**
         * Use getEffects to load callback passed to useEffect based on prerequisite array
         */
        const cb = getEffects([state.setState.loaded], React)[0];
        cb();
        /**
         * use expectSetStateCalledWith to validate setState calls.
         */
        state.expectSetStateCalledWith(state.keys.loaded, true);
      });
      it('increments numEvents on importClicked or fileChanged', () => {
        /**
         * Use getEffects to load callback passed to useEffect based on prerequisite array
         */
        const cb = getEffects([
          state.setState.numEvents,
          state.values.importedClicked,
          state.values.fileInputChanged,
        ], React)[0];
        cb();
        /**
         * For complex setState calls (called with a method), access setState call
         * from state object and test by callback.
         */
        expect(state.setState.numEvents).toHaveBeenCalled();
        const stateCb = state.setState.numEvents.mock.calls[0][0];
        expect(stateCb(1)).toEqual(2);
        expect(stateCb(5)).toEqual(6);
      });
    });
    describe('output', () => {
      describe('handleImportedComponentClicked', () => {
        /**
         * Mock ref behavior on per-test basis if needed to validate behavior
         */
        it('clicks the file input if populated', () => {
          out.handleImportedComponentClicked();
          expect(ref.current.click).toHaveBeenCalled();
        });
        it('does not crash if no file input available', () => {
          React.useRef.mockReturnValueOnce({ current: null });
          out = useExampleComponentData();
          out.handleImportedComponentClicked();
          expect(ref.current.click).not.toHaveBeenCalled();
        });
      });
      describe('handleFileInputChanged', () => {
        it('does not crash if no file input available', () => {
          React.useRef.mockReturnValueOnce({ current: null });
          out = useExampleComponentData();
          out.handleFileInputChanged();
        });
        it('posts formData, clearingInput on success', async () => {
          out.handleFileInputChanged(testFile);
          const [[url, data]] = axios.post.mock.calls;
          expect(url).toEqual(hooks.formUrl);
          expect(data.entries).toEqual(testFormData.entries);
          await postThen();
          expect(out.fileInputRef.current.value).toEqual(null);
        });
      });
      it('passes fileInputRef from hook', () => {
        expect(out.fileInputRef).toEqual(ref);
      });
      it('passes hooks.formUrl from hook', () => {
        expect(out.formAction).toEqual(hooks.formUrl);
      });
    });
  });
});
