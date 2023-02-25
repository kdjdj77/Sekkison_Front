(function ($) {
   "use strict";
   userinfo();

   $("#logout").click(logout);
   function logout() {
      localStorage.clear();
      location.href = "../index.html"
   }
   function userinfo() {
      $.ajax({
         url:path + "/users?userId=" + localStorage.getItem("sks_id"),
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

      $("#username").html("ID : " + username);
      $("#name").html("별명 : " + name);
      $("#gender").html("성별 : " + gender);
      if (user.id == localStorage.getItem("sks_id")) $("#phone").html("휴대폰 : " + phone);
   }
})(jQuery);