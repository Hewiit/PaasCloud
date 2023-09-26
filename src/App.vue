<template>
  <v-app>
    <v-app-bar
        app
        color="black"
        dark
    >
      <div class="d-flex align-center">
        <span style="font-size: 35px; font-weight: bold;">PassCloud</span>
      </div>
      <v-tabs v-model="selectedTab">
        <v-tab
            v-for="(item, index) in items"
            :key="index"
            :to="item.route"
        >
          {{ item.title }}
        </v-tab>
      </v-tabs>
    </v-app-bar>

<!--    <v-navigation-drawer-->
<!--        permanent-->
<!--        app-->
<!--    >-->
<!--      <v-list-item>-->
<!--        <v-list-item-content>-->
<!--          <v-list-item-title class="text-h6">-->
<!--            PaaS Platform-->
<!--          </v-list-item-title>-->
<!--          <v-list-item-subtitle></v-list-item-subtitle>-->
<!--        </v-list-item-content>-->
<!--      </v-list-item>-->

<!--      <v-divider></v-divider>-->

<!--      &lt;!&ndash; 使用 v-tabs 替代 v-list &ndash;&gt;-->

<!--    </v-navigation-drawer>-->

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { VTabs, VTab } from 'vuetify/lib'

export default {
  name: 'App',
  components: {
    VTabs, // 导入 v-tabs 组件
    VTab    // 导入 v-tab 组件
  },
  data() {
    return {
      selectedTab: null, // 用于存储选中的标签
      items: [
        { title: '镜像管理', icon: 'mdi-view-dashboard', route: '/images' },
        { title: '容器管理', icon: 'mdi-forum', route: '/containers' },
        { title: 'pods容器组', icon: 'mdi-card-multiple', route: '/pods' },
        { title: '部署管理', icon: 'mdi-content-duplicate', route: '/deployments' },
      ],
    };
  },
};
</script>

<style>
*::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

*::-webkit-scrollbar-thumb {
  border-radius: 15px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #999;
}

*::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #EDEDED;
}
</style>
