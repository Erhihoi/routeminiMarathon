var app = getApp();
const QQMapWX = require('../../../../we7/js/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    banner: [],
    url: [],
    navTile: "创建线路",
    curIndex: 0,
    nav: ["组队中", "已组队"],
    curList: [],
    oldList: [],
    page: 1,
    oldpage: 1,
    group: [1],
    usrgroup: [1, 2, 3],
    lat: 28.65857270312306,
    lng: 121.41610499450682,
    markers: [],
    teamnum:[3,4,5,6,7,8,9,10],
    objectteamnum: [
      {
        id: 3,
        name: '3人'
      },
      {
        id: 4,
        name: '4人'
      },
      {
        id: 5,
        name: '5人'
      },
      {
        id: 6,
        name: '6人'
      },
      {
        id: 7,
        name: '7人'
      },
      {
        id: 8,
        name: '8人'
      },
      {
        id: 9,
        name: '9人'
      },
      {
        id: 10,
        name: '10人'
      },
    ],
    index: 0,
    time: '18:00',
    longitude:0,
    latitude:0,
    multiIndex: [0, 0, 0],
    // polyline: [{
    //   points: [{
    //     longitude: 113.3245211,
    //     latitude: 23.10229
    //   }, {
    //     longitude: 113.324520,
    //     latitude: 23.21229
    //   }],
    //   color: "#FF0000DD",
    //   width: 2,
    //   dottedLine: true
    // }],
    polyline:[],
    pointer: [{
      num: 0,
      key: 0,
      color: 'none'
    }],
    node:[],
    beforenode:0,
    pl:[],
    distance:[],
    address:'',
    finish_line:''
  },
  onLoad: function(t) {
    var a = this;

    /*wx.chooseAddress({
      success(res){
        console.log(res)
      }
    })*/
    wx.setNavigationBarTitle({
      title: a.data.navTile
    });

  },
  toIndex: function(t) {
    wx.reLaunch({
      url: "/mzhk_sun/pages/index/index"
    });
  },
  onReady: function() {},
  onShow: function() {},
  //选择器
  bindPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },  
  bindTimeChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },  

  //发起组队提交表单
  fagp(e){
    var that=this
    var point = that.data.markers
    var name=e.detail.value.name
    var start_line=e.detail.value.beg
    var finish_line=e.detail.value.end
    var team = e.detail.value.team
    var formid=e.detail.formId
    // 人才改这改那
    var userid = wx.getStorageSync("users").id
    var polyline=that.data.polyline
    var distance=0
    var teamnum=that.data.teamnum[that.data.index]
    // console.log(formid)
    if(!start_line){
      wx.showModal({
        title: '提示',
        content: '请填写跑步起点',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '',
        success: function (res) { 
          return
        },
      })
    }else if(!finish_line){
      wx.showModal({
        title: '提示',
        content: '请填写跑步终点',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '',
        success: function (res) {
          return
         },
      })
    }else if(!point[1]){
      wx.showModal({
        title: '提示',
        content: '请创建跑步线路',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '',
        success: function (res) {
          return
         },
      })
    }
    wx.request({
      url: 'https://xcx.meetu.xin/index.php/Mobile/Index/groupSave',
      method:'get',
      data:{
        'name':name,
        'start_line':start_line,
        'finish_line':finish_line,
        'point':point,
        'time':that.data.time,
        'team':team,
        'formid':formid,
        'userid':userid,
        'polyline':polyline,
        'distance':that.data.distancesum,
        'start_time':that.data.time,
        'teamnum':teamnum
      },
      dataType:'json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(e){
        console.log(e.data)
        wx.showToast({
          title: '添加成功',
        })
      }
    })
  },

  showjoin: function() {
    var that = this
    wx.showModal({
      title: '参与活动',
      content: '本活动由蝎子大王发起，起点体育场路，终点学院路，参与活动请遵守活动规则，若有违反规定的行为，我们有权请您退出队伍。',
      showCancel: true,
      cancelText: '拒绝',
      cancelColor: '',
      confirmText: '同意',
      confirmColor: '',
      success: function(res) {
        that.toGroup()
      },
    })
  },
  toGroup: function(t) {
    var a = t.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../groupdet/groupdet?id=" + a
    });
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  //画图，定位
  pointer(e) {
    var that = this
    console.log(e)
    // 地图选择
    /*wx.chooseLocation({
      success: function (res) {
        // success
        console.log(res, "location")
        console.log(res.name)
        console.log(res.latitude)
        console.log(res.longitude)
        that.setData({
          roomname: res.name
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })*/
  },
