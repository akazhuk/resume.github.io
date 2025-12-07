// webpack.config.js（项目根目录）
module.exports = {
  entry: './src/index.ts', // 单入口：指定你的核心入口文件
  // 多入口写法（如需多个入口）
  // entry: {
  //   main: './src/main.js',
  //   admin: './src/admin-panel.js'
  // },
  output: {
    filename: '[name].bundle.js', // 输出文件名（多入口时按name区分）
    path: __dirname + './dist' // 输出到dist目录（GitHub Pages通常部署此目录）
  },
  mode: 'production'
};