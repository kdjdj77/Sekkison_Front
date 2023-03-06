(function ($) {
   "use strict";
   let isValidUsername = false;
   let isValidPassword = false;
   let isValidName = false;
   let isValidPhone = false;
   let checkNum = false;

   //[ Show pass ]*/
   let showPass = 0;
   $('.btn-show-pass').on('click', function(){
      if(showPass == 0) {
         $("#password").attr('type','text');
         $(this).find('i').removeClass('zmdi-eye');
         $(this).find('i').addClass('zmdi-eye-off');
         showPass = 1;
      }
      else {
         $("#password").attr('type','password');
         $(this).find('i').addClass('zmdi-eye');
         $(this).find('i').removeClass('zmdi-eye-off');
         showPass = 0;
      }
   });
   //[ Dup pass ]*/
   $("input[name='re-password']").on("propertychange change keyup paste input", function(){
      let pass1 = $("input[name='password']").val();
      let pass2 = $("input[name='re-password']").val();

      var regExp = /^[a-zA-Z\d`~!@#$%^&*()-_=+]{8,16}$/;
      if (!regExp.test(pass1)) {
         $("#dup-password").text("비밀번호는 8~16자입니다").css("color", "red");
         isValidPassword = false;
         return;
      }

      if (pass1 == pass2) {
         $("#dup-password").text("  비밀번호와 일치합니다");
         $("#dup-password").css("color", "green");
         isValidPassword = true;
      }
      else {
         $("#dup-password").text("  비밀번호와 다릅니다");
         $("#dup-password").css("color", "red");
         isValidPassword = false;
      }
   })
   $("input[name='password']").on("propertychange change keyup paste input", function(){
      let pass1 = $("input[name='password']").val();
      let pass2 = $("input[name='re-password']").val();

      var regExp = /^[a-zA-Z\d`~!@#$%^&*()-_=+]{8,16}$/;
      if (!regExp.test(pass1)) {
         $("#dup-password").text("비밀번호는 8~16자입니다").css("color", "red");
         isValidPassword = false;
         return;
      }

      if (pass1 == pass2) {
         $("#dup-password").text("  비밀번호와 일치합니다");
         $("#dup-password").css("color", "green");
         isValidPassword = true;
      }
      else {
         $("#dup-password").text("  비밀번호와 다릅니다");
         $("#dup-password").css("color", "red");
         isValidPassword = false;
      }
   })
   //[ Dup username ]*/
   $("input[name='username']").on("propertychange change keyup paste input", function(){
      let str = $("input[name='username']").val();

      var regExp = /^[0-9a-zA-Z]{4,10}$/;
      if (!regExp.test(str)) {
         $("#dup-username").text("아이디는 영문+숫자 4~10자입니다").css("color", "red");
         isValidUsername = false;
         return;
      }

      $.ajax({
         url:`${path}/users/duplicated/0?str=${str}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
               $("#dup-username").text("사용 가능한 아이디입니다").css("color", "green");
               isValidUsername = true;
            } else {
               $("#dup-username").text(data.msg).css("color", "red");
               isValidUsername = false;
            }
         }
      });
   })
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
      if (!isValidUsername) {alert("아이디를 확인해주세요");return;}
      if (!isValidPassword) {alert("비밀번호를 확인해주세요");return;}
      if ($("input[name='password']").val() != $("input[name='re-password']").val()) {alert("비밀번호 확인란이 틀립니다");return;}
      if (!isValidName) {alert("별명을 확인해주세요");return;}
      if (!isValidPhone) {alert("전화번호를 확인해주세요");return;}
      if (!checkNum) {alert("인증번호를 확인해주세요");return;}
      console.log($("input[name='gender']").val());

      let username = $("#username").val();
      let password = $("#password").val();
      let name = $("#name").val();
      let phone = $("#phone").val();
      let gender = $("input[name='gender']:checked").val();
      let content = "";

      let data = {
			"username":username,
			"password":password,
         "name":name,
         "phone":phone,
         "gender":gender,
         "content":content
		};
		
		$.ajax({
			url:`${path}/users`,
			type:"POST",
			data:data,
			cache:false,
			success : function(data){
            if (data.success) {
               alert("회원가입 성공");
               location.href="../index.html";
            } else {
               alert(data.msg);
            }
         }
      });
   })
})(jQuery);