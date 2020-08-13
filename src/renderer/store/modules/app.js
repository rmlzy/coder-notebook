import { getNotebooks, getNotes, getNote } from "@/helpers/util";

export default {
  namespaced: true,

  state: {
    currentNotebookUuid: "notebook_1",
    notebooks: [],

    currentNoteUuid: "",
    notes: [],

    currentNote: null,
  },

  mutations: {
    SET_CURRENT_NOTEBOOK_UUID: (state, payload) => {
      state.currentNotebookUuid = payload;
    },
    SET_NOTEBOOKS: (state, payload) => {
      state.notebooks = payload;
    },
    SET_CURRENT_NOTE_UUID: (state, payload) => {
      state.currentNoteUuid = payload;
    },
    SET_NOTES: (state, payload) => {
      state.notes = payload;
    },
    SET_CURRENT_NOTE: (state, payload) => {
      state.currentNote = payload;
    },
  },

  actions: {
    setNotebooks({ commit }, notebooks) {
      commit("SET_NOTEBOOKS", notebooks);
    },

    async selectNotebook({ commit, dispatch }, notebookUuid) {
      commit("SET_CURRENT_NOTEBOOK_UUID", notebookUuid);
      const notes = await getNotes(notebookUuid);
      commit("SET_NOTES", notes);
      if (notes.length) {
        await dispatch("selectNote", notes[0].uuid);
      }
    },

    async selectNote({ state, commit, dispatch }, noteUuid) {
      commit("SET_CURRENT_NOTE_UUID", noteUuid);
      const note = await getNote(state.currentNotebookUuid, noteUuid);
      commit("SET_CURRENT_NOTE", note);
    },
  },
};
