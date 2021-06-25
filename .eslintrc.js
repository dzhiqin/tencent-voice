// ESLint 检查 .vue 文件需要单独配置编辑器：
// https://eslint.vuejs.org/user-guide/#editor-integrations
module.exports = {
  'extends': ['taro/vue'],
  'rules': {
    'vue/attribute-hyphenation': 'off',
    'vue/max-attributes-per-line': ['error', {
      'singleline': {
        'max': 4,
        'allowFirstLine': true
      }
    }]
  }
}
