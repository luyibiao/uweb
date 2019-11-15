
// 获取微信首页信息mixins
export default {
  data() {
    return {
      config: {}, //开关信息
      cityInfo: {}, //城市信息
      carouselList: [], //轮播列表
      cabinetList: [], //智柜列表
      outerLinkList: [], //外链列表
      imgAd:[],//图片广告
      mediaList:[],//视频图片
      businessList: [], //经营大类
      protocol: {} //洗衣协议
    }
  },
  methods: {
    getCityInfo() {
      return this.$store
        .dispatch("get", {
          uri: "mercBusiness/queryRepeatCity"
        })
        .then(res => {
          this.cityInfo = res.data.city;
          return res;
        });
    },
    // 获取配置信息
    getConfig() {
      return this.$store
        .dispatch("get", {
          uri: "mercCityParam/detail"
        }).then(res => {
          this.config = res.data.data || {};
          return res;
        })
    },
    // 获取轮播图
    getCarouselList() {
      return this.$store
        .dispatch("get", {
          uri: "clientAdve/list",
          params: {
            scene: 11
          }
        }).then(res => {
          this.carouselList = res.data.data.list || [];
          return res;
        })
    },
    // 获取智柜
    getCabinetList() {
      return this.$store
        .dispatch("get", {
          uri: "clientAdve/list",
          params: {
            scene: 12
          }
        }).then(res => {
          this.cabinetList = res.data.data.list || [];
          return res;
        })
    },
    // 获取外链
    getOuterLinkList() {
      return this.$store
        .dispatch("get", {
          uri: "clientAdve/list",
          params: {
            scene: 13
          }
        }).then(res => {
          this.outerLinkList = res.data.data.list || [];
          return res;
        })
    },
    // 获启用取服务项目
    getBusinessList() {
      return this.$store
        .dispatch("get", {
          uri: "mercBusiness/list"
        })
        .then(res => {
          this.businessList = (res.data.data.list || []).filter(item => item.status == 1);
          return res;
        })
    },
    getUserProtocol() {
      return this.$store
        .dispatch("get", {
          uri: "userProtocol/detail"
        }).then(res => {
          this.protocol = res.data.data || {};
          return res;
        });
    },
    getImgAd(){
      return this.$store
        .dispatch("get", {
          uri: "clientAdve/list",
          params: {
            scene: 14
          }
        }).then(res => {
          this.imgAd = res.data.data.list || [];
          return res;
        });
    },
    getMedia(){
      return this.$store
        .dispatch("get", {
          uri: "clientAdve/list",
          params: {
            scene: 15
          }
        }).then(res => {
          this.mediaList = res.data.data.list || [];
          return res;
        });
    }
  }
}