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
    $("#naverBtn").click(naverLogin);
    $("#PW").on('keyup', function() {
        if(window.event.keyCode==13) login();
    })

    function defaultLogin() {
        let id = $("#ID").val();
        let pw = $("#PW").val();
        login(id, pw);
    }
    function googleLogin() {
        login(id, pw);
    }
    function kakaoLogin() {
        login(id, pw);
    }
    function naverLogin() {
        login(id, pw);
    }
    function login(id, pw){
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
	};
})(jQuery);