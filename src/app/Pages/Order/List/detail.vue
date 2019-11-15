<template>
	<div>
		<div v-loading="loading">
			<div class="module-business-progress b-a m-t-lg" v-if="progress.length">
				<img v-if="stampSuccess >= progress.length-2" class="thumb-md" src="/static/img/stamp_success.png" alt="">
        <ul>
          <li v-for="(item , index) in progress" :key="index" :class="{'inactive':index > stampSuccess }">
            <div class="top-text">
              <p class="title">{{item.showText}}</p>
            </div>
            <div class="b-progress">
              <span></span>
            </div>
            <div class="bottom-text text-muted" >
              <div>
                {{item.createTime | getDate(item.createTime)}}
                {{item.createTime | getTime(item.createTime)}}
              </div>
            </div>
          </li>
        </ul>
      </div>

      <table class="order-detail-tb m-t-lg b-a w-full">
        <tr>
          <td class="b-r wrapper" style="width:50%">
            <div class="order-info">
              <p class="detail-title clearfix"><span class="text-md">订单信息</span><a class="text-primary pull-right">打印订单</a></p>
              <ul class="order-list">
                <li><span class="title">订单号：</span>
                  <p class="text">{{orderInfo.orderNo}}
                    <!--<span class="text-warning light m-l">微信扫码取件</span>-->
                  </p>
                </li>
                <li><span class="title">服务项目：</span><p class="text">{{orderInfo.businessStr}}</p></li>
                <li><span class="title">下单渠道：</span>
                  <p class="text">{{orderInfo.originText}}
                    <!--<span class="line-text m-l">取件秘钥： </span>-->
                  </p>
                </li>
                <li><span class="title">订单模式：</span><p class="text">{{orderInfo.modeText}}</p></li>
                <li><span class="title">计价方式：</span><p class="text">{{orderInfo.pricingMode | getValText('PRICING_MODE')}}</p></li>
                <li><span class="title">下单件数：</span><p class="text">{{orderInfo.createCnt || 0}}</p></li>
                <li><span class="title">衣物数量：</span><p class="text" v-if="productList">{{productList.length || '-'}}</p></li>
                <li><span class="title">所属门店：</span><p class="text">{{orderInfo.storeName || '-'}}</p></li>
                <li><span class="title">门店架号：</span><p class="text">-</p></li>
                <li><span class="title">运单编号：</span><p class="text">{{orderInfo.transNo || '-'}}</p></li>
                <li><span class="title">工厂运单号：</span><p class="text">{{orderInfo.factoryTransNo || '-'}}</p></li>
              </ul>
                <div class="line-dashed"></div>
                <ul class="order-list">
                  <li><span class="title">取件方式：</span><p class="text">{{orderInfo.takeModeText}}</p></li>
                  <template v-if="orderInfo.takeMode ==2">
                    <li><span class="title">取件时间：</span><p class="text">{{orderInfo.takeDate}}&nbsp;{{orderInfo.takeTimeStart}}-{{orderInfo.takeTimeEnd}}<template v-if="orderInfo.isEnableUpdateTakeAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckTime(0)">修改</a></auth></template></p></li>
                    <li><span class="title">取件信息：</span><p class="text">{{orderInfo.takeAddress}}，{{orderInfo.takeName}}，{{orderInfo.takePhone}}<template v-if="orderInfo.isEnableUpdateTakeAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckAddress(0)">修改</a></auth></template></p></li>
                  </template>
                  <template v-if="orderInfo.takeMode ==3">
                    <li><span class="title">取件信息：</span><p class="text">{{orderInfo.takeAddress}}【{{orderInfo.takeCupName||'无智柜名称'}}】，{{orderInfo.takeName}}，{{orderInfo.takePhone}}</p></li>
                    <li>
                      <span class="title">开箱码：</span>
                      <p class="text">{{orderInfo.bookCode || '-'}}</p>
                    </li>
                    <li>
                      <span class="title">箱格：</span>
                      <p class="text">{{orderInfo.takeCupboardDoor || '-'}}</p>
                    </li>
                  </template>
                </ul>

                <div class="line-dashed"></div>
                <ul class="order-list">
                  <li><span class="title">送件方式：</span><p class="text">{{orderInfo.sendModeText}}<auth perm="order.list.update"><a class="m-l text-primary" @click="updateSendMode(1)">修改</a></auth></p></li>
                  <template v-if="orderInfo.sendMode ==2">
                    <li><span class="title">送件时间：</span><p class="text">{{orderInfo.sendDate}}&nbsp;{{orderInfo.sendTimeStart}}-{{orderInfo.sendTimeEnd}} <template v-if="orderInfo.isEnableUpdateSendAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckTime(1)">修改</a></auth></template></p></li>
                    <li><span class="title">送件信息：</span><p class="text">{{orderInfo.sendAddress}}，{{orderInfo.sendName}}，{{orderInfo.sendPhone}}<template v-if="orderInfo.isEnableUpdateSendAddressTime"><auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckAddress(1)">修改</a></auth></template></p></li>
                  </template>
                  <template v-if="orderInfo.sendMode ==3">
                    <li><span class="title">送件信息：</span><p class="text">{{orderInfo.sendAddress}}【{{orderInfo.sendCupName ||'无智柜名称'}}】，{{orderInfo.sendName}}，{{orderInfo.sendPhone}}<auth perm="order.list.update"><a class="m-l text-primary" @click="startCheckAddress(1)">修改</a></auth></p></li>
                    <li>
                      <span class="title">箱格：</span>
                      <p class="text">{{orderInfo.sendCupboardDoor || '-'}}</p>
                    </li>
                  </template>
                </ul>
            </div>
          </td>
          <td class="wrapper" style="width:50%">
            <div class="pay-info">
              <p class="detail-title"><span class="text-md">付款信息</span></p>
              <div class="b-a b-success" v-if="orderInfo.payStatus === 1 || orderInfo.payStatus === 3 || orderInfo.payStatus === 4">
                <p class="bg-success wrapper text-xl text-center">已付款</p>
                <ul class="order-list wrapper">
                  <template v-for="(item,index) in orderPayTradeList">
                    <li><span class="title">付款方式：</span><p class="text">{{item.payMethodText}}<template v-if="item.agentPay==1">-代销</template></p></li>
                    <li><span class="title">支付流水号：</span><p class="text">{{item.seq}}</p></li>
                    <li><span class="title">付款金额：</span><p class="text">￥{{item.amount | amtFormat}}</p></li>
                    <li><span class="title">付款时间：</span><p class="text">{{item.tradeTime|getDate}} {{item.tradeTime|getTime}}</p></li>
                    <li><span class="title">操作人：</span><p class="text">{{item.workName}}</p></li>
                  </template>
                  <li class="m-t-sm">
                    <span class="title">衣物总额：</span>
                    <p class="text" v-if="orderInfo.valuationPrice !== null">￥{{orderInfo.valuationPrice | amtFormat}}</p>
                    <p class="text" v-else>￥{{orderInfo.orderPrice || 0 | amtFormat}}</p>
                  </li>
                  <li><span class="title">取件费：</span><p class="text">￥{{orderInfo.takeCarriage | amtFormat}}</p></li>
                  <li><span class="title">送件费：</span><p class="text">￥{{orderInfo.sendCarriage | amtFormat}}</p></li>
                  <li class="text-danger" v-if="orderInfo.isModifyPrice">
                    <span class="title">修改金额：</span>
                    <p class="text">￥{{orderInfo.modifyPrice | amtFormat}}</p>
                  </li>
                  <li><span class="title">优惠券：</span><p class="text">-￥{{orderInfo.couponAmt || 0 | amtFormat}}</p></li>
                  <li>
                    <span class="title">实付金额：</span>
                    <p class="text">
                      <span>￥{{orderInfo.paymentPrice | amtFormat}} <span class="bg-danger ts-icon" v-if="orderInfo.creditStatus == 1">赊</span></span>
                      <router-link v-if="orderInfo.refundStatus !== 0" class="text-primary m-l-sm" :to="`/order/list/refund/${orderInfo.id}?orderNo=${orderInfo.orderNo}`">有退款记录</router-link>
                    </p>
                  </li>
                </ul>
              </div>

              <div class="b-a b-danger" v-else>
                <p class="text-danger bg-danger light wrapper text-xl text-center">未付款</p>
                <div class="wrapper b-t b-danger">应付总额：
                  <span v-if="orderInfo.paymentPrice !== null">
                    <span class="text-danger m-r">￥{{orderInfo.paymentPrice | amtFormat}} <span class="bg-danger ts-icon" v-if="orderInfo.creditStatus == 1">赊</span></span>
                   <!--<el-button>收款</el-button>-->
                  </span>
                  <span class="text-muted" v-else>
                    计算中
                  </span>
                  <auth perm="order.list.chgamt">
                    <el-button type="small" @click="showModifyDialog(orderInfo)" v-if="orderInfo.isEnableModifyPrice">修改金额</el-button>
                  </auth>
                </div>
                <!--<div class="text-danger credited_css" style="padding-left: 15px; font-size: 16px; padding-bottom: 10px" v-if="orderInfo.creditStatus == 1"><span class="bg-danger ts-icon">赊</span></div>-->
              </div>

              <p class="detail-title m-t" v-if="orderInfo.creditStatus == 1"><span class="text-md">赊账备注:</span></p>
              <div class="b-a" style="padding: 30px;padding-left: 15px;padding-top: 15px;" v-if="orderInfo.creditStatus == 1">
                <div class="" >{{orderInfo.creditRemark || '无'}}</div>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <table class="order-detail-tb m-t-lg b-a w-full">
        <tr>
          <td style="width:20%" class="b-r">
            <div class="client-remark wrapper">
              <p class="detail-title"><span class="text-md">用户备注</span></p>
              <p class="text-warning light">{{orderInfo.userRemark}}</p>
            </div>
          </td>
          <td style="width:20%" class="b-r">
            <div class="manager-remark wrapper">
              <p class="detail-title"><span class="text-md">管理备注</span><auth perm="order.list.remark"><el-button size="mini" class="pull-right" @click="mercRemark(orderInfo)">备注</el-button></auth></p>
              <p class="text-danger light">{{orderInfo.remark}}</p>
              <template v-if="orderInfo.rList && orderInfo.rList.length>0">
                <el-table :data="orderInfo.rList" size="mini" :show-header="false" style="width: 100%" max-height="250">
                  <el-table-column fixed prop="createTime" width="85"></el-table-column>
                  <el-table-column prop="remark"></el-table-column>
                  <el-table-column prop="workName" width="60"></el-table-column>
                </el-table>
              </template>
            </div>
          </td>
          <td style="width:20%" class="b-r">
            <div class="client-info wrapper">
              <p class="detail-title"><span class="text-md">客户信息</span></p>
              <ul class="order-list">
                <li><span class="title">姓名：</span>
                  <p class="text text-primary">
                    <img
                      style="vertical-align: middle;width: 14px; margin-right: 1px"
                      :src="user.grade == 1 ? '/static/img/user/crown_blue.png' :
												 user.grade == 2 ? '/static/img/user/crown_yellow.png' :
												  user.grade == 3 ? '/static/img/user/crown_purple.png'  : ''"
                      />
                    <a target="_blank" :href="'/client/list/'+user.id+'/basic'" class="text-primary">{{user.name || ''}}</a>
                  </p>
                </li>
                <li><span class="title">手机号：</span>
                  <p class="text text-primary">
                    <a target="_blank" :href="'/client/list/'+user.id+'/basic'" class="text-primary">{{user.phone || ''}}</a>
                  </p>
                </li>
                <li><span class="title">会员卡：</span>
                  <p class="text text-primary">
                    <a target="_blank" :href="'/client/list/'+user.id+'/basic'" class="text-primary">{{user.cardNo}}</a>
                  </p>
                </li>
                <li><span class="title">会员等级：</span>
                  <p class="text">
                    {{orderInfo.cardName || user.cardName}} （{{orderDiscount}}）
                  </p>
                </li>
                <!--<li><span class="title">消费次数：</span><p class="text">{{user.ext.payCnt}}次</p></li>-->
                <li><span class="title">客户余额：</span><p class="text">{{user.balance | amtFormat}}元</p></li>
                <li><p class="dis-inline" v-if="orderInfo.unionName"><span class="group-ico">团</span>{{orderInfo.unionName}}</p></li>
              </ul>
            </div>
          </td>
          <td style="width:20%" class="b-r">
            <div class="getter wrapper">
              <p class="detail-title"><span class="text-md">收件员/服务商信息</span> <a class="text-primary pull-right" v-if="orderInfo.takeMode == 2 && (orderInfo.takeWorkId || takeExpressInfo.expressStatus == -1) && orderInfo.statusVal < 5" @click="startCheckStaff(0)">修改</a></p>
              <div v-if="orderInfo.takeWorkId">
                <div><img class="thumb-md img-circle" :src="orderInfo.takeWorkImg || '/static/img/work/def.png'" alt=""></div>
                <ul class="order-list">
                  <li><span class="title">姓名：</span><p class="text">{{orderInfo.takeWorkName}}</p></li>
                  <li><span class="title">手机号：</span><p class="text">{{orderInfo.takeWorkPhone}}</p></li>
                  <li><span class="title">工号：</span><p class="text">{{orderInfo.takeWorkCode}}</p></li>
                </ul>
              </div>
              <template v-if="orderInfo.takeExpressNo">
                <div><img class="thumb-md img-circle" src="/static/img/marketing/sf_logo.png" alt=""></div>
                <el-popover
                  placement="bottom"
                  width="500"
                  @show="queryExpressStatus(orderInfo.takeExpressNo, orderInfo.takeExpressType, 1)"
                  trigger="click">
                  <ul class="order-list">
                    <template v-if="takeExpressStatusList.length > 0">
                      <li v-for="item in takeExpressStatusList"><span class="title m-r-sm">{{item.createTime | getDate}} {{item.createTime | getTime}}</span><p class="text" style="margin-left: 140px">{{item.remark}}</p></li>
                    </template>
                    <template v-else>
                      <li class="text-center">暂无记录</li>
                    </template>
                  </ul>
                  <div slot="reference"><el-button type="text">{{orderInfo.takeExpressType | getValText('EXPRESS_TYPE')}}：{{orderInfo.takeExpressNo}}</el-button></div>
                </el-popover>
                <ul class="order-list">
                  <li v-if="takeExpressInfo.expressStatus == -1"><span class="title text-danger">派单失败：</span><p class="text text-danger">{{takeExpressInfo.failRemark}}</p></li>
                  <li v-if="takeExpressInfo.takeWorkPhone"><span class="title">取件员：</span><p class="text">{{takeExpressInfo.takeWorkPhone}} {{takeExpressInfo.takeWorkName||''}}</p></li>
                  <li v-if="takeExpressInfo.sendWorkPhone"><span class="title">送件员：</span><p class="text">{{takeExpressInfo.sendWorkPhone}} {{takeExpressInfo.sendWorkName||''}}</p></li>
                  <li v-if="takeExpressInfo.parcelCnt"><span class="title">包裹件数：</span><p class="text">{{takeExpressInfo.parcelCnt}}</p></li>
                  <li v-if="takeExpressInfo.weight"><span class="title">计费重量：</span><p class="text">{{takeExpressInfo.weight | kgFormat}}kg</p></li>
                  <li v-if="takeExpressInfo.amount"><span class="title">运费：</span><p class="text">{{takeExpressInfo.amount | amtFormat}}</p></li>

                </ul>
              </template>
              <div v-if="!orderInfo.takeExpressType && orderInfo.takeMode == 2 && !orderInfo.takeWorkId && orderInfo.statusVal < 3">
                <auth perm="order.list.assign">
                 <div class="m-t-xs"><el-button @click="startCheckStaff(0)">指派收件员</el-button></div>
                </auth>
              </div>
            </div>
          </td>
          <td style="width:20%">
            <div class="sender wrapper">
              <p class="detail-title">
                <span class="text-md">送件员/服务商信息</span>
                <el-button class="pull-right m-l-xs" type="danger" size="small" v-if="orderInfo.statusVal == 41" plain @click="cancelSend()">撤销</el-button>
                <el-button class="pull-right" type="primary" size="small" v-if="orderInfo.sendMode == 2 && orderInfo.sendWorkId && orderInfo.statusVal <= 41" plain @click="startCheckStaff(1)">修改</el-button>
              </p>
              <div v-if="orderInfo.sendWorkId">
                <div><img class="thumb-md img-circle" :src="orderInfo.sendWorkImg || '/static/img/work/def.png'" alt=""></div>
                <ul class="order-list">
                  <li><span class="title">姓名：</span><p class="text">{{orderInfo.sendWorkName}}</p></li>
                  <li><span class="title">手机号：</span><p class="text">{{orderInfo.sendWorkPhone}}</p></li>
                  <li><span class="title">工号：</span><p class="text">{{orderInfo.sendWorkCode}}</p></li>
                </ul>
              </div>
              <template v-if="orderInfo.sendExpressNo">
                <div><img class="thumb-md img-circle" src="/static/img/marketing/sf_logo.png" alt=""></div>
                <el-popover
                  placement="bottom"
                  width="500"
                  @show="queryExpressStatus(orderInfo.sendExpressNo, orderInfo.sendExpressType, 2)"
                  trigger="click">
                  <ul class="order-list">
                    <template v-if="sendExpressStatusList.length > 0">
                      <li v-for="item in sendExpressStatusList"><span class="title m-r-sm">{{item.createTime | getDate}} {{item.createTime | getTime}}</span><p class="text" style="margin-left: 140px">{{item.remark}}</p></li>
                    </template>
                    <template v-else>
                      <li class="text-center">暂无记录</li>
                    </template>
                  </ul>
                  <el-button slot="reference" type="text">{{orderInfo.sendExpressType | getValText('EXPRESS_TYPE')}}：{{orderInfo.sendExpressNo}}</el-button>
                </el-popover>
                <ul class="order-list">
                  <li v-if="sendExpressInfo.takeWorkPhone"><span class="title">取件员：</span><p class="text">{{sendExpressInfo.takeWorkPhone}} {{sendExpressInfo.takeWorkName||''}}</p></li>
                  <li v-if="sendExpressInfo.sendWorkPhone"><span class="title">送件员：</span><p class="text">{{sendExpressInfo.sendWorkPhone}} {{sendExpressInfo.sendWorkName||''}}</p></li>
                  <li v-if="sendExpressInfo.parcelCnt"><span class="title">包裹件数：</span><p class="text">{{sendExpressInfo.parcelCnt}}</p></li>
                  <li v-if="sendExpressInfo.weight"><span class="title">计费重量：</span><p class="text">{{sendExpressInfo.weight | kgFormat}}kg</p></li>
                  <li v-if="sendExpressInfo.amount"><span class="title">运费：</span><p class="text">{{sendExpressInfo.amount | amtFormat}}</p></li>
                </ul>
							</template>
              <div v-if="!orderInfo.sendExpressType && orderInfo.sendMode == 2 && !orderInfo.sendWorkId && orderInfo.statusVal < 41">
                <auth perm="order.list.assign">
                 <div class="m-t-xs"><el-button @click="startCheckStaff(1)">指派送件员</el-button></div>
                </auth>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <table  class="order-detail-tb m-t-lg b-a w-full">
        <tr>
          <td class="wrapper b-r" style="width:60%">
            <div class="order-track">
              <p class="detail-title"><span class="text-md">订单跟踪</span></p>
              <ul class="track-list" v-if="orderInfo.statusList">
                <li :class="{'text-success': index == 0 }" v-for="(item, index) in orderInfo.statusList" :key="item.id">
                  <div class="content">
                    <span class="pull-left">{{item.createTime | getDate}} {{item.createTime | getTime}}</span>
                    <span class="operator pull-right" v-if="item.createBy == 0">客户</span>
                    <span class="operator pull-right" v-if="item.createBy == -1">系统</span>
                    <span class="operator pull-right" v-if="item.createBy > 0 ">{{item.workName}}</span>
                    <span class="operator pull-right" >{{item.statusDesc}}</span>
                    <p class="text">{{item.statusText}}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="line-dashed"></div>
            <div class="order-track">
              <p class="detail-title"><span class="text-md">指派记录</span></p>
              <ul class="track-list" v-if="workOprList && workOprList.length > 0">
                <li :class="{'text-success': index == 0 }" v-for="(item, index) in workOprList" :key="item.id">
                  <div class="content">
                    <span class="pull-left">{{item.createTime | getDate}} {{item.createTime | getTime}}</span>
                    <span class="operator pull-right">{{item.createName}}</span>
                    <p class="text">{{item.remark}}</p>
                  </div>
                </li>
              </ul>
            </div>
          </td>
          <td class="wrapper" style="width:40%">
            <div class="user-review">
              <p class="detail-title"><span class="text-md">用户评价</span></p>
              <ul class="order-list">
                <li><span class="title">取送人员：</span>
                  <p class="text">
                    <el-rate
                      v-model="evaluate.takeWork.points"
                      disabled
                      show-text
                      text-color="#ff9900">
                    </el-rate>
                  </p>
                </li>
                <li><span class="title">评价内容：</span>
                  <p class="text" v-if="orderInfo.evaluate">{{orderInfo.evaluate.workEvaluate}}</p>
                </li>
              </ul>

              <ul class="order-list m-t">
                <li><span class="title">洗涤服务：</span>
                  <p class="text" v-if="orderInfo.evaluate">
                    <el-rate
                      v-model="orderInfo.evaluate.servicePoints"
                      disabled
                      show-text
                      text-color="#ff9900">
                    </el-rate>
                  </p>
                </li>
                <li><span class="title">评价内容：</span>
                  <p class="text" v-if="orderInfo.evaluate">{{orderInfo.evaluate.serviceEvaluate}}</p>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </table>

      <template v-if="proPriceList && proPriceList.length > 0">
        <div class="m-t-lg m-b text-md text-black">下单衣物清单</div>
        <el-table class="ukao-el-table ukao-tabel-bg"
                :data="proPriceList"
                style="width: 100%">
          <el-table-column label="衣物">
            <template slot-scope="scope">
                <p>{{scope.row.name}}</p>
            </template>
          </el-table-column>
          <el-table-column label="单价">
            <template slot-scope="scope">
              <p :class="{'zhx': orderInfo.isVipPrice && scope.row.vipPrice}">{{scope.row.price | amtFormat}}</p>
              <p v-if="orderInfo.isVipPrice && scope.row.vipPrice" class="text-danger">会员价：{{scope.row.vipPrice | amtFormat}}</p>
            </template>
          </el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">
              {{scope.row.cnt}}
            </template>
          </el-table-column>
          <el-table-column label="折扣">
            <template slot-scope="scope">
              <div class="text-muted" v-if="scope.row.discount && scope.row.discount > 0">{{scope.row.discount /10}}折</div>
              <div class="text-muted" v-else>无折扣</div>
            </template>
          </el-table-column>
          <el-table-column label="小计">
            <template slot-scope="scope">
              <div v-if="scope.row.discount && scope.row.discount > 0">
                {{((orderInfo.isVipPrice && scope.row.vipPrice ? scope.row.vipPrice : scope.row.price) * scope.row.cnt * scope.row.discount / 100) | amtFormat}}
              </div>
               <div class="text-danger" v-else>
                 {{((orderInfo.isVipPrice && scope.row.vipPrice ? scope.row.vipPrice : scope.row.price) * scope.row.cnt) | amtFormat}}
               </div>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <div class="m-t-lg m-b text-md text-black">入库衣物清单</div>
      <div class="text-muted"><span>衣物 {{ynum}} 件</span> <span style="margin-left:10px;">附件 {{productList.length-ynum}} 件</span></div>
        <el-table class="ukao-el-table ukao-tabel-bg"
          :data="productList"
          style="width: 100%">
          <el-table-column label="衣物|条码|绑标" min-width="130px">
            <template slot-scope="scope">
              <p class="m-t-sm">
                <el-badge value="附件" class="item" v-if="scope.row.type == 2" >
                  <a class="text-primary"  target="_blank" :href="'/product/detail/'+scope.row.id" >
                    {{scope.row.productName}}
                  </a>
                </el-badge>
                <a v-else class="text-primary"  target="_blank" :href="'/product/detail/'+scope.row.id" >
                  {{scope.row.productName}}
                </a>
              </p>
              <p><a class="text-primary" target="_blank" :href="'/product/detail/'+scope.row.id" >{{scope.row.scanCode}}</a></p>
              <p>{{scope.row.bindCode}}</p>
              <p v-if="scope.row.hasRefund !== 0" class="text-danger text-xs">{{scope.row.hasRefundText}}</p>
              <p class="m-t-xs" v-show="scope.row.tranNum"><span class="line-text">{{scope.row.tranTypeText}}：{{scope.row.tranNum}}</span></p>
            </template>
          </el-table-column>
          <el-table-column label="服务">
            <template slot-scope="scope">
              <p>{{scope.row.serviceName}}</p>
            </template>
          </el-table-column>
          <el-table-column label="颜色">
            <template slot-scope="scope" v-if="scope.row.colorList">
              <p v-for="item in scope.row.colorList">{{item.name}}</p>
            </template>
          </el-table-column>
          <el-table-column label="瑕疵">
            <template slot-scope="scope" v-if="scope.row.flawList">
              <p v-for="item in scope.row.flawList">{{item.name}}</p>
            </template>
          </el-table-column>
          <el-table-column label="预计效果">
            <template slot-scope="scope" v-if="scope.row.effectList">
              <p v-for="item in scope.row.effectList">{{item.name}}</p>
            </template>
          </el-table-column>
          <el-table-column label="品牌">
            <template slot-scope="scope">
              <p>{{scope.row.brandName}}</p>
            </template>
          </el-table-column>
          <el-table-column label="附件">
            <template slot-scope="scope" v-if="scope.row.annexList">
              <p v-for="item in scope.row.annexList">{{item.name}}</p>
            </template>
          </el-table-column>
          <el-table-column label="附件服务">
            <template slot-scope="scope" v-if="scope.row.addServiceList">
              <p v-for="item in scope.row.addServiceList">{{item.name}}</p>
            </template>
          </el-table-column>
          <el-table-column label="原金额x数量">
            <template slot-scope="scope">
              <p :class="{'zhx':orderInfo.isVipPrice && scope.row.vipServiceAmt }">{{scope.row.serviceAmt| amtFormat}}x{{scope.row.count/100}}</p>
              <p v-if="orderInfo.isVipPrice && scope.row.vipServiceAmt" class="text-danger">会员价：{{scope.row.vipServiceAmt| amtFormat}}x{{scope.row.count/100}}</p>
            </template>
          </el-table-column>
          <el-table-column label="折后">
            <template slot-scope="scope">
              <p class="text-success">{{scope.row.saleAmt| amtFormat}}</p>
              <p class="text-muted" style="font-size: 12px">
                {{scope.row.saleTypeText}}<span v-if="scope.row.saleType==1 || scope.row.saleType==2">({{scope.row.discount|discountFormat}}折)</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="附加费">
            <template slot-scope="scope">
              <p class="text-success">{{scope.row.addsrvAmt | amtFormat}}</p>
            </template>
          </el-table-column>
          <el-table-column label="小计">
            <template slot-scope="scope">
              <p :class="scope.row.chgSubtotal!=null?'text-muted':'text-success'">{{scope.row.subtotal| amtFormat}}</p>
              <p class="text-success" v-if="scope.row.chgSubtotal!=null">{{scope.row.chgSubtotal| amtFormat}}  <span class="bg-danger ts-icon">改</span></p>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <p>{{scope.row.statusText}}</p>
              <!--<div class="m-t-xs">-->
                <!--<el-button><a target="_blank" :href="'/product/detail/'+scope.row.id" >详情</a></el-button>-->
              <!--</div>-->
            </template>
          </el-table-column>
        </el-table>
        <div class="text-right b-b" v-if="(productList && productList.length > 0) || orderInfo.mode == 2">
          <ul class="order-list order-list2">
            <li>
              <span class="title">衣物总额：</span>
              <p class="text" v-if="orderInfo.valuationPrice !== null">￥{{orderInfo.valuationPrice | amtFormat}}</p>
              <p class="text" v-else>￥{{orderInfo.orderPrice || 0 | amtFormat}}</p>
            </li>
            <li><span class="title">取件费：</span><p class="text">￥{{orderInfo.takeCarriage | amtFormat}}</p></li>
            <li><span class="title">送件费：</span><p class="text">￥{{orderInfo.sendCarriage | amtFormat}}</p></li>
            <li class="text-danger" v-if="orderInfo.isModifyPrice">
              <span class="title">修改金额：</span>
              <p class="text">￥{{orderInfo.modifyPrice | amtFormat}}</p>
            </li>
            <li><span class="title">优惠券：</span><p class="text">-￥{{orderInfo.couponAmt || 0 | amtFormat}}</p></li>
            <li :class="{'text-danger':orderInfo.payStatus === 0}"><span class="title">{{orderInfo.payStatus === 0 ? '应付总额' : '实付金额'}}：</span><p class="text">￥{{orderInfo.paymentPrice | amtFormat}}</p></li>

          </ul>
        </div>
      </div>
      <clothingList :orderId="orderInfo.id" class="m-t-lg m-b "/>
      <signList :orderId="orderInfo.id" class="m-t-lg m-b "/>
    <!-- 管理备注-->
  		<el-dialog class="ukao-dialog"
        title="管理备注" :visible.sync="remarkDialog.visible"  size="small">
        <div>
          <el-form :model="remarkDialog.ruleForm" ref="remarkDialog.ruleForm" label-width="160px">

            <el-form-item
              label="内容" prop="remark" :rules="[
                { min: 0, max: 255, message: '内容最大长度255个字', trigger: 'blur'}
              ]">
              <div class="w-lg">
                <el-input type="textarea"  :autosize="{ minRows: 4, maxRows: 6}" v-model="remarkDialog.ruleForm.remark" auto-complete="off"></el-input>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button @click="remarkDialog.visible=false">取消</el-button>
              <el-button type="primary" @click="mercRemarkSave('remarkDialog.ruleForm')">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
  <!-- end管理备注-->

    <el-dialog class="ukao-dialog" title="修改订单金额" :visible.sync="modifyPriceDialog.visible" size="small">
      <div>
        <el-form :model="modifyPriceDialog.ruleForm" ref="modifyPriceDialog.ruleForm" label-width="160px">

          <el-form-item
            label="修改金额" prop="modifyPrice" :rules="{validator: checkAmount, min:0, max:10000000, ignoreEmpty:false, message: '无效的金额,保留二位小数', trigger: 'blur'}">
            <div class="w-lg">
              <el-input type="number" v-model="modifyPriceDialog.ruleForm.modifyPrice"></el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="modifyPriceDialog.visible=false">取消</el-button>
            <el-button type="primary" @click="modifyPrice('modifyPriceDialog.ruleForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 指定派送收人员弹窗 -->
    <el-dialog :title="editStatus?'请指定送件员':'请指定收件员'" :visible.sync="personbox" :lock-scroll='false'>
      <div class="scrollbox">
        <div class="staff-item" @click="checkedStaff(item)" :class="{selected:item.checked}" v-for="(item,index) in staffList" :key="index">
          <div class="user-logo">
            <img :src="item.imgPath?item.imgPath:'/static/img/user/def.png'" alt="">
            <div class="mask text-center">
              <i class="el-icon-check text-xl"></i>
            </div>
          </div>
          <p class="text-center">
            <span class="name">{{item.name}}</span>
          </p>
        </div>
      </div>
      <div class="footer text-right" slot="footer">
        <el-button @click="personbox = false">取消</el-button>
        <el-button type="primary" @click="subStaff">确认</el-button>
      </div>
    </el-dialog>

    <!-- 地址修改弹窗 -->
    <el-dialog :title="'修改送件方式'" :visible.sync="sendModeBox" :lock-scroll='false'>
      <div class="scrollbox">
        <template>
          <el-radio v-model="sendMode" :label="1">客户到店取</el-radio>
          <el-radio v-model="sendMode" :label="2">上门送件</el-radio>
          <el-radio v-model="sendMode" :label="3">智柜送件</el-radio>
        </template>
      </div>
      <div class="footer text-right" slot="footer">
        <el-button @click="sendModeBox = false">取消</el-button>
        <el-button type="primary" @click="updateSendMode(0)">确认</el-button>
      </div>
    </el-dialog>


    <!-- 地址修改弹窗 -->
    <el-dialog :title="editAddress?'请选择送件地址':'请选择取件地址'" :visible.sync="addressbox" :lock-scroll='false'>
     <div class="scrollbox">
      <el-row :gutter="0" class="b-b">
        <el-col :span="4"><div class="grid-content">联系人</div></el-col>
        <el-col :span="6"><div class="grid-content">手机/电话</div></el-col>
        <el-col :span="6"><div class="grid-content">地址</div></el-col>
        <el-col :span="8"><div class="grid-content">详细地址</div></el-col>
      </el-row>
      <el-row class="b-b" :gutter="0" v-for="(item,index) in addressList" :key="index" @click.native="checkedAddress(item)">
          <el-col :span="4"><div class="grid-content">{{item.name}}</div></el-col>
          <el-col :span="6"><div class="grid-content"><span>{{item.phone}}</span></div></el-col>
          <el-col :span="6"><div class="grid-content">{{item.regionalDesc}}</div></el-col>
          <el-col :span="6"><div class="grid-content">{{item.detail}}</div></el-col>
          <el-col :span="2"><div class="grid-content"><i class="el-icon-circle-check" :class="item.checked?'text-success':' text-muted'"></i></div></el-col>
      </el-row>
     </div>
       <div class="footer text-right" slot="footer">
        <el-button @click="addressbox = false">取消</el-button>
        <el-button type="primary" @click="subAddress">确认</el-button>
      </div>
    </el-dialog>
    <!-- 时间弹窗 -->
    <el-dialog :title="editTime?'请选择送件时间':'请选择取件时间'" :visible.sync="timebox" :lock-scroll='false'>
      <div class="timebox">
        <div class="m-b-md">
          <span class="time-item" :class="{'selected':selectedTimes.dayIndex == index}" v-for="(item,index) in daysList" :key="index" @click="selectedDay(item,index)">{{item}}</span>
        </div>
        <div>
          <span class="time-item" :class="{'disable':(!item.status || timeIsLapse(item)),'selected':selectedTimes.id == item.id}" v-for="(item,index) in timeBoxList" :key="index" @click="selectedTimeSlot(item)">{{item.timeStart}}-{{item.timeEnd}}</span>
        </div>
      </div>
       <div class="footer text-right" slot="footer">
        <el-button @click="timebox = false">取消</el-button>
        <el-button type="primary"  @click="subTimes">确认</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
  import msg from '@/utils/msg'
  import calculation from '@/utils/helpers/calculation'
  import time from '@/utils/helpers/timeLite'
  import validate from '@/utils/helpers/validate'
  import clothingList from '@/components/ClothingList/index'
  import signList from '@/components/ClothingList/sign'
  export default {
    data() {
      return {
        ynum:0,
        loading: false,
        orderInfo:{
          id: this.$route.params.id
        },
        statusList: [],
        workOprList: [],
        takeExpressInfo: {},
        sendExpressInfo: {},
        takeExpressStatusList: [],
        sendExpressStatusList: [],
        user:{},
        //评价信息
        evaluate:{
          takeWork:{
            points:0,
            evaluate: ''
          },
          sendWork:{
            points:0,
            evaluate:''
          }
        },
        //入库衣物清单
        productList:[],
        // 下单衣物
        proPriceList:[],
        //备注
        remarkDialog: {
          visible: false,
          ruleForm: {
            id: '',
            userRemark: '',
            remark: ''
          }
        },
        // 修改订单金额
        modifyPriceDialog: {
          visible: false,
          ruleForm: {
            id: '',
            modifyPrice: ''
          }
        },
        //付款记录列表
        orderPayTradeList: [],
        //图形进度
        progressIndex: 0, //当前进度
        progress:[],

        staffList:[],  //取送人员列表
        personbox:false, //是否显示选人弹窗
        editStatus:0, //修改人员状态 0：收件员  1：送件员
        selectedStaff:null, // 当前选中的人员

        sendModeBox: false,//修改送件方式
        sendMode: 1,//取件方式
        addressList:[],  //地址列表
        addressbox:false, //是否显示地址选择弹窗
        editAddress:0, //修改地址状态 0：取件地址  1：送件地址
        selectedAddress: null, //当前选中的地址

        timer:null, //当前时间
        daysList:null, //天列表
        takeTimeList:[],  //取件时间段列表
        sendTimeList:[],  //送件时间段列表
        timeBoxList:[],  //时间选择弹窗的时间段列表
        timebox: false, //是否显示时间选择弹窗
        editTime:0,  //修改时间  0:取件时间   1：送件时间
        selectedTimes:{ //选择的时间
          day:'',
          date:'',
          dayIndex:0,
          timeStart:'',
          timeEnd:'',
          id:0, //时间段id
        }
      };
    },
    created () {
      var _this = this
      _this.info(function (data) {
        _this.orderProgress(data.id)
        _this.productRelList(data.id)
        _this.tradeOrderList(data.id)
        _this.getStaffList();
        _this.getAddressList();
        _this.queryWorkOprList();
        if (data.takeExpressNo) {
          _this.queryExpressDetail(data.takeExpressNo, data.takeExpressType, 1);
        }
        if (data.sendExpressNo) {
          _this.queryExpressDetail(data.sendExpressNo, data.sendExpressType, 2);
        }

        _this.loading = false
      })
    },
    computed: {
      orderDiscount: function () {
        let discount = this.orderInfo.discount || this.user.cardDiscount;
        let discountDesc = this.orderInfo.discountDesc || this.user.discountDesc;
        if (discountDesc) {
          return '多折扣';
        } else if (discount){
          return discount < 100 ? calculation.accDiv(discount, 10) + '折' : '不打折'
        } else {
          return ''
        }
      }
    },
    methods: {
      info(fn){
        this.loading = true
        this.$store.dispatch('post', {
          uri : 'orderInfo/detail',
          data: {
            id: this.orderInfo.id
          }
        }).then((res) =>{
          this.orderInfo = res.data.data;
          this.user = this.orderInfo.userInfo;
          if(this.orderInfo.business) {
             var list = JSON.parse(this.orderInfo.business)
             var tmpList = []
             list.forEach(function (item) {
               tmpList.push(item.name)
             })
            this.orderInfo.businessStr = tmpList.join('/')
          }

          if (this.orderInfo.remarkJson) {
            let rJson = JSON.parse(this.orderInfo.remarkJson);
            let rList = [];
            rJson.forEach(function (ri) {
              rList.push(ri)
            });
            this.orderInfo.rList = rList;
          }

          if (this.orderInfo.proPriceDesc) {
            this.proPriceList = JSON.parse(this.orderInfo.proPriceDesc);
          }
          if(typeof (fn) === 'function'){
            fn(this.orderInfo)
          }
        })
      },
      //进度
      orderProgress(orderId){
        this.$store.dispatch('post', {
          uri : 'orderInfo/progress',
          data: {
            id: orderId
          }
        }).then((res) =>{
          this.progress = res.data.data ||[];
          this.progress.forEach((item,index)=>{
            if(item.state === 1) this.stampSuccess = index;
          })
        })
      },
      productRelList(orderId){
        if(!orderId) return
        this.$store.dispatch('post', {
          uri : 'orderProductRel/list',
          data: {orderId:orderId}
        }).then((res) =>{
          var list = res.data.data
          let _this=this;
          list.forEach(function (item) {
            item.colorList = JSON.parse(item.colorDesc)
            item.effectList = JSON.parse(item.effectDesc)
            item.flawList = JSON.parse(item.flawDesc)
            item.annexList = JSON.parse(item.annexDesc)
            item.addServiceList = JSON.parse(item.addServiceDesc)
            if(item.type===1){
            _this.ynum++;
          }
          })
          this.productList = list
        })
      },
      tradeOrderList(orderId){
        if(!orderId) return
        this.$store.dispatch('post', {
          uri : 'tradeOrder/list',
          data: {orderId:orderId}
        }).then((res) =>{
          var list = res.data.data.list
          this.orderPayTradeList = list
        })
      },
      showModifyDialog(item) {
        this.modifyPriceDialog.ruleForm.id = item.id;
        let paymentPrice = 0;
        if (this.orderInfo.paymentPrice) {
          paymentPrice = calculation.accDiv(this.orderInfo.paymentPrice,100);
        }
        this.modifyPriceDialog.ruleForm.modifyPrice = paymentPrice;
        this.modifyPriceDialog.visible = true;
      },
      modifyPrice(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('post', {
              uri: 'orderInfo/modifyPrice',
              data: {
                id: this.modifyPriceDialog.ruleForm.id,
                modifyPrice: calculation.accMul(this.modifyPriceDialog.ruleForm.modifyPrice, 100)
              }
            }).then((res) => {
              this.modifyPriceDialog.visible = false;
              msg.success();
              var _this = this;
              this.info(function (){
                _this.loading = false
              });
            })
          }
        })
      },
      mercRemark(item){
        this.remarkDialog.ruleForm.id = item.id || ''
        this.remarkDialog.ruleForm.remark = item.remark || ''
        this.remarkDialog.ruleForm.userRemark = item.userRemark || ''
        this.remarkDialog.visible = true
      },
      mercRemarkSave(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('post', {
              uri: 'orderExt/addRemark',
              data: {
                id: this.remarkDialog.ruleForm.id,
                remark: this.remarkDialog.ruleForm.remark,
              }
            }).then((res) => {
              this.remarkDialog.visible = false
              msg.success();
              let _this = this;
              this.info(function (){
                _this.loading = false
              });
            })
          }else{
            return false
          }
        })
      },
      checkAmount(rule, value, callback) {
        if (!validate.amount(value, rule.pos, rule.min, rule.max, rule.ignoreEmpty)) {
          callback(new Error());
        } else {
          callback();
        }
      },
      queryExpressDetail(expressNo, expressType, mode) {
        this.$store.dispatch('post',{
          uri:'expressInfo/detail',
          data:{
            expressNo: expressNo,
            type: expressType
          }
        }).then(res=>{
          if (mode == 1) {
            this.takeExpressInfo = res.data.data || {};
          } else {
            this.sendExpressInfo = res.data.data || {};
          }

        })
      },
      queryExpressStatus(expressNo, expressType, mode) {

        if (mode == 1) {
          if (this.takeExpressStatusList.length > 0) {
            return;
          }
        } else {
          if (this.sendExpressStatusList.length > 0) {
            return;
          }
        }

        this.$store.dispatch('post',{
          uri:'expressStatus/list',
          data:{
            expressNo: expressNo,
            type: expressType
          }
        }).then(res=>{
          if (mode == 1) {
            this.takeExpressStatusList = res.data.data || [];
          } else {
            this.sendExpressStatusList = res.data.data || [];
          }

        })
      },
      // 撤销送件
      cancelSend() {
        let _this = this;
        msg.confirm({
          msg:'确定撤销送件?',
          confirmFn: function () {
            _this.$store.dispatch('post', {
              uri: 'orderInfo/cancelSend',
              data: {id:_this.orderInfo.id}
            }).then((res)=>{
              msg.success();
              _this.info(function (){
                _this.loading = false
              });
            })
          }
        })
      },
      // 获取可指派的人员
      getStaffList(keys=''){
        this.$store.dispatch('get',{
          uri:'workerInfo/takeAndSend/list',
          data:{
            storeId: this.orderInfo.storeId,
            keywords: keys
          }
        }).then(res=>{
          this.staffList = res.data.data || [];
          this.staffList.forEach(item=>{
            this.$set(item,'checked',false)
          })
        })
      },
      // 开始选择收送件人员
      startCheckStaff(i){
        this.editStatus = i;
        this.personbox = true;
        if(i){
           this.staffList.forEach(item=>{
           item.checked = (item.id == this.orderInfo.sendWorkId) ? true: false;
           if(item.checked){
             this.selectedStaff = item;
          }
        })
        } else{
          this.staffList.forEach(item=>{
            item.checked = (item.id == this.orderInfo.takeWorkId) ? true: false;
            if(item.checked){
             this.selectedStaff = item;
            }
          })
        }
      },
      // 选取人员
      checkedStaff(val){
        this.staffList.forEach(item=>{
          if(item.checked) item.checked = false;
        })
        val.checked = true;
        this.selectedStaff = val;
      },
      // 提交修改的人员信息
      subStaff(){
        let id = this.editStatus ? this.orderInfo.sendWorkId : this.orderInfo.takeWorkId;
        if(this.selectedStaff.id != id){
          let uri = this.editStatus ? 'orderExt/assignSendWork':'orderExt/assignTakeWork';
          this.$store.dispatch('post',{
            uri,
            data:{
              id:this.orderInfo.id,
              workId:this.selectedStaff.id
            }
          }).then(res=>{
            this.personbox = false;
            if(this.editStatus){
              this.orderInfo.sendWorkCode = this.selectedStaff.code;
              this.orderInfo.sendWorkId = this.selectedStaff.id;
              this.orderInfo.sendWorkImg = this.selectedStaff.imgPath;
              this.orderInfo.sendWorkName = this.selectedStaff.name;
              this.orderInfo.sendWorkPhone = this.selectedStaff.phone;
            }else{
              this.orderInfo.takeWorkCode = this.selectedStaff.code;
              this.orderInfo.takeWorkId = this.selectedStaff.id;
              this.orderInfo.takeWorkImg = this.selectedStaff.imgPath;
              this.orderInfo.takeWorkName = this.selectedStaff.name;
              this.orderInfo.takeWorkPhone = this.selectedStaff.phone;
            }
            this.queryWorkOprList();
          })
        }else{
          this.personbox = false;
        }
      },
      queryWorkOprList() {
        this.$store.dispatch('get',{
          uri:'logWorkerOpr/list',
          params:{
            bizId:this.orderInfo.id,
            bizType: 'ORDER_ASSIGN'
          }
        }).then(res=>{
          this.workOprList = res.data.data.list || [];
        })
      },
      // 获取地址列表
      getAddressList(){
        this.$store.dispatch('get',{
          uri:'userAddress/list',
          params:{
            userId:this.orderInfo.userId
          }
        }).then(res=>{
          this.addressList = res.data.data.list;
          this.addressList.forEach(item=>{
            this.$set(item,'checked',false);
          })
        })
      },
      // 开始选择收送件地址
      startCheckAddress(i){
        this.editAddress = i;
        this.addressbox = true;
        this.selectedAddress = null;
        this.addressList.forEach(item=>{
          item.checked = false;
        })
      },
      // 选取地址
      checkedAddress(val){
        val.checked = !val.checked;
        this.addressList.forEach(item=>{
          if(item.checked && item.id !=val.id) item.checked = false;
        })
        this.selectedAddress = val.checked? val:null;
      },
      // 提交地址
      subAddress(){
        if(this.selectedAddress){
          let uri = this.editAddress ? 'orderExt/updateSendAddress':'orderExt/updateTakeAddress';
          this.$store.dispatch('post',{
            uri,
            params:{
              id:this.orderInfo.id,
              addressId:this.selectedAddress.id
            }
          }).then(res=>{
           if(this.editAddress){
              this.orderInfo.sendName = this.selectedAddress.name;
              this.orderInfo.sendPhone = this.selectedAddress.phone;
              this.orderInfo.sendAddress = this.selectedAddress.regionalDesc+this.selectedAddress.detail;
            }else{
              this.orderInfo.takeName = this.selectedAddress.name;
              this.orderInfo.takePhone =this.selectedAddress.phone;
              this.orderInfo.takeAddress =this.selectedAddress.regionalDesc + this.selectedAddress.detail;
            }
            this.addressbox = false;
          })
        }else{
          msg.error('请选择地址');
        }
      },
      // 开始修改时间
      startCheckTime(i){
        this.editTime = i;
        this.selectedTimes = {
          day:'',
          date:'',
          dayIndex:0,
          timeStart:'',
          timeEnd:'',
          id:0, //时间段id
        }
        if(this.editTime && !this.sendTimeList.length){
          this.getSendTimeList().then(_=>{
            this.setDayList();
            this.timeBoxList = this.sendTimeList;
          });
        }else if(!this.takeTimeList.length){
          this.getTakeTimeList().then(_=>{
            this.setDayList();
            this.timeBoxList = this.takeTimeList;
          });
        }else{
           this.timeBoxList = this.editTime ? this.sendTimeList : this.takeTimeList;
        }
        this.timebox = true;
      },
      updateSendMode(flag){
        if(flag){
          this.sendModeBox = true;
          this.sendMode = parseInt(this.orderInfo.sendMode);
        }else{
          this.$store.dispatch('post',{
            uri: 'orderInfo/updateSendMode',
            params:{
              id:this.orderInfo.id,
              sendMode:this.sendMode
            }
          }).then(res=>{
            this.orderInfo.sendMode = parseInt(this.sendMode);
            this.sendModeBox = false;
            if (!this.orderInfo.sendAddress) {
              let _this = this;
              this.info(function (){
                _this.loading = false;
              });
            } else {
              this.orderInfo.sendModeText = this.sendMode == 1 ? '客户到店取' :
              this.sendMode == 2? '上门送件': '智柜送件'
            }
          });
        }

      },
      // 设置日期数组
      setDayList(){
        if(!this.daysList){
          this.daysList = Array.apply(null,Array(20)).map((item,i)=>{
            return new Date(this.timer+1000*60*60*24*i).getMonth()+1+ '-' + new Date(this.timer+1000*60*60*24*i).getDate();
          });
        }
      },
      // 时间段是否失效
      timeIsLapse(item){
        return this.selectedTimes.dayIndex == 0 && (new Date(this.timer).getHours()+1) >= parseInt(item.timeEnd);
      },
      // 选择日期
      selectedDay(val,index){
        this.selectedTimes.day = val;
        this.selectedTimes.date = new Date(this.timer+1000*60*60*24*index).getFullYear()+'-'+val;
        this.selectedTimes.dayIndex = index;
        if(index == 0){
          this.selectedTimes.id = 0;
        }
      },
      // 选择时间段
      selectedTimeSlot(item){
        if(item.status && !this.timeIsLapse(item)){
          this.selectedTimes.timeStart = item.timeStart;
          this.selectedTimes.timeEnd = item.timeEnd;
          this.selectedTimes.id = item.id;
        }
      },
      // 提交时间
      subTimes(){
        if(this.selectedTimes.id){
          if(!this.selectedTimes.date) this.selectedTimes.date = new Date(this.timer).getFullYear()+'-'+this.daysList[0];
          let uri = this.editTime ? 'orderExt/updateSendDate':'orderExt/updateTakeDate';
          this.$store.dispatch('post',{
            uri,
            data:{
              id:this.orderInfo.id,
              date : this.selectedTimes.date,
              timeStart : this.selectedTimes.timeStart,
              timeEnd : this.selectedTimes.timeEnd,
            }
          }).then(res=>{
            if(this.editTime){
              this.orderInfo.sendDate = this.selectedTimes.date;
              this.orderInfo.sendTimeStart = this.selectedTimes.timeStart;
              this.orderInfo.sendTimeEnd = this.selectedTimes.timeEnd;
            }else{
              this.orderInfo.takeDate = this.selectedTimes.date;
              this.orderInfo.takeTimeStart = this.selectedTimes.timeStart;
              this.orderInfo.takeTimeEnd = this.selectedTimes.timeEnd;
            }
            this.timebox = false;
          })
        }else{
          msg.error('请选择时间日期');
        }
      },
      getTakeTimeList(){
        return this.$store.dispatch('get',{
          uri:'serviceTime/take/list',
          params:{
            cityId:this.orderInfo.cityId
          }
        }).then(res=>{
          this.takeTimeList = res.data.data || [];
          this.timer = res.data.timestamp;
        })
      },
      getSendTimeList(){
        return this.$store.dispatch('get',{
          uri:'serviceTime/send/list',
           params:{
            cityId:this.orderInfo.cityId
          }
        }).then(res=>{
          this.sendTimeList = res.data.data || [];
          this.timer = res.data.timestamp;
        })
      },
    },
    components: {
      clothingList, signList
    }
  }
