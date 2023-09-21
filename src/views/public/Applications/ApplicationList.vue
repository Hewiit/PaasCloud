<template>
  <div class="page-container">
    <!-- 新增部署 弹窗-->
    <v-dialog v-model="newDialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="blue darken-2"
          style="margin-bottom: 30px"
          dark
          v-bind="attrs"
          v-on="on"
          ><v-icon>mdi-plus</v-icon>新建应用</v-btn
        >
      </template>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> 新增应用 </v-card-title>
        <v-card-text style="margin-top: 10px">
          <v-text-field
            prepend-icon="mdi-hexagon-slice-6"
            label="namespace"
            :rules="rules"
            hide-details="auto"
            v-model="namespace"
            outlined
          ></v-text-field>
        </v-card-text>
        <v-card-text>
          <v-file-input
            outlined
            v-model="depConfig"
            placeholder="部署YAML文件（可上传多个)"
            label="部署Config"
            multiple
            prepend-icon="mdi-paperclip"
            accept=".yaml"
          >
            <template v-slot:selection="{ text }">
              <v-chip small label color="primary">
                {{ text }}
              </v-chip>
            </template>
          </v-file-input>

          <v-file-input
            outlined
            v-model="srvConfig"
            placeholder="服务YAML文件（可上传多个)"
            label="服务Config"
            accept=".yaml"
            multiple
            prepend-icon="mdi-paperclip"
          >
            <template v-slot:selection="{ text }">
              <v-chip small label color="primary">
                {{ text }}
              </v-chip>
            </template>
          </v-file-input>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="onCreateConfirm"> 确认 </v-btn>
          <v-btn color="primary" text @click="newDialog = false"> 取消 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 新增部署 弹窗结束-->
    <v-expansion-panels popout hover>
      <v-expansion-panel
        active-class="expansion-panel-class"
        v-for="(item, i) in dataList"
        :key="i"
      >
        <v-expansion-panel-header>
          <template v-slot:default="{ open }">
            <div class="panel-header">
              <h3>应用名称(namespace) :{{ item.namespace }}</h3>
              <v-chip class="chip" color="blue darken-4" dark label
                >部署数量:{{ item.deployments.length }}</v-chip
              >
              <v-chip class="chip" color="indigo lighten-2" dark label
                >服务数量{{ item.services.length }}</v-chip
              >
            </div>
            <div class="delete-button" v-if="open">
              <!-- 删除 弹窗-->
              <v-dialog v-model="deleteDialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="red darken-2"
                    style="margin-right: 10px"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    @click="onDeleteClick"
                    >删除</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title class="text-h5 grey lighten-2">
                    删除
                  </v-card-title>
                  <v-card-text style="margin-top: 10px">
                    <v-text-field
                      prepend-icon="mdi-hexagon-slice-6"
                      label="namespace"
                      disabled
                      :rules="rules"
                      hide-details="auto"
                      v-model="item.namespace"
                      outlined
                    ></v-text-field>
                  </v-card-text>
                  <v-card-text> 确认删除？ </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="onDeleteConfirm(item)">
                      确认删除
                    </v-btn>
                    <v-btn color="primary" text @click="deleteDialog = false">
                      取消
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- 删除部署 弹窗结束-->
            </div>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card elevation="0" color="blue lighten-2" dark flat>
            <v-card-title>部署列表</v-card-title>
            <v-card elevation="0" light outlined>
              <v-simple-table light style="margin: 10px">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left cell-width">部署名称</th>
                      <th class="text-left">namespace</th>
                      <th class="text-left">可用副本</th>
                      <th class="text-left">副本数量</th>
                      <th class="text-left">创建时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(dep, i) in item.deployments" :key="i">
                      <td class="cell-width">{{ dep.name }}</td>
                      <td class="cell-width">{{ dep.namespace }}</td>
                      <td class="cell-width">{{ dep.replicas }}</td>
                      <td class="cell-width">{{ dep.available_replicas }}</td>
                      <td class="cell-width">
                        {{ dep.creation_timestamp }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-card>
          <v-card elevation="0" color="blue lighten-2" dark flat>
            <v-card-title>服务列表</v-card-title>
            <v-card elevation="0" light outlined>
              <v-simple-table light style="margin: 10px">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left cell-width">服务名称</th>
                      <th class="text-left">namespace</th>
                      <th class="text-left">集群ip</th>
                      <th class="text-left">外部ip</th>
                      <th class="text-left">创建时间</th>
                      <th class="text-left">端口</th>
                      <th class="text-left">服务类型</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(srv, i) in item.services" :key="i">
                      <td class="cell-width">{{ srv.name }}</td>
                      <td class="cell-width">{{ srv.namespace }}</td>
                      <td class="cell-width">{{ srv.cluster_ip }}</td>
                      <td class="cell-width" v-if="srv.external_i_ps != null">
                        <div v-for="(port, k) in srv.external_i_ps" :key="k">
                          {{ port }} <br />
                        </div>
                      </td>
                      <td class="cell-width" v-else>NULL</td>
                      <td class="cell-width">
                        {{ srv.creation_timestamp }}
                      </td>
                      <td class="cell-width">
                        <div v-for="(port, j) in srv.ports" :key="j">
                          { 节点端口： {{ port.node_port }}, 端口：{{
                            port.port
                          }}, 协议:{{ port.protocol }} }<br />
                        </div>
                      </td>
                      <td class="cell-width">
                        {{ srv.type }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-snackbar v-model="snackbar" :color="snackColor">
      {{ snackText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: "ApplicationList",
  mounted() {
      this.refresh();
  },
  data() {
    return {
      rules: [(value) => !!value || "必填"],
      namespace: "",
      depConfig: [],
      srvConfig: [],
      dataList: [],
      newDialog: false,
      deleteDialog: false,
        snackbar: false,
      snackColor: "red",
      snackText: "操作成功",
    };
  },
  methods: {
    onCreateConfirm() {
         if (
        !this.namespace)
        {
        this.toastE("字段不得留空");
        return;
      }
      this.$api.apps.mock
        .create_application(this.namespace, this.depConfig,this.srvConfig)
        .then((res) => {
          this.toast(res);
          this.refresh();
        })
        .catch((e) => {
          this.toastE(e);
          this.refresh();
        });
    },
    onDeleteClick() {
        this.deleteDialog = true;
    },
    onDeleteConfirm(item) {
        this.$api.apps.mock
        .delete_application(item.namespace)
        .then((res) => {
          this.toast(res);
          this.refresh();
        })
        .catch((e) => {
          this.toastE(e);
          this.refresh();
        });
    },
    refresh() {
      this.$api.apps.mock.getApps().then((res) => {
        this.dataList = res;
      });
    },
     toast(res) {
      if (typeof res ===  "string" && res.includes("success")) {
        this.snackColor = "green";
        this.snackText = "操作成功";
        this.snackbar = true;
      } else {
        this.toastE(res);
      }
      this.deleteDialog = false;
      this.newDialog = false;
    },
    toastE(res) {
      this.snackColor = "red";
      this.snackText = "操作失败:" + res;
      this.snackbar = true;
    },
  },
};
</script>

<style scoped>
@import "./common.css";
</style>