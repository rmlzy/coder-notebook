<template>
  <div class="preview">
    <div class="preview__title">{{ title }}</div>
    <div class="markdown-body" v-html="html"></div>

    <a-modal v-model="codeVisible" :title="codeTitle">
      <p>{{ codeContent }}</p>
      <template slot="footer">
        <a-button type="primary" @click="closeCodeModal">{{ $t("Ok") }}</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import $ from "jquery";
import { runCurl } from "@/helpers/util";

export default {
  name: "preview",
  props: ["title", "html"],
  data() {
    return {
      codeVisible: false,
      codeTitle: "",
      codeContent: "",
    };
  },
  mounted() {
    const vm = this;
    $(".is-run-code").on("click", async function () {
      const code = $(this).find(".is-run-code__real").text();
      const language = $(this).attr("data-language");
      if (language === "bash") {
        const res = await runCurl(code);
        vm.codeTitle = res.success ? vm.$t("Success") : vm.$t("Error");
        vm.codeContent = res.data;
        vm.codeVisible = true;
      }
    });
  },
  methods: {
    closeCodeModal() {
      this.codeTitle = "";
      this.codeContent = "";
      this.codeVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.preview {
  width: 100%;
  height: 100%;
  padding: 0 30px 30px;
  word-break: break-all;

  &__title {
    font-size: 18px;
    font-weight: 500;
    padding: 15px 10px;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 10px;
  }
}
</style>
