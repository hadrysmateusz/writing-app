import {
  WatcherAddEvent,
  WatcherDirEvent,
  WatcherFileEvent,
  WatcherUnlinkEvent,
} from "shared"

export const isFileEvent = (eventType: string): eventType is WatcherFileEvent =>
  eventType === "add" || eventType === "unlink"

export const isDirEvent = (eventType: string): eventType is WatcherDirEvent =>
  eventType === "addDir" || eventType === "unlinkDir"

export const isAddEvent = (eventType: string): eventType is WatcherAddEvent =>
  eventType === "add" || eventType === "addDir"

export const isUnlinkEvent = (
  eventType: string
): eventType is WatcherUnlinkEvent =>
  eventType === "unlink" || eventType === "unlinkDir"
