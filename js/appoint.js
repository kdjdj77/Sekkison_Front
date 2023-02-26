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
      $("#ispublic").html(data.ispublic);
      $("#isRecruit").html(data.isRecruit);
   }
   function setMembers(data) {
      data.forEach(member => {
         $("#members").append(member + "\n");
      })
   }

})(jQuery);

// 이미지 지도에서 마커가 표시될 위치입니다 
var markerPosition  = new kakao.maps.LatLng(posX, posY); 

// 이미지 지도에 표시할 마커입니다
// 이미지 지도에 표시할 마커는 Object 형태입니다
var marker = {
    position: markerPosition
};

var staticMapContainer  = document.getElementById('staticMap'), // 이미지 지도를 표시할 div  
    staticMapOption = { 
        center: new kakao.maps.LatLng(posX, posY), // 이미지 지도의 중심좌표
        level: 3, // 이미지 지도의 확대 레벨
        marker: marker // 이미지 지도에 표시할 마커 
    };    

// 이미지 지도를 생성합니다
var staticMap = new kakao.maps.StaticMap(staticMapContainer, staticMapOption);