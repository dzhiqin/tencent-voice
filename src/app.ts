import Vue from 'vue'
import './app.less'
import 'taro-ui-vue/dist/style/index.scss'
import * as Taro from '@tarojs/taro'
import { login } from './service/api'
const App = {
  onLaunch() {
    console.log('onlaunch');
    Taro.login({
      success: res => {
        const code = res.code
        login({code}).then((res: any) => {
          Taro.setStorageSync('userInfo', JSON.stringify(res.data))
          Taro.setStorageSync('fulfill', res.data.edited)
          const { client, uid } = res.header
          const accessToken = res.header['access-token']
          Taro.setStorageSync('auth', JSON.stringify({client, uid, accessToken}))
        }).catch(err => {
          console.log(err);
          Taro.showToast({
            title: '授权失败',
            icon: 'none'
          })
        })
      },
      fail: err=> {
        console.log('wx login fail',err);
      }
    })
  },
  onShow (options) {
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
}

export default App
