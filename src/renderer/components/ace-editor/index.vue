<template>
  <div style="height: 100%; cursor: text;" @click="setFocus">
    <div id="ace-editor"></div>
  </div>
</template>

<script>
import _ from "lodash";
import ace from "brace";

// import all mode
import "brace/mode/markdown";

// import all theme
import "brace/theme/ambiance";
import "brace/theme/chaos";
import "brace/theme/chrome";
import "brace/theme/clouds";
import "brace/theme/clouds_midnight";
import "brace/theme/cobalt";
import "brace/theme/crimson_editor";
import "brace/theme/dawn";
import "brace/theme/dracula";
import "brace/theme/dreamweaver";
import "brace/theme/eclipse";
import "brace/theme/github";
import "brace/theme/gob";
import "brace/theme/gruvbox";
import "brace/theme/idle_fingers";
import "brace/theme/iplastic";
import "brace/theme/katzenmilch";
import "brace/theme/kr_theme";
import "brace/theme/kuroir";
import "brace/theme/merbivore";
import "brace/theme/merbivore_soft";
import "brace/theme/mono_industrial";
import "brace/theme/monokai";
import "brace/theme/pastel_on_dark";
import "brace/theme/solarized_dark";
import "brace/theme/solarized_light";
import "brace/theme/sqlserver";
import "brace/theme/terminal";
import "brace/theme/textmate";
import "brace/theme/tomorrow";
import "brace/theme/tomorrow_night";
import "brace/theme/tomorrow_night_blue";
import "brace/theme/tomorrow_night_bright";
import "brace/theme/tomorrow_night_eighties";
import "brace/theme/twilight";
import "brace/theme/vibrant_ink";
import "brace/theme/xcode";

export default {
  name: "ace-editor",
  props: {
    theme: {
      type: String,
      default: "light",
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      editor: null,
    };
  },
  watch: {
    theme(newVal) {
      const aceTheme = this.getAceTheme(newVal);
      this.editor.setTheme(`ace/theme/${aceTheme}`);
    },
  },
  mounted() {
    const aceTheme = this.getAceTheme(this.theme);
    this.editor = ace.edit("ace-editor");
    this.editor.setValue(this.value);
    this.editor.setOptions({
      height: "100%",
      maxLines: Infinity,
      showPrintMargin: false,
      showGutter: false,
    });
    this.editor.setTheme(`ace/theme/${aceTheme}`);
    this.editor.getSession().setMode("ace/mode/markdown");
    this.editor.getSession().setUseWrapMode(true);
    this.editor.clearSelection();
    this.editor.on("focus", () => {
      this.$emit("focus", null);
    });
    this.editor.on("blur", () => {
      this.$emit("blur", null);
    });
    this.editor.on(
      "change",
      _.debounce(() => {
        this.$emit("change", this.editor.getValue());
      }, 500)
    );
  },
  methods: {
    getAceTheme(appTheme) {
      if (appTheme === "light") {
        return "github";
      }
      if (appTheme === "dark") {
        return "tomorrow_night";
      }
      return "github";
    },

    setFocus() {
      this.editor.focus();
    },
  },
};
</script>
