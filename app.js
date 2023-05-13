App({
    globalData: {
        userInfo: null,
        hasshowpopad: !1,
        checkLogin: false,
        uid:0
    },
    onLaunch: function () {
        var that = this
        var openid = wx.getStorageSync("openid")
        wx.login({
            success: function (res1) {
                console.log(res1)
                that.globalData.logincode = res1.code
                wx.request({
                    url: 'https://xcx.meetu.xin/index.php/Mobile/Index/getOpenid',
                    method: 'get',
                    data: {
                        code: res1.code
                    },
                    dataType: 'json',
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success: function (e) {
                        console.log(e.data)
                        var re = e.data
                        that.globalData.checkLogin = true;
                        that.globalData.uid = re.info.id
                        wx.setStorageSync('openid', re.openid)
                        wx.setStorageSync('uid', re.info.id)
                        if (that.checkLoginReadyCallback){
                            that.checkLoginReadyCallback(e);
                        }
                    }
                })
            }
        })
    },
    getUserInfo: function (cb) {
        var that = this
        var openid = wx.getStorageSync("openid")
        if (openid) {
            typeof cb == "function" && cb(this.globalData.userInfo)
            console.log('app.js1')
        } else {
            console.log('app.js2')
            wx.login({
                success: function (res1) {
                    that.globalData.logincode = res1.code
                    //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    console.log(res1)
                    // that.globalData.checkLogin = true;
                    // if (that.checkLoginReadyCallback){
                    //     that.checkLoginReadyCallback(1);
                    // }

                    wx.request({
                        url: 'https://xcx.meetu.xin/index.php/Mobile/Index/getOpenid',
                        method: 'get',
                        data: {
                            code: res1.code
                        },
                        dataType: 'json',
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success: function (e) {
                            console.log(e.data)
                            var re = e.data
                            wx.setStorageSync('openid', re.openid)
                            wx.setStorageSync('uid', re.info.id)
                        }
                    })
                }
            })
        }
    },
    coco: function () {
        console.log('coco')
    },
    creatPoster: function (e, t, l, a, c) {
        console.log('createpostbegin')
        console.log(e, t, l, a, c)
        console.log('createpostend')
        var r = this,
            o = getCurrentPages(),
            g = o[o.length - 1],
            s = (g.__route__, this.siteInfo.siteroot.split("/app/")[0] + "/attachment/"),
            n = "";
        wx.showLoading({
            title: "获取图片中..."
        }), wx.request({
            url: this.siteInfo.siteroot + "?i=" + this.siteInfo.uniacid + "&t=undefined&v=1.0.0&from=wxapp&c=entry&a=wxapp&do=GetwxCode&m=mzhk_sun",
            header: {
                "content-type": "application/json"
            },
            data: {
                page: e,
                width: t
            },
            success: function (i) {
                console.log("获取小程序二维码"), console.log(i.data), n = i.data;
                var e = new Promise(function (t, e) {
                    wx.getImageInfo({
                        src: l.url + l.logo,
                        success: function (e) {
                            console.log("图片缓存1"), console.log(e), t(e.path);
                        },
                        fail: function (e) {
                            console.log("图片1保存失败"), t(l.url + l.logo), console.log(e);
                        }
                    });
                }),
                    t = new Promise(function (t, e) {
                        wx.getImageInfo({
                            src: s + n,
                            success: function (e) {
                                wx.request({
                                    url: r.siteInfo.siteroot + "?i=" + r.siteInfo.uniacid + "&from=wxapp&c=entry&a=wxapp&do=DelwxCode&m=mzhk_sun",
                                    data: {
                                        imgurl: n
                                    },
                                    success: function (e) {
                                        console.log(e.data);
                                    }
                                }), console.log("图片缓存2"), console.log(e), t(e.path);
                            },
                            fail: function (e) {
                                console.log("图片2保存失败"), t(s + n), console.log(e);
                            }
                        });
                    });
                Promise.all([e, t]).then(function (e) {
                    console.log(e), console.log("进入 promise"), console.log(i);
                    //输入canvas名字shareimg
                    var t = wx.createCanvasContext(c),
                        o = l.bname,
                        s = e[0],
                        n = e[1];
                    //商家品牌名 l.bname 赋值到o变量
                    //根据小程序路径和宽度，生成临时图片
                    //进行绘图
                    t.rect(0, 0, 545, 771), t.setFillStyle("#fff"), t.fill(), 5 == a || 7 == a ? (t.drawImage(s, 0, 0, 600, 336),
                        t.setFillStyle("#fff7e0"), t.fillRect(50, 280, 450, 160), t.setFillStyle("#000"),
                        t.setFontSize(34), r.drawText(o, 70, 290, 400, t), t.setFontSize(22)) : (t.drawImage(s, 0, 0, 600, 418),
                            t.setFillStyle("#000"), t.setFontSize(34), r.drawText(o, 20, 414, 500, t)), 1 == a ? (t.setFillStyle("#666"),
                                t.setFontSize(26), t.fillText("营业时间:", 30, 500), t.setFillStyle("#ef8200"), t.setFontSize(26),
                                t.fillText(l.starttime + "-" + l.endtime, 150, 500)) : 2 == a ? (t.setFillStyle("#666"),
                                    t.setFontSize(26), t.fillText("拼团价:", 30, 500), t.setFillStyle("#ef8200"), t.setFontSize(30),
                                    t.fillText(l.ptprice, 120, 500), t.setFillStyle("#666"), t.setFontSize(26), t.fillText("原价:", 240, 500),
                                    t.fillText(l.shopprice, 300, 500)) : 3 == a ? (t.setFillStyle("#666"), t.setFontSize(26),
                                        t.fillText("砍价:", 30, 500), t.setFillStyle("#ef8200"), t.setFontSize(30), t.fillText(l.kjprice, 120, 500),
                                        t.setFillStyle("#666"), t.setFontSize(26), t.fillText("原价:", 240, 500), t.fillText(l.shopprice, 300, 500)) : 4 == a ? (t.setFillStyle("#666"),
                                            t.setFontSize(26), t.fillText("抢购价:", 20, 500), t.setFillStyle("#ef8200"), t.setFontSize(30),
                                            t.fillText(l.qgprice, 120, 500), t.setFillStyle("#666"), t.setFontSize(26), t.fillText("原价:", 235, 500),
                                            t.fillText(l.shopprice, 300, 500)) : 5 == a ? (t.setFontSize(22), t.setFillStyle("#666"),
                                                t.fillText("活动时间：", 70, 400), t.fillText(l.astime + "至" + l.antime, 180, 400), t.setFontSize(44),
                                                t.setFillStyle("#f33030"), t.fillText("集卡赢大奖", 164, 500)) : 6 == a ? (t.setFillStyle("#666"),
                                                    t.setFontSize(26), r.drawText(l.sharetitle, 20, 480, 400, t)) : 7 == a && (t.setFontSize(22),
                                                        t.setFillStyle("#666"), t.fillText("活动时间：", 70, 400), t.fillText(l.astime + "至" + l.antime, 180, 400),
                                                        t.setFontSize(44), t.setFillStyle("#f33030"), t.fillText("免单等你拿", 164, 500)), t.drawImage(n, 40, 550, 180, 180),
                        t.drawImage("../../../../style/images/zhiwen.png", 340, 550, 130, 130), t.setFontSize(22),
                        t.setFillStyle("#999"), t.fillText("长按识别二维码进入", 310, 710), t.stroke(), t.draw(),
                        console.log("结束 promise"), wx.hideLoading(), wx.showLoading({
                            title: "开始生成海报..."
                        }), new Promise(function (e, t) {
                            setTimeout(function () {
                                e("second ok");
                            }, 500);
                        }).then(function (e) {
                            console.log(e), wx.canvasToTempFilePath({
                                x: 0,
                                y: 0,
                                width: 545,
                                height: 771,
                                destWidth: 545,
                                destHeight: 771,
                                canvasId: c,
                                success: function (e) {
                                    console.log("进入 canvasToTempFilePath"), g.setData({
                                        prurl: e.tempFilePath,
                                        hidden: !1
                                    }), wx.hideLoading();
                                },
                                fail: function (e) {
                                    console.log(e);
                                }
                            });
                        });
                });
            }
        });
    },
    drawText: function (e, t, o, s, n) {
        var i = e.split(""),
            l = "",
            a = [];
        n.font = "30rpx Arial", n.fillStyle = "#222222", n.textBaseline = "middle";
        for (var c = 0; c < i.length; c++) n.measureText(l).width < s || (a.push(l), l = ""),
            l += i[c];
        a.push(l);
        for (var r = 0; r < a.length; r++) n.fillText(a[r], t, o + 30 * (r + 1));
    },
    siteInfo: require("siteinfo.js"),
    util: require("/we7/js/util.js"),
    getSiteUrl: function () {
        var t = wx.getStorageSync("url");
        if (t) return console.log("图片路径缓存"), console.log(t), t;
        wx.request({
            url: this.siteInfo.siteroot + "?i=" + this.siteInfo.uniacid + "&t=undefined&v=1.0.0&from=wxapp&c=entry&a=wxapp&do=Url&m=mzhk_sun",
            header: {
                "content-type": "application/json"
            },
            success: function (e) {
                return console.log("服务器路径"), console.log(e.data), t = e.data, wx.setStorageSync("url", t),
                    t;
            }
        });
    },
    getOpenid: function (e) {
        var o = this,
            t = wx.getStorageSync("openid");
        if (t) return t;
        wx.login({
            success: function (e) {
                console.log("进入wx-login");
                var t = e.code;
                o.util.request({
                    url: "entry/wxapp/openid",
                    data: {
                        code: t
                    },
                    success: function (e) {
                        return console.log("进入获取openid"), console.log(e.data), wx.setStorageSync("openid", e.data.openid),
                            e.data.openid;
                    }
                });
            }
        });
    },
    wxauthSetting: function (e) {
        var i = this,
            t = getCurrentPages(),//获取当前页面的地址
            l = t[t.length - 1];
        wx.getStorageSync("openid") ? wx.getSetting({
            success: function (e) {
                console.log("进入wx.getSetting 1"), console.log(e), e.authSetting["scope.userInfo"] ? (console.log("scope.userInfo已授权 1"),
                    wx.getUserInfo({
                        success: function (e) {
                            l.setData({
                                is_modal_Hidden: !0,
                                thumb: e.userInfo.avatarUrl,
                                nickname: e.userInfo.nickName
                            });
                        }
                    })) : l.setData({
                        is_modal_Hidden: !1
                    });
            },
            fail: function (e) {
                l.setData({
                    is_modal_Hidden: !1
                });
            }
        }) : wx.login({
            success: function (e) {
                console.log("进入wx-login");
                var t = e.code;
                wx.setStorageSync("code", t), wx.getSetting({
                    success: function (e) {
                        console.log("进入wx.getSetting"), console.log(e), e.authSetting["scope.userInfo"] ? (console.log("scope.userInfo已授权"),
                            wx.getUserInfo({
                                success: function (e) {
                                    l.setData({
                                        is_modal_Hidden: !0,
                                        thumb: e.userInfo.avatarUrl,
                                        nickname: e.userInfo.nickName
                                    }), console.log("进入wx-getUserInfo"), console.log(e.userInfo), wx.setStorageSync("user_info", e.userInfo);
                                    var o = e.userInfo.nickName,
                                        s = e.userInfo.avatarUrl,
                                        n = e.userInfo.gender;
                                    i.util.request({
                                        url: "entry/wxapp/openid",
                                        data: {
                                            code: t
                                        },
                                        success: function (e) {
                                            console.log("进入获取openid"), console.log(e.data), wx.setStorageSync("key", e.data.session_key),
                                                wx.setStorageSync("openid", e.data.openid), l.onShow();
                                            var t = e.data.openid;
                                            i.util.request({
                                                url: "entry/wxapp/Login",
                                                cachetime: "0",
                                                data: {
                                                    openid: t,
                                                    img: s,
                                                    name: o,
                                                    gender: n
                                                },
                                                success: function (e) {
                                                    console.log("进入地址login"), console.log(e.data), wx.setStorageSync("users", e.data),
                                                        wx.setStorageSync("uniacid", e.data.uniacid), l.setData({
                                                            usersinfo: e.data
                                                        });

                                                }
                                            });
                                        }
                                    });
                                },
                                fail: function (e) {
                                    console.log("进入 wx-getUserInfo 失败"), wx.showModal({
                                        title: "获取信息失败",
                                        content: "请允许授权以便为您提供给服务!",
                                        success: function (e) {
                                            l.setData({
                                                is_modal_Hidden: !1
                                            });
                                        }
                                    });
                                }
                            })) : (console.log("scope.userInfo没有授权"), l.setData({
                                is_modal_Hidden: !1
                            }));
                    }
                });
            },
            fail: function () {
                wx.showModal({
                    title: "获取信息失败",
                    content: "请允许授权以便为您提供给服务!!!",
                    success: function (e) {
                        l.setData({
                            is_modal_Hidden: !1
                        });
                    }
                });
            }
        });
    },
});