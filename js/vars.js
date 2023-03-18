const path = "http://Sekkison-env-1.eba-qrr3cbmm.ap-northeast-2.elasticbeanstalk.com";
// const path = "http://localhost:5000";

let currentUrl = window.location.href;
if (currentUrl.startsWith("https:"))
   location.href = currentUrl.replace(/^https:/, "http:");


$(function() {
   $(".common").load("../pages/common.html");
})
function t(unsafeText) {
   return unsafeText.replace(/[<>"'&]/g, function (match) {
      switch (match) {
         case '<':
            return '&lt;';
         case '>':
            return '&gt;';
         case '\"':
            return '&quot;';
         case '\'':
            return '&#39;';
         case '&':
            return '&amp;';
      }
   });
}