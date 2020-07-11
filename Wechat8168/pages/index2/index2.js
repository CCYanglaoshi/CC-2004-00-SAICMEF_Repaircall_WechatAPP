// pages/index2/index2.js

//加载util
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    RepairRecords: [],
    openid: "",
    UserRoleSN: "",
    flag:[0, 0, 0],
    startext: ['', '', ''],
    stardata: [1, 2, 3]
  },

  submitRate: function(e) {
    console.log(e);
    var oid = e.currentTarget.dataset.oid;
    var result = this.data.RepairRecords.findIndex(item => {return item.oid == oid});
    var rate = this.data.RepairRecords[result].rate;
    //console.log(this.data.RepairRecords[result]);
    //console.log(rate);
    wx.showModal({
      title: '提示',
      content: '确认进行评价？?',
      success: function(res){
        if (res.confirm){
          console.log("用户点击确认")
          if (rate == null) {

          }
          else {
            var api = "8168/saic/api/RepairCallItems/update?id=" + oid;
            console.log("api is ====");
            console.log(api)
            var url = util.getUrl(api);
            console.log(url)
        
            wx.request({
              url: url,
              method: "PUT",
              header: {
                "accept": "text/plain",
                "content-type": "application/json-patch+json"
              },
              data: [
                {
                  "value": rate,
                  "operationType": 0,
                  "path": "rate",
                  "op": "replace",
                  "from": "string"
                }
              ],
              success (res) {
        
              },
              fail (res) {
        
              },
            })  
          }
        }
        else if (res.cancel){
          console.log("用户点击取消")
          return
        }
      }
    })

    // if (rate == null) {

    // }
    // else {
    //   var api = "8168/saic/api/RepairCallItems/update?id=" + oid;
    //   console.log("api is ====");
    //   console.log(api)
    //   var url = util.getUrl(api);
    //   console.log(url)
  
    //   wx.request({
    //     url: url,
    //     method: "PUT",
    //     header: {
    //       "accept": "text/plain",
    //       "content-type": "application/json-patch+json"
    //     },
    //     data: [
    //       {
    //         "value": rate,
    //         "operationType": 0,
    //         "path": "rate",
    //         "op": "replace",
    //         "from": "string"
    //       }
    //     ],
    //     success (res) {
  
    //     },
    //     fail (res) {
  
    //     },
    //   })  
    // }
  },

  changeColor: function (e) {
    console.log("changeColor");
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var num = e.currentTarget.dataset.no;
    var oid = e.currentTarget.dataset.oid;
    var result = this.data.RepairRecords.findIndex(item => {return item.oid == oid});
    //console.log(result);
    //console.log(this.data.RepairRecords[result]);
    //console.log(Number(this.data.RepairRecords[result].rate));
    
    var that = this;
    var a = "RepairRecords[" + result + "].rate";
    console.log(num);
    if(num == 1) {
      that.setData({
        [a]: 1,
        //[b]: '非常不满意'
      });
    } else if (num == 2){
      that.setData({
        [a]: 2,
        //[b]: '不满意'
      });
    } else if (num == 3) {
      that.setData({
        [a]: 3,
        //[b]: '一般'
      });
    } else if (num == 4) {
      that.setData({
        [a]: 4,
        //[b]: '满意'
      });
    } else if (num == 5) {
      that.setData({
        [a]: 5,
        //[b]: '非常满意'
      });
    }

    /*
    //提交前提示操作评价
    wx.showModal({
      title: '提示',
      content: '确认进行评价？?',
      success: function(res){
        if (res.confirm){
          console.log("用户点击确认")
          var a = "RepairRecords[" + result + "].rate";
          //var b = 'startext[' + index + ']';
          //var that = this;
          if(num == 1) {
            that.setData({
              [a]: 1,
              //[b]: '非常不满意'
            });
          } else if (num == 2){
            that.setData({
              [a]: 2,
              //[b]: '不满意'
            });
          } else if (num == 3) {
            that.setData({
              [a]: 3,
              //[b]: '一般'
            });
          } else if (num == 4) {
            that.setData({
              [a]: 4,
              //[b]: '满意'
            });
          } else if (num == 5) {
            that.setData({
              [a]: 5,
              //[b]: '非常满意'
            });
          }
          //console.log(this.data.RepairRecords);

          
        }
        else if (res.cancel){
          console.log("用户点击取消")
        }
      }
    })

    var api = "8168/saic/api/RepairCallItems/update?id=" + oid;
    console.log("api is ====");
    console.log(api)
    var url = util.getUrl(api);
    console.log(url)

    wx.request({
      url: url,
      method: "PUT",
      header: {
        "accept": "text/plain",
        "content-type": "application/json-patch+json"
      },
      data: [
        {
          "value": num,
          "operationType": 0,
          "path": "rate",
          "op": "replace",
          "from": "string"
        }
      ],
      success (res) {

      },
      fail (res) {

      },
    })
    */
  },

  cancelRepair(e) {
    console.log(e);
    
    var oid = e.currentTarget.dataset.oid;
    var api = "8168/saic/api/RepairCallItems/update?id=" + oid;
    var url = util.getUrl(api);

    var result = this.data.RepairRecords.findIndex(item => {return item.oid == oid});
    var a = "RepairRecords[" + result + "].canceled";
    this.setData({[a]: true});
    //console.log(this.data.RepairRecords);

    wx.request({
      url: url,
      method: "PUT",
      header: {
        "accept": "text/plain",
        "content-type": "application/json-patch+json"
      },
      data: [
        {
          "value": true,
          "operationType": 0,
          "path": "canceled",
          "op": "replace",
          "from": "boolean"
        }
      ],

      success (res) {

        console.log(e);
      },

      fail (res) {
        console.log("ff");
      },
    })
  },

  getRepairCallItemList(){
    let that=this;
    var api = "/8168/saic/api/RepairCallItemsLite";
    //page.showLoading();
    //console.log("open: this.data.openid::::" +that.data.openid)
    wx.request({
      url: util.getUrl(api),
      method: "GET",
      data: {
        openid: this.data.openid
      },
      success(res){
        console.log(res);
        that.setData({
          RepairRecords: res.data
        })
        }
      }
    )
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
            key:'openid',
            success:function(res){
              console.log("res.datares.datares.datares.data"+ res.data)
              that.setData({
                  openid:res.data
              })
            }
          }
      )
    console.log("res.datares.data hahaha"+ that.data.openid)
    //this.getRepairCallItemList();
    
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
            UserRoleSN: res.data[0].userPhoneNum
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
    
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("res.datares.data hahaha"+ this.data.openid)
    this.getRepairCallItemList();
    console.log("repaircallitems:");
    console.log(this.RepairRecords)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("res.datares.data "+ this.openid)
    console.log("res.datares.data "+ this.data.openid)
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
    console.log('onPullDownRefresh')
    wx.showNavigationBarLoading()
    this.getRepairCallItemList();
    this.onLoad()
    setTimeout(() => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 2000);
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