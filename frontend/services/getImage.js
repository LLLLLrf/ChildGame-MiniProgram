const config = require('../utils/config.js');

// function getImage for frontend

// 定义一个函数，用于获取图片
function getImage(filename) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${config.serverUrl}/api/image/${filename}`,
            method: 'GET',
            success: (res) => {
                resolve(res.data);
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

function getImageList(imageList) {
    console.log(imageList);
    return new Promise((resolve, reject) => {
        wx.request({
        url: `${config.serverUrl}/api/image/batch`,
        data: {
            filenames: imageList
        },
        
        method: 'POST',
        success: (res) => {
            resolve(res.data);
        },
        fail: (err) => {
            reject(err);
        }
        });
    });
    }

module.exports = {
    getImage,
    getImageList
};
