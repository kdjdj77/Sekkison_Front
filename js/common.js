(function ($) {
   "use strict";
   //[search]

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
               console.log("데이터 받기 성공");
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
         let name = `${data.name} (${data.memo})`;
         const row = `
            <div style="margin:1px; background-color:#FBF5EF; color:black; width:100%; padding:10px; border:2px solid #F6E3CE; border-radius:5px">
               ${name}
               <button style="float:right; font-size:1.5rem; color:black; margin-right:10px;"
                  onclick="msgSend(${data.id})">
                  <i class="fa fa-envelope-o"></i>
               </button>
            </div>
         `;
         out.push(row);
      });
      $("#friendList").html(out.join("\n"));
   }

   $("#friendInput").on("propertychange change keyup paste input", function() {
      if ($("#friendInput").val().trim() == "") {
         $("#friendSearch").html("");
         return;
      }
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
   });
   function setSearch(result) {
      const out = [];
      result.forEach(data => {
         const row = `
            <div style="margin:1px; background-color:#FBF5EF; color:black; width:100%; padding:10px; border:2px solid #F6E3CE; border-radius:5px">
               ${data.name}
               <button style="float:right; font-size:1.3rem; color:black; margin-right:10px;"
                  onclick="friendSend(${data.id})">
                  ${data.memo == "X" ? "<i class='fa fa-user-plus'></i>" : ""}
               </button>
            </div>
         `;
         out.push(row);
      });
      $("#friendSearch").html(out.join("\n"));
   }
})(jQuery);
function msgSend(toId) {
   let fromId = localStorage.getItem("sks_id");
   location.href = `./msgsend.html?fromId=${fromId}&toId=${toId}`;
}
function friendSend(toId) {
   let fromId = localStorage.getItem("sks_id");

}