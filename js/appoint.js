let posX, posY;
(function ($) {
   "use strict";
   //[search]
   let appointId = localStorage.getItem("sks_appoint");
   load(appointId);

   function load(aid) {
      $.ajax({
         url:path + `/appoints/${aid}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
                  console.log("데이터 받기 성공");
                  console.log(data);
                  set(data.data);
                  loadMembers(aid);
            } else console.log(data.msg);
         }
      });
   }
   function loadMembers(aid) {
      $.ajax({
         url:path + `/appoints/members/${aid}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
                  console.log("데이터 받기 성공");
                  console.log(data);
                  setMembers(data.data);
            } else console.log(data.msg);
         }
      });
   }
   function set(data) {
      $("#title").html(data.title);
      $("#content").html(data.content);
      $("#posX").html(data.posX);
      $("#posY").html(data.posY);
      posX = data.posX;
      posY = data.posY;
      $("#addressDetail").html(data.addressDetail);
      $("#headCnt").html(data.headCnt);
      $("#maxCnt").html(data.maxCnt);
      $("#dDay").html(data.dDay);
      $('#D-d').html("D-" + Math.floor((new Date(data.dDay) - new Date()) / (1000*60*60*24)));
      $("#isPublic").html(data.isPublic ? "공개" : "비공개");
      $("#isRecruit").html(data.isRecruit ? "모집중" : "모집완료");
   }
   function setMembers(data) {
      data.forEach(member => {
         $("#members").append(member + "\n");
      })
   }

})(jQuery);