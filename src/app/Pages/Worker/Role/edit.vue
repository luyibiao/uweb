<template>
  <div v-loading="loading">
    <el-form :model="wkRole" ref="ruleForm" label-width="160px">
      <el-form-item label="角色名称" prop="name"
        :rules="[{ required: true, message: '请填写角色名称'}]">
        <div class="w-xl">
          <el-input v-model="wkRole.name" :disabled="disInput()" auto-complete="off"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="序号">
        <div class="w-xl">
          <el-input v-model.number="wkRole.sortNo" :disabled="disInput()" auto-complete="off"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="角色类型" prop="type" :rules="[{ required: true, message: '请选择角色类型'}]">
        <div class="w-xl">
          <template v-if="disInput()">
            {{wkRole.type | getValText('WK_ROLE_TYPE')}}
          </template>
          <el-select v-else v-model="wkRole.type">
            <el-option v-for="item in wkRoleTypes"
                       :key="item.index"
                       :label="item.text"
                       :value="item.val">
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="备注">
        <div class="w-xl">
          <el-input type="textarea" :disabled="disInput()" v-model="wkRole.remark"></el-input>
        </div>
      </el-form-item>

      <div class="dashed-line m-b-lg m-t-lg"></div>

      <el-form-item v-if="wkRole.type == 1 || wkRole.type == 5">
        <div class="clearfix b-b text-center" style="padding-bottom: 10px;">
          <span class="text-md m-r-xl">选择权限</span>
        </div>
      </el-form-item>

      <el-checkbox-group v-if="wkRole.type == 1 || wkRole.type == 5" v-model="permIds" @change="changePerm">
      <el-form-item v-if="perm.type===1" v-show="perm.isShow" :label="perm.name" v-for="perm in permList" :key="perm.id">
      <!--<el-form-item v-if="perm.type===1" :label="perm.name" v-for="perm in permList" :key="perm.id">-->
        <ul class="b-b item-list clearfix" >
          <li class="item" v-for="item in perm.permissionList" v-show="item.isShow" :key="item.id">
          <!--<li class="item" v-for="item in perm.permissionList" :key="item.id">-->
            <el-checkbox :label="item.id" :disabled="chkDisabled(item.id)">{{item.name}}</el-checkbox>
            <!--<el-checkbox :label="item.id" :disabled="chkDisabled(item.id)">{{ item.id + '-' + item.name}}</el-checkbox>-->
          </li>
        </ul>
        <div v-for="child in perm.children" v-show="child.isShow" :key="child.id">
        <!--<div v-for="child in perm.children" :key="child.id">-->
          <ul class="b-b item-list clearfix" >
            <li class="item" v-for="c in child.permissionList" v-show="c.isShow" :key="c.id">
            <!--<li class="item" v-for="c in child.permissionList" :key="c.id">-->
              <el-checkbox :label="c.id" :disabled="chkDisabled(c.id)">{{c.name}}</el-checkbox>
              <!--<el-checkbox :label="c.id" :disabled="chkDisabled(c.id)">{{c.id + '-' + c.name}}</el-checkbox>-->
            </li>
          </ul>
          <div v-for="three in child.children" v-show="three.isShow" :key="three.id" class="m-l-md">
          <!--<div v-for="three in child.children" :key="three.id" class="m-l-md">-->
            <ul class="b-b item-list clearfix">
              <li class="item" v-for="t in three.permissionList" v-show="t.isShow" :key="t.id">
              <!--<li class="item" v-for="t in three.permissionList" :key="t.id">-->
                <el-checkbox :label="t.id" :disabled="chkDisabled(t.id)">{{t.name}}</el-checkbox>
                <!--<el-checkbox :label="t.id" :disabled="chkDisabled(t.id)">{{t.id + '-'+ t.name}}</el-checkbox>-->
              </li>
            </ul>
          </div>
        </div>
      </el-form-item>
      </el-checkbox-group>

      <el-form-item>
        <router-link to="/worker/role/list"><el-button>取消</el-button></router-link>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="danger" v-if="wkRole.id && wkRole.mercId > 0" @click="del">删除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import keyval from '@/utils/dickeyval';
  import msg from '@/utils/msg';

	export default {
    data() {
			return {
			  wkRoleTypes : keyval.WK_ROLE_TYPE_ADD,
        loading: true,
				wkRole: {
				  id:'',
          mercId: '',
          name: '',
          num: '',
          remark: ''
        },
        // 品牌员工不可选权限
        disPermId : [17,18,19,20,22,23,527,91,530,370,375,380,357,
          5,33,34,35,36,37,60,93,94,78,21,6,240,241,381,353,354,355,356,
          38,39,41,42,10,12,79,522,523,526,529,238,335,358,359,360,361,
          362,363,364,210,211,212,230,231,232,233,234,235,236,237,201,
          270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,
          285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,
          300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,
          315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,
          330,331,332,333,207,225,57,64,65,351,95
        ],
        chgPerm: false,
        permIds:[],
        permList:[]
			}
		},
		created() {
      let id = this.$route.query.id;
      if (id) {
        this.detail(id);
      } else {
        this.queryMenuPerms();
      }
		},
		methods: {
      queryMenuPerms() {
        this.$store.dispatch('post', {
          uri: 'wkPermission/queryTempPerms',
        }).then((res) => {
          let data = res.data.data;
          if (data) {
            this.permList = data.permList || [];
            this.permIds = data.permIds || [];
          }
          this.loading = false;
          this.chgPerm = true;
        });
      },
		  detail(id) {
        this.$store.dispatch('post', {
          uri : 'wkRole/detail',
          data: {id}
        }).then((res) =>{
          let data = res.data.data;
          if (data) {
            this.wkRole = data.info;
            this.permList = data.permList || [];
            this.permIds = data.permIds || [];
          }
          this.loading = false;
        })
      },
      disInput() {
        let wkRole = this.wkRole;
        let dis = false;
        if (wkRole.id && wkRole.mercId <= 0) {
          dis = true;
        }
        return dis;
      },
      chkDisabled(permId) {
        let wkRole = this.wkRole;
        let dis = false;
        let disPermId = this.disPermId;
        if (wkRole && wkRole.type != 5) {
          for (let i = 0; i < disPermId.length; i ++) {
            if (disPermId[i] == permId) {
              dis = true;
              break;
            }
          }
        }
        return dis;
      },
      changePerm() {
		    this.chgPerm = true;
      },
      save() {

        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {

            let url = 'wkRole/add';
            if (this.wkRole.id) {
              url = 'wkRole/update';
            }

            let wkRole = this.wkRole;
            wkRole.createTime = null;
            wkRole.updateTime = null;

            let permIds = null;
            if (this.chgPerm) {

              // 删除禁用权限
              let permIdList = [];
              let permList = this.permIds;
              if (wkRole.type != 5) {
                let disPermId = this.disPermId.slice(0);// 拷贝数组
                for (let j = 0; j < permList.length; j ++) {
                  let addFlag = true;
                  for (let i = 0; i < disPermId.length; i ++) {
                    if (disPermId[i] == permList[j]) {
                      disPermId.splice(i,1);
                      addFlag = false;
                      break;
                    }
                  }
                  if (addFlag) {
                    permIdList.push(permList[j]);
                  }
                }
                this.permIds = permIdList;
              } else {
                permIdList = this.permIds;
              }

              permIds = permIdList.join(",");
            }

//            console.log(permIds);
//            return ;
            this.$store.dispatch('post', {
              uri: url,
              data: {
                ...this.wkRole,
                permIds: permIds
              }
            }).then((res) => {
              msg.success();
              this.$router.push({ path: '/worker/role/list' });
            })

          } else {
            console.log('fail !');
          }
        });
      },
      del() {
        let _this = this;
        msg.confirm({msg: '确认删除此角色', confirmFn: function(){
          _this.$store.dispatch('post', {
            uri : 'wkRole/delete',
            data: {
              id: _this.wkRole.id
            }
          }).then((res) =>{
            msg.success();
            _this.$router.push({ path: '/worker/role/list' })
          })
        }});
      }
    }
	}
</script>

<style scoped>
	.dashed-line {
		border-top: 1px dashed #ccc;
	}
	.item-list .item {
		float: left;
		width: 160px;
		margin-right: 15px;
		padding-bottom: 12px;
	}
	.el-form-item {
		margin-bottom: 12px;
	}
</style>