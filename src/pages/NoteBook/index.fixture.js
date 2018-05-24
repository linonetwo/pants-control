import Plain from 'slate-plain-serializer';

import NoteBook from './';

const exampleSideNote = {
  content: {
    object: 'value',
    document: {
      object: 'document',
      data: {},
      nodes: [
        {
          object: 'block',
          type: 'line',
          isVoid: false,
          data: {},
          nodes: [
            {
              object: 'text',
              leaves: [
                {
                  object: 'leaf',
                  text: 'Your notes:',
                  marks: [
                    {
                      object: 'mark',
                      type: 'note-list',
                      data: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          object: 'block',
          type: 'line',
          isVoid: false,
          data: {},
          nodes: [
            {
              object: 'text',
              leaves: [
                {
                  object: 'leaf',
                  text: '',
                  marks: [],
                },
              ],
            },
          ],
        },
        {
          object: 'block',
          type: 'line',
          isVoid: false,
          data: {},
          nodes: [
            {
              object: 'text',
              leaves: [
                {
                  object: 'leaf',
                  text: 'Try these actions:',
                  marks: [],
                },
              ],
            },
          ],
        },
        {
          object: 'block',
          type: 'line',
          isVoid: false,
          data: {},
          nodes: [
            {
              object: 'text',
              leaves: [
                {
                  object: 'leaf',
                  text: 'AddNewNote',
                  marks: [
                    {
                      object: 'mark',
                      type: 'new-note-button',
                      data: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

export default [
  {
    component: NoteBook,
    name: '笔记页面',
    props: {},
    reduxState: {
      note: {
        notes: {
          Qwvsage33: {
            content: Plain.deserialize('This is editable plain text.\nJust like a <textarea>!').toJSON(),
          },
          Qcsae321z: exampleSideNote,
        },
        ids: ['Qwvsage33', 'Qcsae321z'],
        notSyncedNoteIDs: [],
        currentNoteID: 'Qwvsage33',
        sideNoteID: 'Qcsae321z',
      },
    },
  },
];
