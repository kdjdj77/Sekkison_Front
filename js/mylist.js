let page = 0;

function join(id) {
   location.href = `../pages/appoint.html?id=${id}`;
}
(function ($) {
   "use strict";
   //[search]
   newload();
   function newload() { page = 0; load(); }
   function addload() { page++; load(); }

   function load() {
      page = 0;
      $.ajax({
         url:`${path}/appoints/list/${localStorage.getItem("sks_id")}/${page}`,
         type:"GET",
         cache:false,
         success : function(data){
            if (data.success) {
               console.log((page > 0 ? "추가" : "") + "약속목록 받기 성공");
               console.log(data);
               appList(data.data);
            } else {
               if (page == 0) $("#list").html("");
               else {
                  console.log(data.msg);
                  window.removeEventListener('scroll', func);
                  $("#loading").css("display", "none");
               }
            }
         }
      });
   }
   function appList(result) {      
      const out = [];
      
      result.forEach(appoint => {
         let id = appoint.id;
         let title = appoint.title;
         let date = appoint.dday.substring(0, appoint.dday.length-3);
         let dday = String(Math.floor((new Date(date) - new Date()) / (1000*60*60*24)));
         let head = appoint.headCnt;
         let max = appoint.maxCnt;
         let masterName = appoint.memo;

         const row = `
            <div style="margin-top:5px; text-align:right; font-size:0.5rem; width:100%;">${date}</div>
            <div style="width:100%; border-radius:5px; border:1px solid gray; border-right:0px; padding:0;
               display:flex; flex-wrap:wrap; margin-bottom:2px;">
               <div style="width:85%; margin-left:2%;">
                  <div style="margin-bottom:0.5rem; width:100%; display:flex; flex-wrap:wrap; flex-direction:row;">
                     <div style="margin-top:0.5rem; font-size:1rem; font-weight:bold; overflow: hidden; text-overflow: ellipsis;
                        white-space: nowrap;">
                        ${title}
                     </div>
                     <div style="flex:1; margin-top:0.5rem; text-align:right; padding-right:0.2rem;">
                        ${masterName}
                     </div>
                  </div>
                  ${dday < 0 ? `<span style="color:gray;">종료</span>` : `</span>D-${dday}</span>`}
                  <span style="float:right; margin-right:0.5rem;"><i class="fa fa-user"></i>&nbsp;${head}/${max}</span>
               </div>
               <button type="button" id="join" onclick="join(${id});"
                  style="margin:0; width:13%; height:3.5rem; font-size:1.2rem; color:white;
                  border-radius:0px 5px 5px 0px; background-color:#fd8365">
                  <i class="fa fa-sign-in"></i>
               </button>
            </div>
         `;
         out.push(row);
      });
      if (page == 0) $("#list").html(out.join("\n"));
      else $("#list").append(out.join("\n"));
   }

   function checkVisible( element, check = 'above' ) {
      const viewportHeight = $(window).height(); // Viewport Height
      const scrolltop = $(window).scrollTop(); // Scroll Top
      const y = $(element).offset().top;
      const elementHeight = $(element).height();   
      
      // 반드시 요소가 화면에 보여야 할경우
      if (check == "visible") 
         return ((y < (viewportHeight + scrolltop)) && (y > (scrolltop - elementHeight)));
         
      // 화면에 안보여도 요소가 위에만 있으면 (페이지를 로드할때 스크롤이 밑으로 내려가 요소를 지나쳐 버릴경우)
      if (check == "above") 
         return ((y < (viewportHeight + scrolltop)));
   }
   function func() {
      if (checkVisible('#loading')) load();
   }
   // 스크롤 이벤트 등록
   window.addEventListener('scroll', func);
})(jQuery);

