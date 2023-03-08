const path = "http://localhost:8088";

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