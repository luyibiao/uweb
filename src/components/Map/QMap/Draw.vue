<template>
	<div class="ukao-v-loading" v-loading="loading">
		<div class="map-container" >
			<div id="container" class="map-sub-container"></div>
		</div>

		<!-- 弹出层显示人员模板 -->
		<div id="infoWinTemplate" ref="infoWinTemplate" style="display: none">
			<div class="map_info_win">
				<div class="w_bh">
					<span style="font-weight: 600">ID:{0}</span>
					<span class="w_cz">
						<!--<button type="primary" size="mini" onclick="addWorker('{1}')" class="detailBtn">编辑</button>-->
						<!--<button type="text" size="mini" onclick="deleteSelectedRegion('{2}')"  class="deleteBtn">删除</button>-->
						<auth perm="weixin.dispatch.dispatch.update">
							<el-button type="text" size="mini" id="detailBtn_{1}" class="detailBtn">编辑</el-button>
							<el-button type="text" size="mini" id="deleteBtn_{2}" class="deleteBtn text-danger">删除</el-button>
						</auth>
					</span>
				</div>
				<div class="w_list" id="js_win_data_{3}">
					<ul>
						{4}
						<!--<li>-->
							<!--<img class="w_img" src="images/avatar_user.png">-->
							<!--<div>名称</div>-->
						<!--</li>-->
						<!--<div class="w_empty">还未指派取送员</div>-->
					</ul>
				</div>
			</div>
		</div>
		<!-- end 弹出层模板 -->


	</div>
</template>


