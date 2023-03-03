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
let userId = request.getParameter("userId");

(function ($) {
   "use strict";
   userinfo();

   function userinfo() {
      $.ajax({
         url:`${path}/users/${userId}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
                  console.log("데이터 받기 성공");
                  console.log(data);
                  setUserInfo(data.data);
            } else {
               console.log(data.msg);
            }
         }
      });
   }
   function setUserInfo(user) {
      let username = user.username;
      let name = user.name;
      let gender = user.gender == 'M' ? "남" : "여";
      let phone = user.phone;
      let content = user.content;

      $("#username").html("ID : " + idSetStar(username));
      $("#name").html("별명 : " + name);
      $("#gender").html("성별 : " + gender);
      if (user.id == localStorage.getItem("sks_id")) $("#phone").html("휴대폰 : " + phone);
      $("#content").html(content);
   }
   function idSetStar(username) {
      let len = username.length;
      let res = username.substring(0, 3);
      for(let i = 0; i < len-3; i++) res += "*";
      return res;
   }
})(jQuery);