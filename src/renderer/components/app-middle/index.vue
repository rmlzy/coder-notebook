<template>
  <div class="mid">
    <div class="mid__hd">
      <a-dropdown :trigger="['click', 'contextmenu']">
        <a-icon v-if="currentNotebookUuid !== 'Trash'" class="mid__hd__icon" type="plus" />
        <a-menu slot="overlay">
          <a-menu-item key="rename" @click="onCreateNote('MARKDOWN')">MARKDOWN</a-menu-item>
          <a-menu-item key="remove" @click="onCreateNote('RICH_TEXT')">富文本</a-menu-item>
        </a-menu>
      </a-dropdown>
      <div class="mid__hd__name ellipsis" v-if="currentNotebook">
        <template v-if="currentNotebookUuid === 'Trash'">{{ $t("Trash") }}</template>
        <template v-else-if="currentNotebookUuid === 'Inbox'">{{ $t("Inbox") }}</template>
        <template v-else>{{ currentNotebook.name }}</template>
      </div>
    </div>
    <div class="mid__bd">
      <notes />
    </div>
    <div class="mid__ft">
      <a-button
        v-if="currentNotebookUuid === 'KIS_NOTEBOOK'"
        :loading="kisSyncLoading"
        size="small"
        type="link"
        icon="cloud-sync"
        @click="sync"
      >
        同步
      </a-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { createNote } from "@/helpers/util";
import { syncAllBlogs } from "@/helpers/kis";
import notes from "../notes";

export default {
  name: "middle",
  components: {
    notes,
  },
  data() {
    return {
      kisSyncLoading: false,
    };
  },
  computed: {
    ...mapState({
      config: (state) => state.app.config,
      notebooks: (state) => state.app.notebooks,
      currentNotebookUuid: (state) => state.app.currentNotebookUuid,
    }),
    currentNotebook() {
      return this.notebooks.find((notebook) => notebook.uuid === this.currentNotebookUuid);
    },
  },
  methods: {
    async onCreateNote(type) {
      if (this.currentNotebookUuid === "") {
        return;
      }
      const noteUuid = await createNote(this.currentNotebookUuid, type);
      await this.$store.dispatch("app/refreshNotesThenSelectNote", noteUuid);
    },

    async sync() {
      this.kisSyncLoading = true;
      const { host, token, notebookName } = this.config.kis;
      try {
        await syncAllBlogs({ host, token, notebookName });
        await this.$store.dispatch("app/refreshNotebooks");
        await this.$store.dispatch("app/selectNotebook", { notebookUuid: "KIS_NOTEBOOK" });
        this.$message.success("同步成功");
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.kisSyncLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mid {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 35px 0;

  &__hd {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 35px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    padding: 0 30px;

    &__icon {
      position: absolute;
      top: 8px;
      left: 10px;
      font-size: 18px;
      cursor: pointer;
    }

    &__name {
      font-size: 14px;
      text-align: center;
      width: 100%;
    }
  }

  &__bd {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  &__ft {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 35px;
    border-top: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    padding: 0 3px;
  }
}
</style>
