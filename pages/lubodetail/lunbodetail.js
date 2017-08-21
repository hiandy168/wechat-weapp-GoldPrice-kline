var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()

Page({
    data: {
        title: '',
        time: '',
    },
    onLoad: function (options) {
        var that = this;
        var arcObj = wx.getStorageSync('arcObj')
        console.log(arcObj)
        var article = arcObj.htmlpage.replace(/src="/g, 'src="https://www.hytips.com');
        WxParse.wxParse('article', 'html', article, that, 5);
        that.setData({
            title: arcObj.title,
            time: arcObj.senddate,
        })
    },

})
