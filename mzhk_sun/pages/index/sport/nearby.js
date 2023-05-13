// mzhk_sun/pages/index/sport/nearby.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        all:0,
        attend:0,
        listIndex:0,
        area:['市民广场','体育馆','和合公园','江滨公园','枫山','云西公园','江岸上城','大桥公园','台州湾湿地公园',],
        runner:[],
        join:[1,2,3,4,5,6,7,8,9,10,12,13,14,15],
        teamid:0,
        usrgroup:[1,2,3,4,5],
        list:2
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.loadTeam()

    },

    onReady() {

    },
    loadMore(){
        console.log('more')
        var that=this
        var list=that.data.list
        that.setData({
            list:list+1
        })
    },
    loadTeam:function (){
        var that=this
        wx.request({
            url: 'https://xcx.meetu.xin/index.php/Mobile/Index/listSeek',
            method: 'get',
            data: {
                uid:wx.getStorageSync('uid')
            },
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (e) {
                console.log(e.data)
                var res=e.data
                that.setData({
                    runner: res.team,
                    seek:res.seek
                })
            }
        })
    },
    seek: function(t){
        var seeked=t.currentTarget.dataset.seeked
        var teamid=t.currentTarget.dataset.teamid
        var that=this
        if(seeked){
            wx.showToast({
                title: '取消参考',
            })
            wx.request({
                url: 'https://xcx.meetu.xin/index.php/Mobile/Index/seek',
                method: 'get',
                data: {
                    teamid:teamid,
                    type:1
                },
                dataType: 'json',
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (e) {
                    //删除
                    console.log(e.data,'type-1删除参考元素')
                    let seek=that.data.seek
                    console.log(seek)
                    delete seek[teamid]
                    that.setData({
                        seek:seek
                    })
                }
            })
        }else{
            wx.showToast({
                title: '加入参考',
            })
            wx.request({
                url: 'https://xcx.meetu.xin/index.php/Mobile/Index/seek',
                method: 'get',
                data: {
                    teamid:teamid,
                    type:2,
                    uid:wx.getStorageSync('uid')
                },
                dataType: 'json',
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (e) {
                    //添加
                    console.log(e.data,'type-2,添加参考元素')
                    let seek=that.data.seek
                    seek[teamid]=1
                    that.setData({
                        seek:seek
                    })
                }
            })
        }
    },
    byArea: function(t){
        console.log(t.currentTarget.dataset.setRange)
        var index=t.currentTarget.dataset.setRange
        var bg=['#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff']
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
    learn:function(){
        
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