const config = require('../../utils/config.js');

Page({
  data: {
    fullscreenMode: false,
    pageIndex: 0,
    characterImage: `${config.serverUrl}/static/character.png`,
    dialogText: '-- 点击屏幕任意处继续 --',
    currentImage: '',
    images: [
      `${config.serverUrl}/static/1.png`,
      `${config.serverUrl}/static/2.png`,
      `${config.serverUrl}/static/3.png`,
      `${config.serverUrl}/static/4.png`,
    ],
    totalSeconds: 30,
    seconds: "00",
    timer: null,
    progress: 0,
    timeup: false,
    start: false,
    currentImageIndex: -1,
    recorderManager: null,
  },
  
  onLoad: function () {
    this.getDeviceInfo();

    this.setData({
      recorderManager: wx.getRecorderManager(),
    })

    const recorderManager = this.data.recorderManager;
    recorderManager.onStart(() => {
      console.log("录音开始");
    });

    recorderManager.onStop((res) => {
      console.log("录音结束", res);
      this.setData({
        tempFilePath: res.tempFilePath,
      });

      // 上传音频文件到服务器
      this.uploadAudio(res.tempFilePath);
    });

    recorderManager.onError((err) => {
      console.error("录音错误", err);
    });
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
    console.log("ind",this.data.pageIndex)
    this.setData({
      pageIndex: this.data.pageIndex+1,
    })
    // 交替展示
    if ((this.data.pageIndex-3)%2==1 && this.data.pageIndex<8){
      this.setData({
        fullscreenMode: false,
      })
      this.stopRecording()
      console.log("结束录音")
      return
    }else{
      if(this.data.pageIndex>2){
        this.setData({
          fullscreenMode:true,
        })
        console.log("开始录音")
        this.startRecording()
      }
    }
    if (this.data.pageIndex>2 && this.data.totalSeconds==30) {
      this.startCountdown()
    }
    if (this.data.totalSeconds==0){
      this.setData({
        seconds: "00",
        progress: 0,
        totalSeconds: 30,
      })
      this.startCountdown()
    }
    if (this.data.pageIndex<2) {
      this.setData({
        fullscreenMode: true,
        currentImage: this.data.images[0]
      });
    }else if(this.data.currentImageIndex==3 && this.data.fullscreenMode){
      this.setData({
        fullscreenMode: false,
        pageIndex: 0,
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      let nextIndex = (this.data.currentImageIndex + 1) % this.data.images.length;
      this.setData({
        currentImageIndex: nextIndex,
        currentImage: this.data.images[nextIndex]
      });
    }
  },

  startCountdown: function () {
    if (!this.data.start) {
      this.setData({
        start: true,
      });
    }
    this.data.timer = setInterval(() => {
      if (this.data.totalSeconds > 0) {
        this.data.totalSeconds--
        this.updateDisplay()
        this.updateProgressBar()
      } else {
        this.stopCountdown()
      }
    }, 1000)
  },

  stopCountdown: function () {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    };
    this.setData({
      start: false,
    });
  },

  updateDisplay: function () {
    const seconds = 30-this.data.totalSeconds
    this.setData({
      seconds: seconds.toString().padStart(2, "0"),
    });
  },

  updateProgressBar: function () {
    const totalTime = 30
    const progress = ((totalTime - this.data.totalSeconds) / totalTime) * 360

    this.setData({
      progress: progress,
    });
  },

  onUnload: function () {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    };
    this.setData({
      start: false,
    });
    this.stopRecording();
  },
  
  // 开始录音
  startRecording: function () {
    const recorderManager = this.data.recorderManager;
    recorderManager.start({
      duration: 180000,  // 设置最大录音时间为180秒
      format: 'mp3',  // 音频格式
    });
  },

  // 停止录音
  stopRecording: function () {
    const recorderManager = this.data.recorderManager;
    recorderManager.stop();  // 停止录音
  },

  // 上传音频文件到服务器
  uploadAudio: function (filePath) {
    wx.uploadFile({
      url: `${config.serverUrl}/audio`,
      filePath: filePath,
      name: 'audio',
      success: (res) => {
        console.log("上传成功", res['data']);
        this.setData({
          analysisResult: res['data'],
        })
        wx.showToast({
          title: '上传成功',
          icon: 'success',
        });
      },
      fail: (err) => {
        console.error("上传失败", err);
        wx.showToast({
          title: '上传失败',
          icon: 'none',
        });
      },
    });
  },
});