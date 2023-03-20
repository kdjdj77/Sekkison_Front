(function ($) {
    "use strict";
    //[ Focus input ]

    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") $(this).addClass('has-val');
            else $(this).removeClass('has-val');
        })    
    })
    //[ Validate ]
    let input = $('.validate-input .input100');
    $('.validate-form').on('submit',function(){
        let check = true;
        for(let i=0; i<input.length; i++)
            if(validate(input[i]) == false){showValidate(input[i]);check=false;}
        return check;
    });
    $('.validate-form .input100').each(function(){
        $(this).focus(function(){hideValidate(this);});
    });
    function validate (input) {
        if($(input).attr('type') == 'id' || $(input).attr('name') == 'id'){
            if($(input).val().trim().match( /^[A-Za-z0-9]{4,10}$/) == null)
                return false;
        }
        else if($(input).val().trim() == '') return false;
    }
    function showValidate(input) {
        let thisAlert = $(input).parent();
        $(thisAlert).addClass('alert-validate');
    }
    function hideValidate(input) {
        let thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
    }
    //[ Show pass ]*/
    let showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('zmdi-eye');
            $(this).find('i').addClass('zmdi-eye-off');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').addClass('zmdi-eye');
            $(this).find('i').removeClass('zmdi-eye-off');
            showPass = 0;
        }
    });
    //[login]
    $("#submitBtn").click(defaultLogin);
    $("#googleBtn").click(googleLogin);
    $("#kakaoBtn").click(kakaoLogin);
    $("#PW").on('keyup', function() {
        if(window.event.keyCode==13) defaultLogin();
    })

    function defaultLogin() {
        let id = $("#ID").val();
        let pw = $("#PW").val();
        let data = {
			"username":id,
			"password":pw
		};
		
		$.ajax({
			url:`${path}/users/login`,
			type:"POST",
			data:data,
			cache:false,
			success : function(data){
                if (data.success) {
                    console.log("로그인 성공");
                    localStorage.setItem('sks_id', data.data.id);
                    localStorage.setItem('sks_username', data.data.username);
                    localStorage.setItem('sks_password', data.data.password);
                    localStorage.setItem('sks_name', data.data.name);
                    location.href="./pages/home.html";
                } else {
                    console.log(data.msg);
                    $('#error').text(data.msg);
                }
            }
		});
    }
    // 구글 로그인
    function googleLogin() {
        google.accounts.id.initialize({
            client_id: "646957294495-4nitspjp5vn5u7aapj5ph6qhvt9fdm0m.apps.googleusercontent.com",
            callback: function(response) {
                const token = jwt_decode(response.credential).sub;
                apiLogin(`google_${token}`, `google_pw_${token}`, 0);
            }
        });
        google.accounts.id.prompt();
    }
    // 카카오 로그인
    function kakaoLogin() {
        Kakao.init('cab7544176ea7c6e5560a224d2808d78');
        Kakao.Auth.login({
            success: function () {
                Kakao.API.request({
                    url: '/v2/user/me',
                    success: function (response) {
                        const token = response.id;
                        apiLogin(`kakao_${token}`, `kakao_pw_${token}`, 1);
                    },
                    fail: function (error) { console.log(error) },
                })
            },
            fail: function (error) {
                console.log(error)
            },
        })
    }
    // 네이버 로그인
    let naverLogin = new naver.LoginWithNaverId(
        {
            clientId: "2MC6zwLDyYzFqjXZtAF3",
            callbackUrl: "http://sekkison.com/index.html",
            isPopup: false,
            callbackHandle: true
        }
    );
    naverLogin.init();
    window.addEventListener('load', function () {
        naverLogin.getLoginStatus(function (status) {
            if (status) {
                const token = naverLogin.user.id;
                apiLogin(`naver_${token}`, `naver_pw_${token}`, 2);
            } 
            //else console.log("callback 처리에 실패하였습니다.");
        });
    });

    // api 로그인 진행
    function apiLogin(id, pw, type) {
        $.ajax({
			url:`${path}/users/find?username=${id}`,
			type:"GET",
			cache:false,
			success : function(data){
                if (data.success) {
                    console.log("로그인 성공");
                    localStorage.setItem('sks_id', data.data.id);
                    localStorage.setItem('sks_username', data.data.username);
                    localStorage.setItem('sks_password', data.data.password);
                    localStorage.setItem('sks_name', data.data.name);
                    location.href="./pages/home.html";
                } else {
                    localStorage.setItem('sks_username', id);
                    localStorage.setItem('sks_password', pw);
                    location.href = `./pages/apiregister.html?api=${type}`;
                }
            }
		});
    }
})(jQuery);