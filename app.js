//app.js
App({
    globalData: {
        userInfo: null,
        AppID: 'wxy1234567890',
        openid: '',
    },
    onLaunch: function () {
        var that = this;
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        wx.login({
            success: function (res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: 'https://test.hytips.com/wechat/ForexWeb1/forex_require_url.php',
                        data: {
                            appid: that.globalData.AppID,
                            secret: 'abcdefghijklmnopqrst',
                            js_code: res.code,
                            grant_type: 'authorization_code'
                        },
                        dataType: 'JSONP',
                        success: function (res) {
                            var data0 = JSON.parse(res.data);
                            that.globalData.openid = data0.openid
                            //console.log('data0.openid为：' + data0.openid)
                            wx.request({  //传递数据给服务器
                                url: 'https://test.hytips.com/wechat/ForexWeb1/wxuserDataSaveOpenID.php',
                                //method: 'POST',
                                data: {
                                    openid: that.globalData.openid,  //用户唯一标识
                                    AppID: that.globalData.AppID,  //小程序ID
                                },
                                dataType: 'JSONP',
                                success: function (res) {
                                    console.log('openid和AppID存储成功')
                                }
                            });
                        }
                    })
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });
    },

    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.getUserInfo({
                withCredentials: false,
                success: function (res) {
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                }
            })
        }
    },


})
