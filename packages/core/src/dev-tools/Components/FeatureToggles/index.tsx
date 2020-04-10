import React from "react"
import { config, enable, disable } from "../../Lib/config"

function FeatureToggle({ name }) {
	const [feature, setFeature] = React.useState(config[name])

	React.useEffect(() => {
		if (feature) {
			enable(name)
		} else {
			disable(name)
		}
	}, [feature, name])

	return (
		<div>
			<label>
				Enable {name}:{" "}
				<input
					type="checkbox"
					checked={feature}
					onChange={(e) => setFeature(e.target.checked)}
				/>
			</label>
		</div>
	)
}

export function FeatureToggles() {
	return (
		<>
			{Object.keys(config).map((key) => (
				<FeatureToggle key={key} name={key} />
			))}
		</>
	)
}
