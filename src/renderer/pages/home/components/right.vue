<template>
  <div class="right" v-if="currentNote">
    <div class="right__hd">
      <el-button-group>
        <el-button
          class="mode__btn"
          size="mini"
          :type="mode === 'EDIT' ? 'primary' : 'default'"
          @click="toggleMode('EDIT')"
        >
          <i class="el-icon-edit"></i>
        </el-button>
        <el-button
          class="mode__btn"
          size="mini"
          :type="mode === 'PREVIEW' ? 'primary' : 'default'"
          @click="toggleMode('PREVIEW')"
        >
          <i class="el-icon-view"></i>
        </el-button>
        <el-button
          class="mode__btn"
          size="mini"
          :type="mode === 'MULTIPLE' ? 'primary' : 'default'"
          @click="toggleMode('MULTIPLE')"
        >
          <i class="el-icon-c-scale-to-original"></i>
        </el-button>
      </el-button-group>
    </div>
    <div class="right__bd">
      <template v-if="mode === 'MULTIPLE'">
        <div style="width: 50%;">
          <editor />
        </div>
        <div style="width: 50%;">
          <preview :title="currentNote.title" :html="html" />
        </div>
      </template>

      <template v-if="mode === 'EDIT'">
        <editor />
      </template>

      <template v-if="mode === 'PREVIEW'">
        <preview :title="currentNote.title" :html="html" />
      </template>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import { md2html } from "@/helpers/util";
import editor from "./editor";
import preview from "./preview";

export default {
  name: "right",
  components: {
    preview,
    editor,
  },
  data() {
    return {
      mode: "EDIT",
    };
  },
  computed: {
    ...mapState({
      currentNote: (state) => state.app.currentNote,
    }),
    html() {
      return this.cells2html(this.currentNote.cells);
    },
  },
  methods: {
    toggleMode(mode) {
      this.mode = mode;
    },

    cells2html(cells) {
      if (!_.isArray(cells)) {
        return "";
      }
      const htmlCells = cells.map((cell) => {
        if (cell.type === "markdown") {
          return md2html(cell.data);
        }
        return "";
      });
      return htmlCells.join("");
    },
  },
};
</script>

<style lang="scss" scoped>
.right {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 35px 0 0 0;

  &__hd {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__bd {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;

    & > div {
      flex: 1;
    }
  }
}

.mode {
  &__btn {
    display: inline-block;
    min-width: 60px;
    font-size: 16px;
    height: 25px;
    line-height: 23px;
    padding: 0;
  }
}

.border {
  width: 1px;
  height: 100%;
  background: #dcdfe6;
}
</style>
