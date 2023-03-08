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
   load(appointId);

   $("#mapBtn").click(function() {
      let mapBox = document.getElementById("mapBox");
      mapBox.classList.toggle("hide");
      mapBox.classList.toggle("vis");
      if (mapBox.classList.contains("hide"))
         $(this).html(`<i class="fa fa-angle-up fa-2x"></i>`);
      else $(this).html(`<i class="fa fa-angle-down fa-2x"></i>`);
   });
   function load(aid) {
      $.ajax({
         url:path + `/appoints/${aid}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
               console.log("약속 데이터 받기 성공");
               console.log(data);
               set(data.data);
               loadMembers(aid, data.data.memo, data.data.type);
            } else console.log(data.msg);
         }
      });
   }
   function loadMembers(aid, master, type) {
      $.ajax({
         url:`${path}/appoints/members/${aid}`,
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

      $("#title").html(data.title);
      $("#content").html(data.content);
      $("#posX").html(data.posX);
      $("#posY").html(data.posY);
      openSearch(data.posX, data.posY);
      $("#headCnt").html(data.headCnt);
      $("#maxCnt").html(data.maxCnt);
      $("#dDay").html(data.dDay);
      let dd = Math.floor((new Date(data.dDay) - new Date()) / (1000*60*60*24));
      $('#D-d').html(`${dd < 0 ? "종료" : `D-${dd}`}`);
      $("#isPublic").html(data.isPublic ? "공개" : "비공개");
      $("#isRecruit").html(data.isRecruit ? "모집중" : "모집완료");
      if (data.type == "FTF") $("#appointType").html("만남");
      else if (data.type == "NFTF") $("#appointType").html("온라인");
      else $("#appointType").html("나만의");

      if (data.type == "FTF") {
         $("#category").html(data.category);
         $("#address").html(`주소 : ${data.address}`);
         $("#addressDetail").html(`상세위치 : ${data.addressDetail}`);
      } else {
         $("#category").remove();
         $("#address").remove();
         $("#addressDetail").remove();
      }
   }
   function setMembers(data, master, type) {
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
      });
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