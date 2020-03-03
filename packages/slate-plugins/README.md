Plugins should be self-contained plug-and-play packages containing everything needed to add given functionality to a slate app

- all overrides for props that should be added to the `<Editable />` component
- all overrides for methods on the `editor` object
- all other helpers that are needed for using the functionality in the app

They should not depend on the presence of another plugin (Unless clearly specified and set as a peer dependency)

Any non-essential features that are used to integrate with other plugins but which don't depend on them to function, (e.g. deserialization) should be exposed as a helper that should be passed to the other plugin's options. Or better yet, exposed in a different package (using a mono-repo or multi-repo approach)

All plugins using this system should have their own repositories, and can be linked from this one.

The `usePlugins` hook returns an editor object that can be wrapped with any other higher-order function in order to use plugins from outside the ecosystem.
