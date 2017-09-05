<!DOCTYPE html>
<html data-ng-app="tagApp">
<head>
<meta charset="utf-8">
<title></title>
<link href="styles/baseStyle.css" rel="stylesheet" type="text/css">
<link href="styles/jquery-ui.css" rel="stylesheet" type="text/css">
<link href="styles/jquery-ui-timepicker-addon.css" rel="stylesheet" type="text/css">
</head>

<body data-ng-controller="pageOnload">

    <div data-ng-include="page_header"></div>

    <div data-ng-view></div>

    <div data-ng-include="page_siteNav"></div>

</body>

<script type="text/javascript" src="js/angular.min.js"></script>
<script type="text/javascript" src="js/angular-cookie_route_resource_touch_animate.js"></script>
<script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="js/jquery-ui.min.js"></script>
<script type="text/javascript" src="js/jquery-ui-timepicker-addon.js"></script>
<script type="text/javascript" src="js/app.js"></script>
<script type="text/javascript" src="js/controller.js"></script>
</html>