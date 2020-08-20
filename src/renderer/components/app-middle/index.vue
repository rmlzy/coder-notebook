<template>
  <div class="mid">
    <div class="mid__hd">
      <a-icon class="mid__hd__icon" v-if="currentNotebookUuid !== 'Trash'" type="plus" @click="onCreateNote" />
      <div class="mid__hd__name ellipsis" v-if="currentNotebook">
        <template v-if="currentNotebookUuid === 'Trash'">{{ $t("Trash") }}</template>
        <template v-else-if="currentNotebookUuid === 'Inbox'">{{ $t("Inbox") }}</template>
        <template v-else>{{ currentNotebook.name }}</template>
      </div>
    </div>
    <div class="mid__bd">
      <notes />
    </div>
    <div class="mid__ft"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { createNote } from "@/helpers/util";
import notes from "../notes";

export default {
  name: "middle",
  components: {
    notes,
  },
  computed: {
    ...mapState({
      notebooks: (state) => state.app.notebooks,
      currentNotebookUuid: (state) => state.app.currentNotebookUuid,
    }),
    currentNotebook() {
      return this.notebooks.find((notebook) => notebook.uuid === this.currentNotebookUuid);
    },
  },
  methods: {
    async onCreateNote() {
      if (this.currentNotebookUuid === "") {
        return;
      }
      await createNote(this.currentNotebookUuid);
      await this.$store.dispatch("app/refreshNotes");
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
  }
}
</style>
