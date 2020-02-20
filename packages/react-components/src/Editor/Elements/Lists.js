import React from "react"

const List = ({ as, ...props }) => {
	return React.createElement(as, props)
}

const NumberedList = (props) => {
	return <List {...props} as="ol" />
}

const BulletedList = (props) => {
	return <List {...props} as="ul" />
}

const ListItem = (props) => {
	return <li {...props} />
}

export { NumberedList, BulletedList, ListItem }
