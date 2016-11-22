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
		this.animate = true; //动画的在上一次没执行完，不执行下一次动画

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
				self.groupData = []; //每次点击一个，就清空信息，避免不同组的信息添加集合在一起
				self.groupName = curGroupName;
				self.getGroup();

			}
			// 点击时，初始化弹出框.此时的this是点击的哪一个元素
			self.initPop($(this));
		});
		// 关闭弹出
		this.popMask.on('click', function(event) {
			event.preventDefault();
			$(this).fadeOut();
			self.popContent.fadeOut();
			self.popShow = false;
		});
		this.closeBtn.on('click', function(event) {
			event.preventDefault();
			self.popMask.fadeOut();
			self.popContent.fadeOut();
			self.popShow = false;
		});
		// 绑定上下切换按钮事件
		this.prevArrow.hover(function() {
			// 如果这个箭头没有禁用标志且这一组的长度大于1，那么移除时出现箭头
			if (!$(this).hasClass('arrow-disable') && self.groupData.length > 1) {
				$(this).addClass('prev-arrow-show');
			}
		}, function() {
			if (!$(this).hasClass('arrow-disable') && self.groupData.length > 1) {
				$(this).removeClass('prev-arrow-show');
			}
		});
		this.nextArrow.hover(function() {
			// 如果这个箭头没有禁用标志且这一组的长度大于1，那么移除时出现箭头
			if (!$(this).hasClass('arrow-disable') && self.groupData.length > 1) {
				$(this).addClass('next-arrow-show');
			}
		}, function() {
			if (!$(this).hasClass('arrow-disable') && self.groupData.length > 1) {
				$(this).removeClass('next-arrow-show');
			}
		});
		// 箭头点击切换事件
		this.prevArrow.on('click', function(event) {
			event.preventDefault();
			// 如果元素没用禁用，这表示有该事件
			if (!$(this).hasClass('arrow-disable') && self.animate) {
				// 动画开始的时候，这个标志设置为false
				self.animate = false;
				self.switchImg('prev');
			}
		});
		this.nextArrow.on('click', function(event) {
			event.preventDefault();
			// 如果元素没用禁用，这表示有该事件
			if (!$(this).hasClass('arrow-disable') && self.animate) {
				// 动画开始的时候，这个标志设置为false
				self.animate = false;
				self.switchImg('next');
			}
		});
		// 当弹出框出现时，才进行resize事件，不然弹出框没有出现的话，还是在进行该事件
		// 对性能消耗较大 
		var timer = null;  //清楚定时器
		this.popShow = false;
		// 根据窗口进行resize事件，来调整图片的大小
		$(window).resize(function(event) {
			if (self.popShow) {
				clearTimeout(timer);
				timer = setTimeout(function() {
					self.loadImgSize(self.groupData[self.index].src);
				}, 500);
			}
		// 键盘事件
		}).keyup(function(event) {
			if (self.popShow) {
				var keyValue = event.keyCode;
				if (keyValue === 38 || keyValue === 37) {
					// 左箭头或上箭头
					self.prevArrow.click();
				}else if(keyValue === 40 || keyValue === 39){
					// 有箭头或者下箭头
					self.nextArrow.click();
				}
			}
			
		});
	};
	Lightbox.prototype = {
		// 初始化弹出层的DOM
		renderUI: function(){
			var popStr = '<div class="img-view">' +
							'<img class="pop-img" alt="图片">' +
							'<span class="arrow prev-arrow"></span>' +
							'<span class="arrow next-arrow"></span>' + 
						'</div>'+
						'<div class="img-caption">'+
							'<p></p>'+
							'<div class="img-index"></div>'+
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
					caption: $(this).attr('data-caption'),
					src: $(this).attr('src')
				});
			});
		},
		// 点击时，初始化弹出
		initPop: function(curEle) {
			var self = this,
				curId = curEle.attr('data-id'),
				sourceSrc = curEle.attr('src');
			// 预加载pop弹窗
			this.preloadPop(curId,sourceSrc);
		},
		// 预加载pop弹窗
		preloadPop: function(curId,sourceSrc) {
			var self = this;
			//先出现一个白色的预加载loading框，其他的隐藏起来。
			this.img.hide();
			this.imgCaption.hide();
			this.popMask.fadeIn();
			this.closeBtn.hide();
			// 获取可视区域的高宽
			var winWidth = $(window).width(),
			    winheight = $(window).height();
			// 把图片预览区设置为可视区域高宽的一半
			this.imgView.css({
				width: winWidth/2,
				height: winheight/2 
			});
			//弹出框显示
			this.popContent.fadeIn();
			this.popContent.css({
				width: 0,
				height: 0
			}).animate({
				width: winWidth/2 + 20,
				height: winheight/2 +20
			    },function() {
				// 弹框预加载后，要获取图片的真实地址
				self.loadImgSize(sourceSrc);
			});

			//获取当前点击的元素ID获取在当前组别里面的索引
			this.index = this.getIndexOf(curId);
			// 获取该组的长度
			var groupLength = this.groupData.length;
			// 对该组里面进行判断，当只有一个，此时不需要箭头
			// 当大于一个，最开始的一个不需要箭头，最后一个不需要箭头
			if (groupLength > 1) {
				if (this.index === 0) {
					this.prevArrow.addClass('arrow-disable');
					this.nextArrow.removeClass('arrow-disable');
				}else if(this.index === groupLength-1){
					this.nextArrow.addClass('arrow-disable');
					this.prevArrow.removeClass('arrow-disable');
				}else{
					this.prevArrow.removeClass('arrow-disable');
					this.nextArrow.removeClass('arrow-disable');
				}
			}
		},
		getIndexOf: function(curId) {
			var index = 0;
			$(this.groupData).each(function(i) {
				if (this.id === curId) {
					// 获取该索引值
					index = i;
					return;
				};
			});
			return index;
		},
		// 获取加载图片的大小
		loadImgSize: function(sourceSrc) {
			// 图片加载之后的回调函数
			var self = this;
			//避免下一次的图片比例还是保存上一次的图片比例
			self.img.css({
				width: 'auto',
				height: 'auto'
			});
			// 切换下一个图片，先把描述的文本隐藏掉
			self.imgCaption.hide();
			this.preLoading(sourceSrc, function(){
				self.img.attr('src', sourceSrc);
				var imgWidth = self.img.width(),
					imgHeight = self.img.height();
				// 获取到图片的宽高，此时需要把图片塞进弹出框，来改变弹出框的大小
				self.changeImg(imgWidth, imgHeight);
			});
		},
		// 图片预加载
		preLoading: function(sourceSrc, callback){
			// 创建一个Image对象：var a=new Image();    
			// 定义Image对象的src: a.src=”xxx.gif”;    
			// 这样做就相当于给浏览器缓存了一张图片。
			var img = new Image();
			// 兼容低版本的IE
			if (window.ActiveXObject) {
				img.onreadystatechange = function(){
					if (this.readyState === 'complete') {
						callback();
					}
				};
			}else{
				img.onload = function() {
					callback();
				}
			}
			img.src = sourceSrc;	
		},
		// 图片和文字的填充
		changeImg: function(imgWidth, imgHeight){
			var self = this,
				winWidth = $(window).width(),
				winheight = $(window).height();

			// 如果浏览器的宽高比大于浏览器视口的宽高比，那么缩小图片
			// 让图片一直出现在视口里面
			var scale = Math.min(winWidth / (imgWidth + 20), winheight / (imgHeight + 20), 1);
			imgWidth = imgWidth*scale;
			imgHeight = imgHeight*scale;

			this.imgView.animate({
				width: imgWidth-20,
				height: imgHeight-20
			});
			this.popContent.animate({
				width: imgWidth,
				height: imgHeight
			},function(){
				// 过渡完成后，回调函数
				self.img.css({
					width: imgWidth-20,
					height: imgHeight-20
				}).fadeIn();
				self.imgCaption.fadeIn();
				self.closeBtn.fadeIn();
				// 动画开始的时候，这个标志设置为false
				self.animate = true;
				self.popShow = true;
			});

			// 加载文字和当前索引
			this.captionText.text(this.groupData[this.index].caption);
			// this.index在前面获取了当前元素索引。
			this.curIndex.text('当前索引：'+ (this.index +1) + ' of ' + this.groupData.length);
		},
		switchImg: function(direction) {
			// 向上切换
			if (direction === 'prev') {
				this.index--;
				if (this.index <= 0) {
					// 点击到第一张的，把这个禁用掉
					this.prevArrow.addClass('arrow-disable').removeClass('prev-arrow-show');
				}
				// 不等于最后一张的图片，那么上一张就可以点击
				if (this.index != this.groupData.length -1) {
					this.nextArrow.removeClass('arrow-disable');
				}
				var src = this.groupData[this.index].src;
				this.loadImgSize(src);
			// 向下切换
			}else if(direction === 'next'){
				this.index++;
				// 点击到最后一张的，把这个禁用掉
				if (this.index >= this.groupData.length -1) {
					this.nextArrow.addClass('arrow-disable').removeClass('next-arrow-show');
				}
				// 不等于第一张的图片，那么下一张就可以点击
				if (this.index != 0) {
					this.prevArrow.removeClass('arrow-disable');
				}
				var src = this.groupData[this.index].src;
				this.loadImgSize(src);
			}
		}
	};


	$.fn.Lightbox = function(){
		var lightbox = new Lightbox();
	};
	$(function(){
		$(document).Lightbox();
	})
	
})(jQuery)
