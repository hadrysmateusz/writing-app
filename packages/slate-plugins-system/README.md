## Overview

Plugins should be self-contained plug-and-play packages containing everything needed to add given functionality to a slate app

- all overrides for props that should be added to the `<Editable />` component
- all overrides for methods on the `editor` object
- all other helpers that are needed for using the functionality in the app

They should not depend on the presence of another plugin (Unless clearly specified and set as a peer dependency)

Any non-essential features that are used to integrate with other plugins but which don't depend on them to function, (e.g. deserialization) should be exposed as a helper that should be passed to the other plugin's options. Or better yet, exposed in a different package (using a mono-repo or multi-repo approach)

All plugins using this system should have their own repositories, and can be linked from this one.

## How to use

Plugins are functions that return an object containing all overrides necessary to implement some functionality. Some Plugins take options as arguments. You should create an array containing all of your plugins which you will need to use in two places:

- the `useCreateEditor` hook
- the `<Editable />` component's `plugins` prop

**Important**: keep the plugins array constant by either declaring it outside a React component or in a useMemo hook.

### useCreateEditor

A hook which takes an array of plugins as an argument and returns a memoized editor object (just like Slate's createEditor function).

It automatically wraps the editor with any `editorOverrides` from your plugins. If you have any other [vanilla Slate plugins](https://docs.slatejs.org/concepts/07-plugins) you can either wrap the editor object with them like you would in a regular Slate project, or create a new plugin for them.

```js
// All of these are correct

const HistoryPlugin = () => ({ editorOverrides: withHistory })

const plugins = [LinkPlugin(), HistoryPlugin(), { editorOverrides: withImages }]
```

### Editable Component

The PluginSystem exposes an `<Editable />` component that is a wrapper around Slate's `<Editable />` component. It functions similarly to it with some notable exceptions.

It accepts an additional `plugins` prop that takes an array of plugins.

The following properties accept arrays of functions instead of a single function:

- decorate
- renderLeaf
- renderElement
- onKeyDown
- onDOMBeforeInput

All of the overrides from the above props and those contained in plugins will be merged and applied automatically. Make sure to check what functions you pass into the above props to avoid conflicts.

## Todo

- Move all of the plugins into a separate monorepo with all plugins being separate packages
- Consider making (almost) everything overridable (including the component and type in the plugin options). It would require putting everything through the plugin including the type(s).
