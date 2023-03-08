// date/time picker
$.datepicker.setDefaults({
   dateFormat: 'yy.mm.dd',
   prevText: '이전 달',
   nextText: '다음 달',
   monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
   monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
   dayNames: ['일', '월', '화', '수', '목', '금', '토'],
   dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
   dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
   showMonthAfterYear: true,
   yearSuffix: '년'
});

$(function () {
   $('.bs-timepicker').timepicker();
   $('#date').datepicker({
      showOn:"button",
      buttonText: "",
      changeMonth:true,
      changeYear:true,
      minDate: "0"
   }).next('button').append('<i style="font-size:1.2rem;" class="fa fa-calendar"></i>');
   $('#date').datepicker('setDate', 'today');
});

// makeAppoint
(function ($) {
   $("input[name='tag']").change(function() {
      let tagNum = $("input[name='tag']:checked").val();
      $(".tagBox").addClass("off");
      $(`#appoint_${tagNum}`).removeClass("off");

      if (tagNum == '2') $("#setPublic").addClass("off");
      else $("#setPublic").removeClass("off");
   });
})(jQuery)
function cntUp(num) {
   let cnt = Number($(`#maxCnt_${num}`).val());
   if (cnt == 50) return;
   $(`#maxCnt_${num}`).val(cnt+1);
}
function cntDown(num) {
   let cnt = Number($(`#maxCnt_${num}`).val());
   if (cnt == 1) return;
   $(`#maxCnt_${num}`).val(cnt-1);
}
function submitAppoint(type) {
   let data;

   let title = $("#title").val().trim();
   if (title == null || title == "") { alert("제목이 올바르지 않습니다"); return; }
   let date = $("#date").val();
   let time = $("#time").val();
   let isPublic = $("input[name='isPublic']:checked").val();

   if (type == 0) {
      let maxCnt = Number($("#maxCnt_0").val());
      if (maxCnt < 1) { alert("인원수가 올바르지 않습니다"); return; }
      let category = $("#cate_0").val();
      let address = $("#address_0").val();
      if (address == null || address == "") { alert("주소를 검색해주세요"); return; }
      let phone = $("#addPhone_0").val();
      let posX = $("#posX_0").val().trim();
      let posY = $("#posY_0").val().trim();
      let addressDetail = $("#AD_0").val().trim();
      let content = $("#content_0").val().trim();
      data = {
         "typeInteger":type,
         "isPublic":isPublic,
         "title":title,
         "date":date,
         "time":time,
         "maxCnt":maxCnt,
         "category":category,
         "address":address,
         "phone":phone,
         "posX":posX,
         "posY":posY,
         "addressDetail":addressDetail,
         "content":content
      };
   } else if (type == 1) {
      let maxCnt = $("#maxCnt_1").val();
      if (maxCnt < 1) { alert("인원수가 올바르지 않습니다"); return; }
      let content = $("#content_1").val().trim();
      data = {
         "typeInteger":type,
         "isPublic":isPublic,
         "title":title,
         "date":date,
         "time":time,
         "maxCnt":maxCnt,
         "content":content
      };
   } else {
      let content = $("#content_2").val().trim();
      data = {
         "typeInteger":type,
         "title":title,
         "date":date,
         "time":time,
         "isPublic":false,
         "content":content
      }
   }

   $.ajax({
      url:`${path}/appoints/${localStorage.getItem("sks_id")}`,
      type:"POST",
      data:data,
      cache:false,
      success : function(data){
         if (data.success) {
            console.log("약속 만들기 성공");
            location.href=`../pages/appoint.html?id=${data.data}`;
         }
         else console.log(data.msg);
      }
   });
}