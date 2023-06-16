/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useRef } from 'react';
import { post } from 'axios';

import { stateFactory } from 'utils';

import * as module from './hooks';

export const state = stateFactory([
  'importedClicked',
  'fileInputChanged',
  'loaded',
  'numEvents',
]);

export const formUrl = 'localhost:18000/form-url';

export const useExampleComponentData = () => {
  const [importClicked, setImportClicked] = module.state.importedClicked(0);
  const [fileChanged, setFileChanged] = module.state.fileInputChanged(null);
  const [, setLoaded] = module.state.loaded(false);
  const [, setNumEvents] = module.state.numEvents(0);
  const fileInputRef = useRef();

  useEffect(() => {
    setLoaded(true);
  }, [setLoaded]);

  useEffect(() => {
    setNumEvents(num => num + 1);
  }, [setNumEvents, importClicked, fileChanged]);

  const handleImportedComponentClicked = () => {
    fileInputRef.current?.click();
    setImportClicked(val => val + 1);
  };
  const handleFileInputChanged = (file) => {
    if (fileInputRef.current?.files[0]) {
      const clearInput = () => { fileInputRef.current.value = null; };
      const formData = new FormData();
      formData.append('csv', fileInputRef.current.files[0]);
      post(formUrl, formData).then(clearInput);
    }
    setFileChanged(file);
  };

  return {
    fileInputRef,
    formAction: formUrl,
    handleImportedComponentClicked,
    handleFileInputChanged,
  };
};

export default useExampleComponentData;
