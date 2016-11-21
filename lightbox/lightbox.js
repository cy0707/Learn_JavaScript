;(function($){
	// Lightbox构造函数
	var Lightbox = function(){
		var self = this;

		// 创建遮罩和弹出层
		this.popMask = $('<div class="mask"></div>');
		this.popContent = $('<div class="pop-box"></div>');
		this.bodyNode = $(document.body);

		// 初始化弹出层,把各项所需的数据保存起来
		this.renderUI();
		this.imgView = this.popContent.find('.img-view'); //图片预览区
		this.img = this.popContent.find('.img-view img'); //获取图片
		this.imgCaption = this.popContent.find('.img-caption'); //图片说明文字
		this.prevArrow = this.popContent.find('.prev-arrow'); //左箭头
		this.nextArrow = this.popContent.find('.next-arrow'); //右箭头
		this.captionText = this.popContent.find('.img-caption p'); //图片说明文字
		this.curIndex = this.popContent.find('.img-index'); //图片的索引
		this.closeBtn = this.popContent.find('.close-btn'); //关闭按钮

		// 每一组图片集的数据
		this.groupName = null;
		this.groupData = [];
		// 点击每一张图片，获取每一组图片集的数据
		this.bodyNode.on('click', 'img[data-role="lightbox"]', function(event) {
			event.preventDefault();
			// 点击每一个img元素,取得当前组的名
			var curGroupName = $(this).attr('data-group');
			// 点击img，避免同一组的信息多次获取
			if (curGroupName !== self.groupName) {
				self.groupName = curGroupName;
				self.getGroup();
			}
			// 点击时，初始化弹出框.此时的this是点击的哪一个元素
			self.initPop($(this));
		});
	};
	Lightbox.prototype = {
		// 初始化弹出层的DOM
		renderUI: function(){
			var popStr = '<div class="img-view">' +
							'<img class="pop-img" src="images/1-1.jpg" alt="图片">' +
							'<span class="arrow prev-arrow"></span>' +
							'<span class="arrow next-arrow"></span>' + 
						'</div>'+
						'<div class="img-caption">'+
							'<p>图片描述</p>'+
							'<div class="img-index">当前索引</div>'+
						'</div>'+
						'<span class="close-btn"></span>';
			this.popContent.html(popStr);
			this.bodyNode.append(this.popMask);
			this.bodyNode.append(this.popContent);
		},
		// 获取图片组的信息
		getGroup: function() {
			var self = this;
			// 根据当前的组别名称获取页面中同组的元素的对象
			var dataList = this.bodyNode.find('*[data-group = ' + this.groupName + ']');
			// 遍历该组的所有元素
			dataList.each(function() {
				self.groupData.push({
					id: $(this).attr('data-id'),
					caption: $(this).attr('data-caption')
				});
			});
		},
		// 点击时，初始化弹出
		initPop: function(curEle) {
			var self = this,
				curId = curEle.attr('data-id');
			// 预加载pop弹窗
			this.preloadPop(curId);
		},
		// 预加载pop弹窗
		preloadPop: function() {
			var self = this;
			//先出现一个白色的预加载loading框，其他的隐藏起来。
			this.img.hide();
			this.imgCaption.hide();
			this.popMask.fadeIn();
			// 获取可视区域的高宽
			var winWidth = $(window).width(),
			    winheight = $(window).height();
			// 把图片预览区设置为可视区域高宽的一半
			this.imgView.css({
				width: winWidth/2,
				heiht: winheight/2 
			});
			//弹出框显示
			this.popContent.fadeIn();
			this.popContent.css({
				width: winWidth/2 + 20,
				height: winheight/2 +20,
			});
		}	
	};
	$.fn.Lightbox = function(){
		var lightbox = new Lightbox();
	};
	$(function(){
		$(document).Lightbox();
	})
	
})(jQuery)
