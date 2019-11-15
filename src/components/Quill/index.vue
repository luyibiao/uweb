<style lang="less">
.ql-editor {
  min-height: 300px;
}
</style>
<template>
  <quill-editor v-model="content" ref="editor" @change="getValue($event)" :options="editorOption">
    <div id="toolbar" slot="toolbar">
      <span class="ql-formats">
        <select class="ql-header">
          <option value="1">标题1</option>
          <option value="2">标题2</option>
          <option value="3">标题3</option>
          <option value="4">标题4</option>
          <option value="5">标题6</option>
          <option value="6">标题6</option>
          <option selected="selected">正常</option>
        </select>
        <select class="ql-size">
          <option value="small">小号</option>
          <option selected>正常</option>
          <option value="large">大号</option>
          <option value="huge">加大号</option>
        </select>
      </span>
      <span class="ql-formats">
        <select class="ql-color">
          <option selected="selected"></option>
          <option value="#e60000"></option>
          <option value="#ff9900"></option>
          <option value="#ffff00"></option>
          <option value="#008a00"></option>
          <option value="#0066cc"></option>
          <option value="#9933ff"></option>
          <option value="#ffffff"></option>
          <option value="#facccc"></option>
          <option value="#ffebcc"></option>
          <option value="#ffffcc"></option>
          <option value="#cce8cc"></option>
          <option value="#cce0f5"></option>
          <option value="#ebd6ff"></option>
          <option value="#bbbbbb"></option>
          <option value="#f06666"></option>
          <option value="#ffc266"></option>
          <option value="#ffff66"></option>
          <option value="#66b966"></option>
          <option value="#66a3e0"></option>
          <option value="#c285ff"></option>
          <option value="#888888"></option>
          <option value="#a10000"></option>
          <option value="#b26b00"></option>
          <option value="#b2b200"></option>
          <option value="#006100"></option>
          <option value="#0047b2"></option>
          <option value="#6b24b2"></option>
          <option value="#444444"></option>
          <option value="#5c0000"></option>
          <option value="#663d00"></option>
          <option value="#666600"></option>
          <option value="#003700"></option>
          <option value="#002966"></option>
          <option value="#3d1466"></option>
        </select>
        <select class="ql-background">
          <option value="#000000"></option>
          <option value="#e60000"></option>
          <option value="#ff9900"></option>
          <option value="#ffff00"></option>
          <option value="#008a00"></option>
          <option value="#0066cc"></option>
          <option value="#9933ff"></option>
          <option selected="selected"></option>
          <option value="#facccc"></option>
          <option value="#ffebcc"></option>
          <option value="#ffffcc"></option>
          <option value="#cce8cc"></option>
          <option value="#cce0f5"></option>
          <option value="#ebd6ff"></option>
          <option value="#bbbbbb"></option>
          <option value="#f06666"></option>
          <option value="#ffc266"></option>
          <option value="#ffff66"></option>
          <option value="#66b966"></option>
          <option value="#66a3e0"></option>
          <option value="#c285ff"></option>
          <option value="#888888"></option>
          <option value="#a10000"></option>
          <option value="#b26b00"></option>
          <option value="#b2b200"></option>
          <option value="#006100"></option>
          <option value="#0047b2"></option>
          <option value="#6b24b2"></option>
          <option value="#444444"></option>
          <option value="#5c0000"></option>
          <option value="#663d00"></option>
          <option value="#666600"></option>
          <option value="#003700"></option>
          <option value="#002966"></option>
          <option value="#3d1466"></option>
        </select>
        <button type="button" class="ql-bold"></button>
        <button type="button" class="ql-italic"></button>
        <button type="button" class="ql-underline"></button>
        <button type="button" class="ql-strike"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-align">
          <option selected="selected"></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
        </select>
        <button type="button" class="ql-indent" value="-1"></button>
        <button type="button" class="ql-indent" value="+1"></button>
        <button type="button" class="ql-list" value="ordered"></button>
        <button type="button" class="ql-list" value="bullet"></button>
      </span>
      <!-- <span class="ql-formats">
        <select class="ql-font">
          <option selected="selected"></option>
          <option value="serif"></option>
          <option value="monospace"></option>
        </select>
      </span> -->
      <span class="ql-formats">
        <button type="button" class="ql-code-block"></button>
        <button type="button" class="ql-link"></button>
        <Uploader
          customClass="dis-inline"
          :saveSuccessFn="getImgUrl"
          tip="">
          <button type="button">
            <svg viewBox="0 0 18 18">
              <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
              <circle class="ql-fill" cx="6" cy="7" r="1"></circle>
              <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
            </svg>
          </button>
        </Uploader>          
      </span>
    </div>
  </quill-editor>
</template>
<script>
import { quillEditor } from "vue-quill-editor";
import Uploader from "@/components/Uploader";
import consts from "@/utils/consts";
export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "请输入相关内容"
    }
  },
  data() {
    return {
      action: consts.BASE_URL + "/attachment/uploadFile",
      content: "",
      editorOption: {
        modules: {
          toolbar: "#toolbar"
        },
        placeholder: this.placeholder
      }
    };
  },
  created() {
    this.content = this.value;
  },
  methods: {
    // 获取上传图片
    getImgUrl(data) {
      this.editor.focus();
      this.editor.insertEmbed(
        this.editor.getSelection().index,
        "image",
        data.data.path
      );
    },
    // 获取富文本内容
    getValue({ editor, html, text }) {
      this.$emit("input", html);
    }
  },
  computed: {
    editor() {
      return this.$refs.editor.quill;
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== this.content) {
        this.content = newVal;
      }
    }
  },
  components: {
    quillEditor,
    Uploader
  }
};
</script>

/*
  富文本编辑组件
    props
      属性名|说明
      value|文本内容
 */