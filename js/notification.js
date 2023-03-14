let category = true;
// request 세팅
let Request = function() {  
   this.getParameter = function() {    
       var nowAddress = unescape(location.href);  
       return nowAddress.slice(nowAddress.indexOf('#') + 1, nowAddress.length);
   }  
}
var request = new Request(); 
let tag = request.getParameter();
(function ($) {
   "use strict";
   if (tag == 2) {
      $("#appoint").addClass("btnOn");
      $('#friend').removeClass("btnOn");
      category = !category;
      if (category) {
         $("#friends").removeClass("off");
         $("#appoints").addClass("off");
      } else {
         $("#friends").addClass("off");
         $("#appoints").removeClass("off");
      }
   }

   $(document).on('click', '.radiobtn', function(e) {
      if (!$(this).hasClass("btnOn")) {
         e.preventDefault();
         $(this).addClass("btnOn");
         $('.radiobtn').not($(this)).removeClass("btnOn");
         category = !category;
         if (category) {
            $("#friends").removeClass("off");
            $("#appoints").addClass("off");
         } else {
            $("#friends").addClass("off");
            $("#appoints").removeClass("off");
         }
      }
   })

   setNoti();
   function setNoti() {
      $.ajax({
         url:`${path}/users/my_list/${localStorage.getItem("sks_id")}/0`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
               console.log("친구초대 받기 성공");
               console.log(data);
               setFriends(data.data);
            } else {
               console.log(data.msg);
               $("#friendCnt").html(`(0)`);
            }
         }
      });
      $.ajax({
         url:`${path}/users/my_list/${localStorage.getItem("sks_id")}/1`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
               console.log("약속초대 받기 성공");
               console.log(data);
               setAppoints(data.data);
            } else {
               console.log(data.msg);
               $("#appointCnt").html(`(0)`);
            }
         }
      });
   }
   function setFriends(result) {
      $("#friendCnt").html(`(${result.length})`);
      result.forEach(friend => {
         let id = friend.id;
         let toId = friend.toId;
         let fromId = friend.fromId;
         let regDate = friend.create_at;
         let fromName;

         $.ajax({
            url:`${path}/users/${fromId}`,
            type:"GET",
            cache:false,
            success : function(data) { 
               fromName = data.success ? data.data.name : "unknown";
               const row = `
                  <div style="margin-top:5px; text-align:right; font-size:0.5rem; width:100%;">${regDate}</div>
                  <div style="width:100%; height:50px; display:flex; flex-wrap:wrap; padding:0; margin-bottom:0;
                     border-top:1px solid black; border-bottom:1px solid black;">
                     <div style="margin:auto; width:80%; overflow: hidden; text-overflow: ellipsis;
                        white-space: nowrap;">
                        &nbsp;
                        <img style="width:25px; height:25px; border-radius:50%; vertical-align: middle;"
                           src="${path}/userFiles/${fromId}">
                        ${fromName}님의 친구 초대입니다
                     </div>
                     <div style="margin:auto; width:20%; height:100%; padding:0; margin:0;">
                        <button type="button" style="float:right; margin:0; height:100%; width:50%; border:none;
                           color:crimson; font-size:1.5rem;" onclick="denyFriend(${id})">
                           <i class="fa fa-times"></i>
                        </button>
                        <button type="button" style="float:right; margin:0; height:100%; width:50%; border:none;
                              color:green; font-size:1.5rem;" onclick="acceptFriend(${id})">
                           <i class="fa fa-check"></i>
                        </button>
                     </div>
                  </div>
                  `;
               $("#friends").append(row);
            }
         });
      });
   }
   function setAppoints(result) {
      $("#appointCnt").html(`(${result.length})`);
      const out = [];
      result.forEach(appoint => {
         let id = appoint.id;
         let memo = appoint.memo.split('&');
         let invitor = memo[0];
         let inviteId = memo[1];
         let title = appoint.title;
         let content = appoint.content;
         let posX = appoint.posX;
         let posY = appoint.posY;
         let addressDetail = appoint.addressDetail;
         let headCnt = appoint.headCnt;
         let maxCnt = appoint.maxCnt;
         let date = appoint.dday;
         let dday = "D-"+String(Math.floor((new Date(date) - new Date()) / (1000*60*60*24)));
         let isRecruit = appoint.isRecruit;
         let regDate = appoint.create_at;

         
         const row = `
            <div style="margin-top:5px; text-align:right; font-size:0.5rem; width:100%;">${regDate}</div>
            <div style="width:100%; height:50px; display:flex; flex-wrap:wrap; padding:0; margin-bottom:0;
               border-top:1px solid black;border-bottom:1px solid black;">
               <div style="cursor:pointer; margin:auto; width:80%; overflow: hidden; text-overflow: ellipsis;
                  white-space: nowrap;" onclick="show(${inviteId})">
                  &nbsp;
                  <img style="width:25px; height:25px; border-radius:50%; vertical-align: middle;"
                     src="${path}/userFiles/${inviteId}">
                  ${invitor}님의 약속 초대입니다
               </div>
               <div style="margin:auto; width:20%; height:100%; padding:0; margin:0;">
                  <button type="button" style="float:right; margin:0; height:100%; width:50%; border:none;
                     color:crimson; font-size:1.5rem;" onclick="denyInvite(${inviteId})">
                     <i class="fa fa-times"></i>
                  </button>
                  <button type="button" style="float:right; margin:0; height:100%; width:50%; border:none;
                        color:green; font-size:1.5rem;" onclick="showInvite(${id})">
                     <i class="fa fa-sign-in"></i>
                  </button>
               </div>
            </div>
            <div id="show_${inviteId}" style="min-height:70px; padding:5px; width:100%; display:none;
               border-bottom:1px solid black; border-top:1px solid lightgray; line-height:2rem; background-color:ivory;">
               ${title} (${headCnt}/${maxCnt}) <span style="float:right">${dday}</span><hr>
               언제 : ${date} <br>
               상세 : ${addressDetail}<hr>
               ${content}
            </div>
            `;
         out.push(row);
      });
      $("#appoints").append(out);
   }
})(jQuery);

