import _ from "lodash";
import { getNotebooks, getNotes, getNote, getConfig, setConfig } from "@/helpers/util";

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
    async initSelected({ state, commit, dispatch }) {
      const notebooks = await getNotebooks();
      commit("SET_NOTEBOOKS", notebooks);
      const { lastNotebookUuid, lastNoteUuid } = state.config;
      if (lastNotebookUuid && lastNoteUuid) {
        await dispatch("selectNotebook", {
          notebookUuid: lastNotebookUuid,
          noteUuid: lastNoteUuid,
        });
      } else {
        await dispatch("selectNotebook", { notebookUuid: "Inbox" });
      }
    },

    setConfig({ commit }, config) {
      commit("SET_CONFIG", config);
    },

    setPane({ commit }, pane) {
      commit("SET_PANE", pane);
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

    async selectNotebook({ commit, dispatch }, payload) {
      const { notebookUuid, noteUuid } = payload;
      await setConfig("lastNotebookUuid", notebookUuid);
      const notes = await getNotes(notebookUuid);
      commit("SET_CURRENT_NOTEBOOK_UUID", notebookUuid);
      commit("SET_NOTES", notes);
      if (noteUuid) {
        await dispatch("selectNote", noteUuid);
      } else {
        if (notes.length) {
          await dispatch("selectNote", notes[0].uuid);
        } else {
          commit("SET_CURRENT_NOTE", null);
          commit("SET_CURRENT_NOTE_UUID", "");
          await setConfig("lastNoteUuid", "");
        }
      }
    },

    async selectNote({ state, commit, dispatch }, noteUuid) {
      const note = await getNote(state.currentNotebookUuid, noteUuid);
      commit("SET_CURRENT_NOTE", note);
      commit("SET_CURRENT_NOTE_UUID", noteUuid);
      await setConfig("lastNoteUuid", noteUuid);
    },

    async refreshNotebooks({ commit }) {
      const notebooks = await getNotebooks();
      commit("SET_NOTEBOOKS", notebooks);
    },

    async refreshNotesThenSelectNote({ state, commit, dispatch }, noteUuid) {
      const notes = await getNotes(state.currentNotebookUuid);
      const note = await getNote(state.currentNotebookUuid, noteUuid);
      commit("SET_NOTES", notes);
      commit("SET_CURRENT_NOTE", note);
      commit("SET_CURRENT_NOTE_UUID", noteUuid);
      await setConfig("lastNoteUuid", noteUuid);
    },

    async removeNotebook({ state, commit, dispatch }, notebookUuid) {
      if (state.currentNotebookUuid === notebookUuid) {
        commit("SET_CURRENT_NOTEBOOK_UUID", "");
        commit("SET_CURRENT_NOTE_UUID", "");
        commit("SET_NOTES", []);
        commit("SET_CURRENT_NOTE", null);
        await setConfig("lastNoteUuid", "");
        await dispatch("refreshNotebooks");
      } else {
        await dispatch("refreshNotebooks");
      }
    },

    async removeNote({ state, commit, dispatch }, noteUuid) {
      if (state.currentNoteUuid === noteUuid) {
        commit("SET_CURRENT_NOTE_UUID", "");
        commit("SET_CURRENT_NOTE", null);
        await setConfig("lastNoteUuid", "");
      }
      await dispatch("selectNotebook", { notebookUuid: state.currentNotebookUuid });
    },
  },
};
