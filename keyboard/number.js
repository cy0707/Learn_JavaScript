var input = document.querySelector('.input');
var numKeyboard = document.querySelector('.num-keyboard');
var cancle = document.querySelector('#cancle');
var cursor = document.querySelector('.cursor');

// 数字键盘的弹起
input.addEventListener('click', function(){
	numKeyboard.style.display = 'block';
	cursor.style.display = 'inline-block';

}, false);

// 输入数字
numKeyboard.addEventListener('click', function(e){
	if (e.target == cancle) {
		var inputStr = input.innerHTML;
		console.log(inputStr.length);
		input.innerHTML = inputStr.substring(0, inputStr.length-1);

	}else{
		if (e.target.className == 'num-item') {
			var numVal = e.target.firstChild.nodeValue;
         var span = document.createElement('span');
         var spanNode = span.appendChild(document.createTextNode(numVal));
			input.insertBefore(spanNode, input.firstElementChild);
		}
	}
	
}, false);