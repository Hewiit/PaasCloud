module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer:{
    proxy:{
      "^/":{
        target:"http://47.94.56.24:5000",
        changeOrigin:true,
        pathRewrite:{'^/':'/'}
      }
    }
  }
}
