import Plain from 'slate-plain-serializer';

import NoteBook from './';

export default [
  {
    component: NoteBook,
    name: '笔记页面',
    props: {},
    reduxState: {
      note: {
        notes: {
          Qwvsage33: {
            content: JSON.stringify(
              Plain.deserialize('This is editable plain text.\nJust like a <textarea>!').toJSON(),
            ),
          },
        },
        ids: ['Qwvsage33'],
        notSyncedNoteIDs: [],
        currentNoteID: 'Qwvsage33',
      },
    },
  },
];
