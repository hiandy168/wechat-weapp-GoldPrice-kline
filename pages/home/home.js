//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        show: false,
        userInfo: {},
        huodongTitle: '',
        arcID: '',
        telExplain: '(*必填)',
        telNumber: '',
        uName: '',
        submitBtn: ' 提 交 ',
        appID:null,  //所以小程序的appid
        copyWebsite: '复制',
        copyMail: '复制',
    },
    onLoad: function () {
        var that = this
        //调用应用实例的方法获取全局数据
        
        wx.request({  //获取活动标题和文章ID
            url: 'https://test.hytips.com/wechat/ForexWeb1/forex_hdlm.php',
            data: { appid: app.globalData.appid},
            dataType: 'JSONP',
            success: function (res) {
                var data0 = JSON.parse(res.data);
                that.setData({
                    huodongTitle: data0[0].title,
                    arcID: data0[0].id,
                });

                app.getUserInfo(function (userInfo) {
                    //更新数据
                    that.setData({
                        userInfo: userInfo,
                        show: true,
                    });
                    //用户授权后，将用户数据存到数据库
                    that.storeuserInfo();
                });
                
            }
        });
        wx.request({  //获取所有小程序appid
            url: 'https://test.hytips.com/wechat/ForexWeb1/forex_appid.php',
            data: {},
            dataType: 'JSONP',
            success: function (res) {
                var data0 = JSON.parse(res.data);
                that.setData({
                    appID: data0
                })
            }
        });
    },
    userInfoHandler: function (detail){
        var that=this;
        if (detail.detail.userInfo){
            //更新数据
            that.setData({
                userInfo: detail.detail.userInfo,
                show: true,
            });
            //用户授权后，将用户数据存到数据库
            that.storeuserInfo();
        }else{
            console.log('用户未授权!')
        }
    },
    storeuserInfo:function(){
        var that = this;
        wx.request({  //传递数据给服务器
            url: 'https://test.hytips.com/wechat/ForexWeb1/wxuserDataSave.php',
            //method: 'POST',
            data: {
				openid: app.globalData.openid,  //用户唯一标识
                arcID: that.data.arcID,  //活动标题对应的文章ID
                avatarUrl: that.data.userInfo.avatarUrl,//用户信息：图像
                city: that.data.userInfo.city,//用户信息：所在城市
                gender: that.data.userInfo.gender,//用户信息：性别。0:未知，1：男，2：女
                language: that.data.userInfo.language,//用户信息：语言
                nickName: that.data.userInfo.nickName,//用户信息：姓名
                province: that.data.userInfo.province,//用户信息：省份
            },
            dataType: 'JSONP',
            success: function (res) {
                console.log('用户信息存储成功')
            }
        });
    },
    inputTel: function (e) {  //将输入的电话号码存入telNumber变量中
        var that = this;
        that.setData({
            telNumber: e.detail.value,
            telExplain: '(*必填)',
            submitBtn: ' 提 交 '
        });
    },
    inputName: function (e) {  //将输入的用户姓名存入uName变量中
        var that = this;
        that.setData({
            uName: e.detail.value,
        });
    },
    submit: function (detail) {  //相关信息提交数据库
        var that = this
        if (!that.data.telNumber) {
            that.setData({
                openid: app.globalData.openid,  //用户唯一标识
                telExplain: '请输入号码!',
                submitBtn: ' 提 交 '
            })
        } else if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(that.data.telNumber))) {
            that.setData({
                telExplain: '请输入正确的手机号!',
                submitBtn: ' 提 交 '
            })
        } else {
            wx.request({  //传递数据给服务器
                url: 'https://test.hytips.com/wechat/ForexWeb1/wxuserDataSaveTel.php',
                //method: 'post',
                data: {
                    openid: app.globalData.openid,  //用户唯一标识
                    telNumber: that.data.telNumber,  //客户电话号码
                    uName: that.data.uName,  //客户姓名
                },
                dataType: 'JSONP',
                success: function (res) {
                    that.setData({
                        telExplain: '已提交!',
                        submitBtn: '提交成功'
                    })
					wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 1500
                    })
                }
            });
        }
        console.log(detail.detail.userInfo)
        if (detail.detail.userInfo) {
            //更新数据
            that.setData({
                userInfo: detail.detail.userInfo,
                show: true,
            });
            //用户授权后，将用户数据存到数据库
            that.storeuserInfo();
        } else {
            console.log('用户未授权!')
        }
    },
    openAPPID:function(e){
        var that = this;
        wx.navigateToMiniProgram({
            appId: e.target.dataset.appid,
            path: '',
            extraData: {},
            envVersion: '',
            success(res) {
                console.log(e.target.dataset.appid+'小程序打开成功')
            }
        })
    },
    webCopy: function () {
        var that = this;
        wx.setClipboardData({
            data: 'http://m.hytips.com/?xcx',
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        that.setData({
                            copyWebsite: '已复制',
                        })
                    }
                })
            }
        })
    }
})
