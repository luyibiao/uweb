<style lang="less" scoped>
  .description {
    display: inline-block;
    padding: 15px 20px;
    border-radius: 8px;
    background: #f3f7ff;
  }
  .printcontent {
    display: inline-block;
    width: 300px;
    word-wrap: break-word;
    text-align: left;
  }
  .printbtn {
    margin-top: -5px;
  }
  .el-input-t{
    width: 75%;
  }
  .select  div{
    padding-bottom: 10px;
  }
  .select h4{
    padding-bottom: 5px;
  }

  .test_ellipsis{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
</style>
<template>
  <div>
    <div class="m-t" style="display: flex;">
      <div style="border: 1px solid #dee5e7;font-size: 12px;padding: 20px 10px;margin-right: 60px;border-radius: 4px;box-shadow: rgb(222, 229, 231) 0px 0px 1px;;width: 268px">
        <div class="text-center" v-if="mercLogoFlag">
          <template v-if="customMercLogo && printMercLogo">
            <img style="width: 50px;" :src="printMercLogo"/>
          </template>
          <template v-else>
            <img style="width: 50px;" :src="logoPath"/>
          </template>
        </div>
        <div class="text-center test_ellipsis" style="font-size: 18px;" v-if="mercNameFlag" >{{printMercName}}</div>
        <div class="text-center" style="font-size: 18px;padding: 5px 0" v-if="storeNameFlag">门店名称</div>
        <div class="text-center">18102294130591</div>
        <div class="text-center" v-if="!clothesCodeFlag"><img style="width: 200px;height: 50px;" src="/static/img/setprint/bar_code.png" ></div>
        <div class="text-center" v-else=""><img style="width: 60px;" src="/static/img/setprint/QR_code.png"></div>
        <div style="border-bottom: 1px solid #000;padding-bottom: 5px">
          <div style="display: flex;justify-content:space-between;  align-items: center;"><div>入库：03-15 13:08:45</div> <div>衣物1,附件0</div></div>
          <div>取件方式：上门取件 张三（自营）</div>
          <div>送件方式：上门送件 张三（自营）</div>
        </div>
        <div style="border-bottom: 1px solid #000;padding: 5px 0">
          <table class="table">
            <tr><td style="width: 30px;">T恤</td><td style="width: 124px;">1012016141185</td><td></td><td class="text-right" style="width: 53px">￥20.00</td></tr>
            <tr><td></td><td>￥10.00*80%</td> <td>挂点：输1</td><td class="text-right" style="width: 53px">滑 1824</td></tr>
            <tr><td></td><td>加急12.00元</td><td></td><td></td></tr>
            <tr><td></td><td>白色/磨损/起球/勾丝...</td><td></td><td></td></tr>
          </table>
        </div>
        <div class="text-right" style="border-bottom: 1px solid #000;padding: 5px 0">
          <div>衣物总额：  20.00</div>
          <div>取送费：  10.00</div>
          <div>优惠券：  -5.00</div>
          <div>已付金额：  25.00</div>
        </div>
        <div style="border-bottom: 1px solid #000;padding: 5px 0">
          客户备注：明天中午在家，取件请提前打电话
        </div>
        <div style="border-bottom: 1px solid #000;padding: 5px 0">
          <p style="font-size: 13px;color: black">客户：<span v-if="phoneFlag">13812341234</span><span v-else="">138****1234</span>  斑马的猫</p>
          <p>卡号： <span v-if="userCardFlag">098077259</span><span v-else="">098***259</span></p>
          <p>折扣： 多折扣     <span v-if="balanceFlag" class="m-l-md">余额: ￥13474.79</span></p>
          <p>地址： 湖南省长沙市岳麓区枫林路18号金鹌园小区7栋403</p>
        </div>
        <div style="padding: 5px 0">
          <p>微信号：twash_cn</p>
          <p>服务电话：0731-89748960</p>
          <div v-if="billTipFlag">注意事项：
            <p class="test_ellipsis">
              {{billTip}}
            </p>
          </div>
          <p>客户签名：</p>
        </div>
        <div class="text-center"><img style="width: 80px;" src="/static/img/setprint/QR_code.png"></div>
        <div class="text-center">微信扫码关注，了解更多</div>
      </div>
      <div class="select">
        <div>
          <h4>商家logo</h4>
          <el-radio-group v-model="mercLogoFlag" >
            <el-radio :label="1" style="width: 100px">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
          <div v-if="mercLogoFlag">
            <h4>是否自定义商家logo</h4>
            <el-radio-group v-model="customMercLogo" >
              <el-radio :label="1" style="width: 100px">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
            <Uploader v-if="customMercLogo" class="u-avatar-uploader"
                      tip="建议尺寸为500*100像素或正方形，只支持jpg、png、jpeg格式，且大小不超过2M"
                      :path="printMercLogo"
                      size="2048"
                      accept="image"
                      :beforeFn="beforeUpload"
                      :successFn="successFn" />
          </div>
        </div>
        <div>
          <h4>商家名称</h4>
          <el-radio-group v-model="mercNameFlag">
            <el-radio :label="1" style="width: 100px">显示</el-radio>
            <el-radio :label="0">隐藏商家名称</el-radio>
          </el-radio-group>
          <div>
            <el-input v-model="printMercName" placeholder="请输入内容" style="width: 300px;"></el-input>
          </div>

        </div>
        <div>
          <h4>门店名称</h4>
          <el-radio-group v-model="storeNameFlag">
            <el-radio :label="1" style="width: 100px">显示</el-radio>
            <el-radio :label="0">隐藏门店名称</el-radio>
          </el-radio-group>
        </div>
        <div>
          <h4>订单条码</h4>
          <el-radio-group v-model="clothesCodeFlag" >
            <el-radio :label="0" style="width: 100px">显示条形码</el-radio>
            <el-radio :label="1">显示二维码</el-radio>

          </el-radio-group>
          <p style="margin-left: 130px;" class="text-xs text-danger">安卓一体收银机USB连接的小票打印机不支持打印二维码</p>
        </div>
        <div>
          <h4>手机号</h4>
          <el-radio-group v-model="phoneFlag" >
            <el-radio :label="1" style="width: 100px">显示手机号</el-radio>
            <el-radio :label="0">隐藏手机中间4位</el-radio>
          </el-radio-group>
        </div>
        <div>
          <h4>会员卡号</h4>
          <el-radio-group v-model="userCardFlag" >
            <el-radio :label="1" style="width: 100px">显示卡号</el-radio>
            <el-radio :label="0">隐藏卡号中间3位</el-radio>
          </el-radio-group>
        </div>
        <div>
          <h4>余额</h4>
          <el-radio-group v-model="balanceFlag" >
            <el-radio :label="1" style="width: 100px">显示余额</el-radio>
            <el-radio :label="0">隐藏余额</el-radio>
          </el-radio-group>
        </div>
        <div>
          <h4>小票注意事项</h4>
          <el-radio-group v-model="billTipFlag" >
            <el-radio :label="1" style="width: 100px">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
          <div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4}"
              placeholder="请填写小票注意事项...."
              style="width:300px;"
              v-model="billTip">
            </el-input>
          </div>
        </div>
        <el-button type="primary" :loading="saving" @click="update">保存</el-button>
      </div>
    </div>

  </div>
