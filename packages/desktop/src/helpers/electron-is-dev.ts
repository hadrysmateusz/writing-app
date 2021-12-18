// Source: https://github.com/sindresorhus/electron-is-dev

import electron from "electron"

const app = electron.app /*  || electron.remote.app */

const isEnvSet = "ELECTRON_IS_DEV" in process.env
const getFromEnv =
  !!process.env.ELECTRON_IS_DEV &&
  parseInt(process.env.ELECTRON_IS_DEV, 10) === 1

export const IS_DEV = isEnvSet ? getFromEnv : !app.isPackaged

export default IS_DEV
