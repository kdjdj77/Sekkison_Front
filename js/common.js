(function ($) {
   "use strict";
   //[search]
   $("#headerProfileImg").attr("src", `${path}/userFiles/${localStorage.getItem("sks_id")}`);

   document.getElementById("myName").innerHTML = `나 : ${localStorage.getItem("sks_name")}`;
   document.getElementById("friendBtn").addEventListener('click', function() {
      document.getElementById("friendToggle").classList.toggle('friendOn');
      document.getElementById("friendToggle").classList.toggle('friendOff');
   })
   document.getElementById("friendBtn2").addEventListener('click', function() {
      document.getElementById("friendToggle").classList.toggle('friendOn');
      document.getElementById("friendToggle").classList.toggle('friendOff');
   })
   document.getElementById("findFriendBtn").addEventListener('click', function() {
      document.getElementById("findFriend").classList.remove('off');
   })
   document.getElementById("findFriendBtn2").addEventListener('click', function() {
      document.getElementById("findFriend").classList.add('off');
   })
   $.ajax({
      url:`${path}/friends/list/${localStorage.getItem("sks_id")}`,
      type:"GET",
      cache:false,
      success : function(data){
         if (data.success) {
               console.log("친구목록 받기 성공");
               console.log(data.data);
               setFriends(data.data);
         } else {
               console.log(data.msg);
         }
      }
   });
   function setFriends(result) {
      const out = [];
      result.forEach(data => {
         let name = data.name + (data.memo == null ? "" : `(${data.memo})`);
         const row = `
            <div style="margin:1px; background-color:#FBF5EF; color:black; width:100%; padding:10px; border:2px solid #F6E3CE; border-radius:5px">
               <a style="text-decoration:none; color:black;" href="./otherinfo.html?userId=${data.id}">
                  <img style="width:25px; height:25px; border-radius:50%; vertical-align: middle;"
                     src="${path}/userFiles/${data.id}">
                  <span id="friendName${data.id}">${name}</span>
               </a>
               <button style="font-size:1rem; color:black; margin-right:10px; vertical-align:middle;"
                  onclick="openSetMemo(${data.id});">
                  <i class="fa fa-file-text-o"></i>
               </button>
               <button style="float:right; font-size:1.5rem; color:black; margin-right:10px;"
                  onclick="msgSend(${data.id})">
                  <i class="fa fa-envelope-o"></i>
               </button>
               <div id="memoBox${data.id}" style="display:none; width:100%; height:1.3rem; margin-top:0.5rem;">
                  <input id="friendMemo${data.id}" type="text" style="height:100%; width:60%;" placeholder="메모 입력">
                  <input id="friendNameHD${data.id}" type="hidden" value="${data.name}">
                  <button type="button" style="width:20%; height:100%;"
                     onclick="setMemo(${localStorage.getItem("sks_id")}, ${data.id})">
                     OK
                  </button>
               </div>
            </div>`;
         out.push(row);
      });
      $("#friendList").html(out.join("\n"));
   }

   $("#friendInput").on("propertychange change keyup paste input", keyupSearch);

   function keyupSearch() {
      var regExp = /^[가-힣]{1,8}$/;
      if ($("#friendInput").val().trim() == "") {
         $("#friendSearch").html("");
         return;
      } if (!regExp.test($("#friendInput").val())) return;

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

   function setSearch(result) {
      const out = [];
      result.forEach(data => {
         const row = `
            <div style="margin:0.1%; background-color:#FBF5EF; color:black;
               width:99%; padding:10px; border:2px solid #F6E3CE; border-radius:5px">
               <a style="text-decoration:none; color:black;"
                  href="./otherinfo.html?userId=${data.id}">
                  <img style="width:25px; height:25px; border-radius:50%; vertical-align: middle;"
                     src="${path}/userFiles/${data.id}">
                  ${data.name}
               </a>
               ${setSearchFriendBtn(data)}
            </div>
         `;
         out.push(row);
      });
      $("#friendSearch").html(out.join("\n"));
   }
   function setSearchFriendBtn(data) {
      if (data.memo == "X") {
         return `
            <button style="float:right; font-size:1.3rem; color:black; margin-right:10px;"
               onclick="friendSend(${data.id}, this)">
               <i class='fa fa-user-plus'></i>
            </button>`
      } else if (data.memo == "O") {
         return `
            <button style="float:right; font-size:1.5rem; color:black; margin-right:10px;"
               onclick="msgSend(${data.id})">
               <i class="fa fa-envelope-o"></i>
            </button>`;
      } else {
         return `<span style="float:right; font-size:1rem; color:black; margin-right:10px;">대기중</span>`
      }
   }
})(jQuery);
function msgSend(toId) {
   let fromId = localStorage.getItem("sks_id");
   location.href = `./msgsend.html?fromId=${fromId}&toId=${toId}`;
}
function friendSend(toId, obj) {
   let fromId = localStorage.getItem("sks_id");
   var xmlhttp = new XMLHttpRequest();

   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
         if (xmlhttp.status == 200) {
            data = JSON.parse(xmlhttp.response);
            if (data.success) {
               console.log("친구초대 성공");

               $(obj).css("font-size", "1rem");
               $(obj).css("cursor", "default");
               obj.innerHTML = "대기중";
               obj.disabled = true;
            }
            else console.log(data.msg);
         }
         else if (xmlhttp.status == 400) console.log('There was an error 400');
         else console.log('something else other than 200 was returned');
      }
   };

   xmlhttp.open("POST", `${path}/friends?fromId=${fromId}&toId=${toId}`, true);
   xmlhttp.send();
}
$.ajax({
   url:`${path}/users/alarm/${localStorage.getItem("sks_id")}/0`,
   type:"GET",
   cache:false,
   success : function(data){
      if (data.success) {
         console.log("쪽지개수 받기 성공");
         $("#messageCnt").addClass("redbg");
         $("#messageCnt").html(data.data);
      } else console.log(data.msg);
   }
});
$.ajax({
   url:`${path}/users/alarm/${localStorage.getItem("sks_id")}/1`,
   type:"GET",
   cache:false,
   success : function(data){
      if (data.success) {
         console.log("초대개수 받기 성공");
         $("#inviteCnt").addClass("redbg");
         $("#inviteCnt").html(data.data);
      } else console.log(data.msg);
   }
});
// 메모 세팅
function setMemo(fromId, toId) {
   let memo = $(`#friendMemo${toId}`).val();
   let name = $(`#friendNameHD${toId}`).val();
   $.ajax({
      url:`${path}/friends/memo/${fromId}/${toId}?memo=${memo}`,
      type:"PUT",
      cache:false,
      success : function(data){
         if (data.success) {
            console.log("메모 세팅 완료");
            $(`#friendName${toId}`).html(`${name}(${memo})`);
            $(`#memoBox${toId}`).toggle();
         }
         else console.log(data.msg);
      }
   })
}
function openSetMemo(id) {
   $(`#memoBox${id}`).toggle();
}