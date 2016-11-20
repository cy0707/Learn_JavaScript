(function($){
	// 获取浏览器的前缀，判断某个元素的css是否存在transition属性
	var _prefix = (function(temp){
		var aPrefix = ['webkit','moz','o','ms'],
			props = '';
		for(var i in aPrefix){
			// 驼峰式，判读属性
			props = aPrefix[i] + 'Transition';
			if (temp.style[props] !== undefined) {
				return '-' + aPrefix[i] + '-';
			}
		}
		return false;
	})(document.createElement('div'));

	var PageSwitch = (function(){
		// 构造函数
		function PageSwitch(ele, options){
			this.settings = $.extend(true, $.fn.PageSwitch.defaults, options||{});
			//ele代表一个元素集合
			this.element = ele;
			this.init();
		}
		// 构造函数的原型
		PageSwitch.prototype = {
			// 初始化插件，初始化DOM结构，布局，分页绑定事件
			init: function(){
				var self = this;
				// 找到各种dom的选择器
				self.selectors = self.settings.selectors;
				// 滑块容器
				self.sliderWrapper = self.element.find(self.selectors.sliderWrapper);
				// 每一个滑块
				self.slider = self.element.find(self.selectors.slider);
				// 滑动方向,垂直方向设置为默认方向
				self.direction = self.settings.direction == 'vertical'? true : false;
				// 滑块的个数
				self.pagesCount = self.pagesCount();
				// 获取索引中.设置默认索引值为0
				self.index = (self.settings.index >=0 && self.settings.index < self.pagesCount) ? self.settings.index : 0;
				// 滑动方向
				if (!self.direction) {
					// 如果不是默认的垂直方向，是水平方向，那么就调用水平的布局方向
					self._initLayout();
				}
				// 判读一个动画执行完毕，再执行另一个
				self.canScroll = true;
				// 如果分页其存在
				if (self.settings.pagination) {
					self._initPaging();
				}
				// 绑定的事件
				self._initEvent();
			},	
			// 获取滑块的数量
			pagesCount: function() {
				return this.slider.length;

			},
			// 滑动的宽度（横屏滑动）或者高度（竖屏滑动）
			switchLength: function() {
				return this.direction ? this.element.height() : this.element.width();
			},
			// 主要针对横屏情况进行页面布局
			_initLayout: function() {
				var self = this;
				var sliderWrapperW = self.pagesCount*100 + '%',
				// 除不尽的话，保留小数
					sliderW = (100/self.pagesCount.toFixed(2)) + '%';
				self.sliderWrapper.width(sliderWrapperW);
				self.slider.width(sliderW).css('float','left');

			},
			// 实现分页的Dom结构及CSS样式
			_initPaging: function() {
				var self = this,
					pagesClass = self.settings.selectors.page.substring(1);
					self.activeClass = self.settings.selectors.active.substring(1);
				var pageHtml = '<ul class='+pagesClass+'>';
				for (var i = 0; i < self.pagesCount; i++) {
					pageHtml += '<li></li>';
				}
				pageHtml += '</ul>';
				// 插入到DOM中
				$(self.element).append(pageHtml);
				var pages = self.element.find(self.selectors.page);
				self.pageItem = pages.find('li');
				self.pageItem.eq(self.index).addClass(self.activeClass);

				// 判断横屏还是竖屏,给分页容器添加class
				if (self.direction) {
					pages.addClass('vertical');
				}else{
					pages.addClass('horizontal');
				}
			},
			// 初始化插件事件
			_initEvent: function() {
				var self = this;
				// 分页点击事件(page容器里面的li元素)
				self.element.on('click', self.selectors.page + ' li',function(){
					self.index =$(this).index();
					self._scrollPage();
				});
				// 监听鼠标滚轮事件
				self.element.on('mousewheel DOMMouseScroll', function(e){
					e.preventDefault();
					if (self.canScroll) {
						var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
						// 鼠标向上滚动,且索引值大于0，且为不循环滚动 或者loop为true
						if (delta > 0 && (self.index && !self.settings.loop || self.settings.loop) ) {
							self.prev();
						}else if(delta < 0 && (self.index < (self.pagesCount -1) && !self.settings.loop || self.settings.loop)){
							self.next();
						}
					}
				});
				// 键盘事件
				if (self.settings.keyboard) {
					$(window).on('keydown', function(e){
						var keyCode = e.keyCode;
						// 如果是方向左键或者上键
						if (keyCode === 37 || keyCode === 38) {
							self.prev();
						// 如果是方向右键或者方向下键
						}else if(keyCode === 39 || keyCode === 40){
							self.next();
						}
					});
				}

				// 窗口resize事件时
				$(window).resize(function(){
					// 获取当前的窗口的高宽
					var currentLength = self.switchLength(),
						offset = self.settings.direction ? self.slider.eq(self.index).offset().top : self.slider.eq(self.index).offset().left;
						// 如果
						if (Math.abs(offset) > currentLength/2 && self.index < pagesCount -1) {
							self.index++;
						}
						if (self.index) {
							self._scrollPage();
						}
				});
				if (_prefix) {
					// 动画完成之后的事件
					self.sliderWrapper.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend',function(){
							// 这一个动画，执行完成，下一个动画可以开始了
						self.canScroll = true;
						if (self.settings.callback && $.type(self.settings.callback) === 'function') {
							self.settings.callback();
						}
					});
				}
			},
			// 向前滑动即上一个页面
			prev: function() {
				var self = this;
				if (self.index > 0) {
					self.index --;
					// 如果是循环的话
				}else if(self.settings.loop) {
					// 滑到index为0，向后滑动的话，就滑到最后一个
					self.index = self.pagesCount - 1;
				}
				self._scrollPage();
			},
			// 向后滑动即下一个页面
			next: function() {
				var self = this;
				if (self.index < self.pagesCount) {
					self.index ++;
				}else if(self.settings.loop) {
					self.index = 0;
				}
				self._scrollPage();
			},
			// 滑动动画
			_scrollPage: function(init) {
				var self = this;
				// 每次滑动的距离
				var dest = self.slider.eq(self.index).position();
				if (!dest) {
					return;
				}
				// 在动画开始的时候，下一个动画被禁止
				self.canScroll = false;
				// 如果支持CSS3的话，就直接设置css3的动画
				if (_prefix) {
						var translate = self.direction ? 'translateY(-' + dest.top + 'px)': 'translateX(-' + dest.left + 'px)';
					self.sliderWrapper.css(_prefix + 'transition', 'all '+ self.settings.duration + 'ms '+self.settings.easing);
					self.sliderWrapper.css(_prefix + 'transform', translate);
				}else{
					// 不支持的话，就使用jQuery的animate动画
					var animateCss = self.direction ? {top: -dest.top} : {left: -dest.left};
					    self.sliderWrapper.animate(animateCss, self.settings.duration, function(){
					    	// 这一个动画，执行完成，下一个动画可以开始
					    	self.canScroll = true;
					    	if (self.settings.callbac) {
					    		self.settings.callback();
					    	}
					    });
				}
				if (self.settings.pagination && !init) {
					self.pageItem.eq(self.index).addClass(self.activeClass).siblings('li').removeClass(self.activeClass);
				}
			}

		};
		// 返回这个构造函数
		return PageSwitch;
	})();

	$.fn.PageSwitch = function(options) {
		// 此时的this代表$ ----元素选择器
		return this.each(function(){
			// self代表选择的元素
			var self = $(this),
			    instance = self.data('PageSwitch');
			if (!instance) {
				instance = new PageSwitch(self, options);
				self.data('PageSwitch', instance);
			}
			// 方法的调用
			if ($.type(options) === 'string') {
				return instance[options]();
			}
		});
	};

	$.fn.PageSwitch.defaults = {
		// 各种默认的class
		selectors: {
			sliderWrapper: '.slider-wrapper', //滑块容器
			slider: '.slider', //滑块
			page: '.page', //分页
			active: '.active' //激活class
		},
		index: 0, //索引值
		easing: 'ease', //动画方式
		duration: 500, //过度事件
		loop: false, //是否循环
		pagination: true, //分页
		keyboard: true, //是否键盘控制
		direction: 'vertical', //滑动方向
		callback: ''  //回调函数

	};
	
})(jQuery)
