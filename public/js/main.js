$(function(){

	var dn = 'http://ccmauth.aivics.net'

	var access_token
	var cookie_access_token = $.cookie('access_token')
	if(cookie_access_token){
		$('.login_div').hide()
		$('#registerForm').show()
		access_token = cookie_access_token
	}

	$('.login_div .form-control').keyup(function(event) {
		if(event.keyCode == 13)
			$('.login').click()
	});

	$('.login').click(function(){
		var loginid = $('.loginid').val()
		var loginpwd = $('.loginpwd').val()
		if(!loginid){
			alert('请输入用户名')
			return false
		}
		else if(!loginpwd){
			alert('请输入密码')
			return false
		}
		//admin登录获取token
		var jwtToken
		$.ajax({
			url:dn + '/identity/oauth2admin/token',
			type:'post',
			headers:{'X-Authub-Account':"authub_master"},
			data:{username: loginid,password: loginpwd,grant_type: 'password'}
		})
		.success(function(res){
			if(res.success){
				$('.login_div').hide()
				$('#registerForm').show()
				jwtToken = res

				//通过token创建client
				var client
				$.ajax({
					url:dn + '/identity/clients',
					type:'post',
					headers:{'X-Authub-Account':"authub_master","Authorization":"Bearer " + jwtToken.access_token}
				})
				.success(function(res){
					console.log(jwtToken)
					if(res.success){
						client = res.data
						console.log(client)
						//通过client获取AccessToken
						$.ajax({
							url:dn + '/identity/oauth2admin/token',
							type:'post',
							headers:{'X-Authub-Account':"authub_master"},
							data:{client_id: '5744030526d22a65441664a9',client_secret: '36F4nZUR6RgKA5ltzsjlnLlk1idUkoGRLiHbzVvptyyIgSkhbYs3708DEUlSfsYW',grant_type: 'client_credential'}
						})
						.success(function(res){
							access_token = res.access_token
							$.cookie('access_token',access_token)
						})
					}
				})
			}
			else{
				alert('用户名或密码错误')
			}
		})
		.error(function(obj,error){
			alert('用户名或密码错误')
		})
	})

	$('.submit').off('click')

	$('.submit').on('click',function(){
		var email = $('#email').val()
		var pwd = $('#password').val()
		var repwd = $('#rePassword').val()
		var name = $('#name').val()
		var fullName = $('#fullName').val()
		var firstName = $('#firstName').val()
		var lastName = $('#lastName').val()
		var mobile = $('#mobile').val()

		var validateArr = [email,pwd,repwd,name,fullName,firstName,lastName,mobile]
		var messageArr = ['邮箱','密码','确认密码','公司代码','公司全称','联系人姓氏','联系人名字','手机号']

		var unpass = ''
		validateArr.forEach(function(param,i){
			if(!param){
				unpass+=(messageArr[i]+'、')
			}
		})
		if(unpass){
			unpass = unpass.substring(0,unpass.length-1)
			alert(unpass+'不能为空')
			return false
		}
		else if(!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email))){
			alert('邮箱格式不正确')
			return false
		}
		else if(pwd!=repwd){
			alert('两次密码输入不一致')
			return false
		}
		else if(!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(mobile))){
			alert('手机号格式不正确')
			return false
		}
		$.ajax({
			url:dn + '/identity/register',
			type:'post',
			headers:{'X-Authub-Account':"authub_master",'Authorization':"Bearer " + access_token},
			data:{
				name: name,
	          	fullname: fullName,
	          	username: email,  //?
	          	password: pwd,
	          	mobile: mobile,
	          	email: email,
	          	lastName: lastName,
	          	firstName: firstName
	      	}
		})
		.success(function(res){
			if(res.success){
				alert('注册成功')
				
				//发送验证码
				$.ajax({
					url:dn + '/identity/vericode/code',
					type:'post',
					data:{ identity: email , veri_type: 'email', target_url: "/accounts/activate" }
				})
				.success(function(res){
					if(res.success){
						var veri_code = res.veri_code
						
						$.ajax({
							url:dn + '/identity/oauth2admin/sendMail',
							type:'post',
							headers:{'X-Authub-Account':"authub_master",'Authorization':"Bearer " + access_token},
							data:{subject:'来自fastccm帐号注册',html:'验证码：'+veri_code}
						})
						
					}
				})

			}
		})
		return false
	})

})