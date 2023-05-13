var app=getApp()
Page({
    data: {
        user:[],
        menu:['收藏','留言']
    },
    onLoad(options) {
        var that=this
        that.userinfo()
    },
    userinfo:function (){
        var that=this
        var usr=app.globalData.userInfo
        if(usr){
            console.log('全局变量有用户信息')
            that.setData({
                username:usr.nickName,
                avatar:usr.avatarUrl
            })    
        }else{
            var openid=wx.getStorageSync('openid')
            wx.request({
                url: 'https://xcx.meetu.xin/index.php/Mobile/Index/getUser',
                method: 'get',
                data: {
                    openid:openid
                },
                dataType: 'json',
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (e) {
                    console.log(e.data)
                    var usr=e.data
                    that.setData({
                        username:usr.username,
                        avatar:usr.avatar
                    })
                }
            })
        }

    },
})