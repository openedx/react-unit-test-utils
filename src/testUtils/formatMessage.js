import React from 'react';

/**
 * Mocked formatMessage provided by react-intl
 */
export const formatMessage = (msg, values) => {
  let message = msg.defaultMessage;
  if (values === undefined) {
    return message;
  }
  // check if value is not a primitive type.
  if (Object.values(values).filter(value => Object(value) === value).length) {
    // eslint-disable-next-line react/jsx-filename-extension
    return <format-message-function {...{ message: msg, values }} />;
  }
  Object.keys(values).forEach((key) => {
    // eslint-disable-next-line
    message = message.replaceAll(`{${key}}`, values[key]);
  });
  return message;
};

export default formatMessage;
