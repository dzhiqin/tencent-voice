export default {
  pages: [
    'pages/index/index',
    'pages/registion-list/registion-list',
    'pages/register/register',
    'pages/register-detail/register-detail'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    selectedColor: '#1296db',
    list: [
      {
        pagePath: "pages/index/index",
        text: '微信语音',
        iconPath: 'assets/home.png',
        selectedIconPath: 'assets/home-selected.png'
      },
      {
        pagePath: "pages/register-detail/register-detail",
        text: '讯飞语音',
        iconPath: 'assets/list.png',
        selectedIconPath: 'assets/list-selected.png'
      }
    ]
  },
  "plugins": {
    "QCloudAIVoice": {
      "version": "1.3.0",
      "provider": "wx3e17776051baf153"
    }
  }
}
