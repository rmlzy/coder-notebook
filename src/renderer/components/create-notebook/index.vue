<template>
  <div class="create-notebook">
    <a-icon type="plus" @click="showDialog" />

    <a-modal
      centered
      :title="$t('CreateNotebook')"
      :visible.sync="visible"
      :ok-text="$t('Ok')"
      :cancel-text="$t('Cancel')"
      @ok="onOk"
      @cancel="onCancel"
    >
      <a-form-model ref="dialogForm" :model="dialogForm" :rules="dialogRules">
        <a-form-model-item prop="name">
          <a-input
            v-model="dialogForm.name"
            :placeholder="$t('PleaseInputNotebookName')"
            :max-length="20"
            :suffix="dialogForm.name.length + '/20'"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { createNotebook } from "@/helpers/util";

export default {
  name: "create-notebook",
  data() {
    return {
      visible: false,
      dialogForm: {
        name: "",
      },
      dialogRules: {
        name: [{ required: true, message: this.$t("PleaseInputNotebookName") }],
      },
    };
  },
  methods: {
    showDialog() {
      this.visible = true;
    },

    onCancel() {
      this.$refs.dialogForm.resetFields();
      this.dialogForm = { name: "" };
      this.visible = false;
    },

    async onOk() {
      const nbUuid = await createNotebook(this.dialogForm.name);
      await this.$store.dispatch("app/refreshNotebooks");
      await this.$store.dispatch("app/selectNotebook", { notebookUuid: nbUuid });
      this.onCancel();
    },
  },
};
</script>

<style lang="scss" scoped>
.create-notebook {
  .anticon-plus {
    font-size: 18px;
    cursor: pointer;
  }
}
</style>
