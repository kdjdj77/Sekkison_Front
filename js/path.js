const path = "http://Sekkison-env-1.eba-qrr3cbmm.ap-northeast-2.elasticbeanstalk.com";
// const path = "http://localhost:5000";

let currentUrl = window.location.href;
if (currentUrl.startsWith("https:"))
   location.href = currentUrl.replace(/^https:/, "http:");

