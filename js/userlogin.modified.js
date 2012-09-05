function userlogin()
{
	var redirect = '.';
	if (typeof userlogin_redirect !== 'undefined')
		redirect = userlogin_redirect;

	var loginform = $('input[name=userid]').parents('form');
	var loginInfo = loginform.serialize();
	var submitButton = $('input#login-logo', loginform);
	var submitValue = submitButton.attr('value');

	var loginFinalize = function()
	{
		submitButton.stop(true).attr('src', 'img/login.png');
	};

	var loginSuccess = function(response)
	{
		if (typeof response.result === 'undefined' ||
			typeof response.message === 'undefined' ||
			typeof response.data === 'undefined') {
			alert('出现内部错误。');
			loginFinalize();
			return;
		}

		if (response.result < 0) {
			alert(response.message);
			loginFinalize();
			return;
		}

		var date = new Date();
		date.setTime(date.getTime() + response.data.expire * 1000);
		var datestr = date.toGMTString();

		$.each(response.data.values, function(key, value) {
			document.cookie = key + '=' + value +
				'; domain=.' + document.domain +
				'; path=' + response.data.path +
				'; expires=' + datestr;
		});

		loginFinalize();
		window.location.href = redirect;
	};

	submitButton.attr('src', 'img/loading.gif');
	
	var loginresult = $.ajax({
		url: 'https://www.bdwm.net/bbs/bbsauth.php?callback=?',
		data: loginInfo,
		dataType: 'json',
		timeout: 40200,
		success: loginSuccess,
		error: function() { alert('Network unavailable'); loginFinalize(); }
	});

    return false;
}

$(function() {

	if (typeof window.userlogin_js_loaded != 'undefined')
		return;

	window.userlogin_js_loaded = 1;

//	$('input[name="userid"]').parents('form').submit(userlogin);
	$('input#login-logo').click(userlogin);

});

