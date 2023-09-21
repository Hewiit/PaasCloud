<template>
  <div class="page-container">
    <v-expansion-panels popout hover>
      <v-expansion-panel
        active-class="expansion-panel-class"
        v-for="(item, i) in dataList"
        :key="i"
      >
        <v-expansion-panel-header>
          <div class="panel-header">
            <h3>Pod 名称 :{{ item.name }}</h3>
            <v-chip class="chip" color="blue darken-4" dark label
              >namespace:{{ item.namespace }}</v-chip
            >
            <v-chip class="chip" color="indigo lighten-2" dark label
              >node 名称:{{ item.node_name }}</v-chip
            >
            <v-chip class="chip" color="blue" dark label
              >node IP地址:{{ item.pod_ip }}</v-chip
            >
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card elevation="0" color="blue lighten-2" dark flat> 
            <v-card-title>容器列表</v-card-title>
            <v-card elevation="0" light  outlined>
              <v-simple-table light style="margin:10px">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left cell-width">容器名称</th>
                      <th class="text-left">容器ID</th>
                      <th class="text-left">镜像</th>
                      <th class="text-left">镜像ID</th>
                      <th class="text-left">状态</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="container in item.container_statuses" :key="container.container_id">
                      <td class="cell-width">{{ container.name }}</td>
                      <td class="cell-width">{{ container.container_id }}</td>
                      <td class="cell-width">{{ container.image }}</td>
                      <td class="cell-width">{{ container.image_id }}</td>
                      <td class="cell-width"> <span v-if="container.ready">就绪</span> <span v-else>未就绪</span></td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
export default {
  name: "ApplicationList",
  created(){
    this.$api.apps.mock.getPods().then((res)=>{
      this.dataList = res;
    });
  },
  data() {
    return {
      dataList: [
      ]
    };
  },
  methods: {},
};
</script>

<style scoped>
@import "./common.css";
</style>