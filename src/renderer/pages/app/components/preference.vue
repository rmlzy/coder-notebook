<template>
  <a-modal :visible="visible" :title="$t('Preference')" style="top: 5%;" width="400px" @cancel="onCancel">
    <a-form-model layout="vertical">
      <a-form-model-item :label="$t('Language')">
        <a-select v-model="formData.language">
          <a-select-option v-for="item in languageList" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item :label="$t('Theme')">
        <a-select v-model="formData.theme">
          <a-select-option v-for="item in themeList" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>

    <template slot="footer">
      <a-button key="back" @click="onCancel">{{ $t("Cancel") }}</a-button>
      <a-button key="submit" type="primary" :disabled="!isChanged" @click="onOk">{{ $t("Apply") }}</a-button>
    </template>
  </a-modal>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import i18n from "@/i18n";
import { setFullConfig } from "@/helpers/util";

export default {
  name: "setting",
  props: ["visible"],
  data() {
    return {
      activeTab: "theme",
      themeList: [
        { label: this.$t("LightTheme"), value: "light" },
        { label: this.$t("DarkTheme"), value: "dark" },
      ],
      languageList: [
        { label: "简体中文", value: "zh-CN" },
        { label: "繁體中文", value: "zh-TW" },
        { label: "English", value: "en-US" },
        { label: "日本語", value: "ja" },
        { label: "한국어", value: "ko" },
      ],
      formData: {},
    };
  },
  computed: {
    ...mapState({
      config: (state) => state.app.config,
    }),
    isChanged() {
      return JSON.stringify(this.config) !== JSON.stringify(this.formData);
    },
  },
  watch: {
    config(newVal) {
      this.formData = _.cloneDeep(newVal);
    },
  },
  methods: {
    async onOk() {
      const { theme, language } = this.formData;
      if (theme) {
        document.body.setAttribute("class", `theme-${theme}`);
      }
      if (language) {
        i18n.locale = language;
      }
      await this.$store.dispatch("app/setConfig", this.formData);
      await setFullConfig(this.formData);
      await this.$emit("ok", null);
    },

    onCancel() {
      this.$emit("cancel", null);
    },
  },
};
</script>
