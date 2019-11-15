<template>
	<div>
		<el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formValidate.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="发布时间" prop="date">
        <el-date-picker
		      v-model="formValidate.date"
		      type="date"
		      placeholder="选择日期">
		    </el-date-picker>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <Editor ref="editor" v-model="formValidate.content" @change="handleEditorChange"></Editor>
        <el-input v-model="formValidate.content" style="display: none;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave" class="margin-right-sm">保存</el-button>
        <el-button @click="$router.push('/articles')">返回</el-button>
      </el-form-item>
    </el-form>
	</div>
</template>


<script>
	import { mapState } from 'vuex'
  import Editor from '@/components/Editor'

  export default {
    name: 'form',
    components: {
      Editor
    },
    created () {
      this.id = this.$route.params.id
      this.id && this.get(this.id)
    },
    data () {
      return {
        id: '',
        formValidate: {
          title: '',
          content: '',
          date: ''
        },
        ruleValidate: {
          title: [
            {
              required: true,
              message: '标题不能为空'
            },
            {
              max: 100,
              message: '标题不能多于 100 个字'
            }
          ],
          content: [
            {
              required: true,
              message: '内容不能为空'
            },
            {
              max: 2000,
              message: '内容长度过长'
            }
          ],
          date: [
          	{
              required: true,
              message: '请选择时间'
            }
          ]
        }
      }
    },
    methods: {
      get (uri) {
        this.$store.dispatch('getArticle', {uri})
      },
      handleEditorChange (html) {
        this.$set(this.formValidate, 'content', html)
      },
      handleSave () {
        this.$refs.formValidate.validate((valid) => {
          if (valid) {
            const action = this.id ? 'putArticle' : 'postArticle'
            const uri = this.id
            this.$store.dispatch(action, {
              uri,
              data: this.formValidate
            }).then(() => {
              this.$Message.success((this.id ? '编辑' : '新增') + '成功！')
              !this.id && this.resetFields()
            })
          }
        })
      },
      resetFields () {
        this.$refs.formValidate.resetFields()
        this.$refs.editor.html('')
      }
    },
    computed: mapState([
      'articles'
    ]),
    watch: {
      'articles.article': {
        handler (newVal) {
          this.$set(this, 'formValidate', newVal.data)
          this.$refs.editor.html(newVal.data.content)
        }
      }
    }
  }
</script>