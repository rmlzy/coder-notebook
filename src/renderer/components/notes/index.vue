<template>
  <div class="notes">
    <template v-if="notes.length">
      <a-dropdown v-for="(item, index) in notes" :key="index" :trigger="['contextmenu']">
        <div :class="{ note: true, active: item.uuid === currentNoteUuid }" @click="selectNote(item.uuid)">
          <div class="note__title ellipsis">{{ item.title }}</div>
          <div class="note__date">{{ item.created_at | formatTs }}</div>
          <template v-if="currentNotebookUuid === 'KIS_NOTEBOOK'">
            <div v-if="!item.status" class="note__tag is-local">本地文件</div>
            <div v-if="item.status === 'TOP'" class="note__tag is-top">置顶</div>
            <div v-if="item.status === 'DRAFT'" class="note__tag is-draft">草稿</div>
            <div v-if="item.status === 'PUBLISHED'" class="note__tag is-published">已发布</div>
            <div v-if="item.status === 'HIDE'" class="note__tag is-hide">隐藏</div>
          </template>
        </div>

        <a-menu slot="overlay" overlayClassName="Hey">
          <a-menu-item key="remove" @click="onRemove(item.uuid)">{{ $t("Remove") }}</a-menu-item>
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
    }),
  },
  methods: {
    selectNote(noteUuid) {
      if (noteUuid === this.currentNoteUuid) return;
      this.$store.dispatch("app/selectNote", noteUuid);
    },

    async onRemove(noteUuid) {
      await moveNoteToTrash(this.currentNotebookUuid, noteUuid);
      await this.$store.dispatch("app/removeNote", noteUuid);
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

    &.is-draft {
    }

    &.is-local {
      color: #13c2c2;
    }

    &.is-top {
      color: #f5222d;
    }

    &.is-published {
      color: #52c41a;
    }

    &.is-hide {
      color: #1890ff;
    }
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
