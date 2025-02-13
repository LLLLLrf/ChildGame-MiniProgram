const config = require('../../utils/config.js');

Page({
  data: {
    videoSrc: "",
    tempFilePath: "",
    analysisResult: "",
  },

  startRecording: function () {
    wx.chooseMedia({
      count: 1,
      mediaType: ["video"],
      sourceType: ["camera"],
      maxDuration: 60,
      camera: "back",
      success: (res) => {
        console.log("Recording successful", res)
        this.setData({
          tempFilePath: res.tempFiles[0].tempFilePath,
          videoSrc: res.tempFiles[0].tempFilePath,
          analysisResult: "",
        })
        wx.showToast({
          title: "Video recorded",
          icon: "success",
        })
      },
      fail: (error) => {
        console.error("Recording failed", error)
        wx.showToast({
          title: "Recording failed",
          icon: "none",
        })
      },
    })
  },

  chooseVideo: function () {
    wx.chooseMedia({
      count: 1,
      mediaType: ["video"],
      sourceType: ["album"],
      success: (res) => {
        console.log("Video chosen", res)
        this.setData({
          tempFilePath: res.tempFiles[0].tempFilePath,
          videoSrc: res.tempFiles[0].tempFilePath,
          analysisResult: "",
        })
        wx.showToast({
          title: "Video chosen",
          icon: "success",
        })
      },
      fail: (error) => {
        console.error("Choosing video failed", error)
        wx.showToast({
          title: "Choosing video failed",
          icon: "none",
        })
      },
    })
  },

  uploadVideo: function () {
    if (!this.data.tempFilePath) {
      wx.showToast({
        title: "No video to upload",
        icon: "none",
      })
      return
    }

    wx.showLoading({
      title: "Uploading...",
    })

    wx.uploadFile({
      // BACKEND API here
      url: `${config.serverUrl}/video/upload`,
      filePath: this.data.tempFilePath,
      name: "video",
      success: (uploadRes) => {
        console.log("Upload successful", uploadRes)

        // Parse the response from the server
        let result
        try {
          result = JSON.parse(uploadRes.data)
        } catch (e) {
          console.error("Failed to parse server response", e)
          wx.showToast({
            title: "Failed to parse server response",
            icon: "none",
          })
          return
        }

        if (result && result.analysisResult) {
          this.setData({
            analysisResult: result.analysisResult,
          })
          wx.showToast({
            title: "Analysis complete",
            icon: "success",
          })
        } else {
          wx.showToast({
            title: "No analysis result received",
            icon: "none",
          })
        }
      },
      fail: (error) => {
        console.error("Upload failed", error)
        wx.showToast({
          title: "Upload failed",
          icon: "none",
        })
      },
      complete: () => {
        wx.hideLoading()
      },
    })
  },
})

