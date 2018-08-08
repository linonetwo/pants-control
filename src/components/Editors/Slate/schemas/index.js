// @flow
import documentSchema from './document';
import jsonSchema from './json';

export default function getSchema(type: string) {
  switch (type) {
    case 'json':
      return jsonSchema;
    case 'document':
    default:
      return documentSchema;
  }
}
