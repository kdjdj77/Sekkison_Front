let page = 0;

function join(id) {
   location.href = `../pages/appoint.html?id=${id}`;
}
(function ($) {
   "use strict";
   //[search]
   newload();
   $("#search").on("propertychange change keyup paste input",newload);
   $("#ispublic").change(newload);
   $("#isrecruit").change(newload);
   function newload() { page = 0; load(); }
   function addload() { page++; load(); }

   function load() {
      let ispublic = $("#ispublic").val();
      let isrecruit = $("#isrecruit").val();
      let search = $("#search").val();
      if (search == null) search = "";

      const data = { "search":search }
      $.ajax({
         url:path + `/appoints/search/${ispublic}/${isrecruit}/${page}`,
         type:"GET",
         data:data,
         cache:false,
         success : function(data){
            if (data.success) {
               console.log((page > 0 ? "추가" : "") + "약속목록 받기 성공");
               console.log(data);
               appointList(data.data);
            } else {
               if (page == 0) $("#list").html("");
               else {
                  console.log(data.msg);
                  document.getElementById("showBox").removeEventListener('scroll', func);
                  $("#loading").css("display", "none");
               }
            }
         }
      });
   }
   function appointList(result) {      
      const out = [];
      
      result.forEach(appoint => {
         let id = appoint.id;
         let title = appoint.title;
         let dday = Math.floor((new Date(appoint.dday) - new Date()) / (1000*60*60*24));
         let head = appoint.headCnt;
         let max = appoint.maxCnt;
         let memo = appoint.memo.split('&');
         let masterId = memo[0];
         let masterName = memo[1];
         let isPublic = appoint.isPublic == true ? "공개" : "비공개";
         let isRecruit = appoint.isRecruit == true ? "모집중" : "모집완료";
         let appointType = " ";
         let address;
         if (appoint.type == "FTF") {
            appointType = "만남";
            let addressList = appoint.address == null ? ["",""] : appoint.address.split(" ");
            address = `${addressList[0]} ${addressList[1]}`;
         }
         else if (appoint.type == "NFTF") appointType = "온라인";
         else appointType = "나만의";

         const row = `
            <div style="width:100%; border-radius:5px; border:1px solid gray; border-right:0px; padding:0;
               display:flex; flex-wrap:wrap; margin-bottom:2px;">
               <div style="width:85%; margin-left:2%;">
                  <div style="width:100%; display:flex; flex-wrap:wrap; justify-content:space-between;">
                     <div style="width:70%; font-weight:bold; font-size:1rem; overflow: hidden; text-overflow: ellipsis;
                        white-space: nowrap; cursor:pointer; padding:0;" onclick="join(${id});">
                        <span style="font-weight:normal; font-size:.3rem; border:1px solid gray; border-radius:5px;
                           padding:0 .2rem 0 .2rem; margin:0;">${appointType}</span>
                        <span style="font-weight:normal; font-size:.3rem; border:1px solid gray; border-radius:5px;
                           padding:0 .2rem 0 .2rem; margin:0;">${isRecruit}</span>
                        <span style="font-weight:normal; font-size:.3rem; border:1px solid gray; border-radius:5px;
                           padding:0 .2rem 0 .2rem; margin:0;">${isPublic}</span><br>
                        ${title}<br>
                        <span style="font-size:0.5rem; font-weight:normal;">${address}</span>
                     </div>
                     <div style="width:30%; float:right; text-align:right; padding-right:0.2rem;">
                        <div style="padding:.1rem .1rem 0 0; cursor:pointer;" onclick="goInfo(${masterId});">
                           ${masterId==0 ? "" :
                              `<img style="width:25px; height:25px; border-radius:50%; vertical-align: middle;"
                                 src="${path}/userFiles/${masterId}">`}
                           ${masterName}
                        </div>
                        <div style="font-weight:bold; padding-bottom:0.1rem;">${dday < 0 ? "종료" : `D-${dday}`}</div>
                        <span><i class="fa fa-user"></i>&nbsp;${head}/${max}</span>
                     </div>
                  </div>
               </div>
               <button type="button" id="join" ${appoint.isPublic ? `onclick="join(${id});"` : ""}
                  style="margin:0; width:13%; height:5rem; font-size:1.2rem;
                  border-radius:0px 5px 5px 0px; ${appoint.isPublic ?
                     `background-color:#fd8365; color:white;` : `background-color:dimgray; color:gray;`}">
                  <i class="fa fa-sign-in"></i>
               </button>
            </div>
         `;
         out.push(row);
      });
      if (page == 0) $("#list").html(out.join("\n"));
      else $("#list").append(out.join("\n"));
   }

   function checkVisible(element) {
      const viewportHeight = $("#showBox").height(); // Viewport Height
      const scrolltop = $("#showBox").scrollTop(); // Scroll Top
      const y = $(element).offset().top;
      return ((y < (viewportHeight + scrolltop)));
   }
   function func() {
      if (checkVisible('#loading')) addload();
   }
   // 스크롤 이벤트 등록
   document.getElementById("showBox").addEventListener('scroll', func);
})(jQuery);

window.onresize = function(event) {
   let body = document.body.clientHeight;
   let header = document.getElementById('searchBox').clientHeight;
   document.getElementById('showBox').style.height = body - 140 - header + 'px';
}

function goInfo(id) {
   location.href = `../pages/otherinfo.html?userId=${id}`;
}