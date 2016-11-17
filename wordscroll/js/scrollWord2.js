var scrollBox = document.getElementById("wrapper");
var scrollContent = document.getElementById("scroll-content");
var liHeight = scrollContent.getElementsByTagName("li")[0].offsetHeight;
var ul = document.createElement("ul");
ul.innerHTML = scrollContent.innerHTML;
scrollBox.appendChild(ul);
// 把滚动框的初始值设置为0；
scrollBox.scrollTop = 0;
var times;

function startMove() {
	 times = setTimeout(function(){
	 	scrollBox.scrollTop++;
		if(scrollBox.scrollTop % liHeight == 0) {
				clearTimeout(times);
				setTimeout(startMove, 3000);
			}else{
				if (scrollBox.scrollTop >= scrollContent.offsetHeight) {
					scrollBox.scrollTop = 0;
				}
				startMove();
			}
	}, 50)
	
}

startMove();


