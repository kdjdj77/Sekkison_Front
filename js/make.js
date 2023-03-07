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
   });
})(jQuery)

function cntUp(num) {
   let cnt = Number($(`#maxCnt_${num}`).val());
   if (cnt == 50) return;
   $(`#maxCnt_${num}`).val(cnt+1);
}
function cntDown(num) {
   let cnt = Number($(`#maxCnt_${num}`).val());
   if (cnt == 0) return;
   $(`#maxCnt_${num}`).val(cnt-1);
}