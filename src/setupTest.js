jest.mock('@edx/frontend-platform/i18n', () => {
  const i18n = jest.requireActual('@edx/frontend-platform/i18n');
  const { formatMessage } = jest.requireActual('testUtils');
  return {
    ...i18n,
    useIntl: jest.fn(() => ({ formatMessage })),
    defineMessages: m => m,
  };
});

jest.mock('@edx/paragon', () => jest.requireActual('testUtils').mockComponents({
  Form: {
    Control: 'Form.Control',
    Group: 'Form.Group',
  },
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn((cb, prereqs) => ({ useEffect: { cb, prereqs } })),
  useRef: jest.fn((val) => ({ current: val, useRef: true })),
}));
