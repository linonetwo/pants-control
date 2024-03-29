import { Block } from 'slate';
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations';

export default {
  document: {
    nodes: [
      {
        match: [{ type: 'title' }, { type: 'paragraph' }, { type: 'note-list' }, { type: 'new-note-button' }, { type: 'code_block' }, { type: 'code_line' }],
      },
    ],
    normalize: (change, { code, node, child, index }) => {
      switch (code) {
        case CHILD_TYPE_INVALID: {
          const type = index === 0 ? 'title' : 'paragraph';
          return change.setNodeByKey(child.key, type);
        }
        case CHILD_REQUIRED: {
          const block = Block.create(index === 0 ? 'title' : 'paragraph');
          return change.insertNodeByKey(node.key, index, block);
        }
        default:
          return change;
      }
    },
  },
};
