let page = 0;

function join(id) {
   localStorage.setItem("sks_appoint", id);
   location.href = "../pages/appoint.html";
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
                  console.log("데이터 받기 성공");
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
                  console.log("데이터 받기 성공");
                  console.log(data);
                  addList(data.data);
            } else {
                  console.log(data.msg);
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

         const row = `
            <div style="width:100%; border-radius:5px; border:1px solid gray; border-right:0px; padding:0;
               display:flex; flex-wrap:wrap; margin-bottom:2px;">
               <div style="width:85%; margin-left:2%;">
                  <div style="font-size:1.3rem; overflow: hidden; text-overflow: ellipsis;
                     white-space: nowrap;">${title}</div>
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

         const row = 
            `<div style="width:100%; border:1px solid gray; padding:5px;">
               <div style="font-size:1.3rem;">${title}</div>
               <div>D-${dday}</div>
               <div style="display:flex; flex-wrap:wrap; justify-content:space-between;">
                  <span><i class="fa fa-user"></i>&nbsp;${head}/${max}</span>
                  <button type="button" id="join" onclick="join(${id});">참가하기</button>
               </div>
            </div>
            `;
         out.push(row);
      });
      $("#list").append(out.join("\n"));
   }

   $(window).scroll(function(){
      let scrolltop = $(window).scrollTop(); 
      if( scrolltop == $(document).height() - $(window).height() ){
         load();
      }
   });
})(jQuery);

