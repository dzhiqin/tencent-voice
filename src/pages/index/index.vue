<template>
  <view class="index">
    <!-- <image src="../../assets/bg.png" class="bg" /> -->
    <register-paster :on-hide="onHide" :on-show="onShow" :message="sendMessage"/>
    <AtInput
      name='message'
      title='信息'
      type='text'
      placeholder=''
      :value="message"
      :onChange="handleInput"
    />
    <view style="display: inline-block">
      <AtButton type='primary' :on-click="sendMessage">点击发送信息</AtButton>
    </view>
  </view>
</template>

<script>
import RegisterPaster from '@/components/register-paster/register-paster.vue'
import Xunfei from '@/components/xunfei/xunfei.vue'
import {  AtButton, AtInput } from 'taro-ui-vue'
import './index.less' 
import Taro from '@tarojs/taro'
import { setTimeout } from 'timers';
import { getUserInfo } from '@/api'
export default {
  components: {
    RegisterPaster,
    Xunfei,
    AtButton,
    AtInput
  },
  onShow() {
    this.onShow = true
    this.onHide = false
    getUserInfo().then(res => {
      console.log('userinfo',res);
    })
    // this.socketTask = wx.connectSocket({
    //   url: 'ws://192.168.2.34:3001/cable/',
    //   header:{
    //     'content-type': 'application/json'
    //   },
    //   data: {
    //     command: 'subscribe',
    //     identifier: {
    //       channel: 'ChatRoomChannel'
    //     }
    //   },
    //   success: res=> {
    //     console.log('socket success',res);
    //     setTimeout(() => {
    //       this.sendMessage()
    //     },2000)
    //   },
    //   fail: err => {
    //     console.log('socket fail',err);
    //   }
    // })
    // this.socketTask.onOpen(() => {
    //   console.log('socket open');
    // })
    // this.socketTask.onMessage( res => {
    //   // console.log('socket task message', res);
    //   // this.handleResult(res)
    // })
  },
  onHide() {
    this.onHide = true
    this.onShow = false
  },
  data () {
    return {
      message: '',
      sendMessage: '',
      current: 0,
      socketTask: null,
      onShow: undefined,
      onHide: undefined,
    }
  },
  methods: {
    sendMessage() {
      const msg = this.message
      this.sendMessage = msg
    },
    handleInput(value) {
      console.log(value);
      this.message = value
    },
    sendMessage(){
      const params = {
        name: 'hello'
      }
      this.socketTask.send({
        data: JSON.stringify(params),
        success: res => {
          console.log('send success: ',res);
        },
        fail: err => {
          console.log('send err',err)
        },
        completed: () => {
          console.log('completed');
        }
      })
    },
    handleClick (value) {
      this.current = value
    }
  },
}
</script>
