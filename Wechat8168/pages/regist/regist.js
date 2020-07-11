// pages/regist/regist.js

//获取应用实例
var app = getApp();

var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: wx.getStorageSync('openid'),
    username: "",
    RegistNumber: ""
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
    //console.log(e.detail.value);
    var page = this;
    var api = "8168/saic/api/WechatUsers";
    var url = util.getUrl(api);
    
    console.log("OpenIDOpenIDOpenIDOpenIDOpenIDOpenIDOpenID:" + this.data.openid);
    console.log("OpenIDOpenIDOpenIDOpenIDOpenIDOpenIDOpenID:" +  e.detail.value.username);
    console.log(e.detail);
    var theID = this.data.openid;


    wx.request({
      url: url,
      method: "POST",
      header: {
        "content-type": "application/json"//"x-www-form-urlencoded"//
      },
      data: {
        "oid": util.uuid(),
        "userphonenum": e.detail.value.RegistNumber,
        "userName": e.detail.value.username,
        "openid": theID
      },

      success (res) {
        
        console.log(res);
        if (res.errMsg == "request:ok")
        {
          console.log(res.data);
        }
        wx.showToast({
          title: '操作成功！请联系管理员完成后台注册管理', // 标题
          icon: 'success',  // 图标类型，默认success
          duration: 2000  // 提示窗停留时间，默认1500ms
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //异步方式获取openid
    var that = this;  
    app.getAuthKey().then(function (res) {
      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid')
        })
      } else {
        console.log("res.data"+ res.data);
      }
    });
    console.log(this.data.openid);

      //获取用户信息并赋值globedata.username registphone
     // 获取
     var api = "/8168/saic/api/WechatUsers";
     //page.showLoading();

     wx.request({
       url: util.getUrl(api),
       method: "GET",
       data: {
        openid: wx.getStorageSync('openid')
      },
       success(res) {
         console.log(res.data);
         if(res.data != ""){
          that.setData({
            username: res.data[0].userName,
            RegistNumber: res.data[0].userPhoneNum
          });
         }
         else{
          console.log("res.data is empty")
         }
         //console.log(res.data[0].userName);
         
        //console.log(that.data.username);
        //console.log(that.data.RegistNumber);
       }
     })
    

    // getRepairItems
    var api = "/8168/saic/api/WechatUsers";
    //page.showLoading();
    wx.request({
      url: util.getUrl(api),
      method: "GET",
      data:{
        openid: this.data.openid
      },
      success(res) {
        console.log(res);
        //app.globalData.repairItems = res.data;
        //console.log(app.globalData.repairItems);
        //page.setData({repairItems: res.data});
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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