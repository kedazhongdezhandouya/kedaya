<!-- 主页面 -->
<template>
    <div>
      <div>123456</div>
      <div>456789</div>
      <div>{{ newNum }}</div>
      <button @click="changeNum">???</button>
      <!-- <img :src="imgUrl" v-if="imgUrl"> -->
      <canvas canvas-id="mainCanvas"
              disable-scroll="true"
              @touchstart="onStart"
              @touchmove="onMove"
              @touchend="onEnd"
              :style="canvansStyle"
              v-if="!showRecommend"
              class="mainCanvas"/>
    </div>
  </template>
  <script>
  export default {
    data () {
      return {
        msg: 'test',
        num: 111,
        winWidth: 0,               // 窗口可用区域宽度
        winHeight: 0,              // 窗口可用区域高度
        canvasWidth: 0,            // 画布宽度
        canvasHeight: 0,           // 画布高度
        X: 150,                    // 当前点击的x坐标
        Y: 150,                    // 当前点击的y坐标
        tempX: 150,                // 临时的X坐标
        tempY: 150,                // 临时的Y坐标
        newX: 150,                 // 拖动后的X坐标
        newY: 150,                 // 拖动后的Y坐标
        diffX: 0,                  // 拖动的时候,鼠标点击位置x坐标,跟图片中心的位置x坐标的差
        diffY: 0,                  // 拖动的时候,鼠标点击位置y坐标,跟图片中心的位置y坐标的差
        imgUrl: '',                // 要绘入的图片地址
        imgWidth: 100,             // 图片宽度
        imgHeight: 100,            // 图片高度
        tempImgWidth: 100,         // 最终绘入的图片高度
        tempImgHeight: 100,        // 最终绘入的图片高度
        rotateAngle: 0,            // 旋转角度
        rotateTemp: 0,             // 缓存 旋转角度
        iconSize: 20,              // 操作图标的大小
        operate: 'draw'            // 操作类型
      }
    },
    computed: {
      newNum () {
        return this.num * 2;
      }
    },
    onLoad (options) {
      // console.log('load');
      // this.imgUrl = require('../../../../static/images/add-icon.png');
    },
    onShow () {
      // console.log('show');
    },
    onHide () {
      // console.log('hide');
    },
    // 分享
    onShareAppMessage () {
      return {
        path: `/pages/main/index/main`,
        imageUrl: '/static/images/share-pic.png'
      }
    },
    methods: {
      changeNum () {
        this.num *= 2;
        wx.chooseImage({
          success: (res) => {
            this.imageUrl = res.tempFilePaths[0];
          }
        })
      },
      onStart (e) {
        // console.log('start', e);
        this.operate = 'none';

        // 图标半径
        let r = this.iconSize;
        this.tempX = e.touches[0].x;
        this.tempY = e.touches[0].y;
        this.operate = 'scale';
      },
      onMove (e) {
        // console.log('move', e);
        if (this.operate === 'scale') {
          this.newX = e.touches[0].x;
          this.newY = e.touches[0].y;
        }
        this.draw(); 
      },
      onEnd () {
        // console.log('end');
      },
      draw () {
        const ctx = global.mpvue.createCanvasContext('mainCanvas');
        // console.log(this.X, this.newX, this.tempX);
        if (this.operate === 'scale') {
          let scaleX = (this.X - this.newX) / (this.X - this.tempX);
          let scaleY = (this.Y - this.newY) / (this.Y - this.tempY);
          console.log(scaleX, scaleY);
          let scale = scaleX < scaleY ? scaleX : scaleY;
          this.tempImgWidth = this.imgWidth * scale;
          this.tempImgHeight = this.imgHeight * scale;
          // 设置新的原点
          let x = -this.tempImgWidth / 2
          let y = -this.tempImgHeight / 2
          this.imgUrl = require('../../../../static/images/share-pic.png');
          console.log(x, y, this.tempImgWidth, this.tempImgHeight);
          ctx.drawImage(this.imgUrl, x, y, this.tempImgWidth, this.tempImgHeight);
          ctx.draw();
        }
      }
    }
   }
  </script>
  <style>
    .mainCanvas {
      /* background-color: antiquewhite; */
    }
  </style>
  