/**
 * Checks if the app is running in a local environment like localhost
 */
export const isLocalhost = () => {
  const hostname = window.location.hostname
  if (
    ["localhost", "[::1]", ""].includes(hostname) ||
    hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  ) {
    return true
  } else {
    return false
  }
}
