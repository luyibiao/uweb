<template>
  <div>
    <custom-select
      v-bind:options="options"
      v-bind:key="key"
      v-bind:def="def"
    >
    </custom-select>
    <template id="select_template">
        <select class="form-control" id="customer">
            <option v-for="(item,key) in options" value="@{{key}}">@{{ item }}:@{{ key }}</option>
        </select>
    </template>
  </div>
</template>


<script>
  import consts from '@/utils/consts'

  Vue.component("custom-select",{
    data:function(){
      return {

      }
    },
    props:["options","key","def","placeholder"],
    template:'#select_template',
  })
</script>