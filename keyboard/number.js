window.onload = function() {

    var numKeyboard = document.querySelector('.num-keyboard'); //键盘
    var cancle = document.querySelector('#cancle'); //删除
    var cursor = document.querySelector('.cursor'); //光标
    var inputNum = document.querySelector('#input-num'); //金额输入框;
    var confirmBtn = document.querySelector('#confirm-btn'); //隐藏域的金额;
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
                submitSum();
            }
        // 如果是删除按钮
        }else if(e.target.id == 'cancle'){
            // 如果输入框的数字为空的话
           if (inputNum.innerHTML == '') {
                submitForm.className = 'success-form';
                confirmBtn.value = '';
           }else{
                // 输入框的数字不为空的话
                inputNum.innerHTML = inputNum.innerHTML.substring(0, inputNum.innerHTML.length-1);
                submitSum();
           }
        }else if(e.target.id == 'zero'){
            // 如果开始输入的是0，且不输入小数点的话，那么就不能再输入0
            if (inputNum.innerHTML == '0') {
                return;
            }else{
                inputNum.innerHTML += e.target.firstChild.nodeValue;
                submitSum();
            }
        }else{
            // 是其他数字
           if (e.target.tagName.toLowerCase() == 'span') {
                // 先判断数字的开头是否为0
                if (inputNum.innerHTML == '0') {
                    inputNum.innerHTML = e.target.firstChild.nodeValue;
                    submitSum();
                }else{
                    //先判断是否有点
                      if (inputNum.innerHTML.indexOf('.') == -1) {
                          // 不存在点的话，一共就5个数字
                          if (inputNum.innerHTML.length < 5) {
                              inputNum.innerHTML += e.target.firstChild.nodeValue;
                              submitSum();
                          }  
                      }else{
                          // 找到小数点，两位小数
                          var dotIndex = inputNum.innerHTML.indexOf('.');
                          var dotLen = inputNum.innerHTML.substring(dotIndex, inputNum.innerHTML.length).length;
                          if (dotLen <= 2) {
                              inputNum.innerHTML += e.target.firstChild.nodeValue;
                              submitSum();
                          }
                      }
                }
           }        
        }
       
    }, false);



    // 判断金额是否可以提交
    function submitSum() {
        // 获取此时输入框的值
        confirmBtn.value = inputNum.innerHTML;
        // 如果此时输入框的值为空，则不能提交
        if (confirmBtn.value == '') {   
            submitForm.style.backgroundColor = '#8fcc8f';
        // 如果不为空字符串，则判断其值在可支付的区间内
        }else if(parseFloat(confirmBtn.value) >= 0.01 && parseFloat(confirmBtn.value) <= 10000){
            submitForm.className = 'success-form';
        }else{
            submitForm.className = 'fail-form';
        }
        
    }


    // 判断是否可以提交表单
     submitForm.addEventListener('touchstart',function(e){
        // 金额通过的话，执行表单的提交
        if (submitForm.className == 'success-form') {
            console.log('提交表单');
        }else{
            // 如果金额不通过的话，则不执行表单提交
            console.log('不满足条件，不能提交表单');
        }
     },false);


}