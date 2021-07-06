<template>
  <view>
    <view style="display: inline-block;">
      <!-- <AtButton type='primary' size="default" :full="false" :circle="true" loading>按钮文案</AtButton> -->
      <xunfei></xunfei>
    </view>
  </view>
</template>

<script>
import { AtButton } from 'taro-ui-vue'
import Xunfei from '@/components/xunfei/xunfei.vue'

import "taro-ui-vue/dist/style/components/button.scss";
  export default {
    name: 'RegisterDetail',
    components: {
      AtButton,
      Xunfei
    },
    onShow() {
      console.log('detail onshow');
    },
    beforeDestroy() {
      console.log('detail before destroy');
    },
    data() {
      return {
        loading: true
      }
    }
  }
</script>