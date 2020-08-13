<template>
  <div class="notes">
    <div
      v-for="(item, index) in notes"
      :key="index"
      :class="{ note: true, active: item.uuid === currentNoteUuid }"
      @click="selectNote(item.uuid)"
    >
      <div class="note__title ellipsis">{{ item.title }}</div>
      <div class="note__date">{{ item.updated_at | formatTs }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { formatTs } from "@/helpers/filters";

export default {
  name: "notes",
  data() {
    return {};
  },
  filters: { formatTs },
  computed: {
    ...mapState({
      currentNoteUuid: (state) => state.app.currentNoteUuid,
      notes: (state) => state.app.notes,
    }),
  },
  methods: {
    selectNote(noteUuid) {
      if (noteUuid === this.currentNoteUuid) return;
      this.$store.dispatch("app/selectNote", noteUuid);
    },
  },
};
</script>

<style lang="scss" scoped>
.note {
  width: 100%;
  height: 60px;
  padding: 10px;
  user-select: none;
  cursor: pointer;
  border-bottom: 1px solid #dcdfe6;

  &:last-child {
    border-bottom: none;
  }

  &.active {
    color: #fff;
    background: #409eff;
  }

  &__title {
    font-size: 13px;
    margin-bottom: 10px;
  }

  &__date {
    font-size: 12px;
  }
}
</style>
