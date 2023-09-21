<template>
  <div>
    <v-card class="ma-2 mt-6 elevation-4 pa-2">
      <v-card-title>
        容器管理
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table
          :headers="headers"
          :items="containers"
          disable-pagination
          :hide-default-footer="true"
          :search="search"
      >
        <template v-slot:item.actions="{ item }">
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-icon @click="inspectContainer(item)" v-on="on" v-bind="attrs">mdi-eye</v-icon>
            </template>
            <span>查看容器</span>
          </v-tooltip>
          &nbsp;
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-icon @click="command('start',item)" v-on="on" v-bind="attrs">mdi-play-circle-outline</v-icon>
            </template>
            <span>启动容器</span>
          </v-tooltip>
          &nbsp;
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-icon @click="command('stop',item)" v-on="on" v-bind="attrs">mdi-stop-circle-outline</v-icon>
            </template>
            <span>停止容器</span>
          </v-tooltip>
          &nbsp;
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-icon @click="command('restart',item)" v-on="on" v-bind="attrs">mdi-restart</v-icon>
            </template>
            <span>重启容器</span>
          </v-tooltip>
          &nbsp;
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-icon @click="handleCommitContainer(item)" v-on="on" v-bind="attrs">mdi-file-edit-outline</v-icon>
            </template>
            <span>提交容器</span>
          </v-tooltip>
          &nbsp;
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-icon @click="command('delete',item)" v-on="on" v-bind="attrs">mdi-delete-outline</v-icon>
            </template>
            <span>删除容器</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="blue darken-2" dark fab fixed :right="true" :bottom="true"
               @click="runDialogFlag = true" v-on="on" v-bind="attrs"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>创建新容器</span>
    </v-tooltip>
    <v-dialog v-model="runDialogFlag" max-width="960px" @click:outside="refreshList" v-if="runDialogFlag" >
      <v-card :loading="runDialogLoading">
        <v-card-title>
          <span class="headline">从镜像创建新容器</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-text-field v-model="createContainerForm.name" label="名称" clearable></v-text-field>
            </v-row>
            <v-row>
              <v-text-field v-model="createContainerForm.image" label="镜像" clearable></v-text-field>
            </v-row>
            <v-row>
              <v-card width="100%" class="mb-4">
                <v-card-title>设定端口映射</v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col :cols="3">
                        <v-select v-model="createContainerForm.tmp.protocol" :items="['tcp', 'udp']" label="协议"></v-select>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col :cols="4">
                        <v-text-field v-model="createContainerForm.tmp.container_port" label="容器端口" clearable></v-text-field>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col :cols="4">
                        <v-text-field v-model="createContainerForm.tmp.host_port" label="主机端口" clearable></v-text-field>
                      </v-col>
                      <v-col :cols="1">
                        <v-tooltip left>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn text fab @click="addPort" v-on="on" v-bind="attrs">
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </template>
                          <span>添加端口映射</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-chip v-for="pair in createContainerForm.ports" :key="pair[0]" class="ma-2" close
                              @click:close="createContainerForm.ports.splice(createContainerForm.ports.indexOf(pair),1)">
                        {{ pair[0] + pair[1] }}
                      </v-chip>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-row>
            <v-row>
              <v-textarea outlined label="需要执行的命令" v-model="createContainerForm.command"
                          hint="每行一条命令" persistent-hint>
              </v-textarea>
            </v-row>
            <v-row>
              <v-col :cols="6">
                <v-textarea outlined label="绑定卷" v-model="createContainerForm.volume"
                            hint="每行一条绑定命令，格式：/home/user1/:/mnt/vol2" persistent-hint>
                </v-textarea>
              </v-col>
              <v-col :cols="6">
                <v-textarea outlined label="环境变量" v-model="createContainerForm.environment" hint="每行一个，格式：ENV_VAR=xxx" persistent-hint></v-textarea>
              </v-col>
            </v-row>

          </v-container>
        </v-card-text>

        <v-card-actions>
          <span>{{result}}</span>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="runContainer">创建并运行</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="inspectDialogFlag" max-width="960px" v-if="inspectDialogFlag">
      <v-card>
        <v-card-title>
          <span class="headline">{{ containerClicked.name }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>CONTAINER ID: {{containerClicked.longId}}</v-row>
            <v-row>IMAGE SHORT ID: {{containerClicked.id}}</v-row>
            <v-row>STATUS: {{containerClicked.status}}</v-row>
            <v-row>IMAGE: </v-row>
            <v-row>
              <v-col>
                <v-chip :to="{path: '/images/' + containerClicked.image.id.slice(7)}" dark color="blue">{{containerClicked.imageName}}</v-chip>
              </v-col>
            </v-row>
            <v-row>LABELS:</v-row>
            <v-row v-for="label in Object.getOwnPropertyNames(containerClicked.labels)" :key="label">
              <v-col>
                <v-chip v-if="label != '__ob__'"> {{label + ' : ' + containerClicked.labels[label]}} </v-chip>
              </v-col>
            </v-row>
            <v-row>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon @click="command('start',containerClicked)" v-on="on" v-bind="attrs">mdi-play-circle-outline</v-icon>
                </template>
                <span>启动容器</span>
              </v-tooltip>
              &nbsp;
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon @click="command('stop',containerClicked)" v-on="on" v-bind="attrs">mdi-stop-circle-outline</v-icon>
                </template>
                <span>停止容器</span>
              </v-tooltip>
              &nbsp;
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon @click="command('restart',containerClicked)" v-on="on" v-bind="attrs">mdi-restart</v-icon>
                </template>
                <span>重启容器</span>
              </v-tooltip>
              &nbsp;
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon @click="handleCommitContainer(containerClicked)" v-on="on" v-bind="attrs">mdi-file-edit-outline</v-icon>
                </template>
                <span>提交容器</span>
              </v-tooltip>
              &nbsp;
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon @click="command('delete',containerClicked)" v-on="on" v-bind="attrs">mdi-delete-outline</v-icon>
                </template>
                <span>删除容器</span>
              </v-tooltip>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="commitDialogFlag" max-width="960px" v-if="commitDialogFlag">
      <v-card :loading="commitDialogLoading">
        <v-card-title>
          <span class="headline">提交容器{{ containerClicked.name }}到仓库</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col :cols="6">
                <v-text-field v-model="commitContainerForm.repository" label="仓库" clearable></v-text-field>
              </v-col>
              <v-col :cols="6">
                <v-text-field v-model="commitContainerForm.tag" label="标签" clearable></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="commitContainerForm.author" label="作者" clearable></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col :cols="6">
                <v-textarea outlined v-model="commitContainerForm.message" label="消息" clearable></v-textarea>
              </v-col>
              <v-col :cols="6">
                <v-textarea outlined v-model="commitContainerForm.changes" label="附加指令" clearable></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <span>{{result}}</span>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="commitContainer">提交容器</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Containers',
    components: {
      
    },
    props: {
      search: {type: String, default: ''},
    },
    data() {
      return {
        headers: [
          {text: 'NAME', align: 'start', sortable: true, value: 'name'},
          {text: 'SHORT ID', align: 'start', sortable: true, value: 'id'},
          {text: 'IMAGE', align: 'start', sortable: true, value: 'imageName'},
          {text: 'STATUS', align: 'start', sortable: true, value: 'status'},
          {text: 'ACTIONS', align: 'start', sortable: false, value: 'actions'},
        ],
        containers: [],
        containerClicked: {},
        inspectDialogFlag: false,

        runDialogFlag: false,
        runDialogLoading: false,
        createContainerForm: {
          name: '',
          image: '',
          command: '',
          volume: '',
          environment: '',
          ports: [],
          tmp: {
            protocol: '',
            container_port: 0,
            host_port: 0,
          },
        },

        commitDialogFlag: false,
        commitDialogLoading: false,
        commitContainerForm: {
          repository: '',
          tag: '',
          author: '',
          message: '',
          changes: '',
        },
        result: '',

        containerList: [],
      }
    },
    methods: {
      async refreshList() {

        await this.$axios.get('/list_containers').then((res) => {
          if(res) {
            console.log(res);
            this.containerList = res.data;
          }
        }).catch((err) => {
          console.log(err);
        })

        // await new Promise((resolve) => {
        //   this.containerList = [{"id": "c0d61e1a5542835be05f3150e1a64878ad679f11d1f789bef4aa90a62241f3e7","image": {"id": "sha256:9da615fced53bc1bc11e3d7f20a37873362e1d5354354238f0b63c6d549f7f66","tags": ["harbor.scs.buaa.edu.cn/library/mysql:8","harbor.scs.buaa.edu.cn/library/mysql:latest"]},"labels": {},"name": "mysql_test","short_id": "c0d61e1a55","status": "running"},{"id": "fac360b20dfd76c3778b8be9aeb5c8943727ef7ef433bb146ebf8557d11cc9fb","image": {"id": "sha256:9fa1cc16ad6d525b8319e86c05a7fb228f97aeaf4bcda0033a709f018a2e3eee","tags": ["registry.cn-hangzhou.aliyuncs.com/google_containers/kicbase:v0.0.27"]},"labels": {"created_by.minikube.sigs.k8s.io": "true","mode.minikube.sigs.k8s.io": "minikube","name.minikube.sigs.k8s.io": "minikube","role.minikube.sigs.k8s.io": ""},"name": "minikube","short_id": "fac360b20d","status": "running"}];
        //   resolve();
        // })
        this.containers = [];
        for(let i = 0; i < this.containerList.length; i++) {
          let container = {};
          container.name = this.containerList[i].name === "" ? this.containerList[i].short_id : this.containerList[i].name;
          container.id = this.containerList[i].short_id;
          container.status = this.containerList[i].status;
          container.imageName = this.containerList[i].image.tags[0].slice(this.containerList[i].image.tags[0].lastIndexOf('/') + 1);

          container.longId = this.containerList[i].id;
          container.image = this.containerList[i].image;
          container.labels = this.containerList[i].labels;
          this.containers.push(container);
        }
        console.log('List refreshed');
      },
      inspectContainer(item) {
        this.containerClicked = item;
        this.inspectDialogFlag = true;
      },
      handleCommitContainer(item) {
        this.containerClicked = item;
        this.commitDialogFlag = true;
      },
      async command(order, item) {
        switch (order) {
          case "delete": {
            const index = this.containers.indexOf(item);
            confirm('确认删除?') && this.containers.splice(index, 1);

            let form = new FormData();
            form.append('container_id', item.longId);
            await this.$axios.post('/remove_container', form).then((res) => {
              if(res.data === 'remove success') alert(`镜像${item.id}已成功删除`) && this.refreshList();
              else throw res.data;
            }).catch(() => {
              alert(`镜像${item.id}删除失败`);
              this.refreshList();
            })
          }
          break;
          case "start": {
            this.containers[this.containers.indexOf(item)].status = 'CHANGING...';

            let form = new FormData();
            form.append('container_id', item.longId);
            await this.$axios.post('/start_container', form).then((res) => {
              if(res.data === 'start success') alert(`镜像${item.id}已启动`) && this.refreshList();
              else throw res.data;
            }).catch(() => {
              alert(`镜像${item.id}无法启动`);
              this.refreshList();
            })
          }
          break;
          case "stop": {
            this.containers[this.containers.indexOf(item)].status = 'CHANGING...';

            let form = new FormData();
            form.append('container_id', item.longId);
            await this.$axios.post('/stop_container', form).then((res) => {
              if(res.data === 'stop success') {
                alert(`镜像${item.id}已停止`) && this.refreshList();
              }
              else throw res.data;
            }).catch(() => {
              alert(`镜像${item.id}无法停止`) && this.refreshList();
            })
          }
          break;
          case "restart": {
            this.containers[this.containers.indexOf(item)].status = 'CHANGING...';

            let form = new FormData();
            form.append('container_id', item.longId);
            await this.$axios.post('/restart_container', form).then((res) => {
              if(res.data === 'restart success') alert(`镜像${item.id}已成功重启`) && this.refreshList();
              else throw res.data;
            }).catch(() => {
              alert(`镜像${item.id}重启失败`);
              this.refreshList();
            })
          }
          break;
        }
      },
      async runContainer() {
        this.runDialogLoading = true;
        this.createContainerForm.command = this.createContainerForm.command.split('\n');
        this.createContainerForm.volume = this.createContainerForm.volume.split('\n');
        this.createContainerForm.environment = this.createContainerForm.environment.split('\n');

        let form = new FormData();
        form.append('image', this.createContainerForm.image);
        form.append('name', this.createContainerForm.name);
        for(let i = 0, l = this.createContainerForm.command.length; i < l; i++) {
          form.append('command', this.createContainerForm.command[i]);
        }
        for(let i = 0, l = this.createContainerForm.volume.length; i < l; i++) {
          form.append('volumes', this.createContainerForm.volume[i]);
        }
        for(let i = 0, l = this.createContainerForm.environment.length; i < l; i++) {
          form.append('environment', this.createContainerForm.environment[i]);
        }
        this.result = '正在加载...';
        await this.$axios.post('/run_container', form).then((res) => {
          if(res.data === 'create success') this.result = '容器已启动';
          else throw res.data;
        }).catch(() => {
          this.result = '容器创建失败';
          alert('容器提交失败');
        })
        this.runDialogLoading = false;
      },
      async commitContainer() {
        this.commitDialogLoading = true;
        let form = new FormData();
        form.append('container_id', this.containerClicked.longId);
        form.append('repository', this.commitContainerForm.repository);
        form.append('tag', this.commitContainerForm.tag);
        form.append('message', this.commitContainerForm.message);
        form.append('changes', this.commitContainerForm.changes);
        form.append('author', this.commitContainerForm.author);
        this.result = '正在加载...'
        await this.$axios.post('/commit_container', form).then((res) => {
          if(res.data === 'commit success') this.result = '容器已提交';
          else throw res.data;
        }).catch(() => {
          this.result = '容器提交失败';
          alert('容器提交失败');
        })
        this.commitDialogLoading = false;
      },
      addPort() {
        this.createContainerForm.ports.push([this.createContainerForm.tmp.container_port + '/' + this.createContainerForm.tmp.protocol, this.createContainerForm.tmp.host_port]);
        this.createContainerForm.tmp.protocol = '';
        this.createContainerForm.tmp.container_port = '';
        this.createContainerForm.tmp.host_port = '';
      }
    },
    mounted() {
      this.refreshList();
    }
  }
</script>