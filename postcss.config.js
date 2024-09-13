module.exports = {
  plugins: [
   require('postcss-simple-vars')({
    variables: require('./src/styles/vars'),
    /*variables: function () {
      console.log('variables anew')

      return require('./src/styles/vars');
    },*/
    /*onVariables () {
      delete require.cache[require.resolve('./src/styles/vars.js')]
      const variables = require('./src/styles/vars.js');
      console.log('CSS Variables');
      console.log(JSON.stringify(variables, null, 2));
    }*/
    onVariables (variables) {
      console.log('CSS Variables');
      console.log(JSON.stringify(variables, null, 2));
    }
   })
  ]
}
