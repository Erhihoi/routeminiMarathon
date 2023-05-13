// mzhk_sun/pages/index/sport/sportset.js
var app = getApp()

var interval;
var varName;
var ctx = wx.createCanvasContext('canvasArcCir');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        switch1Checked: 0,
        arrow: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        tips: 'display screen',
        ballhide: 0,
        ballshow: 1,
        color: [],
        first: 0,
        section: [],
        message1: 1,
        message2: 2,
        message3: 3,
        message4: 4,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    // 初始页面，首页
    onLoad: function (options) {
        var that = this
        wx.request({
            url: 'https://xcx.meetu.xin/index.php/Mobile/Index/listTeam',
            method: 'get',
            data: {
            },
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (e) {
                console.log(e.data)
                that.setData({
                    section: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    drawCircle: function () {
        clearInterval(varName);
        function drawArc(s, e) {
            ctx.setFillStyle('white');
            ctx.clearRect(0, 0, 200, 200);
            ctx.draw();
            var x = 100, y = 100, radius = 96;
            ctx.setLineWidth(7);
            ctx.setStrokeStyle('#BFEFFF');
            ctx.setLineCap('round');
            ctx.beginPath();
            ctx.arc(x, y, radius, s, e, false);
            ctx.stroke()
            ctx.draw()
        }
        var step = 1, startAngle = 1.5 * Math.PI, endAngle = 0;
        var animation_interval = 1000, n = 60;
        var animation = function () {
            if (step <= n) {
                endAngle = step * 8 * Math.PI / n + 1.5 * Math.PI;
                drawArc(startAngle, endAngle);
                console.log(step)
                step++;
            } else {
                clearInterval(varName);
            }
        };
        varName = setInterval(animation, animation_interval);
    },
    onReady: function () {
        //创建并返回绘图上下文context对象。
        const query = wx.createSelectorQuery() //定义query
        query.select('.message').boundingClientRect() //获取元素参数
        query.exec((res) => {
            console.log(res[0]) //可以得到元素高度、距离顶部的top值、宽度等，单位为px
            var width=res[0].width
            var height=res[0].height
            var cxt_arc = wx.createCanvasContext('canvasCircle');
            cxt_arc.setLineWidth(8);
            cxt_arc.setStrokeStyle('#BFEFFF');
            cxt_arc.setLineCap('round');
            cxt_arc.beginPath();
            cxt_arc.arc(height/2-30+10, height/2-30+10, height/2-30,-0.5*Math.PI,1* Math.PI, false);
            // cxt_arc.rect(0,0,428,150);
            cxt_arc.stroke();
            cxt_arc.draw();
        })
    },
    section: function (i) {
        var that = this
        console.log()
        var num = i.currentTarget.dataset.num
        wx.request({
            method: 'post',
            url: 'https://xcx.meetu.xin/index.php/Mobile/Index/section',
            data: {
                num: num
            },
            dataType: 'json',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (e) {
                console.log(e.data)
                var info = e.data
                that.setData({
                    message1: info.start_line + info.finish_line,
                    message2: info.destination,
                    message3: info.team,
                    message4: info.progress

                })
            }
        })
    },
    switch1Change: function (t) {
        console.log(t)
        var that = this
        var status = t.detail.value
        if (status) {
            that.setData({
                position: -80
            })
        } else {
            that.setData({
                position: 0
            })
        }
    },
    moveBall: function () {
        var that = this
        var arrow = that.data.arrow
        console.log(arrow)
        var first = that.data.first
        var panl = []
        var color = []
        for (var i = 0; i < 13; i++) {
            panl[i] = arrow[i] + 1
            if (i == first) {
                color[i] = "red"
            } else {
                color[i] = ""
            }
        }
        first++
        console.log(color)
        this.setData({
            // arrow:panl,
            tips: '旋转小陀螺',
            color: color,
            first: first
        })
    }


})