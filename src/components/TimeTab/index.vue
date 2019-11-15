<template>
  <div>
    <el-radio-group v-model="search.index" @change="changeDateTab">
      <el-radio-button v-for="(item,index) in dateList" :key="index" :label="index">{{item.name}}</el-radio-button>
    </el-radio-group>
    <el-date-picker @change="changeSearchDate" class="m-l v-middle" value-format="yyyy-MM-dd" v-model="search.date"
                    type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
    </el-date-picker>
  </div>
</template>
<script>
import time from "@/utils/helpers/timeLite";
export default {
  props: ["value"],
  data() {
    return {
      dateList: [
        {
          name: "今天",
          data: null
        },
        {
          name: "昨天",
          data: null
        },
        {
          name: "近7天",
          data: null
        },
        {
          name: "近30天",
          data: null
        },
        {
          name: "所有",
          data: []
        }
      ],
      search: {
        date: null, //时间
        index: 0 //时间列表第index值
      }
    };
  },
  created() {
    this.initTimes();
  },
  methods: {
    initTimes() {
      // 初始化dateList
      let today = time.getDate(new Date()),
        yesterday = time.getDate(time.add(today, -1, "days")),
        seven = time.getDate(time.add(today, -7, "days")),
        thirty = time.getDate(time.add(today, -30, "days"));
      this.dateList[0].data = [today, today];
      this.dateList[1].data = [yesterday, yesterday];
      this.dateList[2].data = [seven, yesterday];
      this.dateList[3].data = [thirty, yesterday];
      // 初始化search
      let start = this.value[0],
        end = this.value[1];
      if (start && end) {
        this.dateList.forEach((item, index) => {
          if (item.data[0] === start && item.data[1] === end) {
            this.search.date = item.data;
            this.search.index = index;
          }
        });
        if (!this.search.date) {
          this.search.index = this.dateList.length - 1;
          this.search.date = [start, end];
        }
      } else {
        this.search.index = this.dateList.length - 1;
        this.search.date = this.dateList[this.search.index].data;
      }
    },
    changeDateTab(index) {
      this.search.date = this.dateList[this.search.index].data;
      this.$emit("input", this.search.date);
      this.$emit("change");
    },
    changeSearchDate(value) {
      value  = value ? value : "";
      this.$emit("input", value);
      this.$emit("change");
    }
  }
};
</script>

/*
 时间tab栏
  props
    name | type | default | 说明
    value| Array | 无 | 绑定当前选中的时间值
  events
    name | params | 说明
    change |(date)当前选中的时间 | 选中时间改变触发
*/