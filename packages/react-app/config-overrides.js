/* eslint-disable */
const path = require("path")
const fs = require("fs")
const { override, babelInclude } = require("customize-cra")

module.exports = (config, env) => {
	return Object.assign(
		config,
		override(
			babelInclude([
				path.resolve("src"),
				fs.realpathSync("../react-components/src") // Make sure Babel compiles the shared components
			])
		)(config, env)
	)
}
