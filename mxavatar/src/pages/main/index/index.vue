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
      this.imgUrl = require('../../../../static/images/share-pic.png');
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
        this.operate = 'rotate';
      },
      onMove (e) {
        // console.log('move', e);
        if (this.operate === 'scale' || this.operate === 'rotate') {
          this.newX = e.touches[0].x;
          this.newY = e.touches[0].y;
        }
        this.draw(); 
      },
      onEnd (e) {
        if (this.operate === 'rotate') {
          this.rotateAngle += this.rotateTemp
          this.rotateAngle %= 360
          this.rotateTemp = 0
          // console.log('end')
        }
        this.operate = 'none'
      },
      draw () {
        // const ctx = global.mpvue.createCanvasContext('mainCanvas');
        // // console.log(this.X, this.newX, this.tempX);
        // if (this.operate === 'scale') {
        //   let scaleX = (this.X - this.newX) / (this.X - this.tempX);
        //   let scaleY = (this.Y - this.newY) / (this.Y - this.tempY);
        //   console.log(scaleX, scaleY);
        //   let scale = scaleX < scaleY ? scaleX : scaleY;
        //   this.tempImgWidth = this.imgWidth * scale;
        //   this.tempImgHeight = this.imgHeight * scale;
        //   // 设置新的原点
        //   let x = -this.tempImgWidth / 2
        //   let y = -this.tempImgHeight / 2
        //   this.imgUrl = require('../../../../static/images/share-pic.png');
        //   console.log(x, y, this.tempImgWidth, this.tempImgHeight);
        //   ctx.drawImage(this.imgUrl, x, y, this.tempImgWidth, this.tempImgHeight);
        //   ctx.draw();
        // }
        // 判断是否超出边界
        if (this.X > this.canvasWidth + this.tempImgWidth / 2 - 20) {
          this.X = this.canvasWidth + this.tempImgWidth / 2 - 20
        }
        if (this.Y > this.canvasHeight + this.tempImgHeight / 2 - 20) {
          this.Y = this.canvasHeight + this.tempImgHeight / 2 - 20
        }
        if (this.X < -this.tempImgWidth / 2 + 20) {
          this.X = -this.tempImgWidth / 2 + 20
        }
        if (this.Y < -this.tempImgHeight / 2 + 20) {
          this.Y = -this.tempImgHeight / 2 + 20
        }
        let r = this.iconSize / 2     // 图标半径
        let d = this.iconSize         // 图标直径
        if (this.operate === 'delete') {
          // this.X = 150
          // this.Y = 150
          // this.rotateAngle = 0
          // this.imgHeight = 100
          // this.imgWidth = 100
          // this.tempImgHeight = 100
          // this.tempImgWidth = 100
          // this.imgUrl = ''
          // ctx.moveTo(0, 0)
          // ctx.clearRect(0, 0, 300, 300)
          // ctx.draw()
          // return
          this.clearCanvas()
          return
        }
        const ctx = wx.createCanvasContext('mainCanvas')
        if (this.operate === 'scale') {
          let scaleX = (this.X - this.newX) / (this.X - this.tempX)
          let scaleY = (this.Y - this.newY) / (this.Y - this.tempY)
          let scale = scaleX < scaleY ? scaleX : scaleY
          this.tempImgWidth = this.imgWidth * scale
          this.tempImgHeight = this.imgHeight * scale
        }
        if (this.operate === 'rotate') {
          this.rotateTemp = this.getAngle(this.tempX, this.tempX, this.newX, this.newY)
        }
        // 中心位移
        ctx.translate(this.X, this.Y)
        // 设置新的原点
        let x = -this.tempImgWidth / 2
        let y = -this.tempImgHeight / 2
        // 新旧2种角度,分开旋转
        ctx.rotate(this.rotateTemp * Math.PI / 180)
        ctx.rotate(this.rotateAngle * Math.PI / 180)
        if (!this.imgUrl) return
        ctx.drawImage(this.imgUrl, x, y, this.tempImgWidth, this.tempImgHeight)
        // 旋转回来,保证除了图片以外的其他元素不被旋转
        ctx.rotate((360 - this.rotateTemp) * Math.PI / 180)
        ctx.rotate((360 - this.rotateAngle) * Math.PI / 180)
        // 画边框
        ctx.setStrokeStyle('#fd749c')
        ctx.setLineDash([5, 5], 10);
        ctx.strokeRect(x, y, this.tempImgWidth, this.tempImgHeight)
        // 画 删除 按钮
        ctx.drawImage('/static/images/add-icon.png', x - r, y - r, d, d)
        // 画 旋转 按钮
        ctx.drawImage('/static/images/add-icon.png', x + this.tempImgWidth - r, y - r, d, d)
        // 画 缩放 按钮
        ctx.drawImage('/static/images/add-icon.png', x + this.tempImgWidth - r, y + this.tempImgHeight - r, d, d)
        ctx.draw()
      },
      // 获取旋转角度
      getAngle (px, py, mx, my) {//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
        let x = Math.abs(px - mx);
        let y = Math.abs(py - my);
        let z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        let cos = y / z;
        let radina = Math.acos(cos);//用反三角函数求弧度
        let angle = Math.floor(180 / (Math.PI / radina));//将弧度转换成角度
        if (mx > px && my > py) {//鼠标在第四象限
          angle = 180 - angle;
        }
        if (mx === px && my > py) {//鼠标在y轴负方向上
          angle = 180;
        }
        if (mx > px && my === py) {//鼠标在x轴正方向上
          angle = 90;
        }
        if (mx < px && my > py) {//鼠标在第三象限
          angle = 180 + angle;
        }
        if (mx < px && my === py) {//鼠标在x轴负方向
          angle = 270;
        }
        if (mx < px && my < py) {//鼠标在第二象限
          angle = 360 - angle;
        }
        return angle;
      }
    }
   }
  </script>
  <style>
    .mainCanvas {
      /* background-color: antiquewhite; */
    }
  </style>
  