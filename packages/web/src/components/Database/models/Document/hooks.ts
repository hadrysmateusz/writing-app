// Hook to update the modifiedAt field on every update
export const createDocumentPreSaveHook = () => async (data, _doc) => {
  // TODO: check for changes, if there aren't any, don't update the modifiedAt date
  data.modifiedAt = Date.now()
  data.titleSlug = `${
    data.title.trim() === "" ? "untitled" : data.title.trim().toLowerCase()
  } ${Date.now()}`.trim()
}
