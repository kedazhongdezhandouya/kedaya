<template>
  <div>
    <!--  剪裁框与初始图片，剪裁框监听用户手势，获取移动缩放旋转值，images通过css样式显示变化  -->
    <view class="img" @touchstart="touchstartCallback"  @touchmove="touchmoveCallback" @touchend="touchendCallback"  >
      <!-- <img :src="url" v-show="url"> -->
      <image :style="originStyle" :src="originImg.url"></image>
    </view>

    <!--  canvas长宽设为初始图片设置的长款的两倍，使剪裁得到的图片更清晰，也不至于过大  -->
    <!-- <canvas class='imgcrop' style="width:{{ width * 2 }}px;height:{{ height * 2}}px;" canvas-id='imgcrop'></canvas> -->
    <button class="choose-img" @click="uploadTap">change</button>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        url: '',                                        //选择图片路径
        width: '',                                      //剪裁框的宽度
        height: '',                                     //剪裁框的长度
        originImg: '',                                  //存放原图信息
        stv: {
          offsetX: 0,                                   //剪裁图片左上角坐标x
          offsetY: 0,                                   //剪裁图片左上角坐标y
          zoom: false,                                  //是否缩放状态
          distance: 0,                                  //两指距离
          scale: 1,                                     //缩放倍数
          rotate: 0                                     //旋转角度
        }
      }
    },
    computed: {
      originStyle () {
        return `transform: translate(${this.stv.offsetX}px, ${this.stv.offsetY}px); scale: ${this.stv.scale}; rotate: ${this.stv.rotate}deg; width: ${this.originImg.width}px; height: ${this.originImg.height}px`;
      }
    },
    watch: {
      url (val) {
        this.initImg(val);
      }
    },
    onLoad () {
      const device = wx.getSystemInfoSync();
      this.width = device.windowWidth * 0.8;
      this.height = device.windowWidth * 0.8 / (102 / 152);
    },
    methods: {
      // 选择图片
      uploadTap() {
        wx.chooseImage({
          count: 1,
          sizeType: ['original'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            this.url = res.tempFilePaths[0];
            console.log('url', this.url);
          }
        })
      },
      // 触摸开始
      touchstartCallback (e) {
        console.log('begin', e);
        
      },
      // 触摸移动
      touchmoveCallback () {
        // console.log('move');
      },
      // 触摸结束
      touchendCallback () {
        // console.log('end');
      },
      // 初始化图片
      initImg (url) {
        wx.getImageInfo({
          src: url,
          success: (res) => {
            console.log(res);
            // 获取图片宽高比
            let innerAspectRadio = res.width / res.height;
            console.log('ssss', innerAspectRadio, this.width / this.height, this.width, this.height);
            if (innerAspectRadio < this.width / this.height) {
              this.originImg = {
                url: url,
                width: this.width,
                height: this.width / innerAspectRadio
              },
              this.stv = {
                offsetX: 0,
                offsetY: 0 - Math.abs((this.height - this.width / innerAspectRadio) / 2),
                zoom: false, //是否缩放状态
                distance: 0,  //两指距离
                scale: 1,  //缩放倍数
                rotate: 0
              }
            } else {
              this.originImg = {
                url: url,
                width: this.height * innerAspectRadio,
                height: this.height
              },
              this.stv = {
                offsetX: 0 - Math.abs((this.width - this.height * innerAspectRadio) / 2),
                offsetY: 0,
                zoom: false, //是否缩放状态
                distance: 0,  //两指距离
                scale: 1,  //缩放倍数
                rotate: 0
              }
            }
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
.container {
  width: 100%;
  height: 100%;
  background: #eee;
  overflow: hidden;
}
.cropper {
  width: 100%;
  height: 100%;
}
.img {
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