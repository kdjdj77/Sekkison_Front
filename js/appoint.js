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
let appointId = request.getParameter("id");

keyupInviteSearch();
(function ($) {
   "use strict";
   //[search]
   load();

   $("#inviteFriendSearch").on("propertychange change keyup paste input", keyupInviteSearch);
   $("#mapBtn").click(function() {
      let mapBox = document.getElementById("mapBox");
      mapBox.classList.toggle("hide");
      mapBox.classList.toggle("vis");
      if (mapBox.classList.contains("hide"))
         $(this).html(`<i class="fa fa-angle-up fa-2x"></i>`);
      else $(this).html(`<i class="fa fa-angle-down fa-2x"></i>`);
   });
   function load() {
      $.ajax({
         url:`${path}/appoints/${localStorage.getItem("sks_id")}/${appointId}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
               console.log("약속 데이터 받기 성공");
               console.log(data);
               loadMembers(data.data.memo, data.data.type, data.data.posX, data.data.posY);
               if (data.data.memo == localStorage.getItem("sks_name")) {
                  $("#outBtn").html(`
                     <button type="button" onclick="delAppoint(${appointId})" style="color:white;
                        font-weight:bold;">
                        폭파
                     </button>
                  `);
               }
               set(data.data);
            } else {
               alert(data.msg);
               location.href = "../pages/home.html";
            }
         }
      });
   }
   function loadMembers(master, type, x, y) {
      $.ajax({
         url:`${path}/appoints/members/${appointId}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
               console.log("멤버 데이터 받기 성공");
               console.log(data);
               setMembers(data.data, master, type, x, y);
            } else console.log(data.msg);
         }
      });
   }
   function set(data) {
      if (data.type != "FTF") $("#mapBox").remove();

      $("#title").html(t(data.title));
      $("#content").html(t(data.content));
      $("#headCnt").html(data.headCnt);
      $("#maxCnt").html(data.maxCnt);
      $("#dDay").html("D-day : " + data.dday.substring(0, data.dday.length-3));
      let dd = Math.floor((new Date(data.dday) - new Date()) / (1000*60*60*24));
      $('#D-d').html(`${dd < 0 ? "종료" : `D-${dd}`}`);
      $("#isPublic").html(data.isPublic ? "공개" : "비공개");
      $("#isRecruit").html(data.isRecruit ? "모집중" : "모집완료");
      if (data.type == "FTF") $("#appointType").html("만남");
      else if (data.type == "NFTF") $("#appointType").html("온라인");
      else $("#appointType").html("나만의");

      if (data.type == "FTF") {
         $("#category").html(data.category);
         $("#address").html(`주소 : ${data.address}`);
         $("#addressDetail").html(`상세 : ${data.addressDetail}`);
      } else {
         $("#category").remove();
         $("#address").remove();
         $("#addressDetail").remove();
      }
      $("#posX").html(data.posX);
      $("#posY").html(data.posY);
      setKakaoMap(data.posX, data.posY);
   }
   function setMembers(data, master, type, x, y) {
      let isIn = false;
      data.forEach(member => {
         let meter = 
            (member.posX == null || member.posY == null) ?
            "???" : getDist(x, y, member.posX, member.posY);
         let row = `
            <div style="width:100%; margin:1rem;">
               <a style="float:left; text-decoration:none; color:black; font-size:1rem;"
                  href="./otherinfo.html?userId=${member.id}">
                  <img style="width:25px; height:25px; border-radius:50%; vertical-align: middle;"
                     src="${path}/userFiles/${member.id}">
                  ${member.name}
                  ${member.name == master ? `<i class="fa fa-star"></i>` : ""}
               </a>
               ${master == localStorage.getItem("sks_name") && member.name != master ? `
                  <button style="float:left; font-size:1.5rem; color:red;"
                     type="button" onclick="deleteMember(${member.id})">
                     <i class="fa fa-times"></i>
                  </button>` : ""
               }
               <div style="float:right;">${type == "FTF" ? `(${meter})` : ""}</div>
            </div><br>
         `;
         $("#members").append(`${row}\n`);
         if (member.id == localStorage.getItem("sks_id")) {
            $("#inviteBtn").html(`
               <button type="button" style="color:white; font-weight:bold;"
                  onclick="controlFriendTab();">
                  초대하기
               </button>
            `);
            if (master != localStorage.getItem("sks_name")) {
               isIn = true;
               $("#outBtn").html(`
                  <button type="button" onclick="outAppoint(${appointId})" style="color:white;
                     font-weight:bold;">
                     나가기
                  </button>
               `);
            }
         }
      });
      if (!isIn && master != localStorage.getItem("sks_name")) {
         $("#outBtn").html(`
            <button type="button" onclick="inAppoint(${appointId})" style="color:white;
               font-weight:bold;">
               참가하기
            </button>
         `);
      }
   }
})(jQuery);

