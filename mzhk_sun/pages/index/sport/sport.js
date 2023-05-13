

var app = getApp();

Page({
    data: {
        banner: [],
        url: [],
        navTile: "夜跑进行时",
        curIndex: 0,
        nav: [ "组队中", "已组队" ],
        curList: [],
        oldList: [],
        page: 1,
        oldpage: 1,
        group:[1,2,4,2,5],
        usrgroup:[1,2,3]
    },
    onLoad: function(t) {
        var a = this;
        wx.setNavigationBarTitle({
            title: a.data.navTile
        });
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#000000',
            animation: {
                duration: 0,
                timingFunc: "easeIn"
            }
        });
        return
        wx.request({
          url: 'https://wx.tzcs0576.com/index.php/Ccb/Rpc/rlist',
          success:function(e){
            a.setData({
              groupf:e.data[1],
              group:e.data[0]
            })
          }
        })
        var e = app.getSiteUrl();
        e ? a.setData({
            url: e
        }) : app.util.request({
            url: "entry/wxapp/Url",
            cachetime: "30",
            success: function(t) {
                wx.setStorageSync("url", t.data), e = t.data, a.setData({
                    url: e
                });
            }
        }), wx.setNavigationBarColor({
            frontColor: wx.getStorageSync("System").fontcolor,
            backgroundColor: wx.getStorageSync("System").color,
            animation: {
                duration: 0,
                timingFunc: "easeIn"
            }
        }), app.util.request({
            url: "entry/wxapp/ACbanner",
            cachetime: "30",
            success: function(t) {
                a.setData({
                    banner: t.data.lb_imgs3 ? t.data.lb_imgs3 : "",
                    navTile: t.data.bname3 ? t.data.bname3 : ""
                });
            }
        }), a.getptactive(), a.getptclose();
    },
    toIndex: function(t) {
        wx.reLaunch({
            url: "/mzhk_sun/pages/index/index"
        });
    },
    onReady: function() {},
    onShow: function() {},
    getUrl: function() {
        var a = this, e = app.getSiteUrl();
        e ? a.setData({
            url: e
        }) : app.util.request({
            url: "entry/wxapp/Url",
            cachetime: "30",
            success: function(t) {
                wx.setStorageSync("url", t.data), e = t.data, a.setData({
                    url: e
                });
            }
        });
    },
    getptactive: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/PTactive",
            cachetime: "30",
            success: function(t) {
                console.log("拼团数据"), console.log(t.data), 2 == t.data ? a.setData({
                    curList: []
                }) : a.setData({
                    curList: t.data
                });
            }
        });
    },
    getptclose: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/PTClose",
            cachetime: "30",
            success: function(t) {
                2 == t.data ? a.setData({
                    oldList: []
                }) : a.setData({
                    oldList: t.data
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    //滚动到底部
    onReachBottom: function() {
        var e = this;
        if (1 == e.data.curIndex) {
            var n = e.data.oldpage, o = e.data.oldList;
            app.util.request({
                url: "entry/wxapp/PTClose",
                cachetime: "30",
                data: {
                    page: n
                },
                success: function(t) {
                    if (console.log("往期数据"), console.log(t.data), 2 == t.data) wx.showToast({
                        title: "已经没有内容了哦！！！",
                        icon: "none"
                    }); else {
                        var a = t.data;
                        o = o.concat(a), e.setData({
                            oldList: o,
                            oldpage: n + 1
                        });
                    }
                }
            });
        } else {
            var s = e.data.page, c = e.data.curList;
            app.util.request({
                url: "entry/wxapp/PTactive",
                cachetime: "30",
                data: {
                    page: s
                },
                success: function(t) {
                    if (console.log("活动数据"), console.log(t.data), 2 == t.data) wx.showToast({
                        title: "已经没有内容了哦！！！",
                        icon: "none"
                    }); else {
                        var a = t.data;
                        c = c.concat(a), e.setData({
                            curList: c,
                            page: s + 1
                        });
                    }
                }
            });
        }
    },
    onShareAppMessage: function() {},
    navTap: function(t) {
        var a = parseInt(t.currentTarget.dataset.index);
        this.setData({
            curIndex: a
        });
    },
    toGroup: function(t) {
        var a = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../groupdet/groupdet?id=" + a
        });
    },
    showjoin:function(){
        var that=this
        wx.showModal({
          title: '参与活动',
          content: '本活动由蝎子大王发起，起点体育场路，终点学院路，参与活动请遵守活动规则，若有违反规定的行为，我们有权请您退出队伍。',
          showCancel: true,
          confirmText: '同意',
          confirmColor: '',
          cancelText: '拒绝',
          cancelColor: '',
          success: function(res) {
            that.toGroup()
          },
          fail: function(res) {},
          complete: function(res) {},
        })
    }
});