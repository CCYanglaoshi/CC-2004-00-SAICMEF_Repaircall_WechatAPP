// pages/RepairCall/RepairCall.js
var util = require('../../utils/util.js');


//获取录音管理器对象
const recorderManager = wx.getRecorderManager();
const app = getApp();

//结束录音触发
recorderManager.onStop((res) =>{
  const that = this
  console.log('recoder stop', res)
  
  //获取到录音文件路径

    
  //生成guid
  const { tempFilePath} =res;
  var theuuid  = util.uuid();
  console.log("theuuid: " + theuuid);
  wx.cloud.uploadFile({
    // 指定上传到的云路径
    cloudPath: 'AudioRecorder/' + theuuid + '.mp3',
    // 指定要上传的文件的小程序临时文件路径
    filePath: tempFilePath,
    // 成功回调
    success: res => {
      that.setData({
        soundUrl: res.fileID
      }),
      console.log("soundUrl"+ this.data.soundUrl),
      console.log('上传成功', res)
    },
  })
})


Page({
  /**
   * 页面的初始数据
   */
  data: {
    facility: null,
    fName: "fName",
    fId: "fId",
    fContact: NaN,
    repairCallStatuses: [],
    repairStatus: "",
    image: "",
    openid:"",
    // need clear after submit
    description: "",
    repairItems: [],
    files: [],
    images: ["", "", ""],
  },

  //照片选择和预览
  chooseImage: function (e) {
    var that = this;
    var maxCount = 3 - this.data.files.length;
    //console.log(maxCount);
    if (maxCount > 0) {
      wx.chooseImage({
        count: maxCount,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        
        success(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          //console.log(res);
          var i = that.data.files.length;
          that.setData({files: that.data.files.concat(res.tempFilePaths)});
          //console.log(that.data.files);
          for (; i < that.data.files.length; i++) {
            //console.log(i + "---" + that.data.files[i]);
            var index = i;
            wx.getFileSystemManager().readFile({
              filePath: that.data.files[index], //选择图片返回的相对路径
              encoding: 'base64', //编码格式
              success: res => { //成功的回调
                //console.log(res.data);
                var image = "images[" + index + "]";
                that.setData({[image]: res.data});
                console.log(that.data.images);  
              }
            })
          }      
        }
      })
    }
  },

  previewImage: function(e){
      wx.previewImage({
          current: e.currentTarget.id, // 当前显示图片的http链接
          urls: this.data.files // 需要预览的图片http链接列表
      })
  },

  //fucntion: 按下录音
  start_say(){
    recorderManager.start(
      {duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50});
  },

  //fucntion: 结束录音
  end_say(){
    recorderManager.stop();
  },

  //function: 录音播放
  recordingAndPlaying: function(eve) {
    var tempsound = eve.currentTarget.dataset.soundid
    console.log(this.data.soundUrl)
    tempsound = this.data.soundUrl
    console.log(tempsound)
    wx.playBackgroundAudio({
      dataUrl: tempsound
    })
  },

  afterSubmit() {
    console.log("afterSubmit");
    //reset checkbox
    for (var i = 0; i < this.data.repairItems.length; i++) {
      var checked = "repairItems[" + i + "].checked";
      this.setData({[checked]: false});
    }

    this.setData({description: ""});
    this.setData({files: []});
    this.setData({fName: ""});
    this.setData({fId: ""});

    for (var i = 0; i < this.data.images.length; i++) {
      var image = "images[" + i + "]";
      this.setData({[image]: ""});
    }
  },

  //fucntion: 按钮提交
  //按键提交
  handleSubmit(e){
    wx.showToast({  
      title: '正在上传...',  
      icon: 'loading',  
      mask: true,  
      duration: 10000  
    });
    //console.log(e);
    console.log(e.detail.value);
    var page = this;
    var repairDescription = e.detail.value.repairDescription;
    var facilityRepairItems = e.detail.value.facilityRepairItems;
    console.log("facilityRepairItems:");
    console.log(facilityRepairItems);
    console.log("OpenIDOpenIDOpenIDOpenIDOpenIDOpenIDOpenID:" + this.data.openid);

    //检验报修电话不能为空
    if(e.detail.value.contactNumber==''){
      wx.showToast({
             title:'请输入联系电话',
             icon:"none"
          })
          return;
    }

  
    //检验选则其他时，内容描述不能为空
    if(facilityRepairItems.includes("91871dc2-1e6f-4e28-9452-fb0f88f8f35a") && repairDescription==''){
      console.log("选择了其他且描述为空")
      wx.showToast({
             title:'请填写描述其他设施故障的内容',
             icon:"none"
          })
          return;
    }

    var repairItems = "";
    for (var i = 0; i < facilityRepairItems.length; i++) {
      if (i == 0) {
        console.log("here start add sting");
        console.log(facilityRepairItems[i]);
        console.log(app.globalData.repairItems);
        //通过Oid找到对象；
        var repairitemtitle = app.globalData.repairItems.find( n => n.oid == facilityRepairItems[i]);
        console.log(repairitemtitle);
        console.log(repairitemtitle.title);
        repairItems += repairitemtitle.title;

      }
      else {
        console.log("here start add sting222")
        console.log(facilityRepairItems[i])
        var repairitemtitle = app.globalData.repairItems.find( n => n.oid == facilityRepairItems[i]);
        repairItems += "," +repairitemtitle.title;
      }
    }
    console.log(repairItems);

    var oid = util.uuid();
    var api = "8168/saic/api/RepairCallItems";
    var url = util.getUrl(api);

    var that = this;
    wx.request({
      url: url,
      method: "POST",
      header: {
        "content-type": "application/json"//"x-www-form-urlencoded"//
      },
      data: {
        "oid": oid,
        "title": "string",
        //"repairItem": repairItem,
        "description": e.detail.value.repairDescription,
        "reportTime": util.formatTime(new Date()),
        "reportPerson": "abc",
        "contact": e.detail.value.contactNumber,
        "repairCallStatus": page.data.repairStatus,
        "imageProperty": page.data.images[0],
        "imageProperty2": page.data.images[1],
        "imageProperty3": page.data.images[2],
        "fName": e.detail.value.inputfName,
        "fId": e.detail.value.inputfId,
        "OpenID": this.data.openid,
        "repairItems": repairItems
      },

      success (res) {        
        console.log(res);
        if (res.errMsg == "request:ok")
        {
          console.log(res.data);
        }
        
        //检查该Openid是否已经保存在系统内，如没有则添加
        console.log("test here the openid");
        console.log(that.data.openid);
        console.log("test here the openid");
        var api = api = "/8168/saic/api/WechatUsers?openId=" + that.data.openid;
        var url = util.getUrl(api);
        wx.request({
          url: url,
          method: "GET",
          header: {
            "content-type": "application/json"
          },
          success(res){
            console.log(res);
            if (res.errMsg == "request:ok")
            {
              console.log("res.dathaahaahahahahahahaha");
              console.log(res.data);
              if(res.data.length !=0){
                console.log("res.dathaahaahahahahahahaha布控");
                console.log(res.data);
              }
              else{
                var api = "8168/saic/api/WechatUsers";
                var url = util.getUrl(api);
                wx.request({
                  url: url,
                  method: "POST",
                  header: {
                    "content-type": "application/json"
                  },
                  data: {
                    "oid": util.uuid(),
                    "openid": that.data.openid,
                    "lastTimePhoneNum": e.detail.value.contactNumber
                  },
            
                  success (res) {
                    
                    console.log(res);
                    if (res.errMsg == "request:ok")
                    {
                      console.log(res.data);
                    }
                    wx.showToast({
                      title: '操作成功！请联系管理员完成后台注册管理哈哈哈注册成功', // 标题
                      icon: 'success',  // 图标类型，默认success
                      duration: 2000  // 提示窗停留时间，默认1500ms
                    })
                  },
                })
              }
            }
          }
        })
        //清空数据表
        page.afterSubmit();
        
        wx.showToast({
          title: '操作成功！', // 标题
          icon: 'success',  // 图标类型，默认success
          duration: 2000  // 提示窗停留时间，默认1500ms
        })
        wx.switchTab({
          url: '/pages/index2/index2',
        })
      },
      fail (res) {

      },
    })

    this.updateLastTimePhoneNum();
  },

  uploadPhoto(e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log('本地图片的路径:', tempFilePaths )
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            console.log(res.data)
            that.setData({image: res.data});
            wx.previewImage({
              current: tempFilePaths[0],
              urls: tempFilePaths,
            })
          }
        })
        console.log(res)
      }
    })
  },

  repairItemChange(e) {
    console.log(e.detail.value);
    for (var i = 0; i < this.data.repairItems.length; i++) {
      var checked = "repairItems[" + i + "].checked";
      if (i != e.detail.value) {
        console.log(this.data.repairItems);
        console.log(checked);
        this.setData({[checked]: false});       
      }
      else {
        this.setData({[checked]: true});
      }
    }
  },

  repairItemCheckboxChange (e) {
    console.log(e.detail.value);
    
    for (var i = 0; i < this.data.repairItems.length; i++) {
      var oid = this.data.repairItems[i].oid;
      var checked = "repairItems[" + i + "].checked";
      if (e.detail.value.includes(oid)) {
        this.setData({[checked]: true});
      }
      else {
        this.setData({[checked]: false});
      }
    }
  
  },

  contactInput(e) {
    console.log(e.detail.value);
    var value = util.validateNumber(e.detail.value);
    this.setData({fContact: value});
  },  

  showLoading() {
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
  },

  hideLoading() {
    if (this.data.repairItems.length > 0
        && this.data.repairCallStatuses.length > 0) { 
        //&& this.data.facility != null) {
      wx.hideLoading({
        complete: (res) => {
        },
      })
    }
  },

  updateLastTimePhoneNum() {
    //console.log("updateLastTimePhoneNum");
    // update lastTimePhoneNum
    var api = "/8168/saic/api/WechatUsers/update?openId=" + this.data.openid;
    var url = util.getUrl(api);
    wx.request({
      url: url,
      method: "PUT",
      header: {
        "accept": "text/plain",
        "content-type": "application/json-patch+json"
      },
      data: [
        {
          "value": this.data.fContact,
          "operationType": 0,
          "path": "lastTimePhoneNum",
          "op": "replace",
          "from": "string"
        }
      ],
      success (res) {
        console.log(res);

      },
      fail (res) {

      },
    })
  },

  getLastTimePhoneNum() {
    //console.log("getLastTimePhoneNum");
    var page = this;
    if (this.data.openid == "" || this.data.openid == null) {
      console.log("no openid");
    }
    else {
      // get lastTimePhoneNum
      var api = "/8168/saic/api/WechatUsers?openId=" + this.data.openid;
      var url = util.getUrl(api);
      console.log(url);
      wx.request({
        url: url,
        method: "GET",
        //header: {
        //  "accept": "text/plain",
        // // "content-type": "application/json-patch+json"
        //},
        success (res) {
          console.log(res.data[0]);
          page.setData({fContact: res.data[0].lastTimePhoneNum});
        },
        fail (res) {

        },
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(util.formatTime(new Date()));
    console.log(this.data.images);
    //let that = this;
    if(!wx.cloud){
      console.error("请使用高版本")
    } else{
      wx.cloud.init({
        env: 'repaircall8168-kzizk',
        trace: true,
      })
    }
    wx.cloud.callFunction({
      name:'getOpenid',
      complete:res=>{
        console.log('openid--',res.result)
        var openid = res.result.openid
        this.setData({
          openid:openid
        })
        wx.setStorage({
          key: 'openid',
          data: openid
        })
        this.getLastTimePhoneNum();
      }
    })

    var page = this;
    var app = getApp();

    // getRepairItems
    var api = "/8168/saic/api/RepairItems";
    page.showLoading();
    wx.request({
      url: util.getUrl(api),
      method: "GET",

      success(res) {
        //console.log(res);
        app.globalData.repairItems = res.data;
        console.log(app.globalData.repairItems);
        page.setData({repairItems: res.data});
        page.hideLoading();
      }
    })

    //getRepairCallStatus
    api = "/8168/saic/api/RepairCallStatus";
    page.showLoading();
    wx.request({
      url: util.getUrl(api),
      method: "GET",

      success(res) {
        //console.log(res.data);
        page.setData({repairCallStatuses: res.data});
        page.hideLoading();
        for (var i = 0; i < res.data.length; i++) {
          var title = res.data[i].title;
          if (title == "未处理") {
            page.setData({repairStatus: res.data[i].oid});
          }
        }
      }
    })

    //console.log(options);
    //console.log(options.flsn);
    if (options.flsn != undefined) {
      //this.setData({fId: options.flsn});
      api = "/8168/saic/api/LocationItems";
      //console.log(app.globalData.locationSN);
      app.globalData.locationSN = options.flsn;
      page.showLoading();
      wx.request({
        url: util.getUrl(api),
        method: "GET",
        data: {
          sn: app.globalData.locationSN
        },
  
        success (res) {
          console.log(res.data[0]);
          //app.globalData.facility = res.data[0];
          //console.log(app.globalData.facility);
          page.data.facility = res.data[0];
          page.setData({fName: page.data.facility.title, fId:page.data.facility.sn});
          page.hideLoading();
        }
      }) 
    }
    else {
      console.log("kong");
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log("OnReady");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //console.log("OnShow");
    this.showLoading();
    this.hideLoading();
    console.log(app.globalData);
    this.getLastTimePhoneNum();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //console.log("OnHide");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //console.log("OnUnload");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})