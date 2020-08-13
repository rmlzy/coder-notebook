<template>
  <div class="notebooks">
    <div class="notebooks__title">NOTEBOOKS</div>
    <div
      v-for="(item, index) in notebooks"
      :key="index"
      :class="{ notebook: true, active: item.uuid === currentNotebookUuid }"
      @click="selectNotebook(item.uuid)"
    >
      <i class="el-icon-folder"></i>
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "notebooks",
  data() {
    return {};
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
  },
};
</script>

<style lang="scss" scoped>
.notebooks {
  margin-top: 10px;
  margin-bottom: 10px;

  &__title {
    font-size: 12px;
    padding: 0 10px;
    line-height: 25px;
  }
}

.notebook {
  width: 100%;
  height: 25px;
  padding: 0 10px;
  line-height: 25px;
  font-size: 14px;
  user-select: none;
  cursor: pointer;

  &.active {
    color: #fff;
    background: #409eff;
  }
}
</style>
