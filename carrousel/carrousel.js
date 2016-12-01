;(function($){
	// 定义Carrousel构造函数
    var Carrousel = function(ele, options) {
    	// 获取元素
    	this.element = ele;
    	// 默认参数
    	this.defaults = {
    		prevArrow: '.prev', //左箭头的class
    		nextArrow: '.next', //右箭头class
    		loop: false, //是否自动播放
    		autoplay: 2000, //自动播放的时间
    		pagination: false, //默认没有分页器
    		index: 0, //当前元素的索引值
    		eleActive: 'box-current', //元素激活的class
    		paginActive: 'cur',//分页激活的class
    		carrouselBox:'.banner-box', //轮播图的外层盒子
    		wrapperBox: '.container', //最外层的盒子
    		keyboard: 'false' //是否键盘控制
    	};
    	// 合并参数
    	this.options = $.extend({}, this.defaults, options);
        this.init();

        // 是否分页
        if (this.options.pagination) {
        	this.initPaging();
        }

        this.initEvent();
    };


    // 定义Carrousel构造函数的方法
    Carrousel.prototype = {
    	// 初始化,获取class
    	init: function() {
    		// 左箭头
    		this.prev = $(this.options.prevArrow);
    		// 右箭头
    		this.next = $(this.options.nextArrow);
    		// 最外层的容器盒子
    		this.wrapperBox = $(this.options.wrapperBox);
    		// 轮播图的外层盒子
    		this.carrouselBox = $(this.options.carrouselBox);
    		// 获取轮播的个数
    		this.length = this.carrouselBox.find('li').length;
    		// 索引值
    		this.index = this.options.index;
    		// 分页是否存在
    		this.pagination = this.options.pagination;
    		// 分页激活class
    		this.paginActive = this.options.paginActive;
    		// 当前激活元素
    		this.eleActive = this.options.eleActive;
    	},
    	// 初始化分页
    	initPaging: function() {
    		var pageHtml = '<ul class="pagination">';

    		if (this.length <= 0) {
    			return ;
    		}else {
    			for (var i = 0; i < this.length; i++) {
    				pageHtml += '<li></li>';	
    			}
    		}
    		pageHtml += '</ul>';
    		this.wrapperBox.append(pageHtml);
            // 初始化激活分页
            $('.pagination li').eq(this.index).addClass(this.paginActive);
    		
    	},
    	// 初始化事件
    	initEvent: function() {
    		var self = this;
    		// 注意，不要把事件的calss的名字与事件名相同，不然就会报错
    		this.wrapperBox.on('click', '.prev', function(event) {
    			event.preventDefault();
    			self.prevEvent();
    		});
    		this.wrapperBox.on('click', '.next', function(event) {
    			event.preventDefault();
    			self.nextEvent();
               
    		});
    	},
    	// 左箭头事件
    	prevEvent: function() {
    		if (this.index > 0) {
    			this.index--;
    		}else {
    			this.index = this.length-1;
    		}
             console.log(this.index);
    		this.switch();
    	},
    	// 右箭头
    	nextEvent: function() {
    		if (this.index < this.length-1) {
    			this.index++;
    		}else {
    			this.index = 0 ;
    		}
    		this.switch();
    	},
    	// 滑动事件
    	switch: function() {
    		// 如果存在分页
    		if (this.pagination) {
    			$('.pagination li').removeClass(this.paginActive);
    			$('.pagination li').eq(this.index).addClass(this.paginActive);
    		}
    		// 对于滑动的进行布局
    		this.carrouselBox.find('li').removeClass(this.eleActive);
            if (this.index === this.length-1) {
                // 主要问题是样式的覆盖问题
                this.carrouselBox.find('li').eq(0).addClass(this.eleActive).css('left', '17%');
                this.carrouselBox.find('li').eq(this.index-1).css('left', '533px');
            }else if(this.index === 0 ){
                this.carrouselBox.find('li').eq(this.index+1).addClass(this.eleActive).css('left', '17%');
                this.carrouselBox.find('li').eq(this.length-1).css('left', '533px');

            }else {
                // index===1的情况
                this.carrouselBox.find('li').eq(this.index+1).addClass(this.eleActive).css('left', '17%');
                this.carrouselBox.find('li').eq(0).css('left', '533px');
            }
             this.carrouselBox.find('li').eq(this.index).css('left', '0');
    	}



    };

	$.fn.Carrousel = function(options) {
		var carrousel = new Carrousel(this, options);
	};
	
})(jQuery)


$(function(){
	$('.container').Carrousel({
		pagination: true
	});
});