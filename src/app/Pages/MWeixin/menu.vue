<template>
	<div>
		<div class="custom-menu m-t-lg clearfix ukao-v-loading" v-loading="loading">
			<div class="left-part">
				<div class="left-wrapper b-a">
					<img class="w-full v-top" src="/static/img/weixin_public.png" alt="">
					<div class="title">{{mercInfo.name}}</div>
					<ul class="pre-menu-list b-t">
						<li v-for="(preItem, pIdx) in button" class="pre-menu-item b-r" :class="{'is-active': preItem.active}" :style="{'width': liWidth}">
							<a class="pre_menu_link" @click="chooseItem(preItem, pIdx)" title="最多添加3个一级菜单">{{preItem.name}}</a>
							<div class="sub-menu-box" v-if="preItem.showSubButton">
								<ul class="sub-menu-list">
									<li class="sub-menu-item" :class="{'is-active': subItem.active}" v-for="(subItem, cIdx) in preItem.sub_button">
										<a href="javascript:void(0)" @click="chooseSubItem(subItem, pIdx, cIdx)">
											<span class="icon">
												<span>{{subItem.name}}</span>
											</span>
										</a>
									</li>
									<li class="sub-menu-item sub-add-control" v-if="preItem.subAddControl">
										<a href="javascript:void(0)" @click="addSubItem(preItem, pIdx)" title="最多添加5个二级菜单">
											<span class="icon">
												<span>+</span>
											</span>
										</a>
									</li>
								</ul>
								<i class="u-arrow u-arrow-out"></i>
								<i class="u-arrow u-arrow-in"></i>
							</div>
						</li>
						<li v-if="preAddControl" class="pre-menu-item pre-add-control" :class="{'is-active': preAddControlActive}" :style="{'width': liWidth}" @click="addList">+</li>
					</ul>
				</div>
				<!-- <div class="text-center m-t"><el-button>菜单排序</el-button></div> -->
			</div>

			<div class="right-part" v-if="currentActiveObj">
				<div class="right-content wrapper b-a">
					<div class="title b-b wrapper-sm">
						<a class="text-primary pull-right" @click="deleteItem">删除菜单</a>{{menuName}}
					</div>
					<div class="m-t-lg">
						<p class="text-muted m-l m-b" v-if="hasSubButton">已添加子菜单，仅可设置菜单名称。</p>
						<el-form ref="nameForm" :model="currentActiveObj" label-width="85px">
						  <el-form-item label="菜单名称" required prop="name"
								:rules="[{ required:true, message: '菜单名称不能为空', trigger: 'blur' },
						  	{validator:checkBLen, min: 1, max: 8*lenRatio, message: '长度在 1 到 '+8*lenRatio+' 个字符', trigger: 'blur' }]">
							  <div class="w-lg">
							  	<el-input v-model="currentActiveObj.name" @blur="updateMenu" placeholder="菜单名称"></el-input>
							  </div>
							  <p class="text-muted">字数不超过{{4*lenRatio}}个汉字或{{8*lenRatio}}个字母</p>
						  </el-form-item>
              <el-form-item label="菜单内容" v-if="!hasSubButton">
                <el-radio-group v-model="currentActiveObj.type" @change="updateMenu">
                  <!--<el-radio label="click">发送消息</el-radio>-->
                  <el-radio label="view">跳转网页</el-radio>
                  <el-radio label="miniprogram">跳转小程序</el-radio>
                </el-radio-group>
              </el-form-item>
						</el-form>
					</div>
					<template v-if="!hasSubButton">
						<div class="u-el-tabs" v-if="currentActiveObj.type==='click'">
							<el-tabs type="border-card">
								<el-tab-pane>
									<span slot="label"><i class="el-icon-edit"></i> 图文消息</span>
									<div>
										<div v-if="selectedMsg" class="ukao-upload-box-container">
											<div class="selected-msg b-a text-center">
												<img class="v-top" :src="selectedMsg.src" alt="">
												<p class="msg-title">{{selectedMsg.title}}</p>
												<a class="delete-block text-primary" @click="selectedMsg = null">删除</a>
											</div>
										</div>
										<div v-else class="text-center ukao-upload-box-container">
											<a class="ukao-upload-box m-r-xl" @click="msgVisible=true">
												<p class="text text-muted">从素材库中选择</p>
											</a>
											<router-link to="/mweixin/material/new" target="_blank">
												<a class="ukao-upload-box">
													<p class="text text-muted">新建图文消息</p>
												</a>
											</router-link>
										</div>
									</div>
								</el-tab-pane>
								<el-tab-pane>
									<span slot="label"><i class="el-icon-picture"></i> 图片</span>
									<div>
										<div v-if="selectedImg" class="ukao-upload-box-container">
											<div class="selected-msg b-a text-center">
												<img class="v-top" :src="selectedImg.src" alt="">
												<p class="msg-title">{{selectedImg.title}}</p>
												<a class="delete-block text-primary" @click="selectedImg = null">删除</a>
											</div>
										</div>
										<div v-else class="text-center ukao-upload-box-container">
											<a class="ukao-upload-box m-r-xl" @click="imgVisible=true">
												<p class="text text-muted">从素材库中选择</p>
											</a>
											<router-link to="/mweixin/material/new" target="_blank">
												<a class="ukao-upload-box">
													<p class="text text-muted">上传图片</p>
												</a>
											</router-link>
										</div>
									</div>
								</el-tab-pane>
							</el-tabs>
						</div>
						<div class="b-a bg-white" v-if="currentActiveObj.type==='view'">
							<div class="text-muted wrapper">订阅者点击该子菜单会跳到以下链接</div>
							<el-form ref="linkForm" :model="currentActiveObj" label-width="85px">
								<el-form-item label="菜单内容" >
									<el-radio-group v-model="currentActiveObj.urlType">
										<el-radio label="1">常用链接</el-radio>
										<el-radio label="2">自定义链接</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="页面地址" prop="url" :rules="{ validator:checkUrl, message: '无效的地址', ignoreEmpty:currentActiveObj.type!=='view', trigger: 'blur' }">
									<el-input class="w-md" v-if="currentActiveObj.urlType==2" v-model="currentActiveObj.url" type="textarea" :rows="4" @blur="updateMenu" placeholder="认证后才可手动输入地址" ></el-input>
									<el-select v-if="currentActiveObj.urlType==1" v-model="currentActiveObj.url" placeholder="请选择" @change="updateMenu">
										<el-option
											v-for="item in comUrls"
											:key="item.url"
											:label="item.name"
											:value="item.url">
										</el-option>
									</el-select>
									<div class="text-xs text-muted" v-show="currentActiveObj.urlType == 1">链接地址：{{currentActiveObj.url}}</div>
								</el-form-item>
							</el-form>
						</div>
						<div class="b-a bg-white" v-if="currentActiveObj.type==='miniprogram'">
							<div class="text-muted wrapper">订阅者点击该子菜单会跳到以下小程序(仅支持跳转已关联的小程序)</div>
							<el-form ref="linkForm" :model="currentActiveObj" label-width="100px">
								<el-form-item label="路径内容" >
									<el-radio-group v-model="currentActiveObj.urlType">
										<el-radio label="1">常用路径</el-radio>
										<el-radio label="2">自定义路径</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="页面路径" prop="url" :rules="{ required: true, message: '请填写路径', trigger: 'blur' }">
									<el-input class="w-md" v-if="currentActiveObj.urlType==2" v-model="currentActiveObj.pagepath" @blur="updateMenu"></el-input>
									<el-select v-if="currentActiveObj.urlType==1" v-model="currentActiveObj.pageIndex" placeholder="请选择" @change="updateMiniPath">
										<el-option
											v-for="(item, index) in comUrls" v-if="item.pagepath"
											:key="index"
											:label="item.name"
											:value="index">
										</el-option>
									</el-select>
									<div class="text-xs text-muted" v-show="currentActiveObj.urlType == 1">页面路径：{{currentActiveObj.pagepath}}</div>
								</el-form-item>
								<el-form-item label="小程序appid" prop="appid" :rules="{ required: true, message: '请输入小程序appid', trigger: 'blur' }">
									<el-input class="w-md" v-model="currentActiveObj.appid" @blur="updateMenu"></el-input>
								</el-form-item>
								<el-form-item label="备用页面" prop="url" :rules="{ validator:checkUrl, message: '无效的地址', ignoreEmpty:currentActiveObj.type!=='miniprogram', trigger: 'blur' }">
									<el-input class="w-md" v-model="currentActiveObj.url" @blur="updateMenu"></el-input>
								</el-form-item>
							</el-form>
						</div>
					</template>
				</div>
			</div>
		</div>

		<div style="margin-left: 400px; margin-top: 15px;">
			<el-button type="primary" @click="save">保存</el-button>
		</div>

		<el-dialog
		  title="温馨提示"
		  :visible.sync="delDialog"
		  size="tiny">
		  <div>
		  	<p>确认删除</p>
		  	<p class="text-muted">删除后“{{menuName}}”菜单下设置的内容将被删除</p>
		  </div>

		  <span slot="footer" class="dialog-footer">
		    <el-button @click="delDialog = false">取 消</el-button>
		    <el-button type="primary" @click="confirmDelete">确 定</el-button>
		  </span>
		</el-dialog>

		<el-dialog class="ukao-dialog"
		  title="选择图文消息"
		  :visible.sync="msgVisible"
		  size="small">
		  <div>
		  	<ul class="bg-list clearfix">
          <li v-for="item in bgList" :key="item.id" @click="msgChoose(item)">
            <div class="bg-item" :class="{ 'is-active': item.isActive }">
              <img class="msg-img v-top b-a" :src="item.src" alt="">
              <span class="ukao-icon-success"></span>
            </div>
            <p class="msg-title text-center">{{item.title}}</p>
          </li>
        </ul>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="msgVisible = false">取 消</el-button>
		    <el-button type="primary" @click="msgConfirm">确 定</el-button>
		  </span>
		</el-dialog>

		<el-dialog class="ukao-dialog"
		  title="选择图片"
		  :visible.sync="imgVisible"
		  size="small">
		  <div>
		  	<ul class="bg-list clearfix">
          <li v-for="item in bgList2" :key="item.id" @click="imgChoose(item)">
            <div class="bg-item" :class="{ 'is-active': item.isActive }">
              <img class="msg-img v-top b-a" :src="item.src" alt="">
              <span class="ukao-icon-success"></span>
            </div>
            <p class="msg-title text-center">{{item.title}}</p>
          </li>
        </ul>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="imgVisible = false">取 消</el-button>
		    <el-button type="primary" @click="imgConfirm">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
  import auth from '@/utils/auth'
  import consts from '@/utils/consts'
  import bizconsts from '@/utils/bizconsts'
  import validate from '@/utils/helpers/validate'
  import msg from '@/utils/msg'

	export default {
		data() {
			return {
        comUrls: [
//          { "name": "首页", "url": consts.WX_URL + "/home?u_code=" + auth.getMercInfo().code },
//          { "name": "会员中心", "url": consts.WX_URL + "/me?u_code=" + auth.getMercInfo().code },
//          { "name": "我的订单", "url": consts.WX_URL + "/order?u_code=" + auth.getMercInfo().code },
//          { "name": "充值", "url": consts.WX_URL + "/trade/recharge?u_code=" + auth.getMercInfo().code },
//          { "name": "会员卡", "url": consts.WX_URL + "/membership_card?u_code=" + auth.getMercInfo().code }
        ],
        mercInfo : auth.getMercInfo(),
				loading: false,
				button: [
//					 {
//					 	name: '菜单名称a',
//					 	sub_button: [
//					 		{ name: '子菜单名称a1', type:'view', url:'http://sub.a1' },
//					 		{ name: '子菜单名称a2', type:'view', url:'http://sub.a2' },
//					 		{ name: '子菜单名称a3', type:'view', url:'http://sub.a3' }
//					 	]
//					 },
//					 {
//					 	name: '菜单名称b',
//					 	sub_button: [
//					 		{ name: '子菜单名称b1', type:'view', url:'http://sub.b1' },
//					 		{ name: '子菜单名称b2', type:'view', url:'' }
//					 	]
//					 }
				],
				menuName:'菜单名称',
				currentActiveObj: '',
        wxAppInfo: '',
				pIdx: null,
				cIdx: null,
				delDialog: false,
				msgVisible: false,
				imgVisible: false,
				bgList: [
          { src: "/static/img/avatar.jpg", isActive: false, title: '标题' },
          { src: "/static/img/avatar.jpg", isActive: false, title: '标题0000000000000000000000000' },
          { src: "/static/img/avatar.jpg", isActive: false, title: '标题' }
        ],
        bgList2: [
          { src: "/static/img/avatar.jpg", isActive: false, title: 'abc.jpg' },
          { src: "/static/img/avatar.jpg", isActive: false, title: 'abc.jpg' },
          { src: "/static/img/avatar.jpg", isActive: false, title: 'abc.jpg' }
        ],
        choosedMsg: null,
        selectedMsg: null,
        selectedImg: null,
        choosedImg: null
			}
		},
		computed: {
			//  计算preMenuList中每一项所占宽度百分比
			liWidth() {
				let len = this.button.length>=2 ? 3 : this.button.length+1;
				return (Math.round(1/len * 10000)/100).toFixed(2) + '%';
			},
			preAddControlActive() {
				return !this.button.length;
			},
			preAddControl() {
				return this.button.length !== 3;
			},
			hasSubButton() {
				return this.currentActiveObj.sub_button && this.currentActiveObj.sub_button.length;
			},
			// 校验菜单字符系数
			lenRatio() {
			 return this.currentActiveObj.sub_button?1:2;
			}
		},
		created() {
      this.detail();
      this.queryMenuUrl();
      this.queryWxApp();
    },
		methods: {
		  queryMenuUrl() {
        this.$store.dispatch('post', {
          uri : 'sysDicKey/keyList',
					data: {code:'WX_MENU_URL'}
        }).then((res) =>{
          if (res.data.data) {
            let mList = res.data.data;
            for (let i = 0; i < mList.length; i ++) {
              let m = mList[i];
              this.comUrls.push({'name': m.text, 'url': consts.WX_URL + m.val + '?u_code=' + auth.getMercInfo().code, 'pagepath': m.attr1});
						}
          }
        })
			},
		  queryWxApp() {
        this.$store.dispatch('post', {
          uri: 'wxAuthorizerInfo/detail',
          data: {origin: bizconsts.COMMON.ORIGIN_WX_APP}
        }).then((res)=>{
          if (res.data.data) {
            this.wxAppInfo = res.data.data;
          }
        });
			},
		  detail() {
        this.$store.dispatch('post', {
          uri : 'wxMenu/detail',
        }).then((res) =>{
          if (res.data.data) {
            this.button = JSON.parse(res.data.data.menuJson).button;

            for (let i = 0; i < this.button.length; i++) {
              let item = this.button[i];
              if (item.sub_button && item.sub_button.length > 0) {
                for (let j = 0; j < item.sub_button.length; j++) {
                  let subItem = item.sub_button[j];
                  if (subItem.active) {
                    this.chooseSubItem(subItem, i, j);
                    return;
                  }
                }
              } else if (item.active) {
                this.chooseItem(item, i);
                return;
              }
            }
          }

        })
      },
      // 新增菜单
      addList() {
      	let list = this.button;
      	let len = list.length;
      	this.cancelActiveState();
        let newItem = {
      		name: '菜单名称',
      		type: 'view',
      		urlType: '1',
      		url: '',
      		active: true,
      		subAddControl: true,
      		showSubButton: true
      	};
      	list.push(newItem);
      	list[len].active = true;
      	this.currentActiveObj = {...list[len]};
        this.menuName = newItem.name;
      	this.pIdx = len;
      	this.cIdx = null;
      },
      checkUrl(rule, value, callback){
        if (!validate.url(value, rule.ignoreEmpty)) {
          callback(new Error());
        } else {
          callback();
        }
      },
      checkBLen(rule, value, callback){
        if (!validate.string(value, rule.min, rule.max, false, true)) {
          callback(new Error());
        } else {
          callback();
        }
      },
      updateMiniPath(idx) {
        this.currentActiveObj.url = this.comUrls[idx].url;
        this.currentActiveObj.pagepath = this.comUrls[idx].pagepath;
        this.currentActiveObj.appid = this.wxAppInfo.appid;
        this.updateMenu();
			},
      updateMenu() {
        let name = this.currentActiveObj.name;
        if (!name) {
          name = '菜单名称';
				}

				if (this.currentActiveObj.type !== 'miniprogram') {
          delete this.currentActiveObj.pagepath;
          delete this.currentActiveObj.appid;
				}

        this.menuName = name;
        let pIdx = this.pIdx;
        let cIdx = this.cIdx;
        if (typeof(pIdx) === 'number') {
          if (typeof(cIdx) === 'number') {
            this.button[pIdx].sub_button[cIdx] = {...this.currentActiveObj};
            this.button[pIdx].sub_button[cIdx].name = name;
          } else {
            this.button[pIdx] = {...this.currentActiveObj};
            this.button[pIdx].name = name;
          }
        }
			},
      // 选中菜单
      chooseItem(item, index) {
      	this.cancelActiveState();
      	item.showSubButton = true;
      	item.active = true;
      	if (!item.sub_button || item.sub_button.length < 5) {
          item.subAddControl = true;
				}

				if (this.$refs.nameForm) {
          this.$refs.nameForm.resetFields();
				}
        if (this.$refs.linkForm) {
          this.$refs.linkForm.resetFields();
        }

      	this.currentActiveObj = {...item};
        this.menuName = item.name;
      	this.pIdx = index;
        this.cIdx = null;
      },
      // 新增子菜单
      addSubItem(item, index) {
      	this.cancelActiveState();
      	item.showSubButton = true;
      	if (!item.sub_button) {
          item.sub_button = [];
        }
      	let len = item.sub_button.length;
      	if (len >= 4) {
      		 item.subAddControl = false;
      	}
      	let newItem = { name: '子菜单名称', type:'view', urlType: '1', url:'', active: true, subAddControl: true};
      	item.sub_button.push(newItem);

        this.currentActiveObj = {...newItem};
        this.menuName = newItem.name;
        this.pIdx = index;
        this.cIdx = len;
      },
      // 选中子菜单
      chooseSubItem(item, pIdx, cIdx) {
      	this.cancelActiveState();
      	this.button[pIdx].showSubButton = true;
        item.active = true;
        if (this.$refs.nameForm) {
          this.$refs.nameForm.resetFields();
        }
        if (this.$refs.linkForm) {
          this.$refs.linkForm.resetFields();
				}

        this.currentActiveObj = {...item};
        this.menuName = item.name;
        this.pIdx = pIdx;
        this.cIdx = cIdx;
      },
      // 取消选中状态并隐藏子菜单
      cancelActiveState() {
      	this.button.forEach(function(item) {
      		item.active = false;
      		item.showSubButton = false;
      		if (item.sub_button) {
            item.sub_button.forEach(function(subItem) {
              subItem.active = false;
            })
          }
      	})
      },
      // 删除当前选中项
      deleteItem() {
      	this.delDialog = true;
      },
      // 确认删除选中菜单
      confirmDelete() {
      	let pIdx = this.pIdx;
      	let cIdx = this.cIdx;
    		if (typeof(pIdx) === 'number') {
    		  if (typeof(cIdx) === 'number') {
            this.button[pIdx].sub_button.splice(cIdx, 1);
            this.button[pIdx].subAddControl = true;
					} else {
            this.button.splice(pIdx, 1);
					}
				}

      	this.currentActiveObj = null;
        this.menuName = '菜单名称';
      	this.delDialog = false;
      },
      // 选择图文消息
      msgChoose: function(i) {
      	this.choosedMsg = i;
        var _this = this;
        this.bgList.forEach(function(item) {
          if( item !== i ) {
            item.isActive = false;
          }else{
            i.isActive = true;
            _this.selectedBg = i.src || "/static/img/cabinet/clothes.png";
          }  
        })
      },
      // 确认图文消息
      msgConfirm: function() {
      	this.selectedMsg = this.choosedMsg;
      	this.msgVisible = false
      },
      // 选择图片
      imgChoose: function(i) {
      	this.choosedImg = i;
        var _this = this;
        this.bgList2.forEach(function(item) {
          if( item !== i ) {
            item.isActive = false;
          }else{
            i.isActive = true;
            _this.selectedBg = i.src || "/static/img/cabinet/clothes.png";
          }  
        })
      },
      // 确认图片
      imgConfirm: function() {
      	this.selectedImg = this.choosedImg;
      	this.imgVisible = false
      },
			save: function () {
				if (this.button.length == 0) {
				  return;
				}
        for (let i = 0; i < this.button.length; i++) {
					let item = this.button[i];
					if (item.sub_button && item.sub_button.length > 0) {
						for (let j = 0; j < item.sub_button.length; j++) {
						  let subItem = item.sub_button[j];
						  if (!validate.string(subItem.name, 1, 16, false, true)) {
                console.log('err subItem name ' + i + ',' + j);
                this.chooseSubItem(subItem, i, j);
                this.$nextTick(_ => {
                  this.$refs.nameForm.validate(()=>{});
								});
                return;
							} else if ((subItem.type === 'view' || subItem.type === 'miniprogram') &&
                !validate.url(subItem.url, false)) {
                console.log('err subItem url ' + i + ',' + j);
                this.chooseSubItem(subItem, i, j);
                this.$nextTick(_ => {
                  this.$refs.linkForm.validate(()=>{});
                });
                return;
							} else if (subItem.type === 'miniprogram' && (!validate.notEmpty(subItem.appid) || !validate.notEmpty(subItem.pagepath))) {
                console.log('err subItem miniprogram ' + i + ',' + j);
                this.chooseSubItem(subItem, i, j);
                this.$nextTick(_ => {
                  this.$refs.linkForm.validate(()=>{});
                });
                return;
							}
						}
					} else {
					  if (!validate.string(item.name, 1, 8, false, true)) {
					    console.log('err name ' + i);
					    this.chooseItem(item, i);
              this.$nextTick(_ => {
                this.$refs.nameForm.validate(()=>{});
              });
              return;
						} else if ((item.type === 'view' || item.type === 'miniprogram') &&
              !validate.url(item.url, false)) {
              console.log('err url ' + i);
              this.chooseItem(item, i);
              this.$nextTick(_ => {
                this.$refs.linkForm.validate(()=>{});
              });
              return;
						} else if (item.type === 'miniprogram' && (!validate.notEmpty(item.appid) || !validate.notEmpty(item.pagepath))) {
              console.log('err subItem miniprogram ' + i + ',' + j);
              this.chooseItem(item, i);
              this.$nextTick(_ => {
                this.$refs.linkForm.validate(()=>{});
              });
              return;
            }
					}
				}

        this.$store.dispatch('post', {
          uri : 'wxMenu/add',
          data: {
            menuJson: JSON.stringify({"button": this.button})
          }
        }).then(() =>{
          msg.success();
        })
			}
		}
	}
