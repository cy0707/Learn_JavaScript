window.onload = function () {
	(function () {
		var scrollBox = document.getElementById("wrapper");
		var scrollContent = document.getElementById("scroll-content");
		var animate;
		var time = 30;
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
			animate	= setTimeout(function(){
				if (scrollBox.scrollTop >= scrollContent.offsetHeight) {
					scrollBox.scrollTop = 0;
				}else{
					scrollBox.scrollTop++;
				}
				// 调用自身
				scrollUp();
			},time);
		}
		// 错误的方式
		/*
		function scrollUp(){	
			
				if (scrollBox.scrollTop >= scrollContent.offsetHeight) {
					scrollBox.scrollTop = 0;
				}else{
					scrollBox.scrollTop++;
				}
				// 只是清除此时的scrollUp的滑动，
				animate	= setTimeout(scrollUp, time);
		
		}
		*/
		
		scrollUp();
		
	})();
}

