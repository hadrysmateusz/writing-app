This package depends on the `soft-break` plugin.

I might want to actually remove this dependency when publishing - and replace with an implicit dependency:

- Replace SoftBreakEditor type with `Editor & { insertSoftBreak(): void }`
- Let the plugin user know that the plugin depends on the presence of `insertSoftBreak()` on the editor and maybe provide a small helper to implement it
- recommend the `soft-break` plugin for easier integration