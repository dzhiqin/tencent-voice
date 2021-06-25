<template>
  <view
    id="paster"
    class="paster"
    @tap="handleClick"
  >
    智能导诊
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import './register-paster.less'
export default {
  name: 'RegisterPaster',
  data() {
    return {
      
    }
  },
  methods: {
    handleClick() {
      console.log('handleClick')
      Taro.navigateTo({
        url: '/pages/register/register'
      })
    }
  }
}
</script>
