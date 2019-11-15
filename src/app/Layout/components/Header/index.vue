<template>
	<div class="nav clearfix nav_header">
    <router-link :to="'/setting'">
		  <img class="header-logo" :src="mercInfo.logoPath || '/static/img/logo.png'" alt="">
    </router-link>
		<div class="header-nav text-primary" >
			<el-popover
			  ref="popoverHeader"
			  placement="bottom-start"
			  width="500"
			  v-model="visible">
			  <div class="header-nav-list no-select">
					<el-menu theme="light" :default-active="defaultActive" class="el-menu-demo">
						<el-menu-item v-for="item in menuList" :index="item.permission" :key="item.id" @click="handleClick(item)">
              <router-link :to="getRequestUrl(item)" class="item-list">
                <img class="img" :src="item.iconcls">
                <div class="text" v-text="item.name"></div>
              </router-link>
						</el-menu-item>
					</el-menu>
				</div>
			</el-popover>
			<a class="header-nav-switch no-select" v-bind:class="{'is-active': visible }" v-popover:popoverHeader>
				<span v-text="selectedItem"></span>
				<i class="el-collapse-item__header__arrow el-icon-arrow-right"></i>
			</a>
		</div>

    <el-popover
      ref="popoverManager"
      placement="bottom-start">
      <div class="text-center" v-if="workInfo.loginType == 2">
        <el-button size="small" type="text" @click="toPartner">切换商户</el-button>
      </div>
      <div class="text-center">
        <el-button size="small" type="text" @click="logout">退出</el-button>
      </div>
    </el-popover>
    <div class="pull-right text-right m-r-lg">
      <p class="user text-primary">
        <span v-popover:popoverManager>
          {{workInfo.name}}<template v-if="workInfo.loginType != 3">({{workInfo.loginType | getValText('LOGIN_TYPE')}})</template> - {{workInfo.cityName}}{{workInfo.roleName}}
          <i class="el-icon-caret-bottom text-xs"></i>
          <img  class="merchant-logo m-l-xs" src="/static/img/user/def.png" alt="">
        </span>
      </p>
    </div>

		<!-- 角色授权 -->
		<el-popover ref="authManager" @show="initAuth()"
			placement="bottom-start">
			<div class="text-center" >
				<div v-loading="auth_loading">
					<div  v-for="item in authList" v-bind:key="item.accountId">
						<el-button size="small" type="text" class="text-base" @click="pseudo(item)">
							{{item.cityName || ''}}{{item.roleName}}
						</el-button>
					</div>
					<!--<div v-else-if="authList.length == 1" > <el-button size="small" type="text" class="text-base" @click="pseudo(item)">
						{{authList[0].cityName || ''}}{{authList[0].roleName}}
						</el-button></div>-->
					<div v-if="authList.length == 0">
						<p class="text-muted">--无角色授权--</p>
					</div>
				</div>
			</div>
  	</el-popover>
    <div class="pull-right text-right m-r-lg-head">
        <el-button v-if="mercInfo.isAuth === 1" class="m-r-sm auth_button" type="success" size="mini" round>已认证</el-button>
        <el-button v-if="mercInfo.isAuth !== 1 && (workInfo.roleId == 1 || workInfo.roleId == 7)" class="m-r-sm auth_button" type="primary" @click="goAuth" size="mini" round>去认证</el-button>
        <el-button class="mybadge right_menu" @click="goMyTask" v-if="taskNum>0">
            <img src="/static/img/setting/task_logo.png" width="11px" style="vertical-align: text-top;">
            <span ref="ft">我的任务</span>
            <el-badge :value="taskNum"/>
        </el-button>
        <a href="http://help.twash.cn/" target="_blank" class="text-primary" style="line-height:50px;">帮助中心</a>
        <span style="margin:0px 10px;color:#AAAAAA;">|</span>
        <div v-if="workInfo.authEnable" style="display:inline-block;">  
          <p class="user text-primary" v-show="authList.length > 1">
            <span v-popover:authManager >
              角色切换
              <i class="el-icon-caret-bottom text-xs"></i>
            </span>
          </p>
          <span class="user text-primary" v-if="authList.length == 1" > 
            <el-button size="small" type="text" class="text-base" @click="pseudo(authList[0])" style="font-size:14px;">
            切换至 {{authList[0].cityName || ''}}{{authList[0].roleName}}
                </el-button>
          </span>
        </div>
    </div>
	
		<!-- 角色授权-->

	</div>
</template>

