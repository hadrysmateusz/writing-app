// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Document } = initSchema(schema);

export {
  Document
};