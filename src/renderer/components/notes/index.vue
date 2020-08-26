<template>
  <div class="notes">
    <template v-if="notes.length">
      <a-dropdown v-for="(item, index) in notes" :key="index" :trigger="['contextmenu']">
        <div :class="{ note: true, active: item.uuid === currentNoteUuid }" @click="selectNote(item.uuid)">
          <div class="note__title ellipsis">
            <template v-if="currentNotebookUuid === 'KIS_NOTEBOOK'">
              <a-tooltip placement="left" title="本地文件">
                <a-badge v-if="!item.status" status="warning" />
              </a-tooltip>
              <a-tooltip placement="left" title="已发布">
                <a-badge v-if="item.status === 'PUBLISHED'" status="success" />
              </a-tooltip>
              <a-tooltip placement="left" title="置顶">
                <a-badge v-if="item.status === 'TOP'" status="error" />
              </a-tooltip>
              <a-tooltip placement="left" title="草稿">
                <a-badge v-if="item.status === 'DRAFT'" status="default" />
              </a-tooltip>
              <a-tooltip placement="left" title="隐藏">
                <a-badge v-if="item.status === 'HIDE'" status="processing" />
              </a-tooltip>
            </template>
            <span>{{ item.title || $t("Untitled") }}</span>
          </div>
          <div class="note__date">{{ item.created_at | formatTs }}</div>
          <template v-if="item.uuid === currentNoteUuid">
            <div v-if="item.type === 'MARKDOWN'" class="note__tag">md</div>
            <div v-if="item.type === 'RICH_TEXT'" class="note__tag">富文本</div>
          </template>
        </div>

        <a-menu slot="overlay" overlayClassName="Hey">
          <a-menu-item key="remove" @click="onRemove(item)">{{ $t("Remove") }}</a-menu-item>
        </a-menu>
      </a-dropdown>
    </template>
    <div v-else class="notes__empty">
      <p>{{ $t("NoNotes") }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { formatTs } from "@/helpers/filters";
import { moveNoteToTrash } from "@/helpers/util";
import { deleteBlog } from "@/helpers/kis";

export default {
  name: "notes",
  data() {
    return {};
  },
  filters: { formatTs },
  computed: {
    ...mapState({
      currentNotebookUuid: (state) => state.app.currentNotebookUuid,
      currentNoteUuid: (state) => state.app.currentNoteUuid,
      notes: (state) => state.app.notes,
      config: (state) => state.app.config,
    }),
  },
  methods: {
    selectNote(noteUuid) {
      if (noteUuid === this.currentNoteUuid) return;
      this.$store.dispatch("app/selectNote", noteUuid);
    },

    async onRemove({ id, uuid }) {
      if (!id) {
        await moveNoteToTrash(this.currentNotebookUuid, uuid);
        await this.$store.dispatch("app/removeNote", uuid);
        return;
      }
      this.$confirm({
        title: "提示",
        content: "是否删除远程数据库对应的文章?",
        okText: this.$t("Ok"),
        cancelText: this.$t("Cancel"),
        onOk: async () => {
          const { host, token } = this.config.kis;
          const res = await deleteBlog({ host, token, id });
          if (!res.success) {
            this.$message.error(res.message);
            return;
          }
          await moveNoteToTrash(this.currentNotebookUuid, uuid);
          await this.$store.dispatch("app/removeNote", uuid);
        },
        onCancel: async () => {
          await moveNoteToTrash(this.currentNotebookUuid, uuid);
          await this.$store.dispatch("app/removeNote", uuid);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.note {
  position: relative;
  width: 100%;
  height: 60px;
  padding: 10px;
  user-select: none;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  color: var(--note-color);
  background: var(--note-bg);

  &:last-child {
    border-bottom: none;
  }

  &.active {
    color: var(--note-active-color);
    background: var(--note-active-bg);
  }

  &:not(.active).ant-dropdown-open {
    background: var(--note-hover-bg);
  }

  &__title {
    font-size: 14px;
    margin-bottom: 10px;
  }

  &__date {
    font-size: 12px;
  }

  &__tag {
    position: absolute;
    bottom: 0;
    right: 4px;
    font-size: 12px;
    color: #13c2c2;
  }
}

.notes {
  width: 100%;
  height: 100%;

  &__empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
