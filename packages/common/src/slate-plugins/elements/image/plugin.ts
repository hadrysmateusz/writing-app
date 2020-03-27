import { SlatePlugin } from "@slate-plugin-system/core"
import { ImagePluginOptions } from './types';
import { renderElementImage } from './renderElement';
import { withImage } from "./editorOverrides";

export const ImagePlugin = (options?: ImagePluginOptions): SlatePlugin => ({
  renderElement: renderElementImage(options),
  editorOverrides: withImage(options)
});
