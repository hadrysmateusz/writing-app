import React from "react"
import styled from "styled-components"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { Editor } from "@writing-tool/react-components"

import { FirebaseProvider } from "Components"
import { MediumAuthRedirectPage } from "Pages"

function App() {
	return (
		<Router>
			<FirebaseProvider>
				<Container>
					<Switch>
						<Route path="/medium-auth-callback">
							<MediumAuthRedirectPage />
						</Route>
						<Route path="/">
							<h1>Writing Tool</h1>
							<Editor />
						</Route>
					</Switch>
				</Container>
			</FirebaseProvider>
		</Router>
	)
}

const Container = styled.div`
	margin: 40px auto;
	padding: 20px;
	max-width: 540px;
	font-size: 20px;
	box-sizing: content-box;
`

export default App
