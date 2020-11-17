module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  css: {
    sourceMap: true
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Antenas'
        return args
      })
  }
}
