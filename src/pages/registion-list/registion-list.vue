<template>
  <view> 
    <AtList> 
      <AtListItem title='标题文字' arrow='right' :onClick="handleClick" />
      <AtListItem title='标题文字' arrow='right' :onClick="handleClick"/>
    </AtList>
    <AtTabs
      :current="current"
      scroll
      height="100vh"
      tab-direction="vertical"
      :tab-list="[
        { title: '标签页1' },
        { title: '标签页2' }
      ]"
      :on-click="handleClick"
    >
      <AtTabsPane
        tab-direction="vertical"
        :current="current"
        :index="0"
      >
        <view style="font-size:18px;text-align:center;height:100vh;">
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
    </AtTabs>
  </view> 
</template> 

<script>
  import { AtList, AtListItem } from 'taro-ui-vue'
  import { AtTabs, AtTabsPane, AtButton } from 'taro-ui-vue'
  import { hello } from '@/api'
  import Taro from '@tarojs/taro'
  export default {
    name: 'RegistionList',
    components: {
      AtList,
      AtListItem,
      AtTabs,
      AtTabsPane
    },
    methods: {
      handleClick() {
        console.log('handleClick');
        Taro.navigateTo({
          url: '/pages/register-detail/register-detail'
        })
      }
    },
    onshow() {
      console.log('list-onshow');
    },
    mounted() {
      hello().then(res => {
        // console.log('res',res);
      })
    },
    data() {
      return {
        current: 0
      }
    },
    methods: {
      handleClick (value) {
        this.current = value
      }
    }
  }
</script>