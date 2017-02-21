window.onload = function() {

    var numKeyboard = document.querySelector('.num-keyboard'); //键盘
    var cancle = document.querySelector('#cancle'); //删除
    var cursor = document.querySelector('.cursor'); //光标
    var inputNum = document.querySelector('#input-num'); //金额输入框;
    var confirmBtn = document.querySelector('#confirm-btn'); //提交按钮;
    var submitForm = document.querySelector('form'); //表单
    //进入页面，键盘弹起和光标出现
    numKeyboard.style.bottom = 0;
    cursor.style.display = 'inline-block';
    // 输入数字的判断
    numKeyboard.addEventListener('touchstart', function(e){
        e.preventDefault();
        // 当点击的时候，是点
        if (e.target.id == 'dot') {
            if (inputNum.innerHTML.indexOf('.') == -1 && inputNum.innerHTML=='') {
                // 如果用户没有输入点且用户没有输入任何值，直接输入0.
                inputNum.innerHTML += '0.';
            }else if(inputNum.innerHTML.indexOf('.') > -1){
                // 如果已经存在小数点的话，那就什么都不做
                return;
            }else{
                inputNum.innerHTML += e.target.firstChild.nodeValue;
            }
        }else if(e.target.id == 'cancle'){
           if (inputNum.innerHTML == '') {
                submitForm.style.backgroundColor = '#8fcc8f';
                confirmBtn.value = '';
            // 如果用户没有输入任何金额的话，直接什么都不做
                return ;
           }else{
                inputNum.innerHTML = inputNum.innerHTML.substring(0, inputNum.innerHTML.length-1);
                canSubmit();
           }
        }else{
            // 是其他数字
           if (e.target.tagName.toLowerCase() == 'span') {
            // 如果为空字符串的话；
              if (inputNum.innerHTML == '') {
                inputNum.innerHTML += e.target.firstChild.nodeValue;
                canSubmit();
              }else{
                    // 先判断是否有点
                    if (inputNum.innerHTML.indexOf('.') == -1) {
                        // 不存在点的话，一共就5个数字
                        if (inputNum.innerHTML.length < 5) {
                            inputNum.innerHTML += e.target.firstChild.nodeValue;
                            canSubmit();
                        }  
                    }else{
                        // 找到小数点，两位小数
                        var dotIndex = inputNum.innerHTML.indexOf('.');
                        var dotLen = inputNum.innerHTML.substring(dotIndex, inputNum.innerHTML.length).length;
                        if (dotLen <= 2) {
                            inputNum.innerHTML += e.target.firstChild.nodeValue;
                            canSubmit();
                        }
                    }
              }          
           } 
        }
       
    }, false);

    // 可以提交的数字
    function canSubmit() {
       // 对输入框里面的数字进行判断
         var inputVal = inputNum.innerHTML;
         var inputSum;
         if (inputVal == '') {
            inputSum = 0;
         }else {
            inputSum = parseFloat(inputVal);
         }
        // 对于在这个范围内的区间才能提交
        if(inputSum <= 0) {
            submitForm.style.backgroundColor = '#8fcc8f';
            confirmBtn.value = '';
        }else {
             submitForm.style.backgroundColor = '#1AAD19';
             confirmBtn.value = inputVal;
             // 可以提交表单
             submitForm.addEventListener('touchstart',function(e){
                 submitForm.submit();
             },false);
        }
    }
}