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
         url:path + `/appoints/${appointId}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
               console.log("약속 데이터 받기 성공");
               console.log(data);
               loadMembers(data.data.memo, data.data.type);
               if (data.data.memo == localStorage.getItem("sks_name")) {
                  $("#outBtn").html(`
                     <button type="button" onclick="delAppoint(${appointId})" style="color:white;
                        font-weight:bold;">
                        폭파
                     </button>
                  `);
               }
               set(data.data);
            } else console.log(data.msg);
         }
      });
   }
   function loadMembers(master, type) {
      $.ajax({
         url:`${path}/appoints/members/${appointId}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
               console.log("멤버 데이터 받기 성공");
               console.log(data);
               setMembers(data.data, master, type);
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
      $("#dDay").html("약속날짜 : " + data.dday.substring(0, data.dday.length-3));
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
   function setMembers(data, master, type) {
      let isIn = false;
      data.forEach(member => {
         let meter = "...m";
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
}
function keyupInviteSearch() {
   let text = $("#inviteFriendSearch").val();
   let box = $("#inviteFriendList");
   console.log(text);

   var regExp = /^[가-힣]{1,8}$/;
   if (text.trim() == "") { box.html(""); return; }
   if (!regExp.test(text)) { box.html(""); return; }
   return;
   $.ajax({
      url:`${path}/users/search/${localStorage.getItem("sks_id")}?str=${$("#friendInput").val()}`,
      type:"GET",
      cache:false,
      success : function(data){
         if (data.success) {
               setSearch(data.data);
         } else {
               console.log(data.msg);
         }
      }
   });
}