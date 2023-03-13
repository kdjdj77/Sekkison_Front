// request 세팅
let Request = function() {  
   this.getParameter = function(name) {  
       var rtnval = '';  
       var nowAddress = unescape(location.href);  
       var parameters = (nowAddress.slice(nowAddress.indexOf('?') + 1,  
               nowAddress.length)).split('&');  
       for (var i = 0; i < parameters.length; i++) {  
           var varName = parameters[i].split('=')[0];  
           if (varName.toUpperCase() == name.toUpperCase()) {  
               rtnval = parameters[i].split('=')[1];  
               break;  
           }  
       }  
       return rtnval;  
   }  
}
var request = new Request(); 
let apiType = request.getParameter("api");

(function($) {
   "use strict";
   let isValidName = false;
   let isValidPhone = false;
   let checkNum = false;
   //[ Dup name ]*/
   $("input[name='name']").on("propertychange change keyup paste input", function(){
      let str = $("input[name='name']").val();

      var regExp = /^[가-힣]{2,8}$/;
      if (!regExp.test(str)) {
         $("#dup-name").text("별명은 한글 2~8자 입니다").css("color", "red");
         isValidName = false;
         return;
      }

      $.ajax({
         url:`${path}/users/duplicated/1?str=${str}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
               $("#dup-name").text("사용 가능한 별명입니다").css("color", "green");
               isValidName = true;
            } else {
               $("#dup-name").text(data.msg).css("color", "red");
               isValidName = false;
            }
         }
      });
   })
   //[ Dup phone ]*/
   $("input[name='phone']").on("propertychange change keyup paste input", function(){
      let str = $("input[name='phone']").val();

      var regExp = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
      if (!regExp.test(str)) {
         $("#dup-phone").text("올바른 전화번호 11자리를 입력해 주세요").css("color", "red");
         isValidPhone = false;
         return;
      }

      $.ajax({
         url:`${path}/users/duplicated/2?str=${str}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
               $("#dup-phone").text("사용 가능한 번호입니다").css("color", "green");
               isValidPhone = true;
            } else {
               $("#dup-phone").text(data.msg).css("color", "red");
               isValidPhone = false;
            }
         }
      });
   })
   //[ Phone Check Num ]*/
   let code2 = "";
   $("#phoneChk").click(function(){
      
      if(!isValidPhone){
         alert("휴대폰 번호가 올바르지 않습니다.")
      }else {
         alert("인증번호 발송이 완료되었습니다.\n휴대폰에서 인증번호 확인을 해주십시오.");
         var pn = $("#phone").val();
         $.ajax({
            type:"GET",
            url:`${path}/users/phoneCheck?phone=${pn}`,
            cache : false,
            success:function(data){
               if(data == "error"){
                  alert("휴대폰 번호가 올바르지 않습니다.");
               }else{	        		
                  $("#check").attr("disabled",false);
                  $("#dup-check").text("인증번호를 입력한 뒤 본인인증을 눌러주십시오.");
                  $("#dup-check").css("color","red");
                  $("#phone").attr("readonly",true);
                  code2 = data;
               }
            }
         });
      }
   });
   $("#phoneChk2").click(function(){
      
      if(code2.length <= 0 ){
         $("#check").attr("disabled",false);
         //$("#phoneChk2").css("display","inline-block");
         $("#dup-check").text("인증번호를 입력한 뒤 본인인증을 눌러주십시오.");
         $("#dup-check").css("color","red");
      }
      else if(
         $("#check").val() == code2){
         $("#dup-check").text("인증번호가 일치합니다.");
         $("#dup-check").css("color","green");
         $("#check").attr("disabled",true);
         checkNum = true;
      }else{
         $("#dup-check").text("인증번호가 일치하지 않습니다. 확인해주시기 바랍니다.");
         $("#dup-check").css("color","red");
         $(this).attr("autofocus",true);
         checkNum = false;
         return;
      }
   });
   //[ 회원가입 완료 ]*/
   $("#submitBtn").click(function() {
      if (!isValidName) {alert("별명을 확인해주세요");return;}
      if (!isValidPhone) {alert("전화번호를 확인해주세요");return;}
      if (!checkNum) {alert("인증번호를 확인해주세요");return;}
      console.log($("input[name='gender']").val());

      let username = localStorage.getItem("sks_username");
      let password = localStorage.getItem("sks_password");
      let name = $("#name").val();
      let phone = $("#phone").val();
      let gender = $("input[name='gender']:checked").val();

      let data = {
			"username":username,
			"password":password,
         "name":name,
         "phone":phone,
         "gender":gender,
         "content":""
		};
		
		$.ajax({
			url:`${path}/users/apiRegister/${apiType}`,
			type:"POST",
			data:data,
			cache:false,
			success : function(data){
            if (data.success) {
               localStorage.setItem("sks_id", data.data.id);
               localStorage.setItem('sks_username', data.data.username);
               localStorage.setItem('sks_password', data.data.password);
               localStorage.setItem("sks_name", data.data.name);
               location.href="../pages/home.html";
            } else alert(data.msg);
         }
      });
   })
})(jQuery);