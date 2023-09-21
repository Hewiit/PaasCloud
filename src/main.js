import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from "axios";
import { VueAxios } from "@/http/request.js";
import api from "@/api/api.js";
Vue.prototype.$api = api;
Vue.config.productionTip = false;
Vue.prototype.$axios = axios.create({baseURL:"/api",timeout:5000});
Vue.config.productionTip = false
Vue.use(VueAxios);

//自适应文件大小转换工具加入原型链
Vue.prototype.$utils ={
  byte2FormatSize: (filesize) => {
    if(null==filesize||filesize==''){
      return "0 Bytes";
    }
    const unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB");
    let index=0;
    let srcsize = parseFloat(filesize);
    index=Math.floor(Math.log(srcsize)/Math.log(1024));
    let size =srcsize/Math.pow(1024,index);
    size=size.toFixed(2);
    return size+unitArr[index];
  }
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
