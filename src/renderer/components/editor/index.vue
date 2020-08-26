<template>
  <div class="editor">
    <div class="editor__hd">
      <input type="text" v-model="title" :placeholder="$t('Untitled')" @blur="onTitleBlur" />
    </div>
    <div class="editor__bd" v-if="currentNote">
      <q-editor v-if="currentNote.type === 'RICH_TEXT'" :value="content" @change="onChange" />
      <ace-editor v-else :value="content" :theme="config.theme" @change="onChange" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { formatTs } from "@/helpers/filters";
import aceEditor from "@/components/ace-editor";
import qEditor from "@/components/q-editor";
import { updateNoteTitle, updateNoteContent } from "@/helpers/util";

export default {
  name: "editor",
  components: { aceEditor, qEditor },
  filters: { formatTs },
  data() {
    return {
      title: "",
      content: "",
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
    currentNoteUuid(newVal) {
      if (this.currentNote) {
        this.title = this.currentNote.title;
        this.content = this.currentNote.content;
      } else {
        this.title = "";
        this.content = "";
      }
    },
  },
  created() {
    if (this.currentNote) {
      this.title = this.currentNote.title;
      this.content = this.currentNote.content;
    } else {
      this.title = "";
      this.content = "";
    }
  },
  methods: {
    async onTitleBlur() {
      await updateNoteTitle(this.currentNotebookUuid, this.currentNoteUuid, this.title);
      await this.$store.dispatch("app/setNoteTitle", this.title);
    },

    async onChange(content) {
      await updateNoteContent(this.currentNotebookUuid, this.currentNoteUuid, content);
      await this.$store.dispatch("app/setNoteContent", content);
    },
  },
};
</script>

<style lang="less" scoped>
@import "./style";
</style>
