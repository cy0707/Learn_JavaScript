(function(win, doc, $){
	// 定义的滚动条的构造函数
	function CusScrollBar(options) {
		// 函数的调用
		this._init(options);
	}
	// 对象的合并
	$.extend(CusScrollBar.prototype, {
		_init: function(options){
			// 闭包
			var self = this;
			// 初始化参数
			self.options = {
				scrollDir: 'Y', //滚动的方向
				contentSelector: '', //滚动内容区选择器
				barSelector: '', //滚动条选择器
				sliderSelector: '', //滚动滑块选择器
				wheelStep: 10, //滚动步长（鼠标移动一下，内容滚动的幅度）
				tabItemSelector: '.tab-item', //标题选择器
				tabActiveClass: 'tab-active', //选中标签类名,注意这里没有类名的.
				anchorSelector: '.anchor'//锚点选择器

				//每一篇内容不足以撑开可视区域的内容的话，那么点击tab的话
				// 那么那就还会定位不对的地方，此时我们可以通过css设置为min-height：100%;来解决这个问题
			}
			// 覆盖参数
			$.extend(true, self.options, options||{});
			self._initDomEvent();
			return self;
		},

		/**
		 * 初始化DOM引用
		 * @method _initDomEvent
		 * @return {CusScrollBar}
		 */
		 _initDomEvent: function() {
		 	var opts = this.options;
		 	// 滚动内容区对象，必填项
		 	this.$cont = $(opts.contentSelector);
		 	// 滚动条滑块对象，必须项
		 	this.$slider = $(opts.sliderSelector);
		 	// 滚动条对象
		 	this.$bar = opts.barSelector ? $(opts.barSelector) : self.$slider.parent();
		 	// 标签项
		 	this.$tabItem = $(opts.tabItemSelector);
		 	//锚点项
		 	this.$anchor = $(opts.anchorSelector);
		 	// 获取文档对象
		 	this.$doc = $(doc);
		 	this._initSliderDragEvent();
		 	this._bindContentScroll();
		 	this._bindMousewheel();
		 	this._initTabEvent();
		 	this._initSliderHeight();

		 },
		 // 根据内容来定义滑块的高度
		 _initSliderHeight: function() {
		 	var rate = this.$cont.height()/this.$cont[0].scrollHeight;
		 	var sliderHeight = rate*this.$bar.height();
		 	this.$slider.css('height',sliderHeight);
		 },
		 /**
		  * 初始化标签切换功能
		  * @return {[Object]} [this]
		  */

		_initTabEvent: function() {
			var self = this;
			self.$tabItem.on('click',function(e){
				e.preventDefault();
				var index = $(this).index();
				self.changeTabSelect(index);
			// 点击锚点，滚到对应的内容：已经滚出可视区的内容高度+指定锚点与内容容器的距离
			    self.scrollTo(self.$cont[0].scrollTop + self.getAnchorPosition(index));
			    //scrollTo是设置$cont的位置的函数

			})
			return self;
		},
		// 切换标签的选中
		changeTabSelect: function(index){
			var self = this,
			active = self.options.tabActiveClass;
			//切换标签选中
			self.$tabItem.eq(index).addClass(active).siblings().removeClass(active);
		},
		// 获取锚点内容与上边界的像素数(锚点h3)
		getAnchorPosition: function(index) {
			return this.$anchor.eq(index).position().top;
		},
		// 获取每个锚点位置信息的数组
		getAllAnchorPosition: function() {
			var self = this,
			    allPositonArr = [];
			for (var i = 0; i < self.$anchor.length; i++) {
				 allPositonArr.push(self.$cont[0].scrollTop + self.getAnchorPosition(i))
			}
			return allPositonArr;
		},
		 /**
		  * 初始化滑块拖动功能
		  * @return {[Object]} [this]
		  */
		_initSliderDragEvent: function() {
			var self = this;
			// 滑块元素
			var slider = this.$slider,
			    sliderEl = slider[0];
			// 如果元素存在
			if (sliderEl) {
				var doc = this.$doc,
				    dragStartPagePostion,
				    dragStartScrollPostion,
				    dragContBarRate;
				function mousemoveHandler(e) {
					e.preventDefault();
					if (dragStartPagePostion == null) {
						return;
					}
					//内容开始卷曲的高度+rate*(鼠标释放的位置-开始的位置) == 就是内容滑动的位置
					self.scrollTo(dragStartScrollPostion + (e.pageY - dragStartPagePostion)*dragContBarRate);
				}
				slider.on('mousedown', function(e){
					e.preventDefault();
					// 获取鼠标的点击的开始位置
					dragStartPagePostion = e.pageY;
					// 获取内容区域的向上卷区的高度
					dragStartScrollPostion = self.$cont[0].scrollTop;
					dragContBarRate = self.getMaxScrollPosition()/self.getMaxSliderPosition();
					// 监听的document对象
					doc.on('mousemove.scroll', mousemoveHandler).on('mouseup.scroll',function(){
						doc.off('.scroll');
					});
				});
				return self;
			}
		},
		// 计算滑块的当前位置
		getSliderPosition: function() {
			var self = this,
			// 滑块可以移动的距离
			    maxSliderPosition = self.getMaxSliderPosition();
			    // 滑块移动的距离
			return Math.min(maxSliderPosition, maxSliderPosition*self.$cont[0].scrollTop/self.getMaxScrollPosition());
		},
		// 内容可滚动的高度
		getMaxScrollPosition: function() {
			var self = this;
			return Math.max(self.$cont.height(), self.$cont[0].scrollHeight) - self.$cont.height();
		
		},
		//滑块可移动的距离
		getMaxSliderPosition: function(){
			var self = this;
			return self.$bar.height() - self.$slider.height();
		},
		// 监听内容的滚动，同步滑块的位置
		_bindContentScroll: function() {
			var self = this;
			self.$cont.on('scroll', function(){
				var sliderEl = self.$slider && self.$slider[0];
				if (sliderEl) {
					// 设置滑块的位置
					sliderEl.style.top = self.getSliderPosition() + 'px';
				}
			});
			return self;
		},
		// 鼠标滚轮事件
		_bindMousewheel: function() {
			var self = this;
			// on监听事件，多个事件利用空格分开
			self.$cont.on('mousewheel DOMMouseScroll',function(e){
				e.preventDefault();
				// 判断原生事件对象的属性
				var oEv = e.originalEvent,
				//原生事件对象,（其他浏览器负数向下，firefox正数向下,所以在wheelDelta前面有负数）
				// 想要达到的效果，鼠标向下滚动，内容向走
				    wheelRange = oEv.wheelDelta ? -oEv.wheelDelta/120 : (oEv.detail || 0)/3;
		        // 调用scrollTo方法。
		        self.scrollTo(self.$cont[0].scrollTop + wheelRange*self.options.wheelStep)
			});
		},
		// 内容的滑动
		scrollTo: function(positonVal) {
			var self = this;
			// 获取锚点的位置的数组
			var posArr = self.getAllAnchorPosition();
				len = posArr.length;
		
			function getIndex(positonVal) {
				// 判滑动到那个锚点的位置
				for (var i = len-1; i >= 0; i--) {
					if (positonVal >= posArr[i]) {
						// 判断条件，当scrolltop的值大于锚点定位的位置，则表示内容在那个锚点范围里面。
						return i;
					}
				}
			}
			// 锚点数与标签数相同
			if (posArr.length === self.$tabItem.length) {
				// 标签选择事件
				self.changeTabSelect(getIndex(positonVal));
			}
			self.$cont.scrollTop(positonVal);
		}
	});

	win.CusScrollBar = CusScrollBar;
})(window,document,jQuery)
