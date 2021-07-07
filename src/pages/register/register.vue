<template>
  <view class="register-page">
    register
    <view class="voice-panel">
      <image src='@/assets/speaking.png' class="voice-panel-img"/>
      <view class="vioce-panel-input">
        <AtInput name="message" type="text" placeholder="" :value="message" :onChange="handleInput"></AtInput>
      </view>
    <AtButton type='primary'>发送</AtButton>
    </view>
  </view>
</template>

<script>
import './register.less'
import { AtInput, AtButton } from 'taro-ui-vue'
  export default {
    name: 'Register',
    components: {
      AtInput,
      AtButton
    },
    mounted() {
    },
    methods: {
      handleInput() {
        console.log('handleInput')
      },
    },
    data() {
      return {
        message: ''
      }
    }
  }
</script>