//  qqmap api 加入坐标
putdot(e) {
    var that = this
    that.mapCtx = wx.createMapContext("map4select");
    that.mapCtx.getCenterLocation({
      type: 'gcj02',
      success: function(e) {
        //放入坐标点位
        var markers = {
          iconPath: "/style/images/mapine.png",
          id: that.data.markers.length,
          latitude: e.latitude,
          longitude: e.longitude,
          width: 35,
          height: 35
        }
        //创建路径
        qqmapsdk = new QQMapWX({
          key: 'WKVBZ-L7QR3-3KR33-3TLBF-VSBJF-E2B4X'
        });
        // 只能在市民广场范围内5公里的跑步
        qqmapsdk.calculateDistance({
            from: '28.65857270312306,121.41610499450682' || '',
            to: e.latitude + ',' + e.longitude, //终点坐标
            success: function (res) {//成功后的回调
                var res = res.result;
                var dis = [];
                for (var i = 0; i < res.elements.length; i++) {
                dis.push(res.elements[i].distance); //将返回数据存入dis数组，
                }
                var long = that.formatDistance2(dis[0])
                console.log(long)
                if(long>3){
                    wx.showToast({
                        title: '圆圈内选择线路',
                        icon: '',
                        image: '',
                        duration: 1000,
                        mask: true,
                        success: function(res) {
                        that.setData({
                            circles: [{
                            latitude: 28.65857270312306,
                            longitude: 121.41610499450682,
                            color: '#78daf5',
                            fillColor: '#ffffff00',
                            radius: 2600, //定位点半径
                            strokeWidth: 1
                            }],
                        })
                        },
                        fail: function(res) {},
                        complete: function(res) {},
                    })
                    return
                    
                }else{
                    
                }
                var pl = that.data.pl
                var latitude=that.data.latitude
                var longitude=that.data.longitude
                
                if(latitude){
                    console.log('fffffff')
                    that.aquadrs2(e)
                    qqmapsdk.direction({
                        mode: 'walking',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
                        //from参数不填默认当前地址
                        from: latitude+','+longitude,
                        to: e.latitude + ',' + e.longitude, //终点坐标
                        success: function (fe) {
                          console.log(12345)
                          console.log(fe);
                          var distance=that.data.distance
                          distance.push(fe.result.routes[0].distance)
                        //   合计距离
                          var distancesum=that.sum(distance)/1000
                          var ret = fe;
                          var coors = ret.result.routes[0].polyline, pl = that.data.pl,node=that.data.node;
                          //坐标解压（返回的点串坐标，通过前向差分进行压缩）
                          var kr = 1000000;
                          for (var i = 2; i < coors.length; i++) {
                            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
                          }
                          //将解压后的坐标放入点串数组pl中
                          for (var i = 0; i < coors.length; i += 2) {
                            pl.push({ latitude: coors[i], longitude: coors[i + 1] })
                          }
                          var beforenode=that.data.beforenode
                          var afternode
                          if(beforenode&&node!=''){
                            afternode=pl.length
                            node.push(pl.length-beforenode)
                          }else{
                            afternode=pl.length
                            node.push(pl.length)
                          }
                          console.log(pl)
                          //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
                          that.setData({
                            latitude:pl[pl.length-1].latitude,
                            longitude:pl[pl.length-1].longitude,
                            polyline: [{
                              points: pl,
                              color: '#FF0000DD',
                              arrowLine:true,
                              width: 5
                            }],
                            node:node,
                            pl:pl,
                            beforenode:afternode,
                            distance:distance,
                            distancesum:distancesum
                          })
                        },
                        fail: function (error) {
                          console.error(error);
                        },
                    });
                }else{
                    that.aquadrs(e)
                    that.setData({
                        latitude:e.latitude,
                        longitude:e.longitude
                    })
                }
                console.log(that.data.markers)
                that.data.markers.push(markers)
                that.setData({
                    markers: that.data.markers,
                })
            },
        });


      }
    })
    //console.log(that.data.pointer)
  },
  sum(arr){
    var a=0
    for(var s in arr){
        a+=arr[s]
    }
    console.log(a)
    return a
  },
