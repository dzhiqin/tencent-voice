<template>
  <view class="wrap">
    <!-- <view class="mask" :style="displayStyle">
      <sound-wave></sound-wave>
    </view> -->
    <view class="message" :style="closeCircleStyle" @tap="handleOutSideClick">
      <view class="message-list" @tap.stop="handleInsideClick">
        <!-- <view  @tap="handleClearMsg">
          <AtIcon value='close-circle' size='20' color='#FFF' class="message-close"></AtIcon>
        </view> -->
        <view v-for="(item, index) in msgList" :key="index" class="message-list-item">
          {{ item }}
        </view>
        <template>
          <AtActivityIndicator v-show="loading" mode='center'></AtActivityIndicator>
        </template>
      </view>
      
    </view>
    <view class="paster">
      <view class="paster-wrap">
        <view :class="[isActive ? 'ripple' : '', 'paster-body']" @tap="handleClick" @touchStart="touchStart" @touchEnd="touchEnd">
          <image src="../../assets/speaking.png" class="paster-image" />
        </view>
        <view class="paster-text">智能导诊</view>
      </view>

    </view>
  </view>
  
</template>

<script>
import Taro from '@tarojs/taro'
import './register-paster.less'
import { log } from 'util';
import { setInterval, clearInterval, setTimeout } from 'timers';
import { AtIcon, AtActivityIndicator } from 'taro-ui-vue'
import { voiceRegister } from '@/api'
import { UploadFile } from '@/http'
import SoundWave from '@/components/sound-wave/sound-wave.vue'
// const text = "腾讯云基于业界领先技术构建的语音合成系统，具备合成速度快、合成拟真度高、语音自然流畅等特点，能够应用于多种使用场景，让设备和应用轻松发声。"
const recorderManager = wx.getRecorderManager()  // 获取全局唯一的录音管理器 RecorderManager
const innerAudioContext = wx.createInnerAudioContext()  // 创建内部 audio 上下文 InnerAudioContext 对象。
let plugin = requirePlugin("QCloudAIVoice");  //引入语音识别插件
// 访问 https://console.cloud.tencent.com/cam/capi 获取appid secretId, secretKey
plugin.setQCloudSecret('appid', "secretId", "secretKey", true);//设置腾讯云账号信息，其中appid是数字，secret是字符串，openConsole是布尔值(true/false)，为控制台打印日志开关
let manager = plugin.getRecordRecognitionManager();  //获取全局唯一的语音识别管理器
let timer = undefined;

