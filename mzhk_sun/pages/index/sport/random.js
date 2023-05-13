// mzhk_sun/pages/index/sport/random.js
Page({
    data: {
        banner: [],
        url: [],
        navTile: "我的组队",
        curIndex: 0,
        nav: [ "组队中", "已组队" ],
        curList: [],
        oldList: [],
        page: 1,
        oldpage: 1,
        group:[1],
        usrgroup: [1, 2, 3, 4],
        random:[1,2,3]
    },

    onLoad(options) {
        // this.random()
    },
    random: function(){
        var that=this
        wx.showModal({
            title: '为你随机组队',
            content: '跑步时间9月20日19:30，\r\n距离5km，起点图书馆，终点体育馆。\r\n平均配速10min/km',
            showCancel: true,
            confirmText: '确定',
            confirmColor: 'red',
            success: function(res) {

            },
        })
    }
})