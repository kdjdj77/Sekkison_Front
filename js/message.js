(function ($) {
   "use strict";
   setMsg();

   function setMsg() {
      $.ajax({
         url:`${path}/messages/list/${localStorage.getItem("sks_id")}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
               console.log("데이터 받기 성공");
               console.log(data);
               setList(data.data);
            } else {
               console.log(data.msg);
               $("#msgCnt").html(`(0)`);
            }
         }
      });
   }
   function setList(result) {
      $("#msgCnt").html(`(${result.length})`);
      result.forEach(msg => {
         let id = msg.id;
         let fromId = msg.fromId;
         let toId = msg.toId;
         let fromName;
         let content = t(msg.content);
         let regDate = msg.create_at;

         $.ajax({
            url:`${path}/users/${fromId}`,
            type:"GET",
            cache:false,
            success : function(data) { 
               fromName = data.success ? data.data.name : "unknown";
               const row = `
                  <div style="margin-top:5px; text-align:right; font-size:0.5rem; width:100%;">${regDate}</div>
                  <div style="width:100%; height:50px; display:flex; flex-wrap:wrap; padding:0; margin-bottom:0;
                     border-top:1px solid black; border-bottom:1px solid black; border-radius:5px;">
                     <div style="margin:auto; width:10%; height:100%; padding:0; margin:0;">
                        <button type="button" style="float:left; margin:0; height:100%; width:100%; border-radius:5px 0px 0px 5px;
                              color:white; background-color:green" onclick="send(${toId}, ${fromId})">
                           <i class="fa fa-reply"></i>
                        </button>
                     </div>
                     <div style="cursor:pointer; margin:auto; width:40%; overflow: hidden; text-overflow: ellipsis;
                        white-space: nowrap;" onclick="show(${id})">&nbsp;${content}
                     </div>
                     <div style="cursor:pointer; margin:auto; width:40%; text-align:right;" onclick="show(${id})">
                        <img style="width:25px; height:25px; border-radius:50%; vertical-align: middle;"
                           src="${path}/userFiles/${fromId}">   
                        ${fromName}&nbsp;
                     </div>
                     <div style="margin:auto; width:10%; height:100%; padding:0; margin:0;">
                        <button type="button" style="float:right; margin:0; height:100%; width:100%; border-radius:0px 5px 5px 0px;
                           color:white; background-color:crimson" onclick="delMsg(${id})">
                           <i class="fa fa-times"></i>
                        </button>
                     </div>
                  </div>
                  <div id="show_${id}" style="min-height:70px; padding:5px; width:100%; display:none; border:1px solid black; border-top:0px;">
                     ${content}
                  </div>
                  `;
               $("#msgs").append(row);
            }
         });
      });
   }
})(jQuery);

function show(id) {
   let trId = `show_${id}`;
   let trObj = document.getElementById(trId);
   if (trObj.style.display == "none") trObj.style.display = "block";
   else trObj.style.display = "none";
}
function send(fromId, toId) {
   location.href = `./msgsend.html?fromId=${fromId}&toId=${toId}`;
}
function delMsg(id) {
   if (!confirm("삭제하시겠습니까?")) return;
   $.ajax({
      url:`${path}/messages/${id}`,
      type:"DELETE",
      cache:false,
      success : function(data) { 
         if (data.success) alert("삭제 성공");
         else alert("삭제 실패");
         window.location.reload();
      }
   });
}