<template>
  <div>
    <div class="second-nav-list">
      <div class="back-to-nav bg-subnav text-center">
        <v-back-to v-bind:linkto="'/marketing'" v-bind:title="'优付卡'" v-bind:totext="'营销中心'"></v-back-to>
      </div>
    </div>
    <div class="ukao-pt-md ukao-padder">
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import vBackTo from '../../Common/backto.vue';
export default {
  components: {
    vBackTo
  }
}
</script>