<template>
  <a-modal
    :visible="visible"
    :title="$t('Preference')"
    :bodyStyle="{ height: '400px' }"
    width="600px"
    top="5%"
    @cancel="onCancel"
    @ok="onOk"
    :ok-text="$t('Ok')"
    :cancel-text="$t('Cancel')"
  >
    <a-form-model layout="vertical">
      <a-tabs v-model="activeTab" tab-position="left">
        <a-tab-pane key="theme" :tab="$t('ThemeConfig')">
          <a-form-model-item :label="$t('Theme')">
            <a-select v-model="config.theme">
              <a-select-option v-for="theme in themeList" :key="theme.value" :value="theme.value">
                {{ theme.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-tab-pane>
      </a-tabs>
    </a-form-model>
  </a-modal>
</template>

<script>
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
      config: {},
    };
  },
  methods: {
    onOk() {
      this.$emit("ok", null);
    },

    onCancel() {
      this.$emit("cancel", null);
    },
  },
};
</script>
