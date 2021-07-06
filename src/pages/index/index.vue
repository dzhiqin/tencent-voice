<template>
  <view class="index">
    <register-paster />
  </view>
</template>

<script>
import RegisterPaster from '@/components/register-paster/register-paster.vue'
import Xunfei from '@/components/xunfei/xunfei.vue'
import { AtTabs, AtTabsPane, AtButton } from 'taro-ui-vue'
import './index.less' 
export default {
  components: {
    AtTabs,
    AtTabsPane,
    RegisterPaster,
    Xunfei,
    AtButton
  },
  data () {
    return {
      current: 0,
    }
  },
  methods: {
    handleClick (value) {
      this.current = value
    }
  },
    }
</script>
