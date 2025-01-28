Page({
  data: {
    totalSeconds: 3 * 60,
    minutes: "03",
    seconds: "00",
    timer: null,
    progress: 0,
  },

  onLoad: function () {
    this.startCountdown()
  },

  startCountdown: function () {
    this.data.timer = setInterval(() => {
      if (this.data.totalSeconds > 0) {
        this.data.totalSeconds--
        this.updateDisplay()
        this.updateProgressBar()
      } else {
        this.stopCountdown()
        wx.showToast({
          title: "Countdown finished!",
          icon: "success",
        })
      }
    }, 1000)
  },

  stopCountdown: function () {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
  },

  updateDisplay: function () {
    const minutes = Math.floor(this.data.totalSeconds / 60)
    const seconds = this.data.totalSeconds % 60
    this.setData({
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    })
  },

  updateProgressBar: function () {
    const totalTime = 3 * 60
    const progress = ((totalTime - this.data.totalSeconds) / totalTime) * 360

    this.setData({
      progress: progress,
    })
  },

  onUnload: function () {
    this.stopCountdown()
  },
})