</script>

<style lang="less" scoped>
  .time-item{
    display: inline-block;
    line-height: 30px;
    padding: 0 10px;
    margin-right: 10px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
    cursor: pointer;
    &.disable{
      background-color: #ccc;
      color:#fff;
      cursor:no-drop;
    }
    &.selected{
      background-color: #27c24c;
      border-color: #27c24c;
      color: #fff;
    }
  }
  .scrollbox{
    max-height: 450px;
    overflow-y: auto;
  }
  .grid-content{
    height: 100%;
    line-height: 34px;
    cursor: pointer;
  }
  .staff-item {
    width: 90px;
    cursor: pointer;
    margin: 20px 10px 0;
    vertical-align: top;
    display: inline-block;
    .user-logo {
      margin: 0 auto;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      img {
        width: 100%;
      }
      .mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        line-height: 80px;
        display: none;
        background-color: rgba(0, 0, 0, .1);
        .el-icon-check {
          color: #fff;
        }
      }
    }
    .name {
      margin-top: 5px;
      line-height: 28px;
      display: inline-block;
      padding: 0 15px;
      border-radius: 14px;
      border: 1px solid transparent;
      max-width: 90px;
    }
    &.selected {
      .name {
        background-color: #d5e5ff;
        border-color: #20a0ff;
        color: #20a0ff;
      }
      .mask {
        display: block;
      }
    }
  }
  .line-dashed {
    border-top: 1px dashed #dee5e7;
    margin-top: 10px;
    margin-bottom: 10px;
  }
	.module-business-progress {
		position: relative;
		padding: 10px 60px 10px 0;
	}
	.module-business-progress > img {
		position: absolute;
		top: 50%;
		right: 30px;
		transform: translateY(-50%);
	}
	.module-business-progress .top-text .title {
	  height: 20px;
	  line-height: 20px;
	  margin-bottom: 5px;
	}
	.module-business-progress > ul {
	  list-style: none;
	  width: 100%;
	  padding: 0;
	  overflow: hidden;
	}
	.module-business-progress > ul > li {
	  float: left;
	  width: 20%;
	  text-align: center;
	}
	.module-business-progress li:first-child .b-progress:before {
	  display: none;
	}
	.module-business-progress li:last-child .b-progress:after {
	  display: none;
	}
	.module-business-progress .b-progress {
	  margin: 15px auto;
	  position: relative;
	}
	.module-business-progress .b-progress span {
	  display: block;
	  margin: 0 auto;
	  position: relative;
	  width: 16px;
	  height: 16px;
	  border: 5px solid #00c800;
	  box-sizing: content-box;
	  border-radius: 50%;
	  background: #00c800 url(/static/img/ol_icon.png) no-repeat scroll -48px 0;
	  background-size: 64px 32px;
	  background-origin:content-box;
	  z-index: 2;
	}
	.module-business-progress .b-progress:before,
	.module-business-progress .b-progress:after {
	  content: "";
	  width: 50%;
	  height: 3px;
	  position: absolute;
	  top: 50%;
	  background-color: #00c800;
	  transform: translateY(-50%);
	  z-index: 1;
	}
	.module-business-progress .b-progress:before {
	  left: 0;
	}
	.module-business-progress .b-progress:after {
	  right: 0;
	}
	.module-business-progress .bottom-text {
	  padding: 0 8px;
	}
	.module-business-progress li.inactive .b-progress span {
	  border-color: #CACACA;
	  background-color: #CACACA;
	}
	.module-business-progress li.inactive-begin .b-progress:after,
	.module-business-progress li.inactive .b-progress:before,
	.module-business-progress li.inactive .b-progress:after {
	  background-color: #CACACA;
	}

  .order-detail-tb tr td {
    vertical-align: top;
  }
  .detail-title {
    line-height: 36px;
  }
  .order-list li {
    overflow: hidden;
    line-height: 22px;
  }
  .order-list li .title {
    float: left;
  }
  .order-list li .text {
    margin-left: 80px;
  }

  .pay-info {
    width: 400px;
  }

  .track-list li {
    position: relative;
    padding-left: 20px;
    line-height: 30px;
  }
  .track-list li:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    margin-top: 6px;
    width: 6px;
    height: 6px;
    background: #ededed;
    border: 2px solid white;
    border-radius: 50%;
    z-index: 3;
  }
  .track-list li:first-child:before {
    background: #36c924;
  }
  .track-list li:after {
    content: '';
    position: absolute;
    left: 4px;
    top: 0;
    height: 100%;
    margin-top: 6px;
    border-left: 2px solid #ededed;
    border-radius: 50%;
    z-index: 2;
  }
  .track-list li:last-child:after {
    border: 0;
  }
  .track-list .content {
    overflow: hidden;
  }
  .track-list .content .text {
    margin-left: 180px;
    margin-right: 190px;
  }
  .track-list .content .operator {
    width: 150px;
  }

  .pay-info .order-list li .text {
    margin-left: 120px;
  }
  .getter .order-list li .text {
    margin-left: 60px;
  }
  .clothes-text {
    margin-left: 60px;
  }
  .line-text {
    border: 1px solid #f89f01;
    color: #f89f01;
    display: inline-block;
    padding: 0 10px;
    border-radius: 13px;
  }
  .order-list2 {
    display: inline-block;
    padding: 10px 18px;
  }
  .group-ico{
    color: #fff;background: #9a74f4; border-radius: 100%;padding: 2px;
    font-size: 12px;
  }
  .credited_css{
    padding-left: 15px;
    font-size: 16px;
    padding-bottom: 10px
  }

  .zhx{
    text-decoration:line-through;
  }
</style>