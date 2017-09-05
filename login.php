<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>环球网监控平台-登录</title>
<link href="/templates/styles/baseStyle.css" rel="stylesheet" type="text/css">
</head>
<body class="loginBody">

<div id="loginInner" class="clearfix">
    <div id="loginFrom">
        <div class="inner">
            <div class="login-pic">
                <img src="/templates/images/login_logo.png">
            </div>
			<span class="error"><?php echo $flash['error'] ?></span>
			<form action="/login" method="post">
				<div class="from">
					<div class="user-name">
						<input class="login-input" name="username" type="text" placeholder="请输入您的帐号">
					</div>

					<div class="user-password">
						<input class="login-input" name="password" type="password" placeholder="密码">
					</div>

					<div class="login-btn">
						<input class="btn-blue" type="submit" name="submit" value="登&nbsp;&nbsp;&nbsp;&nbsp;录"/>
					</div>
				</div>
			</form>
        </div>
    </div>

    <div class="login-propaganda-pic"></div>
</div>

</body>
<script type="text/javascript">
localStorage.removeItem('hqTag');
</script>
</html>