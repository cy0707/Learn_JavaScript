window.onload = function () {

	(function () {
		var scrollBox = document.getElementById("wrapper");
		var scrollContent = document.getElementById("scroll-content");
		var animate;
		var time = 30;
		//一个li的高度
		var liHeight = scrollContent.getElementsByTagName("li")[0].offsetHeight;
		var ul = document.createElement("ul");
		ul.innerHTML = scrollContent.innerHTML;
		scrollBox.appendChild(ul);
		//鼠标悬停事件
		scrollBox.addEventListener("mouseover",function(event){
				clearTimeout(animate);
			
		},false);

		scrollBox.addEventListener("mouseout",function(event){
				scrollUp();
			
		},false);

		function scrollUp(){
			scrollBox.scrollTop++;	
			animate = setTimeout(function() {
				scrollUp();
				if (scrollBox.scrollTop % liHeight == 0) {
					// 取消间歇调用
					clearTimeout(animate);
					// 等待2s后，再次启动间歇滚动
					setTimeout(scrollUp,2000);
				}
			}, time);
			
		}		
		scrollUp();
		
	})();
}