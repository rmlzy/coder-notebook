<template>
  <div class="create-notebook">
    <i class="el-icon-plus" @click="showDialog"></i>

    <el-dialog title="创建文件夹" :visible.sync="visible" append-to-body>
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules">
        <el-form-item prop="name">
          <el-input placeholder="请输入文件夹名称" maxlength="20" show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="onDialogOk">创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "create-notebook",
  data() {
    return {
      visible: false,
      dialogForm: {
        name: "",
      },
      dialogRules: {
        name: [{ required: true, message: "请输入文件夹名称" }],
      },
    };
  },
  methods: {
    showDialog() {
      this.visible = true;
    },

    closeDialog() {
      this.$refs.dialogForm.resetFields();
      this.dialogForm = { name: "" };
      this.visible = false;
    },

    onDialogOk() {},
  },
};
</script>

<style lang="scss" scoped>
.create-notebook {
  i {
    cursor: pointer;
  }
}
</style>
