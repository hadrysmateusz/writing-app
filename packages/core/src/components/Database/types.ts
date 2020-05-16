import { RxDatabase, RxDocument, RxCollection } from "rxdb"

export type DocumentDocType = {
  id: string
  title: string
  content: string
}

export type DocumentDocMethods = {}

export type DocumentDoc = RxDocument<DocumentDocType, DocumentDocMethods>

export type DocumentCollectionMethods = {}

export type DocumentCollection = RxCollection<
  DocumentDocType,
  DocumentDocMethods,
  DocumentCollectionMethods
>

export type MyDatabaseCollections = { documents: DocumentCollection }

export type MyDatabase = RxDatabase<MyDatabaseCollections>
