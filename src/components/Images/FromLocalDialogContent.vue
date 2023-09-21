<template>
  <v-card :loading="cardLoading">
    <v-card-title>
      <span class="headline">从Docker File构建镜像</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <v-file-input label="Docker File" v-model="dockerFile" clearable></v-file-input>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="6">
            <v-text-field v-model="name" label="镜像名称" clearable :hint="'用英文逗号分割多个tag'" persistent-hint></v-text-field>
          </v-col>
          <v-col :cols="6">
            <v-text-field v-model="version" label="镜像tag" clearable :hint="'留空以使用自定义格式tag'" persistent-hint></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <span class="ml-2" v-text="result"></span>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="buildImage">build</v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
export default {
  name: 'FromLocalDialogContent',
  data() {
    return {
      dockerFile: {},
      name: '',
      version: '',
      result: '等待构建',
    }
  },
  computed: {
    tag() {
      let flag = ':';
      if(this.name === '' || this.version === '') flag = '';
      let tags = this.name.split(',');
      for(let i = 0, l = tags.length; i < l; i++) {
        tags[i] = tags[i] + flag + this.version;
      }
      return tags;
    }
  },
  methods: {
    async buildImage() {
      let form = new FormData();
      form.append('dockerfile', this.dockerFile);
      for(let i = 0, l = this.tag.length; i < l; i++) {
        form.append('tags',this.tag[i]);
      }
      this.cardLoading = true;
      await this.$axios.post('/build_image', form).then((res) => {
        if(res.data === 'build success') this.result = '镜像构建完成';
        else throw res.data;
      }).catch(() => {
        this.result = '镜像构建失败';
      })
      this.cardLoading = false;
    },
  }
}
</script>