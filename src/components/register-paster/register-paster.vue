<template>
  <view class="wrap">
    <view class="mask" :style="displayStyle">
      <sound-wave></sound-wave>
    </view>
    <view class="paster-container">
      <view class="paster-message">
        <view  @tap="handleClearMsg">
          <AtIcon value='close-circle' size='20' color='#FFF' class="paster-close" :style="closeCircleStyle"></AtIcon>
        </view>
        <view v-for="item in msgList" :key="item">
          {{ item }}
        </view>
      </view>
      <view class="paster-body" @tap="handleClick" @touchStart="touchStart" @touchEnd="touchEnd">
        <image :src="imageSrc" class="paster-image" />
        <view class="paster-text">按住说话</view>
      </view>
    </view>
  </view>
  
</template>

<script>
import Taro from '@tarojs/taro'
import './register-paster.less'
import { log } from 'util';
import { setInterval, clearInterval } from 'timers';
import { AtIcon } from 'taro-ui-vue'
import SoundWave from '@/components/sound-wave/sound-wave.vue'
const text = "腾讯云基于业界领先技术构建的语音合成系统，具备合成速度快、合成拟真度高、语音自然流畅等特点，能够应用于多种使用场景，让设备和应用轻松发声。"
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
    SoundWave
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
    manager.onStart((res) => {
      console.log('recorder start', res.msg);
    })
    manager.onStop((res) => {
      console.log('recorder stop', res.tempFilePath);
      // clearInterval(init) // 取消之前的计时
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
    handleClearMsg() {
      console.log('clear msg');
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
        // hotwordId : '08003a00000000000000000000000000',
        // filterDirty: 0,
        // filterModal: 0,
        // filterPunc: 0,
        // convertNumMode : 0,
        success: (data) => {
          const result = data.result
          if(result) {
            this.msgList.push(data.result)
          }
        },
        fail: (err) => {
          console.log('sentenceRecognition error:', err)
          this.msgList.push(err.Error.Message)
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
        sampleRate: 16000,
        numberOfChannels: 2,
        encodeBitRate: 48000,
        format: 'mp3',
        frameSize: 50
      }
      recorderManager.start(params)
    },
    recordStop() {
      recorderManager.stop()
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
            this.msgList.push(res.result)
        }else if(res.errMsg){
          console.log("recognize error", res.errMsg);
        }
      })
    },
    speechRecognizeStop: function() {
      manager.stop();
    },
    touchStart(event) {
      console.log('touch start', event);
      this.imageSrc = '../../assets/microphone-selected.png'
      this.displayStyle = { display: 'block' }
      this.setTimer()
      // this.speechRecognizeStart()
      this.recordStart()
    },
    touchEnd(event) {
      console.log('touch end')
      clearInterval(timer)
      this.imageSrc = '../../assets/microphone.png'
      this.displayStyle = { display: 'none' }
      // this.speechRecognizeStop()
      this.recordStop()
    },
    handleClick() {
      // this.textToSpeech()
      // Taro.navigateTo({
      //   url: '/pages/register/register'
      // })
    },
    textToSpeech(){
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
      msgList: [],
      imageSrc: '../../assets/microphone.png',
      duration: 0,
      displayStyle: {
        display: 'none'
      }
    }
  },
}
</script>
