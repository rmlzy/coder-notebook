<template>
  <div class="editor">
    <div class="editor__hd">
      <input type="text" v-model="title" :placeholder="$t('Untitled')" @blur="onTitleBlur" />
    </div>
    <div class="editor__bd" v-if="currentNote">
      <ace-editor
        :value="currentNote.content"
        :theme="config.theme"
        @focus="onFocus"
        @blur="onBlur"
        @change="onChange"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { formatTs } from "@/helpers/filters";
import aceEditor from "@/components/ace-editor";
import { updateNoteTitle, updateNoteContent } from "@/helpers/util";

export default {
  name: "editor",
  components: {
    aceEditor,
  },
  filters: { formatTs },
  data() {
    return {
      title: "",
    };
  },
  computed: {
    ...mapState({
      config: (state) => state.app.config,
      currentNotebookUuid: (state) => state.app.currentNotebookUuid,
      currentNoteUuid: (state) => state.app.currentNoteUuid,
      currentNote: (state) => state.app.currentNote,
    }),
  },
  watch: {
    currentNote(newVal) {
      if (newVal) {
        this.title = newVal.title;
      }
    },
  },
  created() {
    if (this.currentNote) {
      this.title = this.currentNote.title;
    }
  },
  methods: {
    async onTitleBlur() {
      await updateNoteTitle(this.currentNotebookUuid, this.currentNoteUuid, this.title);
      await this.$store.dispatch("app/setNoteTitle", this.title);
    },

    onFocus(cell) {},

    onBlur() {},

    async onChange(content) {
      await updateNoteContent(this.currentNotebookUuid, this.currentNoteUuid, content);
      await this.$store.dispatch("app/setNoteContent", content);
    },
  },
};
</script>

<style lang="less" scoped>
@import "./editor";
</style>
