<!--
权限控制
@example
<perm key="dashboard.read">
  ...
</perm>
-->
<template>
  <span v-if="hasPerm(perm)">
    <slot></slot>
  </span>
  <span v-else>
    <slot name="noPerm"></slot>
  </span>
</template>

<script>
  import auth from "@/utils/auth";
  export default {
    name: 'auth',
    props: {
      perm: {
        type: String
      },
    },
    methods: {
      hasPerm(perm) {
        return auth.hasPerm(perm);
      }
    }
  }
</script>
