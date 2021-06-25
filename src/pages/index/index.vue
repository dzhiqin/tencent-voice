<template>
  <view class="index">
    <AtTabs
      :current="current"
      scroll
      height="100vh"
      tab-direction="vertical"
      :tab-list="[
        { title: '标签页1' },
        { title: '标签页2' },
        { title: '标签页3' },
        { title: '标签页4' },
        { title: '标签页5' },
        { title: '标签页6' },
      ]"
      :on-click="handleClick"
    >
      <AtTabsPane
        tab-direction="vertical"
        :current="current"
        :index="0"
      >
        <view style="font-size:18px;text-align:center;height:100vh;">
          标签页一的内容
        </view>
      </AtTabsPane>
      <AtTabsPane
        tab-direction="vertical"
        :current="current"
        :index="1"
      >
        <view style="font-size:18px;text-align:center;height:100vh;">
          标签页二的内容
        </view>
      </AtTabsPane>
      <AtTabsPane
        tab-direction="vertical"
        :current="current"
        :index="2"
      >
        <view style="font-size:18px;text-align:center;height:100vh;">
          标签页三的内容
        </view>
      </AtTabsPane>
      <AtTabsPane
        tab-direction="vertical"
        :current="current"
        :index="3"
      >
        <view style="font-size:18px;text-align:center;height:100vh;">
          标签页四的内容
        </view>
      </AtTabsPane>
      <AtTabsPane
        tab-direction="vertical"
        :current="current"
        :index="4"
      >
        <view style="font-size:18px;text-align:center;height:100vh;">
          标签页五的内容
        </view>
      </AtTabsPane>
      <AtTabsPane
        tab-direction="vertical"
        :current="current"
        :index="5"
      >
        <view style="font-size:18px;text-align:center;height:100vh;">
          标签页六的内容
        </view>
      </AtTabsPane>
    </AtTabs>
    <register-paster />
  </view>
</template>

<script>
import RegisterPaster from '@/components/register-paster/register-paster.vue'
import { AtTabs, AtTabsPane } from 'taro-ui-vue'
import './index.less' 
export default {
  components: {
    AtTabs,
    AtTabsPane,
    RegisterPaster
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
