import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Document {
  readonly id: string;
  readonly userId: string;
  readonly documentId: string;
  readonly content: string;
  readonly title: string;
  constructor(init: ModelInit<Document>);
  static copyOf(source: Document, mutator: (draft: MutableModel<Document>) => MutableModel<Document> | void): Document;
}