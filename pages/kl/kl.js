/**
 * Created by ChenChao on 2016/9/27.
 */

var app = getApp();
//var storage = require('../../utils/storage');
var kl = require('../../utils/wxChart/k-line');
var getOptionKline1 = function (type) {
    return {
        name: type || 'dk',
        width: 'auto',
        height: 250,
        average: [5, 10, 20],
        axis: {
            row: 5,
            col: 5,
            showX: false,
            showY: true,
            showEdg: true,
            paddingTop: 0,
            paddingBottom: 1,
            paddingLeft: 0,
            paddingRight: 0,
            color: '#cdcdcd'
        },
        xAxis: {
            //times:['20170101','20170102'],
            data: [],
            averageLabel: []
        },
        yAxis: [],
        callback: function (time) {
            var page = getCurrentPages();
            page = page[page.length - 1];
            page.setData({
                kl1RenderTime: time
            });
        }
    };
};
var kLine;
var ma5Arr, ma10Arr, ma20Arr;

Page({
    data: {
        ma5: '',
        ma10: '',
        ma20: '',
        ma5b: '',
        ma10b: '',
        ma20b: '',
        tabName: '',
        stock: '',
        code: '',
        time: '',
        yc: '',
        kl1RenderTime: 0,
        kl2RenderTime: 0,
        index1: 4,
        timeData: ['5分钟', '15分钟', '30分钟', '60分钟', '日K', '周K', '月K'],
        typeData: ['mink-5', 'mink-15', 'mink-30', 'mink-60', 'dk', 'wk', 'mk'],

        codeStr: 'comex_2',  //获取数据的必要参数
        sj: null,//获取数据的必要参数
        type: 'dk',//获取数据的必要参数
        myUnit: 0,//获取数据的必要参数
        timeNumber: 0,//X轴上时间的个数
        baseData: [],//请求回的数据
        XData: [],//x轴的所有时间数据
        XTime: null,//X轴的3个时间

        indexData: null,//首页传过来的完整数据
        goldData: null,  //从首页获取的黄金品种数据
        index0: 0,  //选择第1个黄金品种

        windowHeight: 0,
    },
    onLoad: function () {
        var that = this;
        that.setData({
            windowHeight: wx.getSystemInfoSync().windowHeight + 48,
        })
        let kl_title = wx.getStorageSync('kl_title')
        wx.setNavigationBarTitle({
            title: kl_title
        })
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#1C1F27',
            animation: {
                duration: 400,
                timingFunc: 'easeIn'
            }
        })
        var indexData = wx.getStorageSync('indexData');
        var goldData = [];
        for (var i = 0; i < indexData.length; i++) {
            goldData[i] = indexData[i].name;
        }
        that.setData({
            indexData: indexData,
            goldData: goldData
        })
        that.requestData(that.data.codeStr, that.data.type);
    },
    selectGold: function (e) {
        var that = this;
        that.requestData(that.data.indexData[e.detail.value].code, that.data.type);
        that.setData({
            index0: e.detail.value,
            codeStr: that.data.indexData[e.detail.value].code,
        })
    },
    selectTime: function (e) {
        var that = this;
        that.requestData(that.data.codeStr, that.data.typeData[e.detail.value]);
        that.setData({
            index1: e.detail.value,
            type: that.data.typeData[e.detail.value],
        })
    },
    requestData: function (codeStr, type) {
        var that = this;
        if (type == 'mink-5') {
            var sj = '5m'
        } else if (type == 'mink-15') {
            var sj = '15m'
        } else if (type == 'mink-30') {
            var sj = '30m'
        } else if (type == 'mink-60') {
            var sj = '1h'
        } else if (type == 'dk') {
            var sj = '1d'
        } else if (type == 'wk') {
            var sj = '1w'
        } else if (type == 'mk') {
            var sj = '1M'
        }
        wx.showLoading({
            title: '加载中...',
        })
        wx.request({
            url: 'https://www.hytips.com/wechat/Gold/gold_hqzx_chart.php',
            data: {
                code: codeStr,
                sj: sj,
            },
            dataType: 'JSONP',
            success: function (res) {
                wx.hideLoading();
                var data0 = JSON.parse(res.data);
                var data = new Array();  //先声明一维
                var XData = [];
                for (var i = 0; i < data0.length; i++) {
                    data[i] = [[], [], [], [], [], [], [], []];
                    data[i][0] = data0[i].date_x;
                    data[i][1] = data0[i].open;
                    data[i][2] = data0[i].close;
                    data[i][3] = data0[i].high;
                    data[i][4] = data0[i].low;
                    data[i][5] = 0;
                    data[i][6] = 0;
                    data[i][7] = 0;
                    data[i] = data[i].toString();
                    XData[i] = data0[i].date_x;
                }
                var tempdata = {
                    "name": "测试数据",
                    "code": "100000",
                    "info": {
                        "c": "15.82",
                        "h": "15.84",
                        "l": "15.75",
                        "o": "15.80",
                        "a": "24561144",
                        "v": "15543",
                        "yc": "15.99",
                        "time": "2017-01-18 09:32:34",
                        "ticks": "34200|54000|0|34200|41400|46800|54000",
                        "total": "1598",
                        "pricedigit": "0.00"
                    },
                    "data": data
                };
                var XTime = [];
                XTime[0] = XData[0];
                XTime[1] = XData[parseInt(XData.length / 2)];
                XTime[2] = XData[XData.length - 1];
                that.setData({
                    tabName: type,
                    stock: tempdata.name,
                    code: tempdata.code,
                    time: tempdata.info.time,
                    yc: tempdata.info.yc,


                    XData: XData,
                    XTime: XTime,
                    myUnit: parseInt(XData.length / 2),
                    timeNumber: XData.length,
                    baseData: tempdata
                });

                that.draw(tempdata, type, that.data.myUnit);
            }
        });
    },
    sliderchange: function (event) {
        var that = this;
        var XTime = [];
        XTime[0] = that.data.XData[0];
        XTime[1] = that.data.XData[parseInt(event.detail.value / 2)];
        XTime[2] = that.data.XData[event.detail.value - 1];
        that.setData({
            myUnit: event.detail.value,
            XTime: XTime,
        })
        that.draw(that.data.baseData, that.data.type, event.detail.value);
    },
    draw: function (data, type, myUnit) {
        kLine = kl('k-line', myUnit).init(getOptionKline1(type));
        kLine.metaData1(data, getOptionKline1(type));
        kLine.draw();
        var yAxis1 = kLine.options.yAxis;
        ma5Arr = yAxis1[1].dataShow;
        ma10Arr = yAxis1[2].dataShow;
        ma20Arr = yAxis1[3].dataShow;
        this.showLastAverage();
    },
    showLastAverage: function () {
        this.setData({
            ma5: ma5Arr[ma5Arr.length - 1],
            ma10: ma10Arr[ma10Arr.length - 1],
            ma20: ma20Arr[ma20Arr.length - 1],
        });
    }
});
