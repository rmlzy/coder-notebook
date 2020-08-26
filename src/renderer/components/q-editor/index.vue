<template>
  <quill-editor ref="editor" :content="content" :options="editorOption" @change="onEditorChange($event)" />
</template>

<script>
export default {
  name: "q-editor",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      content: "",
      editorOption: {
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            ["bold", "italic", "underline", "strike"],

            [{ color: [] }, { background: [] }],

            ["blockquote", "code-block"],

            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],

            [{ align: [] }],

            ["clean"],
          ],
        },
      },
    };
  },
  watch: {
    value(newVal) {
      this.content = newVal;
    },
  },
  mounted() {
    this.content = this.value;
  },
  methods: {
    setFocus() {
      this.$refs.editor.quill.focus();
    },

    onEditorChange({ quill, html, text }) {
      this.$emit("change", html);
    },
  },
};
</script>
