# react-unit-test-utils

Library for maintaining tools to allow simple unit testing of React apps.

The purpose of this library is to support testing patterns for react apps that focus on isolated unit tests and component snapshots.
It provides a shallow renderer similar to Enzyme's, build from `react-test-renderer`, as well as a number of utilities focused on providing support for a react unit-testing ecosystem

## Utilities

### `shallow` - Shallow Renderer
Provides a shallow render of a given react component.  
#### Usage
import renderer
```js
import { shallow } from '@edx/react-unit-test-utils';
```
Mock local components for shallow rendering
```js
jest.mock('./LocalComponent', () => 'LocalComponent');
```
Mock used component libraries (such as paragon) using provide `mockComponents` utility (see below).

Generate render element
```js
const el = shallow(<MyComponent {...props} />);
```
Validate snapshots
```js
expect(el.snapshot).toMatchSnapshot();
expect(el.instance.findByType(LocalComponent)[0].snapshot).toMatchSnapshot();
```
Inspect rendered component props and children.
```js
const localChild = el.instance.findByType(LocalComponent)[0];
const localDiv = el.instance.findByType('div')[0];
const localTestEl = el.instance.findByType('my-test-id')[0];
// returned object is of the shape { props, type, children }
expect(localChild.props.label).toEqual(myLabel);
expect(localDiv.children[0].type).toEqual('h1');
expect(localDiv.children[0].matches(<h1>My Header</h1>)).toEqual(true);
```

### `mockComponents` - Component library mocking utility
Component library mocking utility intended for imported libraries of many complex components to be mocked.

#### Usage
```js
jest.mock('@edx/paragon', () => jest.requireActual('@edx/react-unit-test-utils').mockComponents({
  Button: 'Button',
  Icon: 'Icon',
  Form: {
    Group: 'Form.Group',
    Control: 'Form.Control',
  },
}));

// Provides mocks for <Button>, <Icon>, <Form>, <Form.Group>, and <Form.Control> with appropriate mocks to appear legibly in the snapshot.
```
### `stateFactory`and `mockUseState` - React state hook factory and testing utility
This is a pair of methods to test react useState hooks, which are otherwise somewhat problematic to test directly.
#### Usage
Define a state factory in your hooks module.
__Note__ the name of the `state` object is important here for the mocking utility.
```js
import { stateFactory } from '@edx/react-unit-test-utils';
const state = stateFactory([
  'field1',
  'field2',
  'field3',
]);  // returns an object of state hooks of the form: `state.field1 = (val) => React.useState(val)`
```
When using the state hooks, use the *exported* version of the object so that it can be appropriately mocked for testing
```js
import { stateFactory } from '@edx/react-unit-test-utils';
import * as module from './hooks';
const state = stateFactory(['field1', 'field2', 'field3']);
const useMyComponentData = () => {
  const [field1, setField1] = state.field1(initialValue);
};
```
When testing, initialize mock state utility outside of your tests
```js
import { mockUseState } from '@edx/react-unit-test-utils';
import * as hooks from './hooks';
const state = mockUseState(hooks);
```
Verify the state keys
```js
// state.keys is a StrictDict, which will complain if called with an invalid key.
state.testStateFactory([ state.keys.field1, state.keys.field2, state.keys.field3 ]);
```
For hooks that use these state hooks, first mock the state object for that test, and then test initialization arguments.
```js
state.mock();
const out = myHook();
state.expectInitializedWith(state.keys.field1, initialValue);
```
setState object contains jest functions for each state key.
Access setState object to validate changes and track effects/callbacks.
```js
state.mock();
const out = myHook();
expect(out.setField1).toEqual(state.setState.field1);
out.handleClick(); // out.handleClick = () => { setField2(null); }
expect(state.setField.field2).toHaveBeenCalledWith(null);
```
### `getEffect` - React useEffect hook testing utility method.
Simple utility for grabbing a useEffect call based on a list of prerequisite values.
#### Usage
```js
import { getEffect } from '@edx/react-unit-test-utils';

const useMyHook = ({ val0, val1, method1 }) => {
  useEffect(() => {
    method1(val0);
  }, []);
  useEffect(() => {
    method1(val1);
  }, [val1, method1]);
};

describe('useMyHook', () => {
  describe('behavior', () => {
    const val0 = 'initial-value';
    const val1 = 'test-value';
    const method1 = jest.fn();
    beforeEach(() => { jest.clearAllMocks(); });
    it('calls method1 with val0 on initial load', () => {
      useMyHook({ val0, val1, method1 });
      const cb = getEffect([]);
      cb();
      expect(method1).toHaveBeenCalledWith(val0);
    });
    it('calls method1 with val1 when either changes', () => {
      useMyHook({ val0, val1, method1 });
      const cb = getEffect([val1, method1]);
      cb();
      expect(method1).toHaveBeenCalledWith(val1);
    });
  });
});
```
### `formatMessage` - i18n mocking method
Simple mocking utility for i18n libraries.
#### Usage
mock react-intl or @edx/frontend-platform/i18n (preferably in setupTest.js
```js
jest.mock('@edx/frontend-platform/i18n', () => ({
  formatMessage: jest.requireActual('@edx/react-unit-test-utils').formatMessage,
}));
```
import for validation against shallow renders.
```js
import { shallow, formatMessage } from '@edx/react-unit-test-utils';
...
expect(el.children[0]).toEqual(formatMessage(myMessage));
```
### `StrictDict` and `keyStore` - Strict dictionary for keystore referencing
Defines object that complain when called with invalid keys. useful for when using defined modules, where you want to treat invalid keys as an error behavior (such as when using an object as a key-store).  Primarily, this is a method to avoid using "magic strings" in javascript code and tests.
#### Usage
Wrap an object in StrictDict, and it will raise an error if called with invalid keys.
```js
const selectors = StrictDict({
  validSelector1: () => ({}),
  validSelector2: () => ({}),
});
const selector = selectors.invalidSelector; // raises an error
```
use `keyStore` to quickly grab the keys from an object or StrictDict as a StrictDict themselves.
```js
const selectorKeys = keyStore(selectors);
selectorKeys.validSelector1; // 'validSelector1';
selectorKeys.invalidSelector; // raises an error;
```
