# Electron

Removing electron from the core package should be investigated. Either through Code-Splitting or by moving all electron-related logic to the desktop package - this might require having desktop to use a different react app - with most components coming from the core package and electron-specific ones along with some setup coming from the desktop package itself.

# Symbolic links

Currently using generated models from aws amplify's graphql api requires using symbolic links

TODO: replace the "link-models" npm script with a cross-platform script (possibly node-based)
Investigate these scripts for the above purpose: https://geedew.com/cross-platform-symlink/

## Basic link commands (in packages/core/src directory):

**WIN**: mklink /d models D:\work\writing-tool\packages\web\src\models

**LINUX**: ln -s ../../web/src/models models

## Basic unlink commands (in packages/core/src directory)

**WIN** rmdir models

**LINUX** unlink models
