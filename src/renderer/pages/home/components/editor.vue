<template>
  <div class="editor">
    <div class="editor__title">
      <input type="text" v-model="title" />
    </div>
    <div class="editor__bd" v-if="currentNote">
      <div class="cell" v-for="(cell, index) in currentNote.cells" :key="index">
        <ace-editor v-if="cell.type === 'markdown'" :id="'editor__' + index" mode="markdown" :value="cell.data" />
        <ace-editor v-if="cell.type === 'code'" :id="'editor__' + index" :mode="cell.language" :value="cell.data" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import aceEditor from "@/components/ace-editor";

export default {
  name: "editor",
  components: {
    aceEditor,
  },
  data() {
    return {
      title: "",
    };
  },
  computed: {
    ...mapState({
      currentNote: (state) => state.app.currentNote,
    }),
  },
};
</script>

<style lang="scss" scoped>
.editor {
  padding: 0 20px;

  &__title {
    font-size: 18px;
    font-weight: 500;
    margin: 20px 0;
    padding: 15px 10px;
    border-bottom: 1px solid #dcdfe6;

    input {
      font-size: 18px;
      font-weight: 500;
      background: transparent;
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      margin: 0;
      padding: 0;
    }
  }
}

.cell {
  padding: 10px;
  border-radius: 4px;

  &.active {
    border: 1px solid #dcdfe6;
  }
}
</style>
