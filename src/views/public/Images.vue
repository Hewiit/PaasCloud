<template>
  <div>
    <v-card class="ma-2 mt-6 elevation-4 pa-2">
      <v-card-title>
        镜像管理
        <v-spacer></v-spacer>
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
          :headers="headers"
          :items="images"
          disable-pagination
          :hide-default-footer="true"
          :search="search"
      >
        <template
            v-for="header in headers.filter((header) =>
                header.hasOwnProperty('formatter')
              )"
            v-slot:[`item.${header.value}`]="{ header, value }"
        >
          {{ header.formatter(value) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon @click="inspectImage(item)">mdi-eye-outline</v-icon>
          &nbsp;
          <v-icon @click="deleteImage(item)">mdi-delete-outline</v-icon>
        </template>
      </v-data-table>
      <v-dialog v-model="dialogFlag" max-width="960px" v-if="dialogFlag">
        <v-card>
          <v-card-title>
            <span class="headline">{{ imageToInspect.name + ':' + imageToInspect.tag }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>IMAGE ID: {{imageToInspect.longId}}</v-row>
              <v-row>IMAGE SHORT ID: {{imageToInspect.id}}</v-row>
              <v-row>CREATED TIME: {{timeFormatter(imageToInspect.time)}}</v-row>
              <v-row>SIZE: {{imageToInspect.size}}</v-row>
              <v-row>
                TAGS:
                <v-chip v-for="tag in imageToInspect.raw.tags" :key="tag" class="ma-2" color="primary" small> {{ tag }} </v-chip>
              </v-row>
              <v-row>
                <v-btn text @click="showRawJson = !showRawJson" small>
                  <v-icon>mdi-code-braces</v-icon> {{showRawJson? 'HIDE RAW JSON' : 'VIEW RAW JSON'}}
                </v-btn>
              </v-row>
              <v-row v-if="showRawJson">
                <v-card max-height="600" style="overflow: auto">
                  <pre>{{imageToInspect.raw}}</pre>
                </v-card>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
    <v-speed-dial
        v-model="speedDialFlag"
        fixed :bottom="true" :right="true"
        :direction="'top'" :transition="'slide-y-reverse-transition'"
    >
      <template v-slot:activator>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="blue darken-2" dark fab
                   v-on="on" v-bind="attrs"
            >
              <v-icon v-if="speedDialFlag">mdi-close</v-icon>
              <v-icon v-else>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>添加镜像</span>
        </v-tooltip>
      </template>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab dark small color="green"
                 v-on="on" v-bind="attrs" @click="fromRemoteDialogFlag = true"
          >
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </template>
        <span>从远程镜像仓库</span>
      </v-tooltip>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab dark small color="indigo"
                 v-on="on" v-bind="attrs" @click="fromLocalDialogFlag = true"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>从本地Docker File</span>
      </v-tooltip>
    </v-speed-dial>
    <v-dialog v-model="fromRemoteDialogFlag" max-width="960px" @click:outside="refreshList" v-if="fromRemoteDialogFlag" >
      <FromRemoteDialogContent></FromRemoteDialogContent>
    </v-dialog>
    <v-dialog v-model="fromLocalDialogFlag" max-width="960px" @click:outside="refreshList" v-if="fromLocalDialogFlag">
      <FromLocalDialogContent></FromLocalDialogContent>
    </v-dialog>
  </div>
</template>

<script>
import FromRemoteDialogContent from "@/components/Images/FromRemoteDialogContent";
import FromLocalDialogContent from "@/components/Images/FromLocalDialogContent";
export default {
  name: 'Images',
  components: {
    FromLocalDialogContent,
    FromRemoteDialogContent
  },
  props: {
    search: {type: String, default: ''},
  },
  data () {
    return {
      headers: [
        {text: 'NAME', align: 'start', sortable: true, value: 'name'},
        {text: 'TAG', align: 'start', sortable: true, value: 'tag'},
        {text: 'IMAGE ID', align: 'start', sortable: true, value: 'longId'},
        {text: 'SHORT ID', align: 'start', sortable: true, value: 'id'},
        {text: 'CREATED', align: 'start', sortable: true, value: 'time', formatter: this.timeFormatter},
        {text: 'SIZE', align: 'start', sortable: true, value: 'size'},
        {text: 'ACTIONS', align: 'start', sortable: false, value: 'actions'},
      ],
      images: [],
      imageList: [],
      //search: '',
      dialogFlag: false,
      imageToInspect: 0,
      showRawJson: false,

      speedDialFlag: false,

      fromRemoteDialogFlag: false,
      fromLocalDialogFlag: false,
    }
  },
  methods: {
    timeFormatter(value) {
      return new Date(value).toLocaleString();
    },
    async deleteImage(item) {
      const index = this.images.indexOf(item);
      confirm('确认删除?') && this.images.splice(index, 1);

      let form = new FormData();
      form.append('image_id', item.longId);
      await this.$axios.post('/remove_image', form).then((res) => {
        if(res.data === 'delete success') alert(`镜像${item.id}已成功删除`);
        else throw res.data;
      }).catch(() => {
        alert(`镜像${item.id}删除失败`);
        this.refreshList();
      })
    },
    inspectImage(item) {
      this.imageToInspect = item;
      this.dialogFlag = true;
    },
    async refreshList() {

      await this.$axios.get('/list_images').then((res) => {
        if(res) {
          console.log(res);
          this.imageList = res.data;
        }
      }).catch((err) => {
        console.log(err);
      })

      // await new Promise((resolve) => {
      //   this.imageList = [{"attrs": {"Architecture": "amd64","Author": "","Comment": "","Config": {"AttachStderr": false,"AttachStdin": false,"AttachStdout": false,"Cmd": ["nginx","-g","daemon off;"],"Domainname": "","Entrypoint": ["/docker-entrypoint.sh"],"Env": ["PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin","NGINX_VERSION=1.21.3","NJS_VERSION=0.6.2","PKG_RELEASE=1~buster"],"ExposedPorts": {"80/tcp": {}},"Hostname": "","Image": "sha256:e30f1b92b2c67fbe72fb24af7353a945f6df4f48d9064d47bf0f51674311251e","Labels": {"maintainer": "NGINX Docker Maintainers <docker-maint@nginx.com>"},"OnBuild": null,"OpenStdin": false,"StdinOnce": false,"StopSignal": "SIGQUIT","Tty": false,"User": "","Volumes": null,"WorkingDir": ""},"Container": "21fd1c6cb532225ca7e04c77f6592e220574b919aec07021663576ef438e0fee","ContainerConfig": {"AttachStderr": false,"AttachStdin": false,"AttachStdout": false,"Cmd": ["/bin/sh","-c","#(nop) ","CMD [\"nginx\" \"-g\" \"daemon off;\"]"],"Domainname": "","Entrypoint": ["/docker-entrypoint.sh"],"Env": ["PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin","NGINX_VERSION=1.21.3","NJS_VERSION=0.6.2","PKG_RELEASE=1~buster"],"ExposedPorts": {"80/tcp": {}},"Hostname": "21fd1c6cb532","Image": "sha256:e30f1b92b2c67fbe72fb24af7353a945f6df4f48d9064d47bf0f51674311251e","Labels": {"maintainer": "NGINX Docker Maintainers <docker-maint@nginx.com>"},"OnBuild": null,"OpenStdin": false,"StdinOnce": false,"StopSignal": "SIGQUIT","Tty": false,"User": "","Volumes": null,"WorkingDir": ""},"Created": "2021-10-12T02:03:40.360294686Z","DockerVersion": "20.10.7","GraphDriver": {"Data": {"LowerDir": "/var/lib/docker/overlay2/3e6efe73913b3c0bc37e4c0353aa5517ac12f0ccf23e1639c82975cda82ab032/diff:/var/lib/docker/overlay2/49830b07512b352ed5417ee7ec1fb65aec4671de3a29a9238340638b8b50bdd9/diff:/var/lib/docker/overlay2/b26f2560dacb827ea543c628e2cd12f28a2cfcb76281602e45d6b042669d53eb/diff:/var/lib/docker/overlay2/9119da62a4cc3dc05432a6b029e92afa9b44fd9ae3fa53b94ba32584a149465b/diff:/var/lib/docker/overlay2/81c13feac9eb3b5906a9c484a5939d9fe8a3b7e100237fee34c93c02b9af73e3/diff","MergedDir": "/var/lib/docker/overlay2/6c7af3b69a6d37f3039d59bea684c541cd9d3a76a12c538a48f781e5554ea15d/merged","UpperDir": "/var/lib/docker/overlay2/6c7af3b69a6d37f3039d59bea684c541cd9d3a76a12c538a48f781e5554ea15d/diff","WorkDir": "/var/lib/docker/overlay2/6c7af3b69a6d37f3039d59bea684c541cd9d3a76a12c538a48f781e5554ea15d/work"},"Name": "overlay2"},"Id": "sha256:87a94228f133e2da99cb16d653cd1373c5b4e8689956386c1c12b60a20421a02","Metadata": {"LastTagTime": "0001-01-01T00:00:00Z"},"Os": "linux","Parent": "","RepoDigests": ["harbor.scs.buaa.edu.cn/library/nginx@sha256:7250923ba3543110040462388756ef099331822c6172a050b12c7a38361ea46f"],"RepoTags": ["harbor.scs.buaa.edu.cn/library/nginx:latest"],"RootFS": {"Layers": ["sha256:e81bff2725dbc0bf2003db10272fef362e882eb96353055778a66cda430cf81b","sha256:43f4e41372e42dd32309f6a7bdce03cf2d65b3ca34b1036be946d53c35b503ab","sha256:788e89a4d186f3614bfa74254524bc2e2c6de103698aeb1cb044f8e8339a90bd","sha256:f8e880dfc4ef19e78853c3f132166a4760a220c5ad15b9ee03b22da9c490ae3b","sha256:f7e00b807643e512b85ef8c9f5244667c337c314fa29572206c1b0f3ae7bf122","sha256:9959a332cf6e41253a9cd0c715fa74b01db1621b4d16f98f4155a2ed5365da4a"],"Type": "layers"},"Size": 133277153,"VirtualSize": 133277153},"id": "sha256:87a94228f133e2da99cb16d653cd1373c5b4e8689956386c1c12b60a20421a02","labels": {"maintainer": "NGINX Docker Maintainers <docker-maint@nginx.com>"},"short_id": "sha256:87a94228f1","tags": ["harbor.scs.buaa.edu.cn/library/nginx:latest"]},{"attrs": {"Architecture": "amd64","Author": "","Comment": "buildkit.dockerfile.v0","Config": {"AttachStderr": false,"AttachStdin": false,"AttachStdout": false,"Cmd": null,"Domainname": "","Entrypoint": ["/usr/local/bin/entrypoint","/sbin/init"],"Env": ["PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin","container=docker"],"ExposedPorts": {"22/tcp": {}},"Hostname": "","Image": "","Labels": null,"OnBuild": null,"OpenStdin": false,"StdinOnce": false,"StopSignal": "SIGRTMIN+3","Tty": false,"User": "root","Volumes": null,"WorkingDir": ""},"Container": "","ContainerConfig": {"AttachStderr": false,"AttachStdin": false,"AttachStdout": false,"Cmd": null,"Domainname": "","Entrypoint": null,"Env": null,"Hostname": "","Image": "","Labels": null,"OnBuild": null,"OpenStdin": false,"StdinOnce": false,"Tty": false,"User": "","Volumes": null,"WorkingDir": ""},"Created": "2021-09-16T18:40:38.098709097Z","DockerVersion": "","GraphDriver": {"Data": {"LowerDir": "/var/lib/docker/overlay2/52819ad031da82cfd180439ac8f535f3e420686e5431bb3e6b5680dcf7641415/diff:/var/lib/docker/overlay2/136b291abcc5ca67c7d3a9b986b2f7dd1bd2a2ef1ede4c98153c133302327f2d/diff:/var/lib/docker/overlay2/6c47cfcf6d3845c29e6c6c736db55c7b20a73020bbc886bc3932ce730c4324f5/diff:/var/lib/docker/overlay2/2074168bc7395a00378219de666feac3340fa87688fc54e754bbc1f540d9552f/diff:/var/lib/docker/overlay2/448198d2605887f83d16734dc5c104e820153d41d7261083e5b5c5fd49afc915/diff:/var/lib/docker/overlay2/57643b857a5c96557bd04bc7f59ab5b875661a4b2b67385544c9f9d2fdf36fe8/diff:/var/lib/docker/overlay2/e244c6a87d3a7d6710e3e3af1045cc563e67fb3e66aecc9ed222cf32ad60a06e/diff:/var/lib/docker/overlay2/93a30ade61552b0454a6edc2a588628871f3008a500efa5bc2db04c4ead3e22e/diff:/var/lib/docker/overlay2/a36eceb366d6dc990694105e1c14ead7ffc7cd0e7ce9b7b6c65cdedcde9b534d/diff:/var/lib/docker/overlay2/3afdf51a2697aca04bf1ffe6a08f6a2171cf3f307a675f2e6aff10aa3fa3fedf/diff:/var/lib/docker/overlay2/8093a43dae9e9c39247216910b3bd60b9ea82c0781979ddf8e59737f95e34d18/diff:/var/lib/docker/overlay2/0cbe4bb777befce8efe3caca8038d4c418bbd5fc2947df87164691217434b892/diff:/var/lib/docker/overlay2/db9529f06832c67f6794390348a230f486b086465d3bc6a7f68ba393273f8461/diff:/var/lib/docker/overlay2/2155f989e88ee79a9427fac26fc9a9ffc25bc18eb65ce9c9ced5f197cd969623/diff:/var/lib/docker/overlay2/416ecf9e0a514da3b85b18be592678112fccba977ee4b660997f073db15b03f8/diff:/var/lib/docker/overlay2/0a21058b0c012a5c9acafc0ab373f179d54e27c1401cf60c384f3a15c5896d2d/diff:/var/lib/docker/overlay2/c5c475e0ca6c065c1b4c761e6aaadb445c2071c96078b0c03e7a71cd2c48ec39/diff:/var/lib/docker/overlay2/d6f6ff3206e3efcc8a74b7ca5017055ef52b9d70f5cdfc4f9ac3f05a60e98008/diff:/var/lib/docker/overlay2/7ecb320d25e65e2cb7aa6b9aa698f3baad9152ed9710e64dcf758e44fa95e09f/diff:/var/lib/docker/overlay2/3cea0b171de0444fbcf926654133124dac24868a8cad974835ec1d0dcdcc30fb/diff:/var/lib/docker/overlay2/3cfcc5b3b186f9db7778ffdd2870937c56b0a404bee0ee9e2ede951ff149d170/diff:/var/lib/docker/overlay2/23a94cdaee9985091a71fbc78758b09b7c8827e6f22bf22b88563bfe8d22a820/diff:/var/lib/docker/overlay2/c561106d2905c91e69ac33ca7bf045015a26cea7014ee1cd8867e5323c1437aa/diff:/var/lib/docker/overlay2/1b84cc4c756ed570968aee8cdab433325f23bb800be80393104a1ffe05fa739e/diff:/var/lib/docker/overlay2/d92d12c8b3a89bb4a9e77f48dce27534eb852d9ffb1ee9df45ae0434a57e192c/diff:/var/lib/docker/overlay2/50cfa30648854aa1ffcff34febf5397a7c4cd9eaa4a6aa2b7a2c0df90d8293a6/diff:/var/lib/docker/overlay2/8913a569743ed49882cdea8c69ff4fb4b33825919b9883df7f2e5654e9df7555/diff:/var/lib/docker/overlay2/72abf914d7072f79a090ee1c580494fd25829a58022c389bf698923e881af3f4/diff:/var/lib/docker/overlay2/84e9303cb1e67a784470f0edb108b46488444aae99d246685ddd693357f46eb3/diff:/var/lib/docker/overlay2/54b3d1d18c045b4a8eb0a711b47a94f9b9bb1e3e0e41df8bc5d517649114d1bd/diff:/var/lib/docker/overlay2/040300be2d7372623399cb8f2b934b3f70b484bdf7a67eb59f66728a226b0a52/diff:/var/lib/docker/overlay2/bd26beee05abe65c2b24dc2f661f60d5b9b507b83ec73760073a20288b80f4dc/diff:/var/lib/docker/overlay2/58622de76d7aa508c65bb739eba35e44e08aceca333b8b07dd1ca71f802827d3/diff:/var/lib/docker/overlay2/ab6bfc87230370f8aba8cb7e0b26f0d7988b43d2d2521150afaf3f0ef2ee3f0b/diff:/var/lib/docker/overlay2/42964a99a5bb40d8e24150bfd1bc22431b7e846b6d79cd0403d778a50526f0a0/diff:/var/lib/docker/overlay2/4dcf36474a7b95f56674ab8a5fc078d884516e2d7c81962251a74d72f4ed1492/diff:/var/lib/docker/overlay2/91bcf4d3184706e9708cbe31a42a5856c57e063a71d33eab58672a1f983ecae8/diff:/var/lib/docker/overlay2/9655bd077ef6a9a6d7ba248fe1fceaa9f7c3960e74ed637ae0829aea9e414555/diff","MergedDir": "/var/lib/docker/overlay2/3c92bed5e1febbb4f11d63e3299c007599af92d2230e63cf1b891b432a1c034a/merged","UpperDir": "/var/lib/docker/overlay2/3c92bed5e1febbb4f11d63e3299c007599af92d2230e63cf1b891b432a1c034a/diff","WorkDir": "/var/lib/docker/overlay2/3c92bed5e1febbb4f11d63e3299c007599af92d2230e63cf1b891b432a1c034a/work"},"Name": "overlay2"},"Id": "sha256:9fa1cc16ad6d525b8319e86c05a7fb228f97aeaf4bcda0033a709f018a2e3eee","Metadata": {"LastTagTime": "0001-01-01T00:00:00Z"},"Os": "linux","Parent": "","RepoDigests": ["registry.cn-hangzhou.aliyuncs.com/google_containers/kicbase@sha256:89b4738ee74ba28684676e176752277f0db46f57d27f0e08c3feec89311e22de"],"RepoTags": ["registry.cn-hangzhou.aliyuncs.com/google_containers/kicbase:v0.0.27"],"RootFS": {"Layers": ["sha256:0e64bafdc7ee828d0f3995bebfa388ced52a625ad2969eeb569f4a83db56d505","sha256:935f303ebf75656fcbf822491f56646c5a875bd0ad0bf2529671d31dd5456dfa","sha256:346be19f13b0ccad355ab89265edaa4ac5958a42b8bb0492d2d22d9e4538def4","sha256:ab5978382b76310e2ec5abfeb0b4ea3eeb737b774692602acae918619adf7207","sha256:b3c43e97c97fda40ee2a8a08e590ac43918dd07840e80f6116235bfd02170c6a","sha256:239fd9bb94ac74168f49b3c64f54d12d19eb2f3ec036636673e7a54ae6fd1f35","sha256:f7b6a7186b21ba07a82b19a27878c4b2fe20fbb5791ece8f380b3eaffe6c5f28","sha256:9bceec6675b7806f995930ceba072e4a13ef60a6c097fad923295670b23ae8a5","sha256:bc53d51fdca7b987cdc7bfdab7269e86ba41b09fd78be1631f2b5c6636c47304","sha256:b795fe47f307e3ba44c636325beff414492da45315f171424d4332f003478d11","sha256:b7e03d83918ec86721f345710c9b03d3567b77248dd03f9a495ce5f7b1805f66","sha256:f194ebd42acb5e262eeb4df07d3c7b40107796bd880683c4c6952bec94b77983","sha256:554cf457ec403afeffabe5faa880ce3a1899cd8199997dfa5459d92569511a16","sha256:9e8d4b2e9b17410a0377b22e71677dc75d3b75d5e15080546ca8062874ab5f40","sha256:25f78071a17dc13ebf1481d1b9d65f4a72b740d28714dbcad3d7a43585cb35b6","sha256:74f19b9d6db4d7509f33f6e5fc546e297698a2805e0a8dbfcc1831e13639f62c","sha256:d83d506be3e52f15ca1bb3cb2f63158f5c312d41308012f4b4bbdc411359578c","sha256:7be1a4d57e5c68553026d2a82e920ac3c5c3d876809a9c393b4cf3771afb3f18","sha256:ea1ef5b8203112fc79883c88b5e0fcd4e599502202847afdbee5bb4460b3046f","sha256:3689624da4a6caa85a97ff920824172b20d698532681176de82ddada82d75757","sha256:7f2c520ca53865f37a37405598f7850996883a205f3a4acc49969552cfa4c567","sha256:ac2133d2d4ccb2f732c2b277094de0294c9417cc29db3035ba32c3594eb9a37b","sha256:667defb8434b0aaaaa0b8843062b07a9a72742cb37794874676869ba986a9fdf","sha256:4a32aa651846c58bc66e2ae113f3c9ddc757a38d149947558501e125a3d36257","sha256:1e67d4bdb80af1aef295ee33acff78593a6aae26695b75f80599bb9710379e1e","sha256:f361ce4a6bb1ee0dcffabb3870d7caa495596b2c8e228f72af364654ca188873","sha256:73efdb6eaa7814d3874a3396fce842755a367cbc0a4947c1268500b8f72005c0","sha256:53e1ba5debf79daefbd6b88f2e398507d581308b24e5a0d74c714e26f87aad9a","sha256:2d94ace1cbc4825579a9e7a89a5b726469071cd3a5217ac59fe5b7b0307983d3","sha256:b3d60ef777e3b8444d15eb4eb9770190194f573a45950ce7083fcef64364ff4e","sha256:208f12762bb5ba41939ea2b985842ee3026066cb73a5391bef1fa02d63f1df9e","sha256:a00d500dc77bd98991c8fc9ac01bb5d5edc3b1559135d27b6de5e7da1fa08dfe","sha256:5f05eae75170a3cf72b00e259d087ce4e08f3850e6d1b97cb1962a587de2bdcc","sha256:a7a0cd77bf189c57059da29959f06f5f9a673aac4d2e221518d8293158160120","sha256:717a3204c03b5e2540b834bb004c8381e3f981f2137a6e0613ecb741cc6b0abb","sha256:8e97ad0d2be5b0bc5a53cf9ec846eceb7fcbaf2ee6ad88332a31f4a6ac976406","sha256:baceb4078622ddd9d3ba8d768ff073214f65306d7c4d46b30e0d03cea16a6e10","sha256:51226b4d265dea052f244479f4481a719b7cd2b1e5c3f8bdfd0b42ff0a297446","sha256:b5ad3ed34d7ac78de60a2ce3ce6e5b0b495919fda608ce3676c1994ce2e13bd2"],"Type": "layers"},"Size": 1079609889,"VirtualSize": 1079609889},"id": "sha256:9fa1cc16ad6d525b8319e86c05a7fb228f97aeaf4bcda0033a709f018a2e3eee","labels": {},"short_id": "sha256:9fa1cc16ad","tags": ["registry.cn-hangzhou.aliyuncs.com/google_containers/kicbase:v0.0.27"]}];
      //   resolve();
      // })
      this.images = [];
      for(let i = 0; i < this.imageList.length; i++) {
        let image = {};
        image.name = this.imageList[i].tags[0].slice(this.imageList[i].tags[0].lastIndexOf('/') + 1, this.imageList[i].tags[0].lastIndexOf(':'));
        image.tag = this.imageList[i].tags[0].slice(this.imageList[i].tags[0].lastIndexOf(':') + 1);
        image.id = this.imageList[i].short_id.slice(this.imageList[i].short_id.lastIndexOf(':') + 1);
        image.time = this.imageList[i].attrs.Created;
        image.size = this.$utils.byte2FormatSize(this.imageList[i].attrs.Size);
        image.longId = this.imageList[i].id.slice(7);
        image.raw = this.imageList[i];
        this.images.push(image);
      }
    }
  },
  async mounted() {
    await this.refreshList();
  }
}
</script>