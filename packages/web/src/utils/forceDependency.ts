/**
 * A helper function to enforce a dependency on a value in a React hook
 * It does nothing with the value but makes sure the value doesn't get removed by accident because ESLint will scream
 * It's helpful to put a comment beside to let others or future you know why the value is required
 * @param value a value you want to force a hook dependency on
 */
export function forceDependency(_value: any) {
  // do absolutely nothing
}
