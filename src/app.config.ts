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
  // tabBar: {
  //   list: [
  //     {
  //       pagePath: "pages/index/index",
  //       text: '挂号',
  //       iconPath: 'assets/register.png',
  //       selectedIconPath: 'assets/register-selected.png'
  //     },
  //     {
  //       pagePath: "pages/registion-list/registion-list",
  //       text: '列表',
  //       iconPath: 'assets/list.png',
  //       selectedIconPath: 'assets/list-selected.png'
  //     }
  //   ]
  // },
  "plugins": {
    "QCloudAIVoice": {
      "version": "1.3.0",
      "provider": "wx3e17776051baf153"
    }
  }
}
