window.onload = function(){

	var input = document.querySelector('.input'); //输入的金额
	var numKeyboard = document.querySelector('.num-keyboard'); //键盘
	var cancle = document.querySelector('#cancle'); //删除
	var cursor = document.querySelector('.cursor'); //光标
	var submit = document.querySelectorAll('.sumbtn input'); //提交
	var sum = document.querySelector('#sum'); //提交的金额

	//进入页面，键盘弹起和光标出现
	numKeyboard.style.bottom = 0;
	cursor.style.display = 'inline-block';

	// 输入数字
	numKeyboard.addEventListener('click', function(e){
		if (e.target == cancle) {
			var prevNode = input.lastElementChild.previousElementSibling;
			input.removeChild(prevNode);
		}else{
			if (e.target.className == 'num-item' || e.target.className == 'num-sitem') {
				var numVal = e.target.firstChild.nodeValue;
				var numNode = document.createElement('span');
				numNode.appendChild(document.createTextNode(numVal));
				input.insertBefore(numNode, input.lastElementChild);
			}
		}
	}, false);

	// 三个绿色按钮的提交
	var submitLen = submit.length;
	for (var i = 0; i < submitLen; i++) {
		submit[i].addEventListener('click', function(e){
			e.preventDefault();
			var sumStr = '';
			var len = input.childNodes.length-2;
			// console.log(len);
			for (var i = 0; i < len; i++) {
				if (input.childNodes[i].nodeType === 1) {
					sumStr += input.childNodes[i].firstChild.nodeValue;
				}
			}
			console.log(sumStr);
			sum.value = sumStr;
		}, false);
	}
	
}

