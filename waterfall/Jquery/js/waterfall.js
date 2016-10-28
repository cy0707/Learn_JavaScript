$(document).ready(function() {
	// 当页面加载成功后，即执行改函数
	waterfall();
	// 造了一些后台传过来的数据参数
	var dataInt = {
		data: [
			{src: '1.jpg'},
			{src: '2.jpg'},
			{src: '3.jpg'},
			{src: '4.jpg'},
			{src: '5.jpg'},
			{src: '6.jpg'},
			{src: '7.jpg'},
			{src: '8.jpg'},
			{src: '9.jpg'},
			{src: '10.jpg'},
			{src: '11.jpg'},
			{src: '12.jpg'}
		]
	};
	// 鼠标进行滚动滚动条的事件
	$(window).scroll(function(event) {
		var fragemment = document.createDocumentFragment();
		// 减少性能的消耗，利用文档碎片一次性加入
		if (checkScrollSlide()) {

			// 如果达到判断条件，就从后台加载数据
			$.each(dataInt.data, function(index, val) {
				 $('<div class="box"><div class="box-pic"><img src="images/'+val.src+'" /></div></div>').appendTo(fragemment);
			});		
			$('#main').append(fragemment);
			waterfall();
		}
	});
});

// 该函数接受两个参数，一个是父元素，一个是作用的子元素
function waterfall() {
	//计算整个页面显示的列数（页面的宽度/box的宽度）
	var oBoxs = $('#main .box');
	var w = $('#main .box').first().outerWidth();
	var cols = Math.floor($(window).width()/w);
	// 在对main进行定宽,以字符串的形式
	$('#main').width(w*cols).css('margin', '0 auto');
	var hArr = [ ]; 
	oBoxs.each(function(index, el) {
		var h = oBoxs.eq(index).outerHeight();
		if (index < cols) {
			hArr[index] = h;
		}else{
			var minH = Math.min.apply(null, hArr);
			// 这个是jquery中寻找元素的索引
			var minIndex = $.inArray(minH, hArr);;
			$(el).css({
				position: 'absolute',
				top: minH ,
				left: minIndex*w 
			});
			hArr[minIndex] += oBoxs.eq(index).outerHeight(); 
		}
	});
}

// 判断是否加载数据的条件
function checkScrollSlide() {
	// 判断条件是最后一个box的一半高的+距离最顶端的距离小于滚动条的距离+浏览器窗口的高度就加载数据
	 var lastBox = $('#main .box').last();
	 var lastBoxH = lastBox.offset().top + Math.floor(lastBox.outerHeight()/2);
	 var sTop = $(window).scrollTop();
	 var documentH = $(window).height();
	 return (lastBoxH < sTop + documentH) ? true : false;

}