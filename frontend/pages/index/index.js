Page({
  data: {},

  navigateToPage1: () => {
    wx.navigateTo({
      url: "/pages/plan_a_vac/index",
    })
  },

  navigateToPage2: () => {
    wx.navigateTo({
      url: "/pages/story/index",
    })
  },

  navigateToPage3: () => {
    wx.navigateTo({
      url: "/pages/describe/index",
    })
  },

  navigateToVideoUpload: () => {
    wx.navigateTo({
      url: "/pages/video_upload/index",
      fail: (err) => {
        console.error("Navigation failed:", err)
        wx.showToast({
          title: "Navigation failed",
          icon: "none",
        })
      },
    })
  },
})

