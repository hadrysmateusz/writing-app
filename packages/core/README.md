## Symbolic links

Currently using generated models from aws amplify's graphql api requires using symbolic links

TODO: replace the "link-models" npm script with a cross-platform script (possibly node-based)
Investigate these scripts for the above purpose: https://geedew.com/cross-platform-symlink/

## Basic link commands (in packages/core/src directory):

**WIN**: mklink /d models D:\work\writing-tool\packages\web\src\models
**LINUX**: ln -s ../../web/src/models models

## Basic unlink commands (in packages/core/src directory)

**WIN** rmdir models
**LINUX** unlink models
