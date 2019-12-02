<template>
  <div class="main-container">
    <img :src="cropperResult" :mode="widthFix" class="main-img" v-if="cropperResult">
    <div class="cropper" v-if="originUrl">
      <cropper :url="originUrl"></cropper> 
    </div>
    <div class="choose-img" @click=uploadTap v-else>choose Img</div>
  </div>
</template>
<script>
  import Cropper from '../../../components/cropper.vue';
  export default {
    data () {
      return {
        originUrl: '',
        cropperResult: ''
      }
    },
    components: {
      Cropper
    },
    methods: {
      uploadTap() {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: (res) => {
            this.originUrl = res.tempFilePaths[0];
            this.cropperResult = '';
          }
        })
      }
    }
  }
</script>
<style>
page {
  width: 100%;
  height: 100%;
}
.main-container {
  width: 100%;
  height: 100%;
  background: #eee;
  overflow: hidden;
}
.cropper {
  width: 100%;
  height: 100%;
}
.main-img {
  margin: 20rpx auto;
  display: block;
  background: #fff;
}
.choose-img {
  width: 40%;
  text-align: center;
  padding: 30rpx;
  border: 1px solid #fff;
  margin: 20rpx auto;
  background: #000;
  color: #fff;
}
</style>