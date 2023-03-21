// const path = "http://Sekkison-env-1.eba-qrr3cbmm.ap-northeast-2.elasticbeanstalk.com";
// const path = "http://localhost:5000";
const path = "https://data.sekkison.xyz"



getGeolocation();

$(function() {
   $(".common").load("../pages/common.html");
})
function t(unsafeText) {
   return unsafeText.replace(/[<>"'&]/g, function (match) {
      switch (match) {
         case '<':
            return '&lt;';
         case '>':
            return '&gt;';
         case '\"':
            return '&quot;';
         case '\'':
            return '&#39;';
         case '&':
            return '&amp;';
      }
   });
}

// 사용자 좌표 받아오기(50m 이동할 때마다)
function getGeolocation() {
   if (navigator.geolocation) {
      let before_record = null;
      const newId = navigator.geolocation.watchPosition(
         (position) => {
            let updateFlag = true;
            const now = new Date();
            const new_record = {
               err: 0,
               time: now.toLocaleTimeString(),
               latitude: position.coords.latitude,
               longitude: position.coords.longitude,
            };
            //시작
            if (before_record !== null) {
               const dist = getDistance(
                  before_record.latitude,
                  before_record.longitude,
                  new_record.latitude,
                  new_record.longitude,
               );
               //이동거리가 50m미만이면 안바뀜
               if(dist < 0.05) updateFlag = false;
            } 

            if(updateFlag) {
               setcoords(new_record);
               before_record = new_record;
            }
         },
         (err) => 
            { console.log(err.message); },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
   }
}
function getDistance(lat1,lng1,lat2,lng2) {
   function deg2rad(deg) { return deg * (Math.PI/180)}

   var R = 6371; // Radius of the earth in km
   var dLat = deg2rad(lat2-lat1);  // deg2rad below
   var dLon = deg2rad(lng2-lng1);
   var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
   var d = R * c; // Distance in km
   return d;
}
function setcoords(record) {
   console.log(`X : ${record.latitude}`);
   console.log(`Y : ${record.longitude}`);

   $.ajax({
      url:`${path}/users/setPos/${localStorage.getItem("sks_id")}`,
      type:"PUT",
      data:{
         "x" : record.latitude,
         "y" : record.longitude
      },
      cache:false,
      success : function(data){
         if (data.success) console.log("위치 저장 완료");
         else console.log(data.msg);
      }
   });
}