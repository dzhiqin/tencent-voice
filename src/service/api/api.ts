import { Get, fullUrl, Post } from "../http";
import * as Taro from '@tarojs/taro'
export const hello = () => {
  return Get('http://baidu.com')
}
interface VoiceRegisterParams {
  'req_text': string
}
export const voiceRegister = (data: VoiceRegisterParams) => {
  return Get(fullUrl('voice_appointment/'), data)
}
export const login = (data) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      method:'POST',
      url: 'http://192.168.2.34:3001/api/wechat/login',
      // url: fullUrl('api/wechat/login'),
      data: data,
      header: {
        'content-Type': 'application/json',
      },
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
export const getUserInfo = (data) => {
  return Get(fullUrl('user'))
}