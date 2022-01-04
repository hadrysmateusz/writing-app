export class TabsStateShapeError extends Error {
  constructor(message: string) {
    const name = "TabsStateShapeError"
    const newMessage = `${name}: ${message}`

    super(newMessage)

    this.name = name
  }
}