export default {
  name: 'RegisterPaster',
  components: {
    AtIcon,
    SoundWave,
    AtActivityIndicator
  },
  props: {
    onShow: {
      type: Boolean,
      default: false
    },
    onHide: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    }
  },
  watch: {
    onShow(value,old) {
      console.log('onshow',value);
      if(value !== old) {
        this.show = value
        this.createConnect()
      }
    },
    onHide(value,old) {
      console.log('onhide',value);
      if(value !== old) {
        this.hide = value
        this.closeConnect()
      }
    }
  },
  computed: {
    closeCircleStyle() {
      const style = {
        display: this.msgList.length ? '' : 'none'
      }
      return style
    }
  },
  mounted () {
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
    manager.onStart((res) => {
      console.log('recorder start', res.msg);
    })
    manager.onStop((res) => {
      console.log('recorder stop', res.tempFilePath);
    })
    manager.onError((res) => {
      console.log('recorder error', res.errMsg); // 打印录音识别错误信息
    })
    recorderManager.onStart(() => {
      console.log('record start')
    })
    recorderManager.onStop((res) => {
      const { tempFilePath } = res
      console.log('record end', tempFilePath);
      // 上传文件
      // Taro.uploadFile({
      //   filePath: tempFilePath,
      //   name: 'audio_file',
      //   url: 'http://192.168.2.34:3001/api/voice_detect/',
      //   success: (res) => {
      //     console.log('upload success', res);
      //   },
      //   fail: (err) => {
      //     console.log('upload err', err)
      //   }
      // })
      const auth = JSON.parse(Taro.getStorageSync('auth') || null)
      Taro.uploadFile({
        filePath: tempFilePath,
        name: 'chat[audio_file]',
        url: 'http://192.168.2.34:3001/api/chats/',
        header: {
          'access-token': auth ? auth.accessToken : '',
          client: auth ? auth.client : '',
          uid: auth ? auth.uid : ''
        },
        formData: {
          'chat[channel]': 'dad',
          'chat[chat_message]': 'message...',
          'chat[user_category]': 'customer'
        },
        success: (res) => {
          console.log('upload success', data);
          const data = JSON.parse(res.data)
          this.fileDownloadUrl = data.file_download_url
          Taro.downloadFile({
            url: 'http://192.168.2.34:3001' + this.fileDownloadUrl,
             header: {
              'access-token': auth ? auth.accessToken : '',
              client: auth ? auth.client : '',
              uid: auth ? auth.uid : ''
            },
            success: (res) => {
              console.log('download audio',res);
              if (res.statusCode === 200) {
                const innerAudioContext = Taro.createInnerAudioContext()
                innerAudioContext.autoplay = true
                innerAudioContext.src = res.tempFilePath
                innerAudioContext.onPlay(() => {
                  console.log('开始播放')
                })
                innerAudioContext.onError((res) => {
                  console.log(res.errMsg)
                  console.log(res.errCode)
                })
              }
            },
            fail: err => {
              console.log('download fail',err);
            }
          })
        },
        fail: (err) => {
          console.log('upload err', err)
        }
      })
    })
    recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res
      if(this.duration < 1) {
        Taro.showToast({
          title: '请详细描述',
          icon: 'none',
          duration: 2000
        })
      } else if( this.duration > 60 ){
        Taro.showToast({
          title: '语音过长',
          icon: 'none',
          duration: 2000
        })
      } else {
        this.sentenceRecognize(frameBuffer)
      }
    })
  },
  methods: {
    closeConnect() {
      this.socketTask.close({
        code: 1000,
        success: res => {
          console.log('socket close',res);
        }
      })
    },
    createConnect() {
      this.socketTask = wx.connectSocket({
        url: 'ws://192.168.2.34:3001/cable/',
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log('connect', res);
          setTimeout(() => {
            this.createSubscribe()
          },1000)
        },
        fail: err => {
          console.log('connect err',err);
        }
      })
      this.socketTask.onOpen((res) => {
        console.log('socket open',res);
      })
      this.socketTask.onClose(res => {
        console.log('socket closed',res);
      })
      this.socketTask.onMessage( res => {
        // console.log('get message',res);
        const data = JSON.parse(res.data)
        if(data.type !== 'ping') {
          console.log('get message',data.message);
        }
      })
    },
    createSubscribe() {
      this.socketTask.send({
        data: '\"{\"command\":\"subscribe\",\"identifier\":{\"channel\":\"ChatRoomChannel\"}}\"',
        success: res => {
          console.log('subscribe success', res);
        },
        fail: err => {
          console.log('subscribe fail', err);
        }
      })
    },
    socketSendMsg(params) {
      console.log('send params',params);
      this.socketTask.send({
        data: JSON.stringify(params),
        success: res => {
          console.log('send success',res);
        },
        fail: err => {
          console.log('send err', err);
        },
        completed: (res) => {
          console.log('send complete',res);
        }
      })
    },
    handleOutSideClick(e) {
      this.msgList = []
      console.log('outside click');
    },
    handleInsideClick(e) {
      e.preventDefault();
    },
    handleClearMsg() {
      this.msgList = []
    },
    sentenceRecognize(frameBuffer) {
      // 一句话语音识别
      const buf = wx.arrayBufferToBase64(frameBuffer)
      plugin.sentenceRecognition({
        engSerViceType: '16k_zh',  //引擎类型
        sourceType: 1,  //1：语音数据
        voiceFormat: 'mp3',  
        url: '',
        data: buf,
        dataLen: frameBuffer.byteLength,
        projectId: 0,
        // 以下为非必填参数，可跟据业务自行修改
        hotwordId : '9d1de835d95511eba4de446a2eb5fd98',
        // filterDirty: 0,
        // filterModal: 0,
        // filterPunc: 0,
        // convertNumMode : 0,
        success: (data) => {
          const message = data.result
          if(message) {
            // this.msgList.push(message)
            this.reloadMessage(message)
            this.handleDialog(message)
          }
        },
        fail: (err) => {
          console.log('sentenceRecognition error:', err)
          // this.msgList.push(err)
        }
      })
    },
    setTimer () {
      this.duration = 0
      timer = setInterval(() => {
        this.duration += 1
        console.log(this.duration);
      }, 1000)
    },
    recordStart() {
      const params = {
        duration: 60000,
        // sampleRate: 16000,
        // numberOfChannels: 2,
        // encodeBitRate: 48000,
        sampleRate: 8000,
        numberOfChannels: 1,
        encodeBitRate: 16000,
        format: 'mp3',
        frameSize: 50
      }
      recorderManager.start(params)
    },
    recordStop() {
      recorderManager.stop()
      clearInterval(timer)
    },
    speechRecognizestart() {
      // 实时语音识别
      manager.start({
        // duration:this.duration, // 录音时长， 默认60000ms,最大为10分钟
        engine_model_type: '16k_zh',    // 16k_zh 中文, 16k_en 英语， 16k_ca 粤语
        // 以下为非必填参数，可跟据业务自行修改
        // hotword_id: '08003a00000000000000000000000000', // 热词id
        // filter_dirty: 0,        // 是否过滤脏词
        // filter_modal: 0,        // 是否过滤语气词
        // filter_punc: 0,         // 是否过滤句末的句号
        // convert_num_mode: 0,    // 是否进行阿拉伯数字智能转换
        // needvad: 1
        });
      //获取识别内容
      manager.onRecognize((res) => {
        if(res.result || res.resList){
            console.log("识别结果", res.result);
            // this.msgList.push(res.result)
            this.reloadMessage(res.result)
        }else if(res.errMsg){
          console.log("recognize error", res.errMsg);
        }
      })
    },
    reloadMessage (message) {
      this.msgList.unshift(message)
      // this.msgList = this.msgList.slice(-3)
    },
    speechRecognizeStop: function() {
      manager.stop();
    },
    touchStart(event) {
      this.isActive = true
      this.setTimer()
      this.recordStart()
    },
    touchEnd(event) {
      clearInterval(timer)
      this.isActive = false
      this.recordStop()
    },
    handleClick() {
      // this.handleDialog('帮我挂今天下午4点钟消化内科的号')
      // this.textToSpeech()
      // Taro.navigateTo({
      //   url: '/pages/register/register'
      // })
    },
    handleDialog(message) {
      this.loading = true
      voiceRegister({
        'req_text': message
      }).then(res => {
        console.log('voice register res=',res);
        // Taro.showToast({
        //   title:res,
        //   icon: 'none'
        // })
        // this.msgList.push(res.text)
        if(res.action === 'auto_appointment') {
          const registion =  (res.department ? `预约科室:${res.department}。` : '') + (res.time ? `预约时间:${res.time}` : '')
          this.reloadMessage(registion)
        }
        this.reloadMessage(res.text)
        this.textToSpeech(res.text)
      }).catch(err => {
        console.log('voice register err',err);
      }).finally(() => {
        this.loading = false
      })
    },
    textToSpeech(text){
      plugin.textToSpeech({
        content: text,
        speed: 0,
        volume: 0,
        voiceType: 0,
        language: 1,
        projectId: 0,
        sampleRate: 16000,

        success: function(data) {
          let url = data.result.filePath;
          if(url && url.length > 0){
            innerAudioContext.autoplay = true;
            innerAudioContext.src = url;
            innerAudioContext.onPlay(() => {
            });
            innerAudioContext.onError((res) => {
              console.log(res.errMsg)
            });
          }
        },
        fail: function(error){
          console.log(error);
        }
      })
    }
  },
  data() {
    return {
      fileDownloadUrl: '',
      socketTask: null,
      show: undefined,
      hide: undefined,
      loading: false,
      msgList: [],
      duration: 0,
      displayStyle: {
        display: 'none'
      },
      isActive: false
    }
  },
}
</script>
