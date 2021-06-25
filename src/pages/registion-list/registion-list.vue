<template>
  <view> 
    <AtList> 
      <AtListItem title='标题文字' arrow='right' :onClick="handleClick" />
      <AtListItem title='标题文字' arrow='right' :onClick="handleClick"/>
    </AtList>
  </view> 
</template> 

<script>
  import { AtList, AtListItem } from 'taro-ui-vue'
  import Taro from '@tarojs/taro'
  export default {
    name: 'RegistionList',
    components: {
      AtList,
      AtListItem
    },
    methods: {
      handleClick() {
        console.log('handleClick');
        Taro.navigateTo({
          url: '/pages/register-detail/register-detail'
        })
      }
    },
    data() {
      return {
        
      }
    }
  }
</script>