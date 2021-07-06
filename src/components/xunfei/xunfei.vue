<template>
  <view class="xunfei">
    <view style="display: inline-block;">
      <AtButton type='primary' size="default" :onClick="handleClick">{{ recordStatusText }}</AtButton>
    </view>
  </view>
</template>

<script>
import CryptoJS from 'crypto-js'
import './xunfei.less'
//APPID，APISecret，APIKey在控制台-我的应用-语音听写（流式版）页面获取
const APPID = '686ca9c8'
const API_SECRET = 'ZWMxNTliMDUwZTFlNDg3MTRlZDEyNWYz'
const API_KEY = 'be23343478cc2bb26af918fa73e2e114'
const recorderManager = wx.getRecorderManager()  // 获取全局唯一的录音管理器 RecorderManager

import { AtButton } from 'taro-ui-vue'
import { log } from 'util';
import Taro from '@tarojs/taro'
  export default {
    name: 'xunfei',
    components: {
      AtButton
    },
    mounted() {
      this.getRecordAuth()
      recorderManager.onStart(() => {
        console.log('record start')
      })
      recorderManager.onStop((res) => {
        const { tempFilePath } = res
        console.log('record end', tempFilePath);
      })
      recorderManager.onFrameRecorded((res) => {
        const { frameBuffer, isLastFrame } = res
        console.log('onFrameRecorded', res);
        const int16Arr = new Int8Array(res.frameBuffer)
        const base64Buffer = wx.arrayBufferToBase64(int16Arr)
        // console.log('frameBuffer',frameBuffer);
        // console.log('int16Arr',int16Arr)
        // console.log('base64Buffer',base64Buffer);
        const params = {
          common: {
            app_id: APPID,
          },
          business: {
            language: 'zh_cn',
            domain: 'iat',
            accent: 'mandarin',
            vad_eos: 10,
            dwa: 'wpgs'
          },
          data: {
            status: this.isFirstSend ? 0 : 1,
            format: 'audio/L16;rate=16000',
            encoding: 'raw',
            audio: base64Buffer
          }
        }
        let status = 0
        if(this.isFirstSend) {
          this.isFirstSend = false
        } else {
          status = isLastFrame ? 2 : 1
        }
        params.data.status = status
        this.socketTask.send({
          data: JSON.stringify(params),
          success: (data) => {
            console.log('send success: ', JSON.stringify(data))
          },
          fail: (err) => {
            console.log('send error: ', JSON.stringify(err));
          },
          completed: () => {
            if(isLastFrame) {
              this.socketTask.close()
            }
          }
        })
      })
    },
    methods: {
      getRecordAuth() {
        wx.authorize({
          scope: 'scope.record',
          success: () => {
            console.log('get record permission success');
          },
          fail: () =>{
            Taro.showModal({
              title: '提示',
              content: '您未授权录音，功能将无法使用',
              confirmText: '授权',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({
                    success: (res) => {
                      if (!res.authSetting['scope.record']) {
                        Taro.showToast({
                          title: '您未授权录音，功能将无法使用',
                          icon: 'none'
                        })
                      } else {
                        Taro.showToast({
                          title: '授权成功',
                          icon: 'success'
                        })
                      }
                    }
                  })
                } else if (res.cancel) {
                  Taro.showToast({
                    title: '您未授权录音，功能将无法使用',
                    icon: 'none'
                  })
                }
              }
            })
          }
        })
      },
      handleResult(resultData) {
        console.log('handleResult', JSON.parse(resultData.data))
        let jsonData = JSON.parse(resultData.data)
        if (jsonData.data && jsonData.data.result) {
          let data = jsonData.data.result
          let str = ''
          let resultStr = ''
          let ws = data.ws
          for (let i = 0; i < ws.length; i++) {
            str = str + ws[i].cw[0].w
          }
          console.log('识别结束', str);
          Taro.showToast({
            title: str || '没有内容',
            icon: 'success'
          })
          // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
          // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
          // if (data.pgs) {
          //   if (data.pgs === 'apd') {
          //     // 将resultTextTemp同步给resultText
          //     this.setResultText({
          //       resultText: this.resultTextTemp,
          //     })
          //   }
          //   // 将结果存储在resultTextTemp中
          //   this.setResultText({
          //     resultTextTemp: this.resultText + str,
          //   })
          // } else {
          //   this.setResultText({
          //     resultText: this.resultText + str,
          //   })
          // }
        }
      },
      recordStart() {
        this.socketTask = wx.connectSocket({
          url: this.getWebSocketUrl(),
          success: (res) => {
            console.log('connect websocket success',res)
          }
        })
        this.socketTask.onOpen(() => {
          console.log('socket open');
        })
        this.socketTask.onMessage( res => {
          console.log('socket task message', res);
          this.handleResult(res)
        })
        const params = {
          duration: 60000,
          sampleRate: 16000,
          numberOfChannels: 1,
          encodeBitRate: 48000,
          format: 'PCM',
          frameSize: 10
        }
        recorderManager.start(params)
      },
      recordStop() {
        recorderManager.stop()
      },
      handleClick() {
        console.log('handleClick');
        this.recordStatusText = this.recordStatusText === '开始录音' ? '结束录音' : '开始录音'
        if(this.recordStatusText === '结束录音') {
          this.recordStart()
        } else {
          this.recordStop()
        }
      },
      getWebSocketUrl() {
        // 请求地址根据语种不同变化
        var url = 'wss://iat-api.xfyun.cn/v2/iat'
        var host = 'iat-api.xfyun.cn'
        var apiKey = API_KEY
        var apiSecret = API_SECRET
        var date = new Date().toUTCString()
        var algorithm = 'hmac-sha256'
        var headers = 'host date request-line'
        var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`
        var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
        var signature = CryptoJS.enc.Base64.stringify(signatureSha)
        var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
        var authorization = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin))
        url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
        console.log('websocketurl', url);
        return url
      }
    },
    data() {
      return {
        socketTask: undefined,
        recordStatusText: '开始录音',
        isFirstSend: true
      }
    }
  }
</script>
