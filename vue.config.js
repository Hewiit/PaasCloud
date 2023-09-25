module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer:{
    proxy:{
      "^/":{
        target:"http://10.251.252.117:5001",
        changeOrigin:true,
        pathRewrite:{'^/':'/'}
      }
    }
  }
}
