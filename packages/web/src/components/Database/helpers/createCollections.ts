import { MyModel, MyDatabase } from "../types"

export const createCollections = async (
  db: MyDatabase,
  collections: MyModel[]
) => {
  return await Promise.all(collections.map((colData) => db.collection(colData)))
}
