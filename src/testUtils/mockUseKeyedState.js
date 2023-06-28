import * as utils from '../utils';

/**
 * Mock utility for working with useState in a hooks module.
 * Expects/requires an object containing the state object in order to ensure
 * the mock behavior works appropriately.
 *
 * Expected format:
 *   hooks = { state: { <key>: (val) => React.createRef(val), ... } }
 *
 * Returns a utility for mocking useState and providing access to specific state values
 * and setState methods, as well as allowing per-test configuration of useState value returns.
 *
 * Example usage:
 *   // hooks.js
 *   import * as module from './hooks';
 *   import { useKeyedState, StrictDict } from '@edx/react-unit-test-utils';
 *
 *   const stateKeys = StrictDict({
 *     isOpen: 'isOpen',
 *     hasDoors: 'hasDoors',
 *     selected: 'selected',
 *   });
 *   ...
 *   export const exampleHook = () => {
 *     const [isOpen, setIsOpen] = useKeyedState(stateKeys.isOpen, false);
 *     const handleClickOpen = () => {
 *       setIsOpen(true);
 *     };
 *     if (!isOpen) { return null; }
 *     return { isOpen, setIsOpen, handleClickOpen };
 *   }
 *   ...
 *
 *   // hooks.test.js
 *   import * as hooks from './hooks';
 *   import { mockUseKeyedState } from '@edx/react-unit-test-utils';
 *   const state = mockUseKeyedState(hooks.stateKeys)
 *   ...
 *   describe('exampleHook', () => {
 *     let out;
 *     beforeEach(() => {
 *       state.mock();
 *       out = exampleHook();
 *     });
 *     describe('behavior', () => {
 *       it('initializes state hooks', () => {
 *         state.expectInitializedWith(state.keys.isOpen, false);
 *       });
 *     });
 *     describe('output', () => {
 *       it('returns null if isOpen is default value', () => {
 *         expect(out).toEqual(null);
 *       });
 *       describe('if isOpen is not false', () => {
 *         beforeEach(() => {
 *           state.mockVal(state.keys.isOpen, true);
 *           out = exampleHook();
 *         });
 *         it('forwards isOpen and setIsOpen from state hook', () => {
 *           expect(out.isOpen).toEqual(state.values.isOpen);
 *           expect(out.setIsOpen).toEqual(state.setState.isOpen);
 *         });
 *         test('handleClickOpen sets isOpen to true', () => {
 *           out.handleClickOpen();
 *           state.expectSetStateCalledWith(state.keys.isOpen, true);
 *         });
 *       });
 *     });
 *     afterEach(() => { state.restore(); });
 *   });
 *
 * @param {obj} hooks - hooks module containing a 'state' object
 */
export class MockUseKeyedState {
  constructor(stateKeys) {
    this.keys = stateKeys;
    this.hookSpy = jest.spyOn(utils, 'useKeyedState');
    this.values = {};
    this.initValues = {};
    this.setState = {};

    this.mock = this.mock.bind(this);
    this.restore = this.restore.bind(this);
    this.mockVal = this.mockVal.bind(this);
    this.setup = this.setup.bind(this);
    this.mockHook = this.mockHook.bind(this);
    this.mockVals = this.mockVals.bind(this);
    this.resetVals = this.resetVals.bind(this);
    this.setup();
  }

  setup() {
    this.values = {};
    this.initValues = {};
    this.setState = {};
    Object.keys(this.keys).forEach((key) => {
      this.values[key] = null;
      this.setState[key] = jest.fn((val) => {
        this.values[key] = val;
      });
    });
  }

  mockHook(key, val) {
    this.initValues[key] = val;
    return [this.values[key], this.setState[key]];
  }

  /**
   * Replace the hook module's state object with a mocked version, initialized to default values.
   */
  mock() {
    this.hookSpy.mockImplementation(this.mockHook);
  }

  /**
   * Mock the state getter associated with a single key to return a specific value one time.
   *
   * @param {string} mockKey - state key (from this.keys)
   * @param {any} val - new value to be returned by the useState call.
   */
  mockVal(mockKey, val) {
    this.hookSpy.mockImplementationOnce((key) => {
      if (key === mockKey) {
        return [val, this.setState[key]];
      }
      return this.mockHook(key);
    });
  }

  /**
   * Mock the state getters associated with set of single keys to return specific values one time.
   *
   * @param {object} mapping - { <stateKey>: <val to return> }
   */
  mockVals(mapping) {
    this.hookSpy.mockImplementation((key) => {
      if (mapping[key]) {
        return [mapping[key], this.setState[key]];
      }
      return this.mockHook(key);
    });
  }

  /**
   * Reset hook value mappings after multi-value override
   */
  resetVals() {
    this.hookSpy.mockImplementation(this.mockHook);
  }

  /**
   * Restore the hook module's state object to the actual code.
   */
  restore() {
    this.hookSpy.mockRestore();
  }

  expectInitializedWith(key, value) {
    expect(this.initValues[key]).toEqual(value);
  }

  expectSetStateCalledWith(key, value) {
    expect(this.setState[key]).toHaveBeenCalledWith(value);
  }
}

export const mockUseKeyedState = (stateKeys) => new MockUseKeyedState(stateKeys);

export default mockUseKeyedState;
