<template>
  <div class="notebooks">
    <div class="notebooks__title">{{ $t("Notebooks") }}</div>
    <a-dropdown
      v-for="(item, index) in notebooks"
      :key="index"
      :trigger="['contextmenu']"
      v-if="blackList.indexOf(item.uuid) === -1"
    >
      <div
        :class="{ notebook: true, active: item.uuid === currentNotebookUuid, hover: item.uuid === renameUuid }"
        @click="selectNotebook(item.uuid)"
      >
        <template v-if="renameUuid === item.uuid">
          <a-input
            size="small"
            v-model="renameName"
            autofocus
            @pressEnter="onRenameOk"
            @blur="onRenameOk"
            @click="onRenameInputClick"
          />
        </template>
        <template v-else>
          <a-icon type="book" />
          <span>{{ item.name }}</span>
        </template>
      </div>

      <a-menu slot="overlay">
        <a-menu-item key="rename" @click="onRename(item.uuid, item.name)">{{ $t("Rename") }}</a-menu-item>
        <a-menu-item key="remove" @click="onRemove(item.uuid)">{{ $t("Remove") }}</a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { moveNotebookToTrash, updateNotebookName } from "@/helpers/util";

export default {
  name: "notebooks",
  data() {
    return {
      renameUuid: "",
      renameName: "",
      blackList: ["Inbox", "Trash"],
    };
  },
  computed: {
    ...mapState({
      currentNotebookUuid: (state) => state.app.currentNotebookUuid,
      notebooks: (state) => state.app.notebooks,
    }),
  },
  methods: {
    onRenameInputClick(evt) {
      evt.stopPropagation();
    },

    selectNotebook(notebookUuid) {
      if (notebookUuid === this.currentNotebookUuid) return;
      this.$store.dispatch("app/selectNotebook", { notebookUuid });
    },

    onRename(uuid, name) {
      this.renameUuid = uuid;
      this.renameName = name;
    },

    async onRenameOk() {
      if (this.renameName === "") return;
      await updateNotebookName(this.renameUuid, this.renameName);
      await this.$store.dispatch("app/refreshNotebooks");
      this.renameUuid = "";
      this.renameName = "";
    },

    async onRemove(uuid) {
      await moveNotebookToTrash(uuid);
      await this.$store.dispatch("app/removeNotebook", uuid);
    },
  },
};
</script>

<style lang="less" scoped>
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

  &.hover {
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
