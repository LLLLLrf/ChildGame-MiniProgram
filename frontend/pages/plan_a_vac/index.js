const config = require('../../utils/config.js');

Page({
  data: {
    totalSeconds: 3 * 60,
    minutes: "03",
    seconds: "00",
    timer: null,
    progress: 0,
    start: false,
    recorderManager: null,
    tempFilePath: '',  // 临时音频文件路径
    analysisResult: null,  // 用于存储上传后的结果
  },

  onLoad: function () {
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

  startCountdown: function () {
    if (!this.data.start) {
      this.setData({
        start: true,
      });
    }
    this.startRecording();
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
    this.stopRecording();
    if (this.data.timer) {
      clearInterval(this.data.timer)
    };
    this.setData({
      start: false,
      totalSeconds: 3*60,
      minutes: "03",
      seconds: "00",
    });
    wx.showToast({
      title: '已完成',
      icon: "success",
    })
  },

  updateDisplay: function () {
    const minutes = Math.floor(this.data.totalSeconds / 60)
    const seconds = this.data.totalSeconds % 60
    this.setData({
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    });
  },

  updateProgressBar: function () {
    const totalTime = 3 * 60
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
      url: `${config.serverUrl}/api/audio/upload`,
      filePath: filePath,
      name: 'audio',
      success: (res) => {
        console.log("上传成功", res);
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
})
