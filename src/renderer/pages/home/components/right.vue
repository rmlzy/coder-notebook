<template>
  <div class="right">
    <template v-if="currentNote">
      <div class="right__hd">
        <a-dropdown key="Menu" :trigger="['click']">
          <a-icon class="right__hd__menu" type="menu" />
          <a-menu slot="overlay">
            <a-menu-item>
              <div class="pane" @click="onSetPane(1)">
                <a-icon v-if="pane === 1" class="pane__icon" type="check" />
                <div class="pane__name">{{ $t("SinglePane") }}</div>
              </div>
            </a-menu-item>
            <a-menu-item>
              <div class="pane" @click="onSetPane(2)">
                <a-icon v-if="pane === 2" class="pane__icon" type="check" />
                <div class="pane__name">{{ $t("TwoPane") }}</div>
              </div>
            </a-menu-item>
            <a-menu-item>
              <div class="pane" @click="onSetPane(3)">
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
          <a-button
            class="mode__btn"
            size="small"
            :type="mode === 'MULTIPLE' ? 'primary' : 'default'"
            @click="toggleMode('MULTIPLE')"
          >
            <a-icon type="read" />
          </a-button>
        </a-button-group>
      </div>
      <div class="right__bd">
        <template v-if="mode === 'MULTIPLE'">
          <div style="width: 50%;">
            <editor />
          </div>
          <div class="has-border" style="width: 50%;">
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
    </template>
    <div v-else class="right__empty">
      <p>{{ $t("NoNoteSelected") }}</p>
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
      pane: (state) => state.app.pane,
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

    onSetPane(pane) {
      this.$store.dispatch("app/setPane", pane);
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
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;

    &__menu {
      position: absolute;
      top: 8px;
      left: 10px;
      font-size: 18px;
      cursor: pointer;
    }
  }

  &__bd {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    background: var(--editor-bg);

    & > div {
      flex: 1;
    }
  }

  &__empty {
    width: 100%;
    height: 100%;
    padding-bottom: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
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

.has-border {
  border-left: 1px solid var(--border-color);
}

.pane {
  position: relative;
  height: 100%;
  min-width: 80px;
  padding: 0 20px;

  &__icon {
    position: absolute;
    top: 4px;
    left: 0;
  }

  &__name {
  }
}
</style>
