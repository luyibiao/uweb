export default {
  path: "/stac",
  component: resolve => require(["@/app/stac/index"], resolve),
  children:[
    {
      path:'notice',
      component: resolve =>
        require(["@/app/stac/notice/detail.vue"], resolve) 
    }
  ]
};
