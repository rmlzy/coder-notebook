<template>
  <div class="right">
    <template v-if="currentNote">
      <template v-if="currentNotebookUuid === 'Trash'">
        <div class="right__bd">
          <preview :title="currentNote.title" :html="html" />
        </div>
      </template>
      <template v-else>
        <div class="right__hd">
          <a-dropdown key="Menu" :trigger="['click', 'contextmenu']">
            <a-icon class="right__hd__menu" type="menu" />
            <a-menu slot="overlay">
              <a-menu-item @click="onSetPane(1)">
                <div class="pane">
                  <a-icon v-if="pane === 1" class="pane__icon" type="check" />
                  <div class="pane__name">{{ $t("SinglePane") }}</div>
                </div>
              </a-menu-item>
              <a-menu-item @click="onSetPane(2)">
                <div class="pane">
                  <a-icon v-if="pane === 2" class="pane__icon" type="check" />
                  <div class="pane__name">{{ $t("TwoPane") }}</div>
                </div>
              </a-menu-item>
              <a-menu-item @click="onSetPane(3)">
                <div class="pane">
                  <a-icon v-if="pane === 3" class="pane__icon" type="check" />
                  <div class="pane__name">{{ $t("ThreePane") }}</div>
                </div>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-button-group>
            <a-button
              class="mode__btn"
              size="small"
              :type="mode === 'EDIT' ? 'primary' : 'default'"
              @click="toggleMode('EDIT')"
            >
              <a-icon type="edit" />
            </a-button>
            <a-button
              class="mode__btn"
              size="small"
              :type="mode === 'PREVIEW' ? 'primary' : 'default'"
              @click="toggleMode('PREVIEW')"
            >
              <a-icon type="eye" />
            </a-button>
          </a-button-group>
          <div class="right__hd__publish" v-if="currentNotebookUuid === 'KIS_NOTEBOOK'">
            <publish-to-kis />
          </div>
        </div>
        <div class="right__bd">
          <template v-if="mode === 'EDIT'">
            <editor />
          </template>

          <template v-if="mode === 'PREVIEW'">
            <preview :title="currentNote.title" :html="html" />
          </template>
        </div>
      </template>
    </template>
    <div v-else class="right__empty">
      <p>{{ $t("NoNoteSelected") }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { md2html } from "@/helpers/util";
import publishToKis from "../publish-to-kis";
import editor from "../editor";
import preview from "../preview";

export default {
  name: "right",
  components: {
    preview,
    editor,
    publishToKis,
  },
  data() {
    return {
      mode: "EDIT",
    };
  },
  computed: {
    ...mapState({
      pane: (state) => state.app.pane,
      currentNote: (state) => state.app.currentNote,
      currentNotebookUuid: (state) => state.app.currentNotebookUuid,
      currentNoteUuid: (state) => state.app.currentNoteUuid,
    }),
    html() {
      const { type, content } = this.currentNote;
      if (type === "MARKDOWN") {
        return md2html(this.currentNotebookUuid, this.currentNoteUuid, content);
      }
      if (type === "RICH_TEXT") {
        return content;
      }
    },
  },
  methods: {
    toggleMode(mode) {
      this.mode = mode;
    },

    onSetPane(pane) {
      this.$store.dispatch("app/setPane", pane);
    },
  },
};
</script>

<style lang="less" scoped>
@import "./style";
</style>
