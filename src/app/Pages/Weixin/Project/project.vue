<template>
  <div>
    <div class="clearfix"
         v-if="cityInfo.isShopOpen === 1">
      <div class="sidebar pull-left">
        <wxBox>
          <!-- 轮播图 -->
          <wxCarousel v-if="config.isClientAdve"
                      class="m-b"
                      :list="carouselList"></wxCarousel>
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
          <!-- 智柜 -->
          <wxCabinet v-if="config.showBookCupboard && cityInfo.isCupboard == 1"
                     class="m-b"
                     :bgPath="cabinetList[0] ? cabinetList[0].imgPath : ''"></wxCabinet>
          <!-- 外链 -->
          <wxOuterlink class="m-b"
                       v-if="config.showOutsideLink"
                       :list="outerLinkList">
          </wxOuterlink>
          <wxOnkey class="m-b"
                   v-if="cityInfo.createMode !=3 && config.oneKeyCreate"></wxOnkey>
        </wxBox>
      </div>
      <div class="main"
           v-loading="loading">
        <vProjectConcise v-if="cityInfo.createMode == 3"
                         :image.sync="protocol.imgPath"></vProjectConcise>
        <div v-else>
          <div class="m-b">
            <p class="m-b-sm">选择模板</p>
            <businessType :type.sync="config.bizStyle"></businessType>
          </div>
          <div>
            <p>已启用的项目</p>
            <v-project-content v-bind:project-content="businessList"
                               v-if="businessList && businessList.length > 0"></v-project-content>
          </div>

          <div class="m-t-lg"
               v-if="unBusinessList && unBusinessList.length > 0">
            <p>未启用的项目</p>
            <v-project-content class="project-item-disabled"
                               v-bind:project-content="unBusinessList"></v-project-content>
          </div>
        </div>
      </div>
    </div>
    <vBanner v-else
             :isShow="1"></vBanner>
  </div>
</template>

<script>
import auth from "@/utils/auth";

import wxHomeData from "@/utils/mixins/wx_homedata";

import vProjectContent from "./project_content.vue";
import vProjectConcise from "./project_concise.vue";
import vBanner from "../banner.vue";
import businessType from "../components/business_type.vue";
import wxBox from "@/components/Wx/wx_box";
import wxCarousel from "@/components/Wx/wx_carousel";
import wxBusiness from "@/components/Wx/wx_business";
import wxConcise from "@/components/Wx/wx_concise";
import wxCabinet from "@/components/Wx/wx_cabinet";
import wxOuterlink from "@/components/Wx/wx_outerlink";
import wxOnkey from "@/components/Wx/wx_onkey";

export default {
  mixins: [wxHomeData],
  components: {
    vProjectContent,
    vBanner,
    vProjectConcise,
    businessType,
    wxBox,
    wxCarousel,
    wxCabinet,
    wxBusiness,
    wxOuterlink,
    wxConcise,
    wxOnkey
  },
  data: function() {
    return {
      loading: true,
      unBusinessList: [] //已停用项目
    };
  },
  created() {
    this.loading = true;
    this.getCityInfo().then(res => {
      // 是一键下单模式则设置洗衣协议
      if (res.data.city.createMode === 3) {
        this.getUserProtocol().then(res => {
          this.loading = false;
        });
      } else {
        // 反之获取经营项目   有data表示已经初始化 不需要初始化
        (res.data.data ? this.getBusinessList : this.initCityBusiness)().then(
          res => {
            this.unBusinessList = (res.data.data.list || []).filter(
              item => item.status == 0
            );
            this.loading = false;
          }
        );
      }
    });
    this.getConfig().then(res => {
      if (res.data.data.isClientAdve) this.getCarouselList();
      if (res.data.data.showOutsideLink) this.getOuterLinkList();
      if (res.data.data.showBookCupboard) this.getCabinetList();
    });
  },
  methods: {
    // 初始化经营大类
    initCityBusiness() {
      return this.$store
        .dispatch("post", {
          uri: "mercBusiness/initCity"
        })
        .then(res => {
          this.businessList = (res.data.data.list || []).filter(
            item => item.status == 1
          );
          return res;
        });
    }
  }
};
</script>

<style lang="scss" scoped src="./theme/styles/project.scss"></style>