<script>
import auth from "@/utils/auth";
import router from "@/router";
import storage from '@/utils/helpers/storageLite'
import { mapState } from "vuex";
import consts from '@/utils/consts'
export default {
  data: function() {
    return {
      mercInfo: auth.getMercInfo(),
      menuList: auth.getMenuList(),
      defaultActive: "",
      visible: false,
      selectedItem: "概况",
			auth_loading: false,
      authList:[],	//授权列表
      badge:12,
      taskNum:0
    };
  },
  watch: {
    $route(n,o) {
      if(this.defaultActive !== n.path.split("/")[1]){
        this.initMenu();
      }
    }
  },
  methods: {
    goMyTask(){
      let ft=this.$refs.ft;
      ft.style.color='white'
      this.getTaskNum();
      this.$router.push({path:'/setting/mytask'})
    },
    goAuth() {
      this.$router.push({path:'/setting/account/merc_auth'})
    },
    getAuth(item){
      let num = 0;
      let obj=auth.getPermList();
      for(let i=0;i<item.length;i++){
        for(let j=0;j<=obj.length;j++){
          if(item[i].permission===obj[j]){
             num++;
          }
        }
      }
      return num;
    },
    getTaskNum(){
      this.$store.dispatch('post',{
        uri:'taskInfo/list',
      }).then(res=>{
        if(res.data.data.list.length!==0){
           this.taskNum= this.getAuth(res.data.data.list);
         }
      })
    },
    initMenu() {
      if (auth.hasPerm('setting.mytask.read')) {
        this.getTaskNum();
      }
      const openName = this.$route.path.split("/")[1];
      for (let index = 0; index < this.menuList.length; index++) {
        if (openName == this.menuList[index].permission) {
          this.selectedItem = this.menuList[index].name;
          this.defaultActive = this.menuList[index].permission;
          return false;
        }
      }
    },
    getRequestUrl(item) {
      let requestUrl = item.requestUrl;
      requestUrl = requestUrl == '#' ? item.children[0].requestUrl : requestUrl;
      requestUrl = requestUrl == '#' ? item.children[0].children[0].requestUrl : requestUrl;
      return requestUrl;
		},
    handleClick(item) {
      this.selectedItem = item.name;
      this.defaultActive = item.permission;
      this.visible = false;
    },
    toPartner() {
      window.open(consts.PARTNER_URL,'_self')
    },
    logout() {
      this.$store.dispatch('get', {
        uri: 'workerLogin/logout',
        forceResolve:true
      }).then((res)=>{
        this.$store.commit("SETWORKINFO", {});
        auth.logout();
        storage.sessionRemove("ACCOUNT_AUTH");
        router.push("/login");
      });
    },
		initAuth(){
      this.auth_loading = true;
			let _this = this;
			let authList = storage.sessionGet("ACCOUNT_AUTH");
			if(authList){
        _this.authList = authList;
        _this.auth_loading = false;
      }else{
        _this.$store.dispatch('post', {
          uri: 'accountAuth/list',
        }).then((res) => {
          _this.authList = res.data.data || [];
          _this.auth_loading = false;
          storage.sessionSet("ACCOUNT_AUTH", _this.authList);
          _this.authList = res.data.data || [];
        })
			}
		},
		pseudo(item){
			this.$store.dispatch('post', {
				uri: 'accountAuth/pseudo',
				data:{accountId:item.accountId}
			}).then((res) => {
        storage.sessionRemove("ACCOUNT_AUTH");
			  window.open(res.data.data,'_self')	//覆盖当前页面，避免拦截
			})
		}
  },
  created() {
    this.initMenu();
    this.initAuth()
  },
  computed: {
    ...mapState(["workInfo"])
  }
};
</script>

<style lang="scss" scoped src="./theme/styles/index.scss"></style>

<style lang="less">
.el-menu{
  border-right:0 !important;
}
.user {
  line-height: 50px;
  cursor: pointer;
}
.auth_button{
  padding: 3px 9px !important;
}
.el-popover {
  z-index: 100001;
}
.el-menu.el-menu-demo {
  background: #fff;
}
.el-menu.el-menu-demo .el-menu-item:hover {
  background: #fff;
}
.merchant-logo {
  vertical-align: middle;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}
.nav_header{
  .right_menu.mybadge{
  padding: 6px 14px;
  // margin-right: 10px;
  border-radius: 20px;
  margin-right: 10px;
  // margin-top: 0px;
  font-size: 10px;
  background-color: #ff6602;
  color:white;
  border: none;
  &:hover{
    opacity: .8;
    color: white !important;
  };
  &:active{
    color: white !important;
  }
}
 .el-badge__content{
  background-color: white !important;
  color: #ff6602 !important;
  font-size: 12px !important;
  -webkit-transform : scale(0.90,0.90)  !important;
  height: 17px !important;
  padding: 0px 7px !important;
}
.m-r-lg-head{
  margin-right: 7px;
}
}
</style>