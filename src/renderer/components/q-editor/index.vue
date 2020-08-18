<template>
  <quill-editor
    ref="qEditor"
    v-model="data"
    :options="options"
    @focus="onFocus"
    @blur="onBlur"
    @change="onChange"
  ></quill-editor>
</template>

<script>
import _ from "lodash";

export default {
  name: "q-editor",
  props: {
    id: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      editor: null,
      data: "",
      options: {
        placeholder: "",
        theme: "snow",
        modules: {
          toolbar: "",
        },
      },
    };
  },
  watch: {
    value(newVal) {
      this.data = newVal;
    },
  },
  mounted() {
    this.editor = this.$refs.qEditor.quill;
  },
  methods: {
    onFocus() {
      this.$emit("focus", null);
    },

    onBlur() {
      this.$emit("blur", null);
    },

    onChange: _.debounce(function () {
      this.$emit("change", this.data);
    }, 500),
  },
};
</script>

<style lang="scss">
.quill-editor {
  min-height: 17px;

  .ql-container.ql-snow {
    border: none;
  }

  .ql-editor {
    padding: 0;
  }
}
</style>
