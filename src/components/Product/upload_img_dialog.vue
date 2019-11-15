<template>
  <el-dialog title="修改图片"
             custom-class="ukao-dialog-lg"
             :visible="value"
             @open="open"
             @update:visible="value => $emit('input',value)"
             size="tiny">
    <div>
      <p class="l-h-2x">自定义图片</p>
      <Uploader class="u-mini-uploader"
                :tip="tips"
                :path="imgPath"
                :beforeFn="beforeUpload"
                :successFn="successFn"></Uploader>
      <div class="clearfix m-t m-b-md">
        <span class="l-h36">可使用图片</span>
        <el-input class="w-md pull-right"
                  placeholder="请输入关键字"
                  v-model.trim="keys">
          <el-button slot="append"
                     @click="searchImgs"
                     icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div v-show="availableImgs.length">
        <el-row :gutter="20">
          <el-col :span="4"
                  :key="item.id"
                  v-for="item in availableImgs">
            <div class="usable-item b-a"
                 :class="{'active':path === item.path}"
                 @click="selectImg(item)">
              <div class="usable-logo">
                <img :src="item.path">
              </div>
              <div class="usable-size">
                {{item.width}} x {{item.height}}
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="text-right m-t-sm">
          <el-pagination :page-size="pagination.size"
                         layout="total, prev, pager, next"
                         :total="pagination.total"
                         :current-page.sync="pagination.page"
                         @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
      <div v-show="availableImgs.length === 0"
           class="text-center text-muted wrapper-md">
        未搜索到相关图片！
      </div>
    </div>
    <div slot="footer"
         class="text-center">
      <el-button @click="$emit('input',false)">取 消</el-button>
      <el-button type="primary"
                 @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Uploader from "@/components/Uploader";
import consts from "@/utils/consts";
import validate from "@/utils/helpers/validate";
import msg from "@/utils/msg";

export default {
  props: {
    // 图片上传工具tips
    tips: {
      default: "建议尺寸为300像素*300像素，大小不超过500kb",
      type: String
    },
    // 搜索图片关键字
    keywords: {
      default: "",
      type: String
    },
    // 控制弹窗显示值
    value: {
      default: false,
      typeof: Boolean
    },
    // 传入的图片路径
    imgPath: {
      default: "",
      type: String
    }
  },
  components: {
    Uploader
  },
  data() {
    return {
      keys: "",
      path: "",
      availableImgs: [],
      pagination: {
        size: 12,
        total: 0,
        page: 1
      }
    };
  },
  methods: {
    // 获取图片
    getAvailableImgs(keywords = "") {
      this.$store
        .dispatch("get", {
          uri: "attachment/list",
          params: {
            keywords,
            startRow: (this.pagination.page - 1) * this.pagination.size,
            pageSize: this.pagination.size
          }
        })
        .then(res => {
          this.availableImgs = res.data.data.list;
          this.pagination.total = res.data.data.total;
        });
    },
    // 搜索图片
    searchImgs() {
      if (this.keys) {
        this.getAvailableImgs(this.keys);
      }
    },
    // 选择可使用图片
    selectImg(item) {
      this.path = this.path == item.path ? this.imgPath : item.path;
    },
    // 翻页
    handleCurrentChange() {
      this.getAvailableImgs(this.keys);
    },
    // 自定义图片上传前
    beforeUpload(file) {
      const isImg = validate.image(file.type);
      if (isImg) return true;
      msg.error("上传文件不是图片！");
      return false;
    },
    // 自定义图片上传成功
    successFn(fileNames) {
      if (fileNames && fileNames[0]) {
        this.path = fileNames[0];
      }
    },
    submit() {
      this.$emit("confirm", this.path);
    },
    open() {
      if (this.keywords) this.getAvailableImgs(this.keywords);
      this.path = this.imgPath;
      this.keys = this.keywords || "";
    }
  }
};
</script>
<style lang="less" scoped>
.usable-item {
  width: 100%;
  padding-bottom: 100%;
  padding-top: 30px;
  position: relative;
  cursor: pointer;
  margin-bottom: 10px;
  &.active {
    border: 1px solid #00c800;
    &::before {
      content: "";
      position: absolute;
      right: 0;
      top: 0;
      z-index: 1;
      border: 14px solid;
      border-color: #00c800 #00c800 transparent transparent;
    }
    &::after {
      content: "\E608";
      font-family: element-icons !important;
      position: absolute;
      right: 0;
      top: 1px;
      z-index: 2;
      color: #fff;
      font-size: 12px;
    }
  }
}
.usable-logo {
  position: absolute;
  left: 0;
  top: 0;
  padding-bottom: 100%;
  width: 100%;
  overflow: hidden;
  img {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
.usable-size {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  line-height: 30px;
  text-align: center;
}
</style>


