<template>
  <div class="grid-content clearfix" :class="def==1?'grid-content-blue':'grid-content-green'">
    <div class="pull-left grid-name text-center text-white text-lg">
      {{item.name}}
      <i class="el-icon-caret-left"></i>
    </div>
    <div class="control" v-if="def != 1">
      <!-- 编辑工位名 -->
      <i class="el-icon-edit" @click="$emit('editRename',item.id,item.name)"></i>
      <!-- 删除当前工位 -->
      <i class="el-icon-delete"  @click="$emit('deleteItem',item.id)"></i>
    </div>
    <div class="grid-main clearfix">
      <div class="pull-left m-l m-t m-b" v-for="(item,i) in staff" :key="i">
        <img class="user-logo" src="/static/img/user/def.png" alt="">
        <p class="text-center m-t-xs">{{item.workName || item.name}}</p>
      </div>
      <p class="no" v-if="!staff.length">暂无员工,请
        <span @click="$emit('editstaff',item.id)">添加</span>
      </p>
    </div>
    <span class="edit"  @click="$emit('editstaff',item.id)">编辑</span>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object
    },
    staff: {
      type: Array,
      default: []
    },
    def: {
      type: Number,
      default: 1
    }
  },
  methods:{
   
  }
}
</script>
<style lang="less" scoped>
.grid-content-blue {
  background-color: #20a0ff;
  border: 1px solid #20a0ff;
  .grid-name {
    background-color: #20a0ff;
    .el-icon-caret-left {
      color: #d5e5ff;
    }
  }
  .grid-main {
    background-color: #d5e5ff;
  }
  .edit {
    color: #20a0ff;
  }
}

.grid-content-green {
  background-color: #13ce66;
  border: 1px solid #13ce66;
  .grid-name {
    background-color: #13ce66;
    .el-icon-caret-left {
      color: #d5fce5;
    }
  }
  .grid-main {
    background-color: #d5fce5;
  }
  .edit {
    color: #13ce66;
  }
}


.grid-content {
  border-radius: 6px;
  position: relative;
  cursor: pointer;
  .control {
    display: none;
    position: absolute;
    left: 100px;
    top: 5px;
    color: #fff;
    font-size: 14px;
    i {
      padding-right: 8px;
    }
  }
  .grid-name {
    width: 150px;
    line-height: 50px;
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -25px;
    .el-icon-caret-left {
      position: absolute;
      right: -7px;
      margin-top: -9px;
      top: 50%;
    }
  }
  .grid-main {
    border-radius: 0 6px 6px 0;
    padding-right: 48px;
    min-height: 115px;
    margin-left: 150px;
    .no {
      text-align: center;
      line-height: 115px;
      span {
        color: #2d95f8;
      }
    }
  }
  .user-logo {
    margin: 0 auto;
    display: block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
  }
  .edit {
    display: none;
    position: absolute;
    right: 10px;
    top: 10px;
  }
  &:hover {
    .edit {
      display: block;
    }
    .control {
      display: block;
    }
  }
}
</style>