<script>
	import base from '@/utils/helpers/base'
  export default {
		props: ['center','callback'],
    data: function() {
      return {
				loading: false,
				core:{			//默认中心点的位置
				  lng: 112.881080,
					lat: 28.217320
				},
				QMap: {
				  map: {},	//地图对象
					drawingManager:{}		//绘图对象
				},
				selectedRegion:{		    //选择区域
					isLoadDataList : true,	//是否加载查询
					radius : 1000,		//默认类型marker半径
					overlaysArray: [		//已经选的与其列表,覆盖区域
//            {								//参数格式
//              id: '',		//选择区域id
//              code: '',		//弹出提示唯一编码
//              overlay: '',	//	覆盖
//              type: '',		//图形类型
//              infoWin: ''	//弹出文字层对象
//            }
					]
				}
      }
    },
		mounted() {
		  if(this.center && this.center.lng && this.center.lat){
				this.core.lng = this.center.lng
				this.core.lat = this.center.lat
			}
			setTimeout(() => {
				this.init()
			}, 1500);
    },
		watch:{
		  'center.lng'(val){
				this.core.lng = val || this.core.lng
			},
			'center.lat'(val){
				this.core.lat = val || this.core.lat
			}
		},
		methods: {
			//初始化
			init(){
			  var _this = this
        var map = new qq.maps.Map(document.getElementById("container"), {
					 center:  new qq.maps.LatLng(_this.core.lat, _this.core.lng),      // 地图的中心地理坐标。
					 zoom: 11                                               //缩放比例
        });
        this.QMap.map = map

				var drawingManager = new qq.maps.drawing.DrawingManager({
					drawingMode: qq.maps.drawing.OverlayType.POLYGON,
					drawingControl: true,
					drawingControlOptions: {
							position: qq.maps.ControlPosition.TOP_CENTER,
							drawingModes: [
//									qq.maps.drawing.OverlayType.MARKER,
//									qq.maps.drawing.OverlayType.CIRCLE,
									qq.maps.drawing.OverlayType.POLYGON,
//									qq.maps.drawing.OverlayType.POLYLINE,
//									qq.maps.drawing.OverlayType.RECTANGLE
							]
					},
					circleOptions: {
							fillColor: new qq.maps.Color(255, 208, 70, 0.3),
							strokeColor: new qq.maps.Color(88, 88, 88, 1),
							strokeWeight: 3,
							clickable: false
					}
				});
    		drawingManager.setMap(map);
    		this.QMap.drawingManager = drawingManager

				//添加绘图监听事件
				this.addListener()

				//初始化地图后回调
				if(typeof (this.callback) === 'function'){
					this.callback({action: 'init', fn : function (list) {
						list.forEach(function (item) {
							var assign = item
							var signs = item.signList || []
							var workers = item.workList || []

							//设置覆盖区域
							var paths = []
							signs = signs.sort(function(a , b){
			          return a.sortNo - b.sortNo;
			      	})
							signs.forEach(function (sitem) {
								 paths.push(new qq.maps.LatLng(sitem.latitude, sitem.longitude));
              })
							//在地图上设置绘画层
							var overlay = _this.setPolygon(paths);

							//文字弹出层坐标位置
							var pointSign = {
								latitude : assign.latitude || signs[0].latitude,
								longitude : assign.longitude || signs[0].longitude
							}

							//设置覆盖区域文字
							var infoWinTemplate = _this.infoWinWork({
									regionAssign : assign,
									workList : workers
							});

							//设置弹出层
							var infoWin = _this.setAssignDom(pointSign, infoWinTemplate);

							//缓存对象
							var regionParam = {
								id : assign.id,		//选择区域id
								code : assign.code,		//弹出提示唯一编码
								overlay : overlay,	//	覆盖
								type : assign.regionType,		//图形类型
								infoWin : infoWin	//弹出文字层对象
							}
							_this.addOverlaysArray(regionParam)
						})
						//弹出层btn添加事件
						_this.addBtnEvent()
          }})
					_this.loading = false
				}
      },
			addListener(){		//添加绘图监听事件
		    var _this = this
				qq.maps.event.addListener(_this.QMap.drawingManager, 'overlaycomplete', function(event) {

					//取第一个坐标作为显示编号弹出层的位置
					var pointSign = {
						longitude : '',
						latitude : ''
					};

					//获得绘图区域所有坐标
				  var points = '';
					if(event.type == "polygon" || event.type == "rectangle") {	//图形类型
						//坐标拼接
						event.overlay.getPath().forEach(function(e){
							var lng = e.getLng()
        			var lat = e.getLat()

							//取第一个点坐标
							if(!pointSign.longitude && !pointSign.latitude){
								pointSign.longitude = lng;
								pointSign.latitude = lat;
							}
							points += lng+","+lat+"|";
            })
						//去掉最后一个'|'
						points = points.substring(0, points.length-1);

						//如果绘图只有2个点，不能构成一个范围，不保存。
						if(points.split("|").length > 2){
							var data = {
								points : points,
								pointSign : pointSign,
								type : event.type,
								overlay : event.overlay
							}
							_this.addPeopleDataByPolygon(data)
            }else{
							event.overlay.setMap(null);
						}
          }
        })
			},
			//多边形路区域
			addPeopleDataByPolygon(data){
			  var _this = this
				_this.callback({action: 'save', data:data, fn: function (regionParam, data) {
					_this.getInfoWinTemplate(regionParam, data)
        },removeFn: function (regionParam) {
          _this.delete(regionParam)
        }})
			},
			delete(regionParam){
        regionParam.id= '-100';
        this.addOverlaysArray(regionParam);
				this.clearOverlayItem( regionParam.id);
			},
			//弹出人员模板
			getInfoWinTemplate(regionParam, data){
				var _this = this

			  var infoWinTemplate = this.$refs.infoWinTemplate.innerHTML
				infoWinTemplate = infoWinTemplate.toString().format(data.code,data.id,data.id, data.id, '<div class="w_empty">还未指派取送员</div>')
				regionParam.pointSign.latitude = data.latitude || regionParam.pointSign.latitude;
				regionParam.pointSign.longitude = data.longitude || regionParam.pointSign.longitude;
				var infoWin = this.setAssignDom(regionParam.pointSign, infoWinTemplate);

				//页面缓存选择区域
				regionParam.id = data.id;
				regionParam.code = data.code;
				regionParam.infoWin = infoWin;
				_this.addOverlaysArray(regionParam)

				//直接弹出选择人员
				_this.callback({action: 'addWorker', data:{id:data.id,code:data.code}, fn : function (data) {
				  _this.infoWinWorkDataList(data);
				}})

        //弹出层btn添加事件
        _this.addBtnEvent();
			},
			//设置选择覆盖区域显示文字
			setAssignDom(pointSign, infoWinTemplate){
				var center = new qq.maps.LatLng(pointSign.latitude, pointSign.longitude);
				var infoWin = new qq.maps.InfoWindow({
						map: this.QMap.map
				});
				infoWin.open();
				//tips  自定义内容
				infoWin.setContent(infoWinTemplate);
				infoWin.setPosition(center);
				return infoWin;
			},
			//页面缓存选择区域
			addOverlaysArray (data){
				this.selectedRegion.overlaysArray.push({
					id : data.id,
					code : data.code,
					overlay : data.overlay,
					type : data.type,
					infoWin : data.infoWin
				});
			},
			//清除绘图区域
			clearOverlays(overlaysArray, regionAssignId){
				if (overlaysArray && overlaysArray.length > 0) {
				  //按id删除
				  if(regionAssignId) {
            for (var i in overlaysArray) {
              var item = overlaysArray[i];
              if (regionAssignId == item.id || regionAssignId == item.code) {
                if (item.overlay) {
                  item.overlay.setMap(null);
                } else {
                  item.setMap(null);
                }
              }
            }
          }else{
				    //清除所有
						for (var i in overlaysArray) {
							var item = overlaysArray[i];
							if (item.overlay) {
								item.overlay.setMap(null);
							}else{
								item.setMap(null);
							}
						}
					}
        }
			},
			//清楚绘图区域和层
			clearOverlayItem(id){
				this.selectedRegion.overlaysArray.forEach(function (item) {
					if(id && id == item.id){
						if(item.overlay){
							item.overlay.setMap(null);
						}
						if(item.infoWin){
							item.infoWin.close();
						}
					}
				})
			},
			//初始化弹出
			infoWinWork(data){
				if(!data || !data.regionAssign) {
        	return false;
				}
				//获取弹出层模板
				var infoWinTemplate = this.$refs.infoWinTemplate.innerHTML
				var liList = [];
				var workList = data.workList || [];
				if(workList && workList.length > 0){
					workList.forEach(function (item, index) {
						var img = item.imgPath ? item.imgPath : '/static/img/work/def.png';
						liList.push('<li>');
						liList.push('<img class="thumb-sm img-circle" src="'+img+'">');
						liList.push('<div>'+(item.name || '')+'</div>');
						liList.push('</li>');
					});
				}else{
						liList.push('<div class="w_empty">还未指派取送员</div>');
				}
				infoWinTemplate = infoWinTemplate.toString().format(
					data.regionAssign.code,
					data.regionAssign.id,
					data.regionAssign.id,
					data.regionAssign.id,
					liList.join(''));
				return infoWinTemplate;
			},
			addBtnEvent(){
				var _this = this;
				setTimeout(() => {
          _this.selectedRegion.overlaysArray.forEach(function (item) {
            let detailBtn = document.getElementById('detailBtn_' + item.id);
            let deleteBtn = document.getElementById('deleteBtn_' + item.id);
            _this.addBtnEventListener(detailBtn, {id: item.id, code: item.code})
            _this.addBtnEventListener(deleteBtn, {id: item.id, code: item.code})
          })
				},1000)
			},
			//给绘画层btn添加事件
			addBtnEventListener(btn, params){
			  if(!btn){
			    return
				}
				var _this = this
				btn.addEventListener('click', function(btnObj){
					//格式<btton><span>text</span></button>
					//或<btton>text</button>
					//console.log('but', val.target, val.target.parentElement.id || '-', id)
					var btnId = btnObj.target.parentElement.id || btnObj.target.id
					var action = btnId.indexOf('detailBtn_') >= 0 ? 'addWorker' : ''
					 action = btnId.indexOf('deleteBtn_') >= 0 ? 'deleteRegion' : action
					//回调方法
					_this.callback({action: action, data:params, fn : function (data) {
						 if(action === 'deleteRegion'){
								_this.clearOverlayItem(data.id)
						 }
						 if(action === 'addWorker'){
							 _this.infoWinWorkDataList(data)
						 }
					}})
				})

			},
			//地图设置选择覆盖区域
			setPolygon(path) {
				var polygon = new qq.maps.Polygon({
					path:path,
		//		    strokeColor: '#000000',
		//		    strokeWeight: 1,
		//		    fillColor: '#111111',
					map: this.QMap.map
					});
				return polygon;
			},
			//单个绘图选择添加人员后动态注入选择的人员，不刷新页面
			infoWinWorkDataList(data){
				//弹出层id格式 js_win_data_000
				var dataListDom = document.getElementById("js_win_data_" + data.regionAssign.id);
				var liList = [];
				var workList = data.workList || [];
				if(workList && workList.length > 0){
					liList.push('<ul>')
					workList.forEach(function (item, index) {
							var img = item.imgPath ? item.imgPath : '/static/img/work/def.png';
							liList.push('<li>');
							liList.push('<img class="thumb-sm img-circle" src="'+img+'">');
							liList.push('<div>'+(item.name || '')+'</div>');
							liList.push('</li>');
					 });
					liList.push('</ul>')
					dataListDom.innerHTML = liList.join('')
				}
			}

    }
  }
	//字符串占位符替换
	String.prototype.format = function() {
	  if(arguments.length == 0) return this;
	  for(var s = this, i = 0; i < arguments.length; i++)
	    s = s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);
	  return s;
	}
</script>

<style>
	.map-container {
		position: fixed;
		top: 140px;
		left: 40px;
		right: 40px;
		bottom: 40px;
		z-index: 10;
	}

	.map-sub-container {
	 	width: 100%;
		height: 100%;
	}
	.map_info_win{
		min-width:250px;padding-top:5px;font-size: 12px
	}
	.map_info_win .w_bh{
		border-bottom: 1px solid #cae8fb;
		font-size: 14px;
	}
	.map_info_win .w_list {
		margin: 5px 0px;
	}
	.map_info_win .w_list ul {
		text-align: center;
		overflow: hidden;
		padding-bottom: 10px;
	}
	.map_info_win .w_list ul li{
		float: left;
		width: 60px;
		height: 65px;
	}
	.map_info_win .w_list ul li img{
		height: 40px;
	}
	.map_info_win .w_empty{
		height: 50px;
		line-height: 50px;
		text-align: center;
	}
	.w_bh .w_cz{
		text-align: right;position: absolute;right: 5px;
	}
	.w_bh .w_cz a{
		margin-left: 10px;
	}
</style>
