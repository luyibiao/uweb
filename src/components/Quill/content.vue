<template>
  <div class="quill-editor ql-editor" v-html="value"></div>
</template>
<script>
require("quill/dist/quill.core.css");
export default {
  props: ["value"]
};
</script>
//富文本编辑器内容展示容器