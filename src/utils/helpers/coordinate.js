var geocoder = new qq.maps.Geocoder();
export default {

  codeAddress : function (cityName,fn,_this) {
  //对指定地址进行解析
  geocoder.getLocation(cityName);
  //设置服务请求成功的回调函数
  geocoder.setComplete(function(result) {
    fn(result);
  });
  //若服务请求失败，则运行以下函数
  geocoder.setError(function() {
    _this.$message({message:"地址出错了，请截图联系管理员",type:'error'})
  });
}

}