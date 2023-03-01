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
let fromId = request.getParameter("fromId");
let toId = request.getParameter("toId");

(function ($) {
   "use strict";
   setToName();
   $("#sendBtn").click(function() {
      if ($("#content").val().trim() == "") {alert("내용을 입력해 주세요"); return;}
      let content = $("#content").val();
      sendMsg(fromId, toId, content);
   })
   $('textarea').keyup(function(){
      let content = $(this).val();
      if (content.length > 500){
        alert("최대 500자까지 입력 가능합니다.");
        $(this).val(content.substring(0, 500));
      }
    });
   function sendMsg(from, to, cont) {
      let res = false;
      let data = {
         "fromId":from,
         "toId":to,
         "content":cont
      }
      $.ajax({
         url:`${path}/messages`,
         type:"POST",
         data:data,
         cache:false,
         success : function(data) {
            if (data.success) {
               alert("전송 완료");
               location.href = "./message.html"
            } else alert("전송 실패");
         }
      });
      return res;
   }
   function setToName() {
      $.ajax({
         url:`${path}/users/${toId}`,
         type:"GET",
         cache:false,
         success : function(data) {
            $("#sendto").html(`받는 사람 : ${data.success ? data.data.name + idSetStar(data.data.username) : "unknown"}`);
         }
      });
   }
   function idSetStar(username) {
      let len = username.length;
      let res = username.substring(0, 3);
      for(let i = 0; i < len-3; i++) res += "*";
      return ` (${res})`;
   }
})(jQuery);