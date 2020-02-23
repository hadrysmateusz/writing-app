import React from "react"

const List = ({ as, ...props }) => {
	console.log("list props")
	const { attributes, children } = props
	return React.createElement(as, { ...attributes, children })
}

const NumberedList = (props) => {
	return <List {...props} as="ol" />
}

const BulletedList = (props) => {
	return <List {...props} as="ul" />
}

const ListItem = ({ attributes, children }) => {
	return <li {...attributes}>{children}</li>
}

export { NumberedList, BulletedList, ListItem }
