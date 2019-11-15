<template>
	<div class="clearfix">
		<div class="sidebar pull-left">
			<wxBox>
				<!-- 轮播图 -->
				<wxCarousel v-if="config.isClientAdve"
				            class="m-b"
				            :list="carouselList"></wxCarousel>
				<!-- 经营项目 -->
				<wxBusiness class="m-b"
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
			<div class="project-item m-l-lg">
				<v-project-item @updateSuccess="getBusinessList"
				                :id="$route.params.id"></v-project-item>
			</div>
		</div>
	</div>
</template>

<script>
import wxHomeData from "@/utils/mixins/wx_homedata";

import vProjectItem from "./project_item.vue";

import wxBox from "@/components/Wx/wx_box";
import wxCarousel from "@/components/Wx/wx_carousel";
import wxBusiness from "@/components/Wx/wx_business";
import wxCabinet from "@/components/Wx/wx_cabinet";
import wxOuterlink from "@/components/Wx/wx_outerlink";
import wxOnkey from "@/components/Wx/wx_onkey";

export default {
  mixins: [wxHomeData],
  components: {
    vProjectItem,
    wxBox,
    wxCarousel,
    wxCabinet,
    wxBusiness,
    wxOuterlink,
    wxOnkey
  },
  data() {
    return {
      loading: true
    };
  },
  created() {
    // 获取项目详情
    this.loading = true;
    this.getBusinessList().then(res => {
      this.loading = false;
    });
    this.getCityInfo();
    // 获取微信首页信息
    this.getConfig().then(res => {
      if (res.data.data.isClientAdve) this.getCarouselList();
      if (res.data.data.showOutsideLink) this.getOuterLinkList();
      if (res.data.data.showBookCupboard) this.getCabinetList();
    });
  }
};
</script>

<style lang="scss" scoped src="./theme/styles/project.scss"></style>