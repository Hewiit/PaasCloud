<template>
  <div>
    <template>
      <v-card>
        <v-tabs
          background-color="light-blue accent-4"
          @change="changeTab"
          center-active
          dark
        >
          <v-tab>Pods 容器</v-tab>
          <v-tab>Deployment 部署</v-tab>
          <v-tab>Service 服务</v-tab>
          <v-tab>Applications 应用</v-tab>
        </v-tabs>
      </v-card>
    </template>
    <router-view />
  </div>
</template>
<script>
export default {
  name: "Applications",
  components: {},
  methods: {
    changeTab(index) {
      switch (index) {
  
        case 0:
          this.$router.push("/applications/pods");
          break;
        case 1:
          this.$router.push("/applications/deployments");
          break;
        case 2:
          this.$router.push("/applications/services");
          break;
        case 3:
          this.$router.push("/applications/applications");
          break;
      }
    },
  },
};
</script>
