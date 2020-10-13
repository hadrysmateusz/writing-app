/**
 * Helper function for use in the 'match' option.
 * It's a higher-order function that returns a matcher function checking the node's type
 */
export const matchType = (type) => {
  return (n) => n.type === type
}
