/**
 * Opens the given url in a popup window. If a window with the same name is already open, it will be reused, otherwise a new window will be created.
 * @param {String} url url to be opened in the popup window
 * @param {String} name name of the window to open the url in
 * @param {String} windowFeatures string of comma separated options for the popup window
 * @param {Object} windowObj the window object of the popup
 * @returns the window object of the popup
 */
export const openPopupWindow = (
  url: string,
  name: string | undefined,
  windowFeatures: string | undefined,
  windowObj: Window | null,
  onClose: (message: string) => void
): Window | null => {
  // if the window is closed or the parameter was null, try to open a new window
  if (windowObj === null || windowObj.closed) {
    windowObj = window.open(url, name, windowFeatures)
    // if the window can't be opened, exit unsuccessfully
    if (windowObj === null) {
      onClose("Window couldn't be opened")
      return null
    }
  }

  // PERF: if the window is open, check if the url has changed
  const urlHasChanged = windowObj.location.href !== url

  // open new window if it's not already open or open new url in window with the same name if url has changed
  if (urlHasChanged) {
    windowObj = window.open(url, name, windowFeatures)
    // if the window can't be opened, exit unsuccessfully
    if (windowObj === null) {
      onClose("Window couldn't be opened")
      return null
    }
  }

  // TODO: if the popup stays open the polling will continue indefinitely (see if this can be improved)
  var pollIsClosedInterval = setInterval(function () {
    if (windowObj === null || windowObj.closed) {
      clearInterval(pollIsClosedInterval)
      onClose("Unknown reason. State polling found the window closed.")
    }
  }, 1000)

  // focus the popup (might not work in all browsers)
  // windowObj.focus()

  // return the window object
  return windowObj
}
