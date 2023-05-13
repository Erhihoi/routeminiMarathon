var app=getApp()
Page({
    data: {
        section: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        all:0,
        attend:0,
        index:0,
        teamid:0,
        lat: 28.65857270312306,
        lng: 121.41610499450682,
        markers: [],
        userInfo: {},
        hasUserInfo: false,
        canIUseGetUserProfile: false,
    },
    onLoad: function (options) {
        var that=this

        if (wx.getUserProfile) {
            this.setData({
              canIUseGetUserProfile: true
            })
        }
        if (app.globalData.checkLogin){
            console.log('checklogin')
            this.setData({
                test:1,
                test2:app.globalData.uid
            })
            that.loadTeam()
            that.loadDaka()
        }else{
            app.checkLoginReadyCallback = res => {
                console.log('index.js')
                console.log(wx.getStorageSync('uid'))
                console.log(app.globalData.uid)
                var uid=wx.getStorageSync('uid')
                this.setData({
                    uid:uid,
                    test:2,
                    test2:app.globalData.uid
                })
                that.loadTeam()
                that.loadDaka()
            };
        }
    },
    onReady: function(options){
    },
    call() { // 打电话
        let phone = "15968667245" // 仅为示例，并非真实的电话号码
        wx.makePhoneCall({
          phoneNumber: phone  
        })
    },
    loadTeam:function (){
        var that=this
        wx.request({
            url: 'https://xcx.meetu.xin/index.php/Mobile/Index/listSeek',
            method: 'get',
            data: {
                uid:app.globalData.uid,
            },
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (e) {
                console.log(e.data)
                var runner=e.data.team
                var check=[]
                var bg=[]
                for(var s in runner){
                    check[s]='none'
                    bg[s]='#fffc98'
                }
                var marker=JSON.parse(runner[0].point)
                var polyline=JSON.parse(runner[0].polyline)
                bg[0]='#98e7ff'
                check[0]=''
                that.setData({
                    lat: marker[0].latitude,
                    lng: marker[0].longitude,
                    teamid:runner[0].id,
                    distance:(parseFloat(runner[0].distance)).toFixed(2),
                    start_time:runner[0].start_time,        
                    polyline:polyline,
                    markers:marker,
                    runner: runner,
                    seek:e.data.seek,
                    // 最早是用写好的数组赋值，jquery时期用操作dom单独改变div状态，而这里用过调取数组来取值，几号dom操作了对几号赋值。最早还有一个想法就是对dom单独赋值。后来发现错了，不通过数组通过一个变量来操作导致全部状态改变，这个写法自己想的没有参照别人
                    check:check,
                    bg:bg
                })
            }
        })
    },
    loadDaka:function(){
        var that=this
        wx.request({
            url: 'https://xcx.meetu.xin/index.php/Mobile/Index/loadDaka',
            method: 'get',
            data: {
                uid:app.globalData.uid,
            },
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (e) {
                var res=e.data
                console.log(res)
                that.setData({
                    daka:res.daka,
                    today:res.today
                })
            }
        })
    },

    daka:function (t){
        console.log(t)
        var that=this
        var type=t.detail.value
        if(type){
            type=1
        }else{
            type=0
        }
        wx.request({
            url: 'https://xcx.meetu.xin/index.php/Mobile/Index/daka',
            method: 'get',
            data: {
                uid:wx.getStorageSync('uid'),
                type:type
            },
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (e) {
                console.log(e)
                var daka=that.data.daka
                if(type){
                    daka[e.data]=1
                }else{
                    daka[e.data]=0
                }
                console.log(daka)
                that.setData({
                    daka:daka
                })
            }
        })
    },
    toScreen: function(t){
        console.log(t.currentTarget.dataset.setRange)
        var index=t.currentTarget.dataset.setRange
        var runner=this.data.runner
        var check=[]
        var bg=[]
        var foot=[]
        for(var s in runner){
            check[s]='none'
            bg[s]='#fffc98'
            foot[s]=''
        }
        bg[index]='#98e7ff;'
        check[index]=''

        var all=this.data.runner[index].all
        var attend=this.data.runner[index].attend
        var polyline=JSON.parse(this.data.runner[index].polyline)
        var markers=JSON.parse(this.data.runner[index].point)
        var join=[]
        for(var i=0;i<all;i++){
            if(i<attend){
                join[i]=1
            }else{
                join[i]=0
            }
        }
        
        this.setData({
            lat: markers[0].latitude,
            lng: markers[0].longitude,
            bg:bg,
            check:check,
            foot:foot,
            join:join,
            all:all,
            attend:attend,
            index:index,
            teamid:this.data.runner[index].id,
            distance:(parseFloat(this.data.runner[index].distance)).toFixed(2),
            start_time:this.data.runner[index].start_time,
            polyline:polyline,
            markers:markers
        })
    },
    join: function(){
        var that=this
        var openid=wx.getStorageSync("openid")
        var uid=wx.getStorageSync("uid")
        if(!that.data.hasUserInfo){
            wx.getUserProfile({
                desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (ee) => {
                    console.log(ee)
                    var res=ee.userInfo
                    wx.request({
                        url: 'https://xcx.meetu.xin/index.php/Mobile/Index/user',
                        method: 'get',
                        data: {
                            // user:JSON.parse(res.userInfo),
                            avatarUrl:res.avatarUrl,
                            openid:openid,
                            city:res.city,
                            country:res.country,
                            gender:res.gender,
                            language:res.language,
                            nickName:res.nickName,
                            province:res.province
                        },
                        dataType: 'json',
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success: function (e) {
                            var res=e.data
                            console.log(res)
                            wx.showModal({
                                title: '参与跑步',
                                content: '跑步时间9月20日19:30，\r\n距离5km，起点图书馆，终点体育馆。\r\n平均配速10min/km',
                                showCancel: true,
                                confirmText: '确定',
                                confirmColor: 'red',
                                success: function(res) {
                                    if(res.confirm){
                                        var join=[]
                                        var all=that.data.all
                                        var attend=parseInt(that.data.attend)+1
                                        var index=that.data.index
                                        var runner=that.data.runner
                                        runner[index].attend=attend
                        
                                        console.log(all,attend)
                                        for(var i=0;i<all;i++){
                                            if(i<attend){
                                                join[i]=1
                                            }else{
                                                join[i]=0
                                            }
                                        }
                        
                                        that.setData({
                                            join:join,
                                            runner:runner
                                        })
                                        
                                        wx.request({
                                            url: 'https://xcx.meetu.xin/index.php/Mobile/Index/addActivity',
                                            method: 'get',
                                            data: {
                                                teamid:that.data.teamid,
                                                uid:uid
                                            },
                                            dataType: 'json',
                                            header: {
                                                'content-type': 'application/json' // 默认值
                                            },
                                            success: function (e) {
                                                var status=e.data
                                                if(!status){
                                                    wx.showToast({
                                                      title: '您已添加过',
                                                    })
                                                }
                                            }
                                        })
                                    }
                
                                },
                            })
                        }
                    })
                    // that.globalData.userInfo=ee.userInfo
                    app.globalData.userInfo=ee.userInfo
                    console.log(app.globalData.userInfo)
                    this.setData({
                        userInfo: ee.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }else{
            wx.showModal({
                title: '参与跑步',
                content: '跑步时间9月20日19:30，\r\n距离5km，起点图书馆，终点体育馆。\r\n平均配速10min/km',
                showCancel: true,
                confirmText: '确定',
                confirmColor: 'red',
                success: function(res) {
                    if(res.confirm){
                        var join=[]
                        var all=that.data.all
                        var attend=parseInt(that.data.attend)+1
                        var index=that.data.index
                        var runner=that.data.runner
                        runner[index].attend=attend
        
                        console.log(all,attend)
                        for(var i=0;i<all;i++){
                            if(i<attend){
                                join[i]=1
                            }else{
                                join[i]=0
                            }
                        }
        
                        that.setData({
                            join:join,
                            runner:runner
                        })
                        
                        wx.request({
                            url: 'https://xcx.meetu.xin/index.php/Mobile/Index/addActivity',
                            method: 'get',
                            data: {
                                teamid:that.data.teamid,
                                uid:uid
                            },
                            dataType: 'json',
                            header: {
                                'content-type': 'application/json' // 默认值
                            },
                            success: function (e) {
                                var status=e.data
                                if(!status){
                                    wx.showToast({
                                      title: '您已添加过',
                                    })
                                }else{
                                    wx.showToast({
                                        title: '添加成功',
                                    })
                                }
                            }
                        })
                    }

                },
            })

        }

    },
    fav: function(t){
        var that=this
        var teamid=that.data.teamid
        var seek=that.data.seek
        var seeked=seek[teamid]
        if(seeked){
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
    getUserProfile(e) {
        // 推荐使用 wx.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log(res)
                this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
                })
            }
        })
    },
})