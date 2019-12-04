<template>
  <div class="container" catchtouchmove="true">
    <div class="img" :style="borderStyle" @touchstart="touchstartCallback"  @touchmove="touchmoveCallback" @touchend="touchendCallback">
      <img :style="originStyle" :src="originImg.url" class="transform-img">
    </div>
    <!--  canvas长宽设为初始图片设置的长宽的两倍，使剪裁得到的图片更清晰，也不至于过大  -->
    <div class="footer">
      <div @click="cropperImg">打印</div>
    </div>
    <canvas class='imgcrop' :style="canvasStyle" canvas-id='imgcrop'></canvas>
  </div>
</template>
  <script>
    export default {
      props: ['url'],
      data () {
        return {
          // url: '',                                     //选择图片路径
          width: '',                                      //剪裁框的宽度
          height: '',                                     //剪裁框的长度
          originImg: '',                                  //存放原图信息
          startX: '',                                     //单指点击位置的x坐标
          startY: '',                                     //单指点击位置的y坐标
          stv: {
            offsetX: 0,                                   //剪裁图片左上角坐标x
            offsetY: 0,                                   //剪裁图片左上角坐标y
            zoom: false,                                  //是否缩放状态
            distance: 0,                                  //两指距离
            scale: 1,                                     //缩放倍数
            rotate: 0                                     //旋转角度
          },
          twoPoint: {                                     //旋转数据
            x1: 0,                                        //手指1坐标x
            y1: 0,                                        //手指1坐标y
            x2: 0,                                        //手指2坐标x
            y2: 0                                         //手指2坐标y
          }
        }
      },
      computed: {
        // 剪裁框样式
        borderStyle () {
          return `width: ${this.width}px; height: ${this.height}px`;
        },
        // 图片动态样式
        originStyle () {
          return `transform: translate(${this.stv.offsetX}px, ${this.stv.offsetY}px) scale(${this.stv.scale}) rotate(${this.stv.rotate}deg); width: ${this.originImg.width}px; height: ${this.originImg.height}px`;
        },
        // canvas样式
        canvasStyle () {
          return `width: ${this.width * 2}px; height: ${this.height * 2}px;`;
        }
      },
      watch: {
        url (val) {
          console.log('val', val);
          this.initImg(val);
        }
      },
      onLoad () {
        // this.initImg(this.url);
        const device = wx.getSystemInfoSync();
        this.width = device.windowWidth * 0.8;
        this.height = device.windowWidth * 0.8 / (102 / 152);
        this.initImg(this.url);
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
            }
          })
        },
        // 触摸开始
        touchstartCallback (e) {
          // length为触摸屏幕的手指数
          if (e.touches.length === 1) {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
          } else {
            // 计算手指间距离
            let xMove = e.touches[1].clientX - e.touches[0].clientX;
            let yMove = e.touches[1].clientY - e.touches[0].clientY;
            let distance = Math.sqrt(xMove * xMove + yMove * yMove);
  
            this.twoPoint = {
              x1: e.touches[0].pageX * 2,
              y1: e.touches[0].pageY * 2,
              x2: e.touches[1].pageX * 2,
              y2: e.touches[1].pageY * 2,
            }
  
            this.stv.distance = distance;
            this.stv.zoom = true;
          }
        },
        // 图片手势动态缩放
        touchmoveCallback (e) {
          this.touchmove(e);
        },
        // 处理触摸移动事件
        touchmove (e) {
          // 单指移动
          if (e.touches.length === 1) {
            // 缩放状态，不处理单指
            if (this.stv.zoom) {
              return;
            }
            // 计算移动距离
            let clientX = e.touches[0].clientX;
            let clientY = e.touches[0].clientY;
            let offsetX = clientX - this.startX;
            let offsetY = clientY - this.startY;
  
            // 计算距离后，记录手指位置新的坐标值
            this.startX = clientX;
            this.startY = clientY;
  
            // 移动图片
            this.stv.offsetX += offsetX;
            this.stv.offsetY += offsetY;
          } else if (e.touches.length === 2) {
            // 计算旋转
            let preTwoPoint = JSON.parse(JSON.stringify(this.twoPoint));
            this.twoPoint.x1 = e.touches[0].pageX * 2;
            this.twoPoint.y1 = e.touches[0].pageY * 2;
            this.twoPoint.x2 = e.touches[1].pageX * 2;
  
            // 旋转前后两点距离
            let vector1 = this.vector(preTwoPoint.x1, preTwoPoint.y1, preTwoPoint.x2, preTwoPoint.y2);
            let vector2 = this.vector(this.twoPoint.x1, this.twoPoint.y1, this.twoPoint.x2, this.twoPoint.y2);
            let cos = this.calculatePM(vector1, vector2);

            // 旋转角度
            let angle = Math.acos(cos) * 180 / Math.PI;
            let direction = this.calculateCP(vector1, vector2);
            // 最终旋转角度值
            let allDeg = direction * angle;
  
            if (Math.abs(allDeg) > 1) {
              this.stv.rotate += allDeg;
            } else {
              // 双指缩放
              let xMove = e.touches[1].clientX - e.touches[0].clientX;
              let yMove = e.touches[1].clientY - e.touches[0].clientY;
              let distance = Math.sqrt(xMove * xMove + yMove * yMove);
              // 现在两指距离
              let distanceDiff = distance - this.stv.distance;
              // 缩放比例
              let newScale = this.stv.scale + 0.005 * distanceDiff;
              // 缩放过大或过小则返回
              if (newScale < 0.2 || newScale > 2.5) {
                return;
              }
              // 缩放后记录当前距离及缩放比例
              this.stv.distance = distance;
              this.stv.scale = newScale;
            }
          } else {
            // 其他情况返回
            return;
          }
        },
        // 计算向量
        vector (x1, y1, x2, y2) {
          return {
            x: x2 - x1,
            y: y2 - y1
          }
        },
        // 计算点乘(角度余弦值)
        calculatePM (vector1, vector2) {
          return (vector1.x * vector2.x + vector1.y * vector2.y) / (Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y) * Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y));
        },
        // 计算叉乘(方向)
        calculateCP (vector1, vector2) {
          return (vector1.x * vector2.y - vector2.x * vector1.y) > 0 ? 1 : -1;
        },
        // 触摸结束
        touchendCallback (e) {
          if (e.mp.touches.length === 0) {
            this.stv.zoom = false;  // 重置缩放状态
          }
        },
        // 初始化图片
        initImg (url) {
          wx.getImageInfo({
            src: url,
            success: (res) => {
              // 获取图片宽高比
              let innerAspectRadio = res.width / res.height;
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
        },
        // canvas剪裁图片
        cropperImg () {
          // wx.showLoading({
          //   title: 'loading',
          //   mask: true
          // })
          let ctx = wx.createCanvasContext('imgcrop');
          ctx.save();
          // 缩放偏移值
          let x = (this.originImg.width - this.originImg.width * this.stv.scale) / 2;
          let y = (this.originImg.height - this.originImg.height * this.stv.scale) / 2;

          // 画布中点坐标转移到图片中心
          let movex = (this.stv.offsetX + x) * 2 + this.originImg.width * this.stv.scale;
          let movey = (this.stv.offsetY + y) * 2 + this.originImg.height * this.stv.scale;
          ctx.translate(movex, movey);
          ctx.rotate(this.stv.rotate * Math.PI / 180);
          ctx.translate(-movex, -movey);
          ctx.drawImage(this.originImg.url, (this.stv.offsetX + x) * 2, (this.stv.offsetY + y) * 2, this.originImg.width * 2 * this.stv.scale, this.originImg.height * 2 * this.stv.scale);
          ctx.restore();
          ctx.draw(false, ()=> {
            wx.canvasToTempFilePath({
              canvasId: 'imgcrop',
              success: (response) => {
                console.log(response.tempFilePath);
                this.$emit('show-img', response.tempFilePath);
                // _this.triggerEvent("getCropperImg", { url: response.tempFilePath })
                // wx.hideLoading();
              },
              fail( e ) {
                console.log( e );
                wx.hideLoading();
                wx.showToast({
                  title: '生成图片失败',
                  icon: 'none'
                })
              }
            }, this)
          });
        }
      }
    }
  </script>
  <style>
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    background: #000;
  }
  .img {
     position: absolute;
     top: 5%;
     left: 50%;
     transform: translateX(-50%);
     overflow: hidden;
     background: #eee;
  }
  .transform-img {
    height: 400px;
  }
  .imgcrop {
     position: absolute;
    left: -50000rpx;
    top: -500000rpx; 
  }
  .footer {
    position: absolute;
    width: 100%;
    height: 110rpx;
    color: #fff;
    background: #000;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .footer view {
    width: 30%;
    text-align: center;
  }
  .background {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: -1;
  }
  </style>