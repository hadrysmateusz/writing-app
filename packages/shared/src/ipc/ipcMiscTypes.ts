import { IpcResponseTypes } from "./ipcResponseTypes"

export enum IpcResponseStatus {
  SUCCESS = "success",
  ERROR = "error",
  CANCELED = "canceled",
}

export type IpcResponseObject<DataType extends {} | null = null> =
  | {
      status: IpcResponseStatus.SUCCESS
      data: DataType
      error: null
    }
  | {
      status: IpcResponseStatus.ERROR
      data: null
      error: any
    }
  | {
      status: IpcResponseStatus.CANCELED
      data: null
      error: null
    }

export type IpcChannels = keyof IpcResponseTypes
