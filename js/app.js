/**
 * Angular 路由
 */


var tagApp = angular.module('tagApp',[
    "ngRoute",
    "ngTouch",
    "ngCookies",
    "ngAnimate"
]);

tagApp.config(['$routeProvider', '$locationProvider','$httpProvider',function($routeProvider,$locationProvider,$httpProvider) {

    $routeProvider
        //根目录
        //.when('/', {
        //    templateUrl: '/templates/page/pending.html',
        //    controller: 'pendingCtrl'
        //})

        //添加稿源
        .when('/addManuscripts', {
            templateUrl: 'page/addManuscripts.html',
            controller: 'addManuscriptsCtrl'
        })

        //添加敏感词
        .when('/addSensitiveWords', {
            templateUrl: 'page/addSensitiveWords.html',
            controller: 'addSensitiveWordsCtrl'
        })

        //浏览稿源
        .when('/browseManuscripts/:cs', {
            templateUrl: 'page/browseManuscripts.html',
            controller: 'browseManuscriptsCtrl'
        })

        //浏览敏感词
        .when('/browseSensitiveWords/:cs', {
            templateUrl: 'page/browseSensitiveWords.html',
            controller: 'browseSensitiveWordsCtrl'
        })

        //已审核内容
        .when('/approved/:cs', {
            templateUrl: 'page/approved.html',
            controller: 'approvedCtrl'
        })

        //待审核内容
        .when('/pending', {
            templateUrl: 'page/pending.html',
            controller: 'pendingCtrl'
        })

        //添加管理人
        .when('/addAdmin', {
            templateUrl: 'page/addAdmin.html',
            controller: 'addAdminCtrl'
        })

        //管理管理员
        .when('/browseAdmin', {
            templateUrl: 'page/browseAdmin.html',
            controller: 'browseAdminCtrl'
        })

        //修改管理员
        .when('/modifyAdmin/:cs', {
            templateUrl: 'page/modifyAdmin.html',
            controller: 'modifyAdminCtrl'
        })

        //账号设置
        .when('/setupAdmin/:cs', {
            templateUrl: 'page/setupAdmin.html',
            controller: 'setupAdminCtrl'
        })

        //管理审核维度
        .when('/browseTag/:cs', {
            templateUrl: 'page/browseTag.html',
            controller: 'browseTagCtrl'
        })

        //添加审核维度
        .when('/addTag', {
            templateUrl: 'page/addTag.html',
            controller: 'addTagCtrl'
        })

        //其他
        .otherwise({
            redirectTo: '/'
        });

}]);















