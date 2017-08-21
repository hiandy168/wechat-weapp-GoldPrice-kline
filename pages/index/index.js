//index.js  
//获取应用实例  
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({
    data: {
        typeid:41,  //栏目id
        wdfl:'黄金期货',//问答分类
        arcList: [],//文章列表
        answerArcList: [],//问答文章列表
        tableData: [],  //表格数据
        lunboData: [],  //轮播数据
        arcNewsNumber: 0,//第1次请求10篇新闻
        answerArcNewsNumber: 0,//第1次请求10篇新闻
        huangjinqihuo_title:[],//各类标题
    },
    onLoad: function () {
        var that = this;
        that.getHuangjinqihuoTitle();
        that.getArcLunbo();
        that.getSectionContent(that.data.typeid);
        that.getTableData(that.data.typeid);
       
        that.getArcList(6, that.data.typeid);  //黄金要闻topid=6
        that.getAnswerArcList();  //问答分类
    },
    getHuangjinqihuoTitle:function(){
        var that = this;
        wx.request({
            url: 'https://test.hytips.com/wechat/Gold/huangjinqihuo_title.php',
            data: {},
            dataType: 'JSONP',
            success: function (res) {
                var data0 = JSON.parse(res.data);
                that.setData({
                    huangjinqihuo_title: data0
                })
                wx.setStorageSync('kl_title', data0[3])
            }
        });
    },
    getArcLunbo: function () {  //请求轮播列表数据
        var that = this;
        wx.request({
            url: 'https://test.hytips.com/wechat/ForexWeb1/forex_news.php',
            data: { typeid: 71 },
            dataType: 'JSONP',
            success: function (res) {
                var data0 = JSON.parse(res.data);
                that.setData({
                    lunboData: data0
                })
            }
        });
    },
    seeLunboDetail: function (e) {  //跳转到轮播详情页
        var that = this;
        wx.setStorageSync('arcObj', that.data.lunboData[e.target.dataset.num])
        wx.navigateTo({
            url: '../lubodetail/lunbodetail'
        })
    },
    getArcList: function (topid, typeid) {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        })
        wx.request({
            url: 'https://test.hytips.com/wechat/Gold/gold_zhuanti.php',
            data: {
                topid: topid,
                typeid: typeid,
                number: that.data.arcNewsNumber,
            },
            dataType: 'JSONP',
            success: function (res) {
                wx.hideLoading();
                var data0 = JSON.parse(res.data);
                if (!data0[0]) {
                    wx.showToast({
                        title: '没有更多了',
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    that.setData({
                        arcList: data0,
                    })
                }
            }
        });
    },
    updateArc: function () {
        var that = this;
        that.setData({
            arcNewsNumber: that.data.arcNewsNumber + 1,
        })
        that.getArcList(6, that.data.typeid);
    },
    getAnswerArcList: function () {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        })
        wx.request({
            url: 'https://test.hytips.com/wechat/Gold/gold_gold_wd.php',
            data: {
                wdfl: that.data.wdfl,
                number: that.data.answerArcNewsNumber,
            },
            dataType: 'JSONP',
            success: function (res) {
                wx.hideLoading();
                var data0 = JSON.parse(res.data);
                console.log(data0)
                if (!data0[0]) {
                    wx.showToast({
                        title: '没有更多了',
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    that.setData({
                        answerArcList: data0,
                    })
                }
            }
        });
    },
    updateAnswerArc: function () {
        var that = this;
        that.setData({
            answerArcNewsNumber: that.data.answerArcNewsNumber + 1,
        })
        that.getAnswerArcList();
    },
    gotoArcDetail: function (e) {  //跳转详情页
        var that = this;
        wx.navigateTo({
            url: '../arcdetail/arcdetail?aid=' + e.target.dataset.aid
        })
    },
    gotoAnswerArcDetail: function (e) {  //跳转详情页
        var that = this;
        wx.navigateTo({
            url: '../answerArcdetail/answerArcdetail?aid=' + e.target.dataset.aid
        })
    },
    getSectionContent: function (typeid) {
        var that = this;
        wx.request({
            url: 'https://www.hytips.com/wechat/Gold/gold_get_content.php',
            data: { typeid: typeid },
            dataType: 'JSONP',
            success: function (res) {
                var data0 = JSON.parse(res.data);
                var article = data0.content;
                WxParse.wxParse('article', 'html', article, that, 5);
            }
        });
    },
    getTableData: function (typeid) {
        var that = this;
        wx.request({
            url: 'https://www.hytips.com/wechat/Gold/gold_hqzx.php',
            data: { typeid: typeid },
            dataType: 'JSONP',
            success: function (res) {
                var data0 = JSON.parse(res.data);
                that.setData({
                    tableData: data0
                })
                wx.setStorageSync('indexData', data0)
            }
        });
    },
    gotoKL: function (e) {  //跳转到轮播详情页
        var that = this;
        wx.switchTab({
            url: '../kl/kl'
        })
    },

}) 