Page({
  data: {
    fullscreenMode: false,
    characterImage: '/path/to/character.png',
    dialogText: '-- 点击屏幕任意处继续 --',
    currentImage: '',
    images: [
      '/assets/picturedescribing/img1.png',
      '/assets/picturedescribing/img2.png',
    ],
    questions:[
      A=["小猪在吃什么？","小猪为什么摔倒了？"],
      B=["小猫想吃什么？","小猫最后怎么了？"],
    ],
    currentImageIndex: -1
  },
  onLoad() {
    this.getDeviceInfo();
  },

  getDeviceInfo() {
    wx.getSystemInfo({
      success: (res) => {
        let deviceType = '';
        let imageStyle = '';

        // 根据设备型号判断刘海位置
        if (res.model.includes('iPhone X') || res.model.includes('iPhone 11')) {
          deviceType = 'notch-right';
          imageStyle = 'width: 90%; height: 90%;';
        } else if (res.model.includes('Huawei P30') || res.model.includes('Huawei Mate 30')) {
          deviceType = 'notch-left';
          imageStyle = 'width: 90%; height: 90%;';
        } else {
          imageStyle = 'width: 95%; height: 95%;';
        }

        this.setData({ deviceType, imageStyle });
      }
    });
  },
  handleTap() {
    if (!this.data.fullscreenMode) {
      // 首次点击，进入全屏模式
      this.setData({
        fullscreenMode: true,
        currentImage: this.data.images[0]
      });
    } if(this.data.currentImageIndex==1 && this.data.fullscreenMode){
      this.setData({fullscreenMode: false})
      wx.navigateBack({
        delta: 1
      })
    } else {
      // 已在全屏模式，切换到下一张图片
      let nextIndex = (this.data.currentImageIndex + 1) % this.data.images.length;
      this.setData({
        currentImageIndex: nextIndex,
        currentImage: this.data.images[nextIndex]
      });
    }
  }
});