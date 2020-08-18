<template>
  <div class="editor" v-click-outside="onClickOutside">
    <div class="editor__title">
      <input type="text" v-model="title" :placeholder="$t('Untitled')" @blur="onTitleBlur" />
    </div>
    <div v-if="currentCell.uuid === ''" class="editor__tools">
      <span style="margin-right: 20px;">Created: {{ currentNote.created_at | formatTs }}</span>
      <span>Updated: {{ currentNote.updated_at | formatTs }}</span>
    </div>
    <div v-else class="editor__tools">
      <a-select
        v-model="currentCell.type"
        size="small"
        style="width: 130px; margin-right: 10px;"
        @change="onCellTypeChange"
      >
        <a-select-option value="text">Text Cell</a-select-option>
        <a-select-option value="markdown">Markdown Cell</a-select-option>
        <a-select-option value="code">Code Cell</a-select-option>
      </a-select>

      <a-select
        v-if="currentCell.type === 'code'"
        v-model="currentCell.language"
        show-search
        size="small"
        style="width: 130px; margin-right: 10px;"
        @change="onCellLanguageChange"
      >
        <a-select-option v-for="(item, index) in codeModes" :key="index" :value="item">{{ item }}</a-select-option>
      </a-select>
    </div>
    <div class="editor__body" v-if="currentNote">
      <div
        v-for="(cell, index) in currentNote.cells"
        :class="{ cell: true, active: currentCell.uuid === cell.uuid }"
        :key="cell.uuid"
        @click="onCellClick(cell.uuid)"
      >
        <!-- <a-icon class="cell__drag" type="drag" />-->
        <div class="cell__before" @click="insertBeforeUuid($event, cell.uuid)">{{ $t("InsertBeforeCell") }}</div>
        <div class="cell__after" @click="insertAfterUuid($event, cell.uuid)">{{ $t("InsertAfterCell") }}</div>
        <ace-editor
          v-if="cell.type === 'markdown'"
          :ref="cell.uuid"
          :id="cell.uuid"
          mode="markdown"
          :value="cell.data"
          @focus="onFocus(cell)"
          @blur="onBlur"
          @change="onChange($event, cell.uuid)"
        />
        <ace-editor
          v-if="cell.type === 'code'"
          :ref="cell.uuid"
          :id="cell.uuid"
          :mode="cell.language"
          :value="cell.data"
          @focus="onFocus(cell)"
          @blur="onBlur"
          @change="onChange($event, cell.uuid)"
        />
        <q-editor
          v-if="cell.type === 'text'"
          :ref="cell.uuid"
          :id="cell.uuid"
          :value="cell.data"
          @focus="onFocus(cell)"
          @blur="onBlur"
          @change="onChange($event, cell.uuid)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import { formatTs } from "@/helpers/filters";
import aceEditor from "@/components/ace-editor";
import qEditor from "@/components/q-editor";
import { updateNoteTitle, updateNoteCells, uuid } from "@/helpers/util";
import { codeModes } from "@/helpers/const";

export default {
  name: "editor",
  components: {
    aceEditor,
    qEditor,
  },
  filters: { formatTs },
  data() {
    return {
      codeModes: codeModes,
      title: "",
      currentCell: {
        uuid: "",
        type: "",
        data: "",
        language: "",
      },
    };
  },
  computed: {
    ...mapState({
      currentNotebookUuid: (state) => state.app.currentNotebookUuid,
      currentNoteUuid: (state) => state.app.currentNoteUuid,
      currentNote: (state) => state.app.currentNote,
    }),
  },
  watch: {
    currentNote(newVal) {
      if (newVal) {
        this.title = newVal.title;
      }
    },
  },
  created() {
    if (this.currentNote) {
      this.title = this.currentNote.title;
    }
  },
  methods: {
    onClickOutside(event) {
      event.stopPropagation();
      this.currentCell = {
        uuid: "",
        type: "",
        data: "",
        language: "",
      };
    },

    onCellClick(cellUuid) {
      this.$refs[cellUuid][0].editor.focus();
    },

    async onTitleBlur() {
      await updateNoteTitle(this.currentNotebookUuid, this.currentNoteUuid, this.title);
      await this.$store.dispatch("app/setNoteTitle", this.title);
    },

    onFocus(cell) {
      this.currentCell = cell;
    },

    onBlur() {
      // this.currentCellIndex = -1;
    },

    async updateCells(cells) {
      await updateNoteCells(this.currentNotebookUuid, this.currentNoteUuid, cells);
      await this.$store.dispatch("app/setNoteCells", cells);
    },

    async insertBeforeUuid(evt, cellUuid) {
      evt.stopPropagation();
      const cells = _.cloneDeep(this.currentNote.cells);
      const index = cells.findIndex((item) => item.uuid === cellUuid);
      const before = cells.slice(0, index);
      const after = cells.slice(index);
      const newUuid = uuid();
      const newCells = [...before, { uuid: newUuid, type: "markdown", data: "" }, ...after];
      await this.updateCells(newCells);
      this.$nextTick(() => {
        this.$refs[newUuid][0].editor.focus();
      });
    },

    async insertAfterUuid(evt, cellUuid) {
      evt.stopPropagation();
      const cells = _.cloneDeep(this.currentNote.cells);
      const index = cells.findIndex((item) => item.uuid === cellUuid);
      const before = cells.slice(0, index + 1);
      const after = cells.slice(index + 1);
      const newUuid = uuid();
      const newCells = [...before, { uuid: newUuid, type: "markdown", data: "" }, ...after];
      await this.updateCells(newCells);
      this.$nextTick(() => {
        this.$refs[newUuid][0].editor.focus();
      });
    },

    async onChange(val, cellUuid) {
      const newCells = _.cloneDeep(this.currentNote.cells).map((cell) => {
        if (cell.uuid === cellUuid) {
          cell.data = val;
        }
        return cell;
      });
      await this.updateCells(newCells);
    },

    async onCellTypeChange(type) {
      const newCells = _.cloneDeep(this.currentNote.cells).map((cell) => {
        if (cell.uuid === this.currentCell.uuid) {
          cell.type = type;
          if (cell.type !== "code") {
            delete cell.language;
          }
        }
        return cell;
      });
      await this.updateCells(newCells);
    },

    async onCellLanguageChange(language) {
      const newCells = _.cloneDeep(this.currentNote.cells).map((cell) => {
        if (cell.uuid === this.currentCell.uuid) {
          cell.language = language;
        }
        return cell;
      });
      await this.updateCells(newCells);
    },
  },
};
</script>

<style lang="less" scoped>
@import "./editor";
</style>
