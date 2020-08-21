import _ from "lodash";
import { getNotebooks, getNotes, getNote, setConfig } from "@/helpers/util";

export default {
  namespaced: true,

  state: {
    config: {},

    pane: 3,

    currentNotebookUuid: "Inbox",
    notebooks: [],

    currentNoteUuid: "",
    notes: [],

    currentNote: null,
  },

  mutations: {
    SET_CONFIG: (state, payload) => {
      state.config = payload;
    },
    SET_PANE: (state, payload) => {
      state.pane = payload;
    },
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
    setConfig({ commit }, config) {
      commit("SET_CONFIG", config);
    },

    setPane({ commit }, pane) {
      commit("SET_PANE", pane);
    },

    setNotebooks({ commit }, notebooks) {
      commit("SET_NOTEBOOKS", notebooks);
    },

    setNoteTitle({ state, commit }, title) {
      const newNotes = _.cloneDeep(state.notes).map((note) => {
        if (note.uuid === state.currentNoteUuid) {
          note.title = title;
        }
        return note;
      });
      const newCurrentNote = _.cloneDeep(state.currentNote);
      newCurrentNote.title = title;
      commit("SET_NOTES", newNotes);
      commit("SET_CURRENT_NOTE", newCurrentNote);
    },

    setNoteContent({ state, commit }, content) {
      const note = _.cloneDeep(state.currentNote);
      note.content = content;
      commit("SET_CURRENT_NOTE", note);
    },

    async selectNotebook({ commit, dispatch }, notebookUuid) {
      commit("SET_CURRENT_NOTEBOOK_UUID", notebookUuid);
      const notes = await getNotes(notebookUuid);
      commit("SET_NOTES", notes);
      if (notes.length) {
        await dispatch("selectNote", notes[0].uuid);
      } else {
        commit("SET_CURRENT_NOTE", null);
      }
    },

    async selectNote({ state, commit, dispatch }, noteUuid) {
      commit("SET_CURRENT_NOTE_UUID", noteUuid);
      const note = await getNote(state.currentNotebookUuid, noteUuid);
      commit("SET_CURRENT_NOTE", note);
    },

    async refreshNotebooks({ commit }) {
      const notebooks = await getNotebooks();
      commit("SET_NOTEBOOKS", notebooks);
    },

    async refreshNotes({ state, dispatch }) {
      dispatch("selectNotebook", state.currentNotebookUuid);
    },

    async removeNotebook({ state, commit, dispatch }, notebookUuid) {
      if (state.currentNotebookUuid === notebookUuid) {
        commit("SET_CURRENT_NOTEBOOK_UUID", "");
        commit("SET_CURRENT_NOTE_UUID", "");
        commit("SET_NOTES", []);
        commit("SET_CURRENT_NOTE", null);
        await dispatch("refreshNotebooks");
      } else {
        await dispatch("refreshNotebooks");
      }
    },

    async removeNote({ state, commit, dispatch }, noteUuid) {
      if (state.currentNoteUuid === noteUuid) {
        commit("SET_CURRENT_NOTE_UUID", "");
        commit("SET_CURRENT_NOTE", null);
      }
      await dispatch("refreshNotes");
    },
  },
};
