<style lang="less" scoped>
.mr100 {
  margin-left: 95px;
}
.w500{
  width: 500px !important;
}
</style>
<template>
  <div>
    <div class="clearfix m-b-lg">
      <div class="w-md pull-left">
        <el-input placeholder="请输入内容" v-model="keywords">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div class="pull-right">
        <el-button type="primary" @click="$router.push('add')">添加短信模板</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="模板名称">
      </el-table-column>
      <el-table-column
        prop="name"
        label="工单号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="短信ID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="name"
        :filters="[{ text: '全部', value: '家' }, { text: '审批中', value: '审批中' },{ text: '审批通过', value: '审批通过' },{ text: '审批未通过', value: '审批未通过' }]"
        :filterMethod="selectedStatus"
        filter-placement="left-start"
        label="状态"
        width="120">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="getDetails(scope.row)">详情</el-button>
          <el-button type="text" @click="deleteTemplate">删除</el-button>
          <el-tooltip placement="top" content="失败原因">
            <el-button type="text">失败原因</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="text-right m-t-md">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import consts from "@/utils/consts";
import msg from "@/utils/msg";
export default {
  data() {
    return {
      keywords: "", //搜索关键字
      pagination: {
        //分页
        size: consts.PAGE_SIZE20,
        total: 1300,
        current: 1
      },
      tableData: [
        { name: "审批未通过",id:'SMS_24023042',text:"生日快乐生日快乐生日快乐生日快乐生日快乐生日快乐生日快乐",remarks:'的交费老师教的访问' },
        { name: "生日快乐",id:'SMS_24023042',text:"生日快乐生日快乐生日快乐生日快乐生日快乐生日快乐生日快乐",remarks:'的交费老师教的访问' },
        { name: "生日快乐",id:'SMS_24023042',text:"生日快乐生日快乐生日快乐生日快乐生日快乐生日快乐生日快乐",remarks:'的交费老师教的访问' },
        { name: "生日快乐",id:'SMS_24023042',text:"生日快乐生日快乐生日快乐生日快乐生日快乐生日快乐生日快乐",remarks:'的交费老师教的访问' },
        { name: "生日快乐",id:'SMS_24023042',text:"生日快乐生日快乐生日快乐生日快乐生日快乐生日快乐生日快乐",remarks:'的交费老师教的访问' },
      ] //表格数据
    };
  },
  methods: {
    search() {
      //关键字搜索
    },
    deleteTemplate() {
      //删除短信模板
      msg.confirm({
        msg: "确定删除选中的模板？",
        title: "删除",
        confirmFn: _ => {
          console.log("删除成功！");
        },
        cancelFn: _ => {
          console.log("删除失败！");
        }
      });
    },
    getDetails(data) {
      //短信模板详情
      const vnode = this.$createElement;
      this.$msgbox({
        title: "短信详情",
        customClass:'w500',
        message: vnode("div", null, [
          vnode("div", { class: "clearfix m-b-md" }, [
            vnode("div", { class: "w-xs pull-left text-right" }, "模板名称："),
            vnode("div", { class: "mr100" }, data.name)
          ]),
          vnode("div", { class: "clearfix m-b-md" }, [
            vnode("div", { class: "w-xs pull-left text-right" }, "短信ID："),
            vnode("div", { class: "mr100" }, data.id)
          ]),
          vnode("div", { class: "clearfix m-b-md" }, [
            vnode("div", { class: "w-xs pull-left text-right" }, "短信内容："),
            vnode("div", { class: "mr100" }, data.text)
          ]),
          vnode("div", { class: "clearfix m-b-md" }, [
            vnode("div", { class: "w-xs pull-left text-right" }, "申请说明："),
            vnode("div", { class: "mr100" }, data.remarks)
          ])
        ]),
        confirmButtonText: '确定',
      }).catch(_=>{
        console.log('关闭')
      });
    },
    selectedStatus(value, row) {
      //筛选短信模板状态
      console.log(value, row);
    }
  }
};
</script>
