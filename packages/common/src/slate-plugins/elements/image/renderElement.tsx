import { getRenderElement } from '@slate-plugin-system/core';
import { ImageElement } from './components';
import { IMAGE } from './types';

export const renderElementImage = getRenderElement({
  type: IMAGE,
  component: ImageElement,
});
