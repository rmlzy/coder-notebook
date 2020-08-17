<template>
  <div class="notebooks">
    <div class="notebooks__title">{{ $t("Notebooks") }}</div>
    <a-dropdown v-for="(item, index) in notebooks" :key="index" :trigger="['contextmenu']">
      <div :class="{ notebook: true, active: item.uuid === currentNotebookUuid }" @click="selectNotebook(item.uuid)">
        <template v-if="renameUuid === item.uuid">
          <a-input size="small" v-model="item.name" />
        </template>
        <template v-else>
          <a-icon type="book" />
          <span>{{ item.name }}</span>
        </template>
      </div>

      <a-menu slot="overlay" overlayClassName="Hey">
        <a-menu-item key="rename" @click="onRename(item.uuid)">{{ $t("Rename") }}</a-menu-item>
        <a-menu-item key="remove" @click="onRemove(item.uuid)">{{ $t("Remove") }}</a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "notebooks",
  data() {
    return {
      renameUuid: "",
    };
  },
  computed: {
    ...mapState({
      currentNotebookUuid: (state) => state.app.currentNotebookUuid,
      notebooks: (state) => state.app.notebooks,
    }),
  },
  methods: {
    selectNotebook(notebookUuid) {
      if (notebookUuid === this.currentNotebookUuid) return;
      this.$store.dispatch("app/selectNotebook", notebookUuid);
    },

    onRename(uuid) {
      this.selectNotebook(uuid);
      this.renameUuid = uuid;
    },

    onRemove(uuid) {},
  },
};
</script>

<style lang="scss" scoped>
.notebooks {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 0 1px;

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
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 25px;

  &.active {
    color: #fff;
    background: #409eff;
  }

  &.ant-dropdown-open {
    outline: 1px solid #409eff;
  }

  .anticon {
    position: absolute;
    top: 5px;
    left: 5px;
    font-size: 16px;
  }

  .ant-input {
    border: none;
    border-radius: 2px;
  }
}
</style>
