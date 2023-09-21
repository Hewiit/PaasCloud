<template>
  <v-card :loading="cardLoading">
    <v-card-title>
      <span class="headline">从远程镜像仓库拉取镜像</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field v-model="url" label="URL" clearable></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <span class="ml-2" v-text="result"></span>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="pullImage">pull</v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
export default {
  name: 'FromRemoteDialogContent',
  data() {
    return {
      cardLoading: false,
      url: '',
      result: '等待拉取',
    }
  },
  methods: {
    async pullImage() {
      let form = new FormData();
      form.append('repository', this.url);
      this.cardLoading = true;
      await this.$axios.post('/pull_image', form).then((res) => {
        if(res.data === 'pull success') this.result = '镜像拉取完成';
        else throw res.data;
      }).catch(() => {
        this.result = '镜像拉取失败';
      })
      this.cardLoading = false;
    },
  }
}
</script>