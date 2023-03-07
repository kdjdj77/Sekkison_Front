let isValidName = false;

(function ($) {
   "use strict";
   userinfo();

   $("#profileImg").attr("src",`${path}/userFiles/${localStorage.getItem("sks_id")}`)

   $("#logout").click(function() {
      localStorage.clear();
      location.href = "../index.html"
   });
   $("#myappoint").click(function() { location.href = "./mylist.html" });

   $("#profileInput").change(function(e) {
      let formData = new FormData($('#frm')[0]);
      $.ajax({
         url : `${path}/userFiles/upload?userId=${localStorage.getItem("sks_id")}`,
         type : 'POST',
         data : formData,
         contentType : false,
         processData : false,
         success:function(data) {
            if (data.success) console.log("프로필 변경 성공");
            else console.log(data.msg);
         }   
      });
   });
   $("#chName").on("propertychange change keyup paste input", function(){
      let str = $("#chName").val();

      var regExp = /^[가-힣]{2,8}$/;
      if (!regExp.test(str)) {
         $("#nameMsg").text("별명은 한글 2~8자 입니다").css("color", "red");
         isValidName = false;
         return;
      }

      $.ajax({
         url:`${path}/users/duplicated/1?str=${str}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
               $("#nameMsg").text("사용 가능한 별명입니다").css("color", "green");
               isValidName = true;
            } else {
               $("#nameMsg").text(data.msg).css("color", "red");
               isValidName = false;
            }
         }
      });
   });
   $("#chNameBtn").click(function() {
      if (!isValidName) { alert("유효한 이름을 입력해주세요"); return; }
      let strName = $("#chName").val();
      $.ajax({
         url:`${path}/users/0/${localStorage.getItem("sks_id")}?str=${strName}`,
         type:"PUT",
         cache:false,
         success : function(data){
            if (data.success) {
               alert("수정 성공");
               $("#nameBox").toggle("off");
               localStorage.setItem("sks_name", strName);
               window.location.reload();
            } else alert("수정 실패");
         }
      });
   });
   $('textarea').keyup(function(){
      let content = $(this).val();
      if (content.length > 500){
         alert("최대 500자까지 입력 가능합니다.");
         $(this).val(content.substring(0, 500));
      }
   });
   $("#contentOk").click(function() {
      let strContent = $("#contentBox").val();
      $.ajax({
         url:`${path}/users/1/${localStorage.getItem("sks_id")}`,
         type:"PUT",
         data:{str:strContent},
         cache:false,
         success : function(data){
            if (data.success) {
               alert("수정 성공");
               $("#contentBox").toggle("off");
               $("#contentOk").toggle("off");
               window.location.reload();
            } else alert("수정 실패");
         }
      });
   });
   function userinfo() {
      $.ajax({
         url:`${path}/users/${localStorage.getItem("sks_id")}`,
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

      $("#username").html(`ID : ${username}`);
      $("#name").html(`별명 : ${name} <i style="cursor:pointer;" class="fa fa-pencil-square-o" onclick="changeName();"></i>`);
      $("#gender").html(`성별 : ${gender}`);
      if (user.id == localStorage.getItem("sks_id")) $("#phone").html(`휴대폰 : ${phone}`);
      $("#content").html(content);
   }
})(jQuery);

function changeName() {
   document.getElementById("nameBox").classList.toggle("off");
}
function changeContent() {
   let c = document.getElementById("content");
   let cBox = document.getElementById("contentBox");
   let btn = document.getElementById("contentOk");
   
   cBox.innerText = c.innerText;
   c.classList.toggle("off");
   cBox.classList.toggle("off");
   btn.classList.toggle("off");
}