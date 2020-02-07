import React from "react"
import app from "firebase/app"

const config = {
	apiKey: "AIzaSyBaix_oRoJs_mIpbUXHxjgMvqOgHxDbddc",
	authDomain: "write-and-publish-tool.firebaseapp.com",
	databaseURL: "https://write-and-publish-tool.firebaseio.com",
	projectId: "write-and-publish-tool",
	storageBucket: "write-and-publish-tool.appspot.com",
	messagingSenderId: "482929099305",
	appId: "1:482929099305:web:de3c7260dacfbdae1a1238"
}

class Firebase {
	constructor() {
		app.initializeApp(config)
	}
}

const FirebaseContext = React.createContext(null)

export const FirebaseProvider = ({ children }) => (
	<FirebaseContext.Provider value={new Firebase()}>{children}</FirebaseContext.Provider>
)

export const useFirebase = () => {
	const firebase = React.useContext(FirebaseContext)
	return firebase
}
