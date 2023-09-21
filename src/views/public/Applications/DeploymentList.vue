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
          ><v-icon>mdi-plus</v-icon>新增部署</v-btn
        >
      </template>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> 新增部署 </v-card-title>
        <v-card-text style="margin-top: 10px">
          <v-text-field
            prepend-icon="mdi-hexagon-slice-6"
            label="namespace"
            :rules="rules"
            hide-details="auto"
            v-model="newNamespace"
            outlined
          ></v-text-field>
        </v-card-text>
        <v-card-text>
          <v-file-input
            prepend-icon="mdi-application-edit-outline"
            outlined
            v-model="newYAML"
            accept=".yaml"
            placeholder="点击上传文件"
            truncate-length="255"
          >
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
          <div class="panel-header">
            <h3>部署名称 :{{ item.name }}</h3>
            <v-chip class="chip" color="blue darken-4" dark label
              >namespace:{{ item.namespace }}</v-chip
            >
            <v-chip class="chip" color="indigo lighten-2" dark label
              >副本数量:{{ item.replicas }}</v-chip
            >
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card elevation="0" color="blue lighten-2" dark flat>
            <v-card-title>详情与操作</v-card-title>
            <v-card elevation="0" light outlined>
              <v-card-subtitle> 创建时间 </v-card-subtitle>
              <v-card-text>{{ item.creation_timestamp }}</v-card-text>

              <v-card-subtitle> 副本数量 </v-card-subtitle>
              <v-card-text>{{ item.replicas }}</v-card-text>

              <v-card-subtitle> 可用副本数量 </v-card-subtitle>
              <v-card-text>{{ item.available_replicas }}</v-card-text>
              <v-card-actions>
                <!-- 更新部署 弹窗-->
                <v-dialog v-model="dialog" width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="orange darken-2"
                      style="margin-right: 10px"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      @click="onUpdateClick(item)"
                      >更新</v-btn
                    >
                  </template>
                  <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                      更新部署
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
                    <v-card-text>
                      <v-text-field
                        label="名称"
                        prepend-icon="mdi-tag-outline"
                        disabled
                        :rules="rules"
                        hide-details="auto"
                        v-model="item.name"
                        outlined
                      ></v-text-field>
                    </v-card-text>
                    <v-card-text>
                      <v-file-input
                        prepend-icon="mdi-application-edit-outline"
                        outlined
                        v-model="updateYAML"
                        accept=".yaml"
                        placeholder="点击上传文件"
                        truncate-length="255"
                      >
                      </v-file-input>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text @click="onUpdateConfirm(item)"> 确认 </v-btn>
                      <v-btn color="primary" text @click="dialog = false">
                        取消
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <!-- 更新部署 弹窗结束-->
                <!-- 删除部署 弹窗-->
                <v-dialog v-model="deleteDialog" width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="red darken-2"
                      style="margin-right: 10px"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      >删除</v-btn
                    >
                  </template>
                  <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                      删除部署
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
                    <v-card-text>
                      <v-text-field
                        label="名称"
                        prepend-icon="mdi-tag-outline"
                        disabled
                        :rules="rules"
                        hide-details="auto"
                        v-model="item.name"
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
              </v-card-actions>
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
  name: "DeploymentList",
  mounted() {
    this.refresh();
  },
  data() {
    return {
      updateYAML: "",
      newNamespace: "",
      newYAML: "",
      dataList: [],
      dialog: false,
      newDialog: false,
      deleteDialog: false,
      snackbar: false,
      snackColor: "red",
      snackText: "操作成功",
      rules: [(value) => !!value || "必填"],
    };
  },
  methods: {
    onUpdateClick() {
      this.dialog = true;
    },
    onUpdateConfirm(item) {
      if (!this.updateYAML) {
        this.toastE("字段不得留空");
        return;
      }
      this.$api.apps.mock
        .update_deployment(item.name, item.namespace, this.updateYAML)
        .then((res) => {
          this.toast(res);
          this.refresh();
        })
        .catch((e) => {
          this.toastE(e);
          this.refresh();
        });
    },
    onCreateConfirm() {
      if (
        !this.newNamespace ||
        !this.newYAML ||
        this.newNamespace.length === 0
      ) {
        this.toastE("字段不得留空");
        return;
      }
      this.$api.apps.mock
        .create_deployment(this.newNamespace, this.newYAML)
        .then((res) => {
          this.toast(res);
          this.refresh();
        })
        .catch((e) => {
          this.toastE(e);
          this.refresh();
        });
    },
    onDeleteConfirm(item) {
      this.$api.apps.mock
        .delete_deployment(item.name, item.namespace)
        .then((res) => {
          this.toast(res);
          this.refresh();
        })
        .catch((e) => {
          this.toastE(e);
          this.refresh();
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
      this.dialog = false;
      this.deleteDialog = false;
      this.newDialog = false;
    },
    toastE(res) {
      this.snackColor = "red";
      this.snackText = "操作失败:" + res;
      this.snackbar = true;
    },
    refresh() {
      this.$api.apps.mock.getDeployments().then((res) => {
        this.dataList = res;
      });
    },
  },
};
</script>

<style scoped>
@import "./common.css";
</style>