function show(id) {
   let trId = `show_${id}`;
   let trObj = document.getElementById(trId);
   if (trObj.style.display == "none") trObj.style.display = "block";
   else trObj.style.display = "none";
}

function acceptFriend(friendId) {
   var xmlhttp = new XMLHttpRequest();
   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
         if (xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.response);
            if (data.success) {
               console.log("친구초대 수락");
               window.location.reload();
            }
            else console.log(data.msg);
         }
         else if (xmlhttp.status == 400) console.log('There was an error 400');
         else console.log('something else other than 200 was returned');
      }
   };
   xmlhttp.open("POST", `${path}/friends/accept/${friendId}`);
   xmlhttp.send();
}
function denyFriend(friendId) {
   var xmlhttp = new XMLHttpRequest();
   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
         if (xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.response);
            if (data.success) {
               console.log("친구초대 거절");
               window.location.reload();
            }
            else console.log(data.msg);
         }
         else if (xmlhttp.status == 400) console.log('There was an error 400');
         else console.log('something else other than 200 was returned');
      }
   };
   xmlhttp.open("DELETE", `${path}/friends/${friendId}`);
   xmlhttp.send();
}
function showInvite(appointId) {
   location.href = `../pages/appoint.html?id=${appointId}`;
}
function denyInvite(inviteId) {
   var xmlhttp = new XMLHttpRequest();
   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
         if (xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.response);
            if (data.success) {
               console.log("약속초대 거절");
               window.location.reload();
            }
            else console.log(data.msg);
         }
         else if (xmlhttp.status == 400) console.log('There was an error 400');
         else console.log('something else other than 200 was returned');
      }
   };
   xmlhttp.open("DELETE", `${path}/invites/${inviteId}`);
   xmlhttp.send();
}
function friendBtnClick() { location.href="#1"; }
function appointBtnClick() { location.href="#2"; }