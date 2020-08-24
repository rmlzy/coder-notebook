<template>
  <div class="notebooks">
    <div class="notebooks__title">{{ $t("Library") }}</div>

    <a-dropdown key="Inbox" :trigger="['contextmenu']">
      <div :class="{ notebook: true, active: currentNotebookUuid === 'Inbox' }" @click="selectNotebook('Inbox')">
        <a-icon type="inbox" />
        <span>{{ $t("Inbox") }}</span>
      </div>
      <a-menu slot="overlay">
        <a-menu-item key="rename">{{ $t("ShowInFinder") }}</a-menu-item>
      </a-menu>
    </a-dropdown>

    <a-dropdown key="Trash" :trigger="['contextmenu']">
      <div :class="{ notebook: true, active: currentNotebookUuid === 'Trash' }" @click="selectNotebook('Trash')">
        <a-icon type="delete" />
        <span>{{ $t("Trash") }}</span>
      </div>
      <a-menu slot="overlay">
        <a-menu-item key="clearTrash" @click="onClearTrash">{{ $t("ClearTrash") }}</a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { clearTrash } from "@/helpers/util";

export default {
  name: "libraries",
  computed: {
    ...mapState({
      currentNotebookUuid: (state) => state.app.currentNotebookUuid,
    }),
  },
  methods: {
    selectNotebook(notebookUuid) {
      if (notebookUuid === this.currentNotebookUuid) return;
      this.$store.dispatch("app/selectNotebook", { notebookUuid });
    },

    async onClearTrash() {
      await clearTrash();
      await this.$store.dispatch("app/selectNotebook", { notebookUuid: this.currentNotebookUuid });
    },
  },
};
</script>

<style lang="less">
.notebooks {
  margin-top: 10px;
  margin-bottom: 10px;

  &__title {
    font-size: 12px;
    padding: 0 8px;
    line-height: 25px;
  }
}

.notebook {
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 30px;
  color: var(--notebook-color);
  background: var(--notebook-bg);
  margin-right: -1px;

  &.active {
    color: var(--notebook-active-color);
    background: var(--notebook-active-bg);
  }

  &:not(.active).ant-dropdown-open {
    background: var(--notebook-hover-bg);
  }

  .anticon {
    position: absolute;
    top: 6px;
    left: 8px;
    font-size: 16px;
  }

  .ant-input {
    border: none;
    border-radius: 2px;
  }
}
</style>
