/* eslint-disable */
const path = require("path")
const fs = require("fs")
const { override, babelInclude } = require("customize-cra")

module.exports = (config, env) => {
	return Object.assign(
		config,
		override(
			// Make sure Babel compiles related react packages
			babelInclude([
				path.resolve("src"),
				fs.realpathSync("../core/src"),
			])
		)(config, env)
	)
}
