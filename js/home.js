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


   function newload() {
      page = 0;
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
                  console.log("약속목록 받기 성공");
                  console.log(data);
                  newList(data.data);
            } else {
                  console.log(data.msg);
                  $("#list").html("\n");
            }
         }
      });
   }
   function load() {
      page++;
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
               console.log("추가 약속목록 받기 성공");
               console.log(data);
               addList(data.data);
            } else {
               console.log(data.msg);
               window.removeEventListener('scroll', func);
               $("#loading").css("display", "none");
            }
         }
      });
   }
   function newList(result) {      
      const out = [];
      
      result.forEach(appoint => {
         let id = appoint.id;
         let title = appoint.title;
         let dday = String(Math.floor((new Date(appoint.dday) - new Date()) / (1000*60*60*24)));
         let head = appoint.headCnt;
         let max = appoint.maxCnt;
         let masterName = appoint.masterName;

         const row = `
            <div style="width:100%; border-radius:5px; border:1px solid gray; border-right:0px; padding:0;
               display:flex; flex-wrap:wrap; margin-bottom:2px;">
               <div style="width:85%; margin-left:2%;">
                  <div style="width:100%; display:flex; flex-wrap:wrap; justify-content:space-between;">
                  <div style="width:70%; font-size:1.3rem; overflow: hidden; text-overflow: ellipsis;
                     white-space: nowrap;">
                     ${title}
                  </div>
                  <div style="width:30%; text-align:right; padding-right:0.2rem;">${masterName}</div>
               </div>
                  <div>D-${dday}</div>
                  <span><i class="fa fa-user"></i>&nbsp;${head}/${max}</span>
               </div>
               <button type="button" id="join" onclick="join(${id});"
                  style="margin:0; width:13%; height:5rem; font-size:1.2rem; color:white;
                  border-radius:0px 5px 5px 0px; background-color:#fd8365">
                  보기
               </button>
            </div>
         `;
         out.push(row);
      });
      $("#list").html(out.join("\n"));
   }
   function addList(result) {
      const out = [];
      
      result.forEach(appoint => {
         let id = appoint.id;
         let title = appoint.title;
         let dday = String(Math.floor((new Date(appoint.dday) - new Date()) / (1000*60*60*24)));
         let head = appoint.headCnt;
         let max = appoint.maxCnt;
         let masterName = appoint.masterName;

         const row = `
            <div style="width:100%; border-radius:5px; border:1px solid gray; border-right:0px; padding:0;
               display:flex; flex-wrap:wrap; margin-bottom:2px;">
               <div style="width:85%; margin-left:2%;">
                  <div style="width:100%; display:flex; flex-wrap:wrap; justify-content:space-between;">
                     <div style="width:70%; font-size:1.3rem; overflow: hidden; text-overflow: ellipsis;
                        white-space: nowrap;">
                        ${title}
                     </div>
                     <div style="width:30%; text-align:right; padding-right:0.2rem;">${masterName}</div>
                  </div>
                  <div>D-${dday}</div>
                  <span><i class="fa fa-user"></i>&nbsp;${head}/${max}</span>
               </div>
               <button type="button" id="join" onclick="join(${id});"
                  style="margin:0; width:13%; height:5rem; font-size:1.2rem; color:white;
                  border-radius:0px 5px 5px 0px; background-color:#fd8365">
                  보기
               </button>
            </div>
         `;
         out.push(row);
      });
      $("#list").append(out.join("\n"));
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