</script>

<style scoped>
	.custom-menu {
		min-width: 1160px; 
	}
	.custom-menu .left-part {
		float: left;
		width: 320px;
	}
	.left-wrapper {
		position: relative;
	}
	.left-wrapper .title {
		position: absolute;
		top: 28px;
		margin: 0 auto;
		left: 0;
		right: 0;
		width: 100%;
		text-align: center;
		color: rgba(255,255,255,0.7);
		font-size: 16px;
	}

	.pre-menu-list {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 50px;
		padding-left: 43px;
		background: url(/static/img/bg_wx_foot.png) no-repeat;
	}
	.pre-menu-item {
		position: relative;
		float: left;
		height: 50px;
		line-height: 50px;
		box-sizing: border-box;
		text-align: center;
	}
	.pre-menu-item:nth-child(3) {
		border-right: 0;
	}
	.pre-menu-item a {
		display: block; 
		width: auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-wrap: normal;
		color: #616161;
		text-decoration: none;
	}
	.pre-menu-item.is-active .pre_menu_link,
	.pre-add-control.is-active {
		border: 1px solid #44b549;
		line-height: 48px; 
		background-color: #fff;
		color: #44b549;
	}
	.sub-menu-box .u-arrow {
		position: absolute;
    left: 50%;
    margin-left: -6px
	}
	.sub-menu-box {
		position: absolute; 
		z-index: 100;
		bottom: 60px;
		left: 0;
		width: 100%;
		border: 1px solid #d0d0d0;
		background-color: #fafafa;
		border-top-width: 0;
		box-sizing: border-box;
	}
	.sub-menu-box .u-arrow-out {
		bottom: -6px;
    display: inline-block;
    width: 0;
    height: 0;
    border-width: 6px;
    border-style: dashed;
    border-color: transparent;
    border-bottom-width: 0;
    border-top-color: #d0d0d0;
    border-top-style: solid;
	}
	.sub-menu-box .u-arrow-in {
    bottom: -5px;
    display: inline-block;
    width: 0;
    height: 0;
    border-width: 6px;
    border-style: dashed;
    border-color: transparent;
    border-bottom-width: 0;
    border-top-color: #fafafa;
    border-top-style: solid
	}
	.sub-menu-item {
		line-height: 44px;
		border: 1px solid transparent;
		margin: 0 -1px -1px;
	}
	.sub-menu-item:first-child {
		border-top: 1px solid #d0d0d0;
	}
	.sub-menu-item a {
		padding: 0 .5em;
	}
	.sub-menu-item.is-active {
		background-color: #fff;
    border: 1px solid #44b549;
    position: relative;
    z-index: 1;
    line-height: 45px;
    *zoom:1
	}
	.sub-menu-item.is-active .icon {
		border-top: 0; 
	}
	.sub-menu-item:hover {
		background-color: #eee;
		border: 1px solid #d0d0d0;
		line-height: 45px;
		cursor: pointer;
	}
	.sub-menu-item.is-active:hover {
		background-color: #fff;
    border: 1px solid #44b549;
	}
	.sub-menu-item:hover:first-child {
		line-height: 44px;
	}
	.sub-menu-item .icon {
		display: block;
		border-top: 1px solid #e7e7eb;
		width: auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-wrap: normal;
		cursor: pointer;
	}
	.sub-menu-item:hover .icon {
		border-top: 0;
	}
	.sub-menu-item:first-child .icon {
		border-top: 0;
	}

	.custom-menu .right-part {
		margin-left: 400px;
		min-width: 700px;
		overflow: hidden;
	}
	.right-content {
		width: 700px;
		min-height: 535px;
		background: #f4f5f9;
	}
	.lh40 {
		line-height: 40px;
	}
