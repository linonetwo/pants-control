import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations';

export default {
  document: {
    nodes: [
      {
        match: [{ type: 'paragraph' }],
      },
    ],
    normalize: (change, { code, node, child, index }) => {
      switch (code) {
        case CHILD_TYPE_INVALID: {
          return change.setNodeByKey(child.key, 'paragraph');
        }
        case CHILD_REQUIRED: {
          return change.insertNodeByKey(node.key, index, 'paragraph');
        }
        default:
          return change;
      }
    },
  },
};
