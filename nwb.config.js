module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactSocket',
      externals: {
        react: 'React'
      }
    }
  }
}
