<template>
  <div class="mid">
    <div class="mid__hd">
      <a-icon type="plus" @click="onCreateNote" />
    </div>
    <div class="mid__bd">
      <notes />
    </div>
    <div class="mid__ft"></div>
  </div>
</template>

<script>
import { createNote } from "@/helpers/util";
import notes from "./notes";
import { mapState } from "vuex";

export default {
  name: "middle",
  components: {
    notes,
  },
  computed: {
    ...mapState({
      currentNotebookUuid: (state) => state.app.currentNotebookUuid,
    }),
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
  width: 200px;
  height: 100%;
  padding: 35px 0;

  &__hd {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    padding: 0 10px;

    .anticon-plus {
      font-size: 18px;
      cursor: pointer;
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
    border-top: 1px solid #dcdfe6;
  }
}
</style>
