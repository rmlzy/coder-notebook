<template>
  <a-modal :visible="visible" :title="$t('Preference')" style="top: 5%;" width="400px" @cancel="onCancel">
    <a-form-model layout="vertical">
      <a-form-model-item :label="$t('AppName')">
        <a-input v-model="formData.name" />
      </a-form-model-item>
      <a-form-model-item :label="$t('DataPath')">
        <a-input v-model="formData.dataPath">
          <a href="javascript:;" slot="addonAfter" @click="openDataPathInFinder">{{ $t("Open") }}</a>
        </a-input>
      </a-form-model-item>
      <a-form-model-item :label="$t('Language')">
        <a-select v-model="formData.language">
          <a-select-option v-for="item in languageList" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-model-item :label="$t('Theme')">
            <a-select v-model="formData.theme" @change="onChangeTheme">
              <a-select-option v-for="item in themeList" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" v-if="formData.theme === 'light'">
          <a-form-model-item :label="$t('BackgroundImage')">
            <a-select v-model="formData.bg">
              <a-select-option v-for="item in lightBgList" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" v-if="formData.theme === 'dark'">
          <a-form-model-item :label="$t('BackgroundImage')">
            <a-select v-model="formData.bg">
              <a-select-option v-for="item in darkBgList" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
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
import { setFullConfig, showInFinder, moveDataFolder } from "@/helpers/util";

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
      lightBgList: [
        { label: "不设定", value: "" },
        { label: "祥云", value: "light-bg1" },
        { label: "石灰石", value: "light-bg2" },
        { label: "石板", value: "light-bg3" },
        { label: "条纹", value: "light-bg4" },
        { label: "鸟", value: "light-bg5" },
        { label: "等高线", value: "light-bg6" },
        { label: "粗糙", value: "light-bg7" },
        { label: "三角形", value: "light-bg8" },
      ],
      darkBgList: [
        { label: "不设定", value: "" },
        { label: "方块", value: "dark-bg1" },
        { label: "机器人", value: "dark-bg2" },
        { label: "亚麻", value: "dark-bg3" },
        { label: "黑曼巴", value: "dark-bg4" },
        { label: "旧衬衫", value: "dark-bg5" },
        { label: "台球桌", value: "dark-bg6" },
        { label: "十字", value: "dark-bg7" },
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
    openDataPathInFinder() {
      const { dataPath } = this.formData;
      try {
        showInFinder(dataPath);
      } catch (e) {
        this.$error({
          title: "ERROR",
          content: `${dataPath} not existed!`,
        });
      }
    },

    onChangeTheme() {
      this.formData.bg = "";
    },

    onCancel() {
      this.$emit("cancel", null);
    },

    async onOk() {
      const { dataPath, name, theme, language } = this.formData;
      if (theme) {
        document.body.setAttribute("class", `theme-${theme}`);
      }
      if (name) {
        document.title = name;
      }
      if (language) {
        i18n.locale = language;
      }
      if (dataPath !== this.config.dataPath) {
        await moveDataFolder(dataPath);
      }
      await this.$store.dispatch("app/setConfig", this.formData);
      await setFullConfig(this.formData);
      await this.$emit("ok", null);
    },
  },
};
</script>