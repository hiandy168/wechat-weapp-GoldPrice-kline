var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()

Page({
    data: {
        title: '',
        time: '',
    },
    onLoad: function (options) {
        var that = this;
        var aid = options.aid
        wx.showLoading({
            title: '加载中...',
        })
        wx.request({
            url: 'https://test.hytips.com/wechat/Gold/gold_zhuanti_body.php',
            data: {
                aid: aid,
                topid: 6
            },
            dataType: 'JSONP',
            success: function (res) {
                wx.hideLoading();
                var data0 = JSON.parse(res.data)[0];
                console.log(data0)
                var article = data0.body.replace(/src="/g, 'src="http://gold.hytips.com');
                WxParse.wxParse('article', 'html', article, that, 5);
                that.setData({
                    title: data0.title,
                    time: data0.senddate,
                })
            }
        });

    },

})
