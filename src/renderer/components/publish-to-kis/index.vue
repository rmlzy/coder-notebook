<template>
  <div>
    <a-button ghost size="small" type="primary" icon="rocket" @click="showModal">
      发布
    </a-button>

    <a-modal :visible="visible" title="发布到 Kis" style="top: 5%;" width="600px" @cancel="onCancel">
      <a-form-model layout="vertical">
        <a-form-model-item label="路径">
          <a-input v-model="formData.pathname" />
        </a-form-model-item>
        <a-form-model-item label="摘要">
          <a-input v-model="formData.summary" />
        </a-form-model-item>
        <a-form-model-item label="分类">
          <a-radio-group v-model="formData.categoryId">
            <a-radio v-for="item in categoryList" :key="item.id" :value="item.id">{{ item.name }}</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="标签">
          <a-checkbox-group v-model="formData.tagIds">
            <a-checkbox v-for="item in tagList" :key="item.id" :value="item.id">{{ item.name }}</a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-radio-group v-model="formData.status">
            <a-radio v-for="item in statusList" :key="item.value" :value="item.value">{{ item.label }}</a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>

      <template slot="footer">
        <a-button key="back" @click="onCancel">{{ $t("Cancel") }}</a-button>
        <a-button :loading="saveLoading" key="submit" type="primary" @click="onOk">{{ $t("Apply") }}</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getCategories, getTags, updateBlog, syncBlog } from "@/helpers/kis";

export default {
  name: "publish-to-kis",
  data() {
    return {
      visible: false,
      categoryList: [],
      tagList: [],
      statusList: [
        { label: "草稿", value: "DRAFT" },
        { label: "立即发布", value: "PUBLISHED" },
        { label: "置顶", value: "TOP" },
        { label: "隐藏", value: "HIDE" },
      ],
      formData: {
        id: "",
        pathname: "",
        summary: "",
        categoryId: "",
        tagIds: [],
        status: "",
      },
      saveLoading: false,
    };
  },
  computed: {
    ...mapState({
      config: (state) => state.app.config,
      currentNote: (state) => state.app.currentNote,
      currentNotebookUuid: (state) => state.app.currentNotebookUuid,
      currentNoteUuid: (state) => state.app.currentNoteUuid,
    }),
  },
  methods: {
    async getCategories() {
      this.categoryList = await getCategories(this.config.kis);
    },

    async getTags() {
      this.tagList = await getTags(this.config.kis);
    },

    async showModal() {
      const { id, pathname, summary, categoryId, tagIds, status } = this.currentNote;
      this.formData = {
        id,
        pathname,
        summary,
        categoryId,
        tagIds,
        status,
      };
      await this.getCategories();
      await this.getTags();
      this.visible = true;
    },

    async onCancel() {
      this.formData = {
        id: "",
        pathname: "",
        summary: "",
        categoryId: "",
        tagIds: [],
        status: "",
      };
      this.visible = false;
    },

    async onOk() {
      const { host, token } = this.config.kis;
      const { uuid, title, content } = this.currentNote;
      const fd = {
        host,
        token,
        title,
        content,
        ...this.formData,
      };
      this.saveLoading = true;
      try {
        const res = await updateBlog(fd);
        await syncBlog({ host, token, id: res.data, uuid });
        await this.$store.dispatch("app/selectNotebook", { notebookUuid: "KIS_NOTEBOOK", noteUuid: uuid });
        if (res.success) {
          this.$message.success(res.message);
          await this.onCancel();
        } else {
          this.$message.error(res.message);
        }
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.saveLoading = false;
      }
    },
  },
};
</script>