function deleteMember(id) {
   $.ajax({
      url:`${path}/appoints/members/${appointId}/${localStorage.getItem("sks_id")}/${id}`,
      type:"DELETE",
      cache:false,
      success : function(data) { 
         if (data.success) alert("강퇴 성공");
         else alert("강퇴 실패");
         window.location.reload();
      }
   });
}
function outAppoint(appointId) {
   if (!confirm("정말 나가시겠습니까?")) return;
   $.ajax({
      url:`${path}/myAppoints/${localStorage.getItem("sks_id")}/${appointId}`,
      type:"DELETE",
      cache:false,
      success : function(data) {
         if (data.success) window.location.reload();
         else alert(data.msg);
      }
   });
}
function inAppoint(appointId) {
   $.ajax({
      url:`${path}/myAppoints/${localStorage.getItem("sks_id")}/${appointId}`,
      type:"POST",
      cache:false,
      success : function(data) {
         if (data.success) window.location.reload();
         else alert(data.msg);
      }
   });
}
function delAppoint(appointId) {
   if (!confirm("정말 폭파하시겠습니까?")) return;
   $.ajax({
      url:`${path}/appoints/${localStorage.getItem("sks_id")}/${appointId}`,
      type:"DELETE",
      cache:false,
      success : function(data) {
         if (data.success) location.href="../pages/home.html"
         else alert(data.msg);
      }
   });
}
function controlFriendTab() {
   $("#inviteFriendTab").toggle();
   searchFriendSize();
}
function keyupInviteSearch() {
   let text = $("#inviteFriendSearch").val();
   let box = $("#inviteFriendList");

   var regExp = /^[가-힣]{0,8}$/;
   if (!regExp.test(text)) { box.html(""); return; }

   $.ajax({
      url:`${path}/users/search/invite/${localStorage.getItem("sks_id")}/${appointId}?str=${text}`,
      type:"GET",
      cache:false,
      success : function(data){
         if (data.success) {
               setInviteFriends(data.data);
         } else {
               console.log(data.msg);
         }
      }
   });
}
function setInviteFriends(result) {
   const out = [];
   result.forEach(data => {
      const row = `
         <div style="margin:0.1%; background-color:#FBF5EF; color:black;
            padding:0.2rem; border:2px solid #F6E3CE; border-radius:5px">
            <a style="text-decoration:none; color:black;"
               href="./otherinfo.html?userId=${data.id}">
               <img style="width:25px; height:25px; border-radius:50%;
                  vertical-align: middle;" src="${path}/userFiles/${data.id}">
               ${data.name}
            </a>
            ${setInviteFriendBtn(data)}
         </div>
      `;
      out.push(row);
   });
   $("#inviteFriendList").html(out.join("\n"));
}
function setInviteFriendBtn(data) {
   if (data.memo == "X") {
      return `
         <button style="font-size:1.3rem; color:green; margin-right:10px; vertical-align:middle;"
            onclick="inviteSend(${data.id}, this)">
            <i class='fa fa-plus'></i>
         </button>`
   } else if (data.memo == "O") {
      return `<span style="font-size:0.7rem; color:gray; margin-right:10px;">참가중</span>`;
   } else {
      return `<span style="font-size:0.7rem; color:gray; margin-right:10px;">초대중</span>`
   }
}
function inviteSend(toId) {
   let fromId = localStorage.getItem("sks_id");
   $.ajax({
      url:`${path}/invites/${appointId}/${fromId}/${toId}`,
      type:"POST",
      cache:false,
      success : function(data){
         if (data.success) keyupInviteSearch();
         else console.log(data.msg);
      }
   })
}
function getDist(lat1,lng1,lat2,lng2) {
   function deg2rad(deg) { return deg * (Math.PI/180)}

   var R = 6371; // Radius of the earth in km
   var dLat = deg2rad(lat2-lat1);  // deg2rad below
   var dLon = deg2rad(lng2-lng1);
   var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
   var d = R * c * 1000; // Distance in km
   
   if (d >= 1000) return `${Math.round(d/100)/10}km`;
   return `${Math.round(d)}m`;
}