<template>
  <div>
    <div class="sidebar pull-left">
      <!-- 微信预览 -->
      <wxBox>
        <!-- 轮播图 -->
        <wxCarousel v-if="config.isClientAdve"
                    class="m-b"
                    :list="carouselList"></wxCarousel>
        <!-- 外链 -->
        <wxOuterlink class="m-b"
                     v-if="config.showOutsideLink && config.topOutsideLink"
                     :list="outerLinkList">
        </wxOuterlink>
        <!--图片广告-->
        <wxImgAd class="m-b" :list="imgAd" v-if="imgAd && imgAd.length > 0"></wxImgAd>
        <!-- 一键下单 -->
        <wxConcise v-if="cityInfo.createMode === 3"
                   :bgPath="protocol.imgPath"
                   class="m-b">
        </wxConcise>
        <!-- 经营项目 -->
        <wxBusiness v-else
                    class="m-b"
                    :list="businessList"
                    :type="config.bizStyle"></wxBusiness>
        <!--视频图片-->
        <wxImgAd class="m-b" :list="mediaList" v-if="config.showMedia && mediaList && mediaList.length > 0"></wxImgAd>
        <!-- 智柜 -->
        <wxCabinet v-if="config.showBookCupboard && cityInfo.isCupboard"
                   class="m-b"
                   :bgPath="cabinetList[0] ? cabinetList[0].imgPath : ''"></wxCabinet>
        <!-- 外链 -->
        <wxOuterlink class="m-b"
                     v-if="config.showOutsideLink && !config.topOutsideLink"
                     :list="outerLinkList">
        </wxOuterlink>
        <wxOnkey class="m-b" v-if="cityInfo.createMode !=3 && config.oneKeyCreate"></wxOnkey>
      </wxBox>
    </div>
    <div class="main" v-loading="loading">
      <el-tabs v-model="tabName"
               type="card">
        <el-tab-pane label="轮播图"
                     name="carousel">
          <carousel :status.sync="config.isClientAdve"
                    :list="carouselList"
                    @updataList="getCarouselList"></carousel>
        </el-tab-pane>
        <el-tab-pane v-if="cityInfo.isCupboard"
                     label="预约智柜"
                     name="cabinet">
          <cabinet :status.sync="config.showBookCupboard"
                   :list="cabinetList"
                   @updataList="getCabinetList"></cabinet>
        </el-tab-pane>
        <el-tab-pane label="外链菜单"
                     name="link">
          <outerLink :status.sync="config.showOutsideLink"
                     :top.sync="config.topOutsideLink"
                     :list="outerLinkList"
                     @updataList="getOuterLinkList"></outerLink>
        </el-tab-pane>
        <el-tab-pane label="首页广告"
                     name="imgAd">
          <imgAd :status.sync="config.showImgAd"
                     :list="imgAd"
                     @updataList="getImgAd"></imgAd>
        </el-tab-pane>
        <el-tab-pane label="视频图片"
                     name="media">
          <media :status.sync="config.showMedia"
                 :list="mediaList"
                 @updataList="getMedia"></media>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<style lang="scss" scoped src="../Project/theme/styles/project.scss"></style>

<script>
  import wxBox from "@/components/Wx/wx_box";
  import wxCarousel from "@/components/Wx/wx_carousel";
  import wxImgAd from "@/components/Wx/wx_imgAd";
  import wxBusiness from "@/components/Wx/wx_business";
  import wxCabinet from "@/components/Wx/wx_cabinet";
  import wxOuterlink from "@/components/Wx/wx_outerlink";
  import wxOnkey from "@/components/Wx/wx_onkey";
  import wxConcise from "@/components/Wx/wx_concise";
  import imgAd from  "./components/img_ad";
  import media from  "./components/media";
  import outerLink from "./components/outer_link";
  import cabinet from "./components/cabinet";
  import carousel from "./components/carousel";

  import wxhomedata from "@/utils/mixins/wx_homedata";

  export default {
    mixins: [wxhomedata],
    data() {
      return {
        tabName: "carousel",
        loading: false
      };
    },
    created() {
      this.loading = true;
      Promise.all([this.getCityInfo(), this.getConfig()]).then(res => {
        this.cityInfo.createMode == 3
          ? this.getUserProtocol()
          : this.getBusinessList();
        this.loading = false;
      });
      this.getCarouselList();
      this.getOuterLinkList();
      this.getCabinetList();
      this.getImgAd();
      this.getMedia();
    },
    computed: {
      // 智柜背景图
      cabinetBgPath() {
        return this.cabinetList[0] ? this.cabinetList[0].imgPath : "";
      }
    },
    components: {
      outerLink,
      cabinet,
      carousel,
      wxBox,
      wxCabinet,
      wxBusiness,
      wxCarousel,
      wxImgAd,
      wxOuterlink,
      imgAd,
      media,
      wxConcise,
      wxOnkey
    }
  };
</script>
