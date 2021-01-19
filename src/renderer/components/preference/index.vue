<template>
  <a-modal :visible="visible" :title="$t('Preference')" centered width="600px" @cancel="onCancel">
    <a-form-model layout="vertical">
      <a-tabs v-model="activeTab" tab-position="left" @change="onActiveTabChange">
        <a-tab-pane key="theme" :tab="$t('Theme')">
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
              <a-select-option v-for="item in enums.languageList" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-model-item :label="$t('Theme')">
                <a-select v-model="formData.theme" @change="onChangeTheme">
                  <a-select-option v-for="item in enums.themeList" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="formData.theme === 'light'">
              <a-form-model-item :label="$t('BackgroundImage')">
                <a-select v-model="formData.bg">
                  <a-select-option v-for="item in enums.lightBgList" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="formData.theme === 'dark'">
              <a-form-model-item :label="$t('BackgroundImage')">
                <a-select v-model="formData.bg">
                  <a-select-option v-for="item in enums.darkBgList" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="kis" tab="连接配置">
          <a-form-model-item label="域名">
            <a-input v-model="formData.kis.host" placeholder="请填写域名" />
          </a-form-model-item>
          <a-form-model-item label="邮箱">
            <a-input v-model="formData.kis.email" placeholder="请填写邮箱" />
          </a-form-model-item>
          <a-form-model-item label="密码">
            <a-input type="password" v-model="formData.kis.password" placeholder="请填写密码" />
          </a-form-model-item>
          <a-form-model-item label="文件夹名称">
            <a-input v-model="formData.kis.notebookName" placeholder="Kis 所有的文章将被同步到此文件夹下" />
          </a-form-model-item>
          <a-button v-if="!kisIsValid" size="small" type="primary" @click="testKisConnect">测试连接</a-button>
          <a-button v-else :loading="kisSyncLoading" size="small" type="primary" @click="onSyncKis">
            开始同步
          </a-button>
        </a-tab-pane>
      </a-tabs>
    </a-form-model>

    <template slot="footer">
      <a-button key="back" @click="onCancel">{{ $t("Cancel") }}</a-button>
      <a-button key="submit" type="primary" :disabled="!isChanged" @click="onOk">{{ $t("Apply") }}</a-button>
    </template>
  </a-modal>
</template>

<script>
import $ from "jquery";
import _ from "lodash";
import { mapState } from "vuex";
import i18n from "@/i18n";
import { setFullConfig, showInFinder, moveDataFolder } from "@/helpers/util";
import { syncAllBlogs } from "@/helpers/kis";
import { languageList, lightBgList, darkBgList } from "./const";

export default {
  name: "setting",
  props: ["visible"],
  data() {
    return {
      activeTab: "theme",
      enums: {
        themeList: [
          { label: this.$t("LightTheme"), value: "light" },
          { label: this.$t("DarkTheme"), value: "dark" },
        ],
        languageList,
        lightBgList,
        darkBgList,
      },
      formData: {
        name: "",
        dataPath: "",
        language: "",
        theme: "",
        bg: "",
        kis: {
          host: "",
          email: "",
          password: "",
          token: "",
          notebookName: "",
        },
      },
      kisIsValid: false,
      kisSyncLoading: false,
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

    onActiveTabChange() {},

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

    async getCaptcha() {
      let captcha = "";
      try {
        const { host } = this.formData.kis;
        const res = await $.ajax(`${host}/api/v1/captcha`, { type: "GET" });
        if (res.success) {
          captcha = res.debug;
        }
      } catch (e) {
        // pass
      }
      return captcha;
    },

    async getToken({ email, password, captcha }) {
      let token = "";
      try {
        const { host } = this.formData.kis;
        const res = await $.ajax(`${host}/api/v1/login`, {
          type: "POST",
          data: { email, password, captcha },
        });
        if (res.success) {
          token = res.data;
        }
      } catch (e) {
        // pass
      }
      return token;
    },

    async testKisConnect() {
      const { host, email, password, notebookName } = this.formData.kis;
      if (!host) {
        this.$message.warning("请填写域名");
        return;
      }
      if (!email) {
        this.$message.warning("请填写邮箱");
        return;
      }
      if (!password) {
        this.$message.warning("请填写密码");
        return;
      }
      const captcha = await this.getCaptcha();
      const token = await this.getToken({ email, password, captcha });
      const res = await $.ajax(`${host}/api/v1/check-token`, {
        type: "POST",
        data: { token },
      });
      if (!res.success) {
        this.$message.error(res.message);
        return;
      }
      this.kisIsValid = true;
      this.$confirm({
        title: "Token 校验成功!",
        content: `是否将 kis 所有的文章同步到 ${notebookName}?`,
        okText: this.$t("Ok"),
        cancelText: this.$t("Cancel"),
        onOk: () => {
          this.onSyncKis();
        },
        onCancel: () => {},
      });
    },

    async onSyncKis() {
      this.kisSyncLoading = true;
      const { host, token, notebookName } = this.formData.kis;
      try {
        await syncAllBlogs({ host, token, notebookName });
        await this.$store.dispatch("app/refreshNotebooks");
        this.$message.success("同步成功");
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.kisSyncLoading = false;
      }
    },
  },
};
</script>
