window.onload = function() {
	// 当页面加载成功后，即执行改函数
	waterfall('main', 'box');
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
	window.onscroll = function() {
		// checkScrollSlide这个函数，是检测是否具有滚动条件
		var oParent = document.getElementById('main');
		var fragemment = document.createDocumentFragment();
		// 减少性能的消耗，利用文档碎片一次性加入
		if (checkScrollSlide()) {
			// 如果达到判断条件，就从后台加载数据
			for (var i = 0; i < dataInt.data.length; i++) {
				var box = document.createElement('div');
				box.className = 'box';
				var boxPic = document.createElement('div');
				boxPic.className = 'box-pic';
				box.appendChild(boxPic);
				var boxImg = document.createElement('img');
				boxImg.src = 'images/' + dataInt.data[i].src;
				boxPic.appendChild(boxImg);
				fragemment.appendChild(box);
				
			}
			// appendChild这个方法的参数是节点对象不是字符串;
			oParent.appendChild(fragemment);
			waterfall('main', 'box');
		}
	}
}

// 该函数接受两个参数，一个是父元素，一个是作用的子元素
function waterfall(parent, box) {
	// 将main下所有的class为box的元素取出来
	var oParent = document.getElementById(parent);
	// 这个是取class为box所有元素的函数
	var oBoxs = getByClass(oParent, box);
	//计算整个页面显示的列数（页面的宽度/box的宽度）
	var oBoxW = oBoxs[0].offsetWidth;
	var cols = Math.floor(document.documentElement.clientWidth/oBoxW);
	// 在对main进行定宽,以字符串的形式
	oParent.style.cssText = 'width:' + oBoxW*cols + 'px;margin: 0 auto;'
	// 这里面是根据用户浏览器的窗口宽度来决定，main的宽度，以及列数，计算重新
	// 调整窗口的大小，也不会变化，除非重新刷新

	// 先求出第一行中，最小高度的那一列，然后下一列从那个方向开始排列
	// 存放每一行中的列数的高度
	var hArr = [ ]; 
	for (var i = 0; i < oBoxs.length; i++) {
		if (i < cols) {
			// 先对第一排的高度求出，放到高度数组中
			hArr.push(oBoxs[i].offsetHeight);
		}else{
			var minH = Math.min.apply(null, hArr);
			var index = getMinIndex(hArr, minH);
			// 下一排的第一个的定位
			oBoxs[i].style.position = 'absolute';
			oBoxs[i].style.top = minH + 'px';
			oBoxs[i].style.left = index*oBoxW + 'px'; 
			// left定位的两种方法，根据索引乘以每一列的宽度
			// 或者通过所以，求出offsetLeft的值
			// oBoxs[i].style.left = oBoxs[index].offsetLeft + 'px';
			hArr[index] += oBoxs[i].offsetHeight; 
			 // 重新更新高度数组的数值，求出最小值，不然后面的图片会重叠

		}
	}
}


// 取得所有calss的元素的函数
function getByClass(parent, className) {
	// 所有元素的是一个集合
	var boxArr = [ ];
	// 先父元素下的所有元素
	var oElements = parent.getElementsByTagName('*');
	// 再对所有元素进行遍历
	for (var i = 0; i < oElements.length; i++) {
		// 这个只针对于class只有一个名字的
		if (oElements[i].className == className) {
			boxArr.push(oElements[i]);
		}
		// 如果有多个class的，应该这样做
	}
	return boxArr;
}

// 取得最小高度的索引值
function getMinIndex(arr, val) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == val) {
			return i;
		}
	}

}

// 判断是否加载数据的条件
function checkScrollSlide() {
	// 判断条件是最后一个box的一半高的+距离最顶端的距离小于滚动条的距离+浏览器窗口的高度就加载数据
	 var oParent = document.getElementById('main');
	 var oBoxs = getByClass(oParent,'box');
	 var lastBoxH = oBoxs[oBoxs.length -1].offsetTop + Math.floor(oBoxs[oBoxs.length -1].offsetHeight/2);
	 var sTop = document.body.scrollTop || document.documentElement.scrollTop;
	 var documentH = document.documentElement.clientHeight;
	 return (lastBoxH < sTop + documentH) ? true : false;

}