</style>

<style scoped>
	.bg-list {
		margin-left: -15px;
		margin-right: -15px;
	}
	.bg-list li {
    float: left;
    margin-left: 15px;
    margin-right: 15px;
    margin-top: 10px;
    width: 100px;
  }
  .msg-img {
  	width: 90px;
  	height: 90px;
  }
  .bg-item + .msg-title {
  	margin-right: 8px;
  }
  .msg-title {
  	white-space:nowrap; 
  	overflow: hidden;
		text-overflow: ellipsis;
  }
  .bg-item {
    position: relative;
    padding: 8px 8px 0 0;
  }
  .bg-item.is-active .ukao-icon-success {
    position: absolute;
    top: 0;
    right: 0;
    width: 18px;
    height: 18px;
    background: #36c924;
    border-radius: 50%;
  }
  .bg-item.is-active .ukao-icon-success:after {
    content: '';
    position: absolute;
    top: 3px;
    left: 6px;
    border: 2px solid #fff;
    box-sizing: content-box;
    border-left: 0;
    border-top: 0;
    height: 8px;
    width: 4px;
    transform: rotate(45deg);
    transition: transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;
    transform-origin: center;
  }
  .selected-msg {
  	width: 143px;
  	position: relative;
  	margin: 0 auto;
  }
  .selected-msg > img {
  	width: 143px;
  	height: 143px;
  }
  .selected-msg .delete-block {
  	position: absolute;
  	right: -36px;
  	bottom: 0;
  	display: inline-block;
  }
</style>