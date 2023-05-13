Page({
    data: {
        section: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        bg:['#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6'],
        foot:['none','none','none','none','none','none','none','none','none','none','none',],
        all:0,
        attend:0,
        listIndex:0,
        area:['市民广场','体育馆','和合公园','江滨公园','枫山','云西公园','江岸上城','大桥公园','台州湾湿地公园',],
        statusTag: [true,true,true,true,true,true,true,true,true,true,true,true],
        runner:[],
        join:[0,1,2,3,4,5,6,7,8,9,10,12,13,14,15],
        teamid:0,
        list:1
    },
    onLoad(options) {
        // this.loadTeam()
        this.loadJoin()
    },

    onReady() {

    },
    loadMore(){
        var that=this
        var list=that.data.list
        that.setData({
            list:list+1
        })
    },
    loadJoin(){
        var that=this
        var uid=wx.getStorageSync('uid')
        wx.request({
            url: 'https://xcx.meetu.xin/index.php/Mobile/Index/hasJoin',
            method: 'get',
            data: {
                uid:uid
            },
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (e) {
                console.log(e.data)
                that.setData({
                    runner: e.data
                })

            }
        })
    },
    loadTeam:function (){
        var that=this
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
                    runner: e.data
                })
            }
        })
    },
    byArea: function(t){
        console.log(t.currentTarget.dataset.setRange)
        var index=t.currentTarget.dataset.setRange
        var bg=['#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6','#d1bce6']
        bg[index]='#fff944;'
        var that=this
        var statusTag=[true,true,true,true,true,true,true,true,true,true,true,true]
        wx.request({
            url: 'https://xcx.meetu.xin/index.php/Mobile/Index/listByArea',
            method: 'get',
            data: {
                area:index+1
            },
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (e) {
                console.log(e.data)
                that.setData({
                    runner: e.data
                })
            }
        })
        this.setData({
            bg:bg,
            listIndex:index,
            statusTag:statusTag
        })
    },
    showMap: function(t){
        var index=t.currentTarget.dataset.setMap
        var teamid=t.currentTarget.dataset.setTeamid
        var statusTag=[true,true,true,true,true,true,true,true,true,true,true,true]
        statusTag[index]=false
        this.setData({
            statusTag:statusTag,
            listIndex:index,
            teamid:teamid
        })
    },
    join: function(){
        var that=this
        wx.showModal({
            title: '参与跑步',
            content: '跑步时间9月20日19:30，\r\n距离5km，起点图书馆，终点体育馆。\r\n平均配速10min/km',
            showCancel: true,
            confirmText: '确定',
            confirmColor: 'red',
            success: function(res) {
                var runner=that.data.runner
                var listIndex=that.data.listIndex
                var attend=runner[listIndex].attend
                runner[listIndex].attend=parseInt(attend)+1
                wx.request({
                    url: 'https://xcx.meetu.xin/index.php/Mobile/Index/addActivity',
                    method: 'get',
                    data: {
                        teamid:that.data.teamid,
                        uid:1
                    },
                    dataType: 'json',
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success: function (e) {
                        console.log(e.data)
                        var status=e.data
                        if(status==0){
                            wx.showToast({
                                title: '已经添加',
                            })
                        }else{
                            that.setData({
                                runner:runner
                            })  
                        }
                    }
                })
            },
        })
    }
})