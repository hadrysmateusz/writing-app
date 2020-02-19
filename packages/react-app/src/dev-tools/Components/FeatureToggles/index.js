import React from "react"
import featureToggles, { enable, disable } from "../../featureToggles"

function FeatureToggle({ name }) {
	const [feature, setFeature] = React.useState(featureToggles[name])

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

function FeatureToggles() {
	return (
		<>
			{Object.keys(featureToggles).map((key) => (
				<FeatureToggle name={key} />
			))}
		</>
	)
}

export default FeatureToggles