//   获取起点地址
  aquadrs(e) {
    var _this = this;
    qqmapsdk.reverseGeocoder({
      location: e.latitude + ',' + e.longitude || '', //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
      //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
      success: function(res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var mks = [];
        mks.push({ // 获取返回结果，放到mks数组中
          title: res.address,
          id: 0,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: '/style/images/5.png',//图标路径
          width: 20,
          height: 20,
        //   callout: {
        //     content: res.address,
        //     color: '#000',
        //     display: 'ALWAYS'
        //   }
        });
        _this.setData({ //设置markers属性和地图位置poi，将结果在地图展示
          markers: mks,
          address:res.address,
          poi: {
            latitude: res.location.lat,
            longitude: res.location.lng
          }
        });
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    })
  },
  //   获取地址
  aquadrs2(e) {
    var _this = this;
    qqmapsdk.reverseGeocoder({
      location: e.latitude + ',' + e.longitude || '', //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
      //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
      success: function(res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var mks = [];
        mks.push({
          title: res.address,
          id: 0,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: '/style/images/hklogo.png',
          width: 20,
          height: 20,
        });
        _this.setData({ //设置markers属性和地图位置poi，将结果在地图展示
        //   markers: mks,
          finish_line:res.address,
          poi: {
            latitude: res.location.lat,
            longitude: res.location.lng
          }
        });
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    })
  },
  //连线
  mline() {
    var that = this
    var markers = that.data.markers
    var polyline = []
    for (var i = 0; i < markers.length - 1; i++) {
      var mk = markers[i]
      var mk2 = markers[i + 1]
      var tempmk = {
        points: [{
          longitude: mk.longitude,
          latitude: mk.latitude
        }, {
          longitude: mk2.longitude,
          latitude: mk2.latitude
        }],
        color: "#FF0000DD",
        dottedLine: true,
        arrowLine: true,
        width: 5
      }
      polyline.push(tempmk)
    }
    console.log(polyline)
    that.setData({
      polyline: polyline
    })
  },
  undo(){
    var that=this
    that.data.markers.splice(-1)
    that.setData({
      markers: that.data.markers
    })
    if (that.data.polyline.length){
      that.mline()
    }
    console.log(that.data.markers)
  },
  undo2(){
    var that=this
    //start deletenumber splice
    //start end slice
    var node = that.data.node
    that.data.markers.splice(-1)
    that.data.pl.splice(-node[node.length-1])
    that.data.node.splice(-1)
    that.data.distance.splice(-1)

    //node和pl同时清空,marker点比他们多一个，所以最后起始点应该再撤销一次
    
    console.log('undo '+node[node.length-1])
    that.setData({
        node: that.data.node,
        polyline: [{
            points: that.data.pl,
            color: '#FF0000DD',
            arrowLine:true,
            width: 5
        }],
        markers: that.data.markers,
        distance:that.data.distance
    })
    console.log(that.data.markers.length-1)
    //marker点比路径数组多一个值
    if(that.data.markers.length>0){
        that.setData({
            latitude:that.data.markers[that.data.markers.length-1]['latitude'],
            longitude:that.data.markers[that.data.markers.length-1]['longitude']    
        })
    }else{
        that.setData({
            latitude:0,
            longitude:0
        })
    }

  },
  formatDistance(num) {
    　if (num < 1000) {
      　　return num.toFixed(0) + 'm';
    　} else if (num > 1000) {
      　　return (num / 1000).toFixed(1) + 'km';
    　}
  },
  formatDistance2(num) {
      return (num / 1000).toFixed(1)
  }
});