</template>
<script>
  import consts from "@/utils/consts";
  import msg from "@/utils/msg";
  import auth from '@/utils/auth';
  import Uploader from "@/components/Uploader";

  export default {
    data() {
      return {
        saving: false,
        printset: "printcontent",
        logoPath:'',
        printMercLogo:'',
        printMercName:'',
        billTip:'',
        mercLogoFlag: 0,
        mercNameFlag: 0,
        storeNameFlag: 0,
        clothesCodeFlag: 0,
        phoneFlag: 0,
        userCardFlag: 0,
        balanceFlag: 0,
        billTipFlag: 0,
        customMercLogo: 0,
      };
    },
    created() {
      let mercInfo = auth.getMercInfo();
      this.printMercName = mercInfo.name;
      this.logoPath = mercInfo.logoPath;
      this.getContent();
    },
    methods: {
      update() {
        let orderConfig = ''+this.phoneFlag;
        orderConfig += this.userCardFlag;
        orderConfig += this.balanceFlag;
        orderConfig += this.clothesCodeFlag;
        orderConfig += this.mercLogoFlag;
        orderConfig += this.mercNameFlag;
        orderConfig += this.storeNameFlag;
        orderConfig += this.customMercLogo;
        this.$store
          .dispatch("post", {
            uri: "mercCityParam/update",
            data: {
              billTip: this.billTip,
              billTipEnable: this.billTipFlag,
              orderConfig: orderConfig,
              printMercName: this.printMercName,
              printMercLogo: this.printMercLogo,
            }
          })
          .then(res => {
            msg.success();
            this.getContent();
          });
      },
      getContent() {
        this.$store
          .dispatch("post", {
            uri: "mercCityParam/detail",
            data: {}
          })
          .then(res => {
            this.billTip = res.data.data.billTip || '本店清洗的衣物凭票领取衣服，超时未取收取费用';
            let orderConfig = res.data.data.orderConfig;
            let num = 7 - orderConfig.length;
            if(num > 0){
              for(let i = 0 ; i < num; i++){
                orderConfig = orderConfig + '0'
              }
            }
            this.printMercName = res.data.data.printMercName ? res.data.data.printMercName : this.printMercName;
            this.printMercLogo = res.data.data.printMercLogo;

            let orderConfigArr = orderConfig.split('').map(Number);
            //第一位是否显示完整手机号，第二位是否显示卡号，第三位是否显示余额，第四位是否显示条形码，第五位是否显示商家log，第六位是否显示商家名称，第七位是否显示门店名称
            this.phoneFlag = orderConfigArr[0] ;
            this.userCardFlag = orderConfigArr[1];
            this.balanceFlag = orderConfigArr[2];
            this.clothesCodeFlag = orderConfigArr[3];
            this.mercLogoFlag = orderConfigArr[4];
            this.mercNameFlag = orderConfigArr[5];
            this.storeNameFlag = orderConfigArr[6];
            this.customMercLogo = orderConfigArr[7];
            this.billTipFlag = res.data.data.billTipEnable;
          });
      },
      beforeUpload() {
        this.saving = true;
      },
      successFn(file) {
        if (file && file[0]) {
          this.printMercLogo = file[0];
        }
        this.saving = false;
      }
    },
    components: {
      Uploader
    },
  };
</script>
>