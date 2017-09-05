/**
 * Angular 控制器
 */
var TIMER;
var IMG_TAGS;
var TEMP;
var TAG_SAVE = {};

tagApp

    //添加稿源
    .controller("addManuscriptsCtrl",function($scope,$http,$routeParams,$timeout,$interval){

        document.title = "环球网监控平台-添加稿源";
        $("body").removeClass("pendingBody");
        $interval.cancel(TIMER);

        //验证单日稿件上限
        $scope.yzManuscriptNum = function(e){
            var val = $(e).val();
            if(isNaN(val) || val <= 0){
                $(e).val("1");
            }
        };

        //添加稿源
        $scope.addManuscriptsPost = function(){

            //合作方分类
            var partnerType = [];
            var $pcUi = $(".partner-categories .ui-select-s");
            for(var i=0;i<$pcUi.length;i++){
                partnerType.push($pcUi.eq(i).attr("data-id"));
            }

            //合作方名称
            var partnerName = $(".partner-name").val();

            //合作方URL地址
            var partnerUrl = $(".partner-url").val();

            //单日稿件上限
            var manuscriptCap;
            if($(".manuscript-cap .ui-select").hasClass("ui-select-s")){
                manuscriptCap = 99999;
            }else{
                manuscriptCap = $(".manuscript-cap-num").val();
            }

            //合作方式
            var cooperationMethod = $(".cooperation-method .ui-drop-down-list .select").attr("data-id");

            //有效期
            var endless = $(".endless").hasClass("ui-select-s") ? 1 : 0;
            var startTime = $("#example_1_start").val();
            var endTime = $("#example_1_end").val();

            //备注
            var remark = $(".remark").val();

            //提交
            if(partnerName === ""){
                addTips("请填写合作方名称");
            }
            else if(!manuscriptCap){
                addTips("请填写单日稿件上限");
            }
            else if(!endless && startTime === "" || endTime === ""){
                addTips("请填写有效期");
            }else{
                //提交参数
                var cs = {
                    class: partnerType.join(","),
                    url: partnerUrl,
                    sitename: partnerName,
                    limit: manuscriptCap,
                    type: cooperationMethod,
                    remark: remark,
                    start_time: startTime,
                    end_time: endTime,
                    endless: endless
                };

                $http.post('/dashboard/add_source',cs,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
                    if(json.status === 1){
                        addTips("添加成功");
                        $timeout(function(){
                            window.location.href = '#/browseManuscripts/1';
                        },2000);
                    }else{
                        addTips(json.msg);
                    }
                });
            }
        };
    })

    //添加敏感词
    .controller("addSensitiveWordsCtrl",function($scope,$http,$routeParams,$interval,$timeout){

        document.title = "环球网监控平台-添加敏感词";
        $("body").removeClass("pendingBody");
        $interval.cancel(TIMER);

        //添加敏感词
        $scope.addSensitiveWordsPost = function(){

            //审核分类
            var dimension = $(".dimension .show-t").attr("data-id");
            var dimensionTag = $(".dimensionTag .show-t").attr("data-id");

            //敏感词名称
            var sensitiveWordName = $(".sensitive-words-textarea textarea").val();

            //提交
            if(sensitiveWordName === ""){
                addTips("请填写敏感词名称");
            }else{

                //提交参数
                var cs = {
                    tags: dimension,
                    attr: dimensionTag,
                    words: sensitiveWordName
                };

                $http.post('/dashboard/add_word',cs,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
                    if(json.status === 1){
                        addTips("添加成功");
                        $timeout(function(){
                            window.location.href = '#/browseSensitiveWords/1';
                        },2000);
                    }else{
                        addTips(json.msg);
                    }
                });
            }
        };
    })

    //浏览稿源
    .controller("browseManuscriptsCtrl",function($scope,$http,$routeParams,$interval){

        document.title = "环球网监控平台-浏览稿源";
        $("body").removeClass("pendingBody");
        $interval.cancel(TIMER);

        //页面分页搜索参数
        $scope.pageCsArr = $routeParams.cs.split("&");

        //当前页
        $scope.page = parseInt($scope.pageCsArr[0]);

        //合作方名称
        $scope.hzf = $scope.pageCsArr[1];

        //翻页&搜索
        var cs = {};
        if($scope.hzf){
            $scope.partnerName = $scope.hzf;
            cs = {
                page: $scope.page,
                hzf: $scope.hzf
            }
        }else{
            cs = {
                page: $scope.page
            }
        }

        //分页
        $http.post('/dashboard/list_source',cs,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
            //搜索字段
            if($scope.pageCsArr.length > 1){
                $scope.pageCsArr.splice(0,1);
                $scope.ssArr = "&" + $scope.pageCsArr.join("&");
            }else{
                $scope.ssArr = "";
            }

            //总条目数
            $scope.pagesTotal = json.total;

            //总分页数
            $scope.pagesNum = json.pages || 1;

            //上页
            $scope.pagePrev = $scope.page - 1 >= 1 ? ($scope.page - 1) + $scope.ssArr : 1 + $scope.ssArr;

            //下页
            $scope.pageNext = $scope.page + 1 <= $scope.pagesNum ? ($scope.page + 1) + $scope.ssArr : $scope.pagesNum + $scope.ssArr;

            //首页
            $scope.pageFirst = 1 + $scope.ssArr;

            //末页
            $scope.pageEnd = $scope.pagesNum + $scope.ssArr;

            //分配给页面显示的数据
            $scope.listData = json.results;
            if(json.results.length <= 0){
                addTips("暂未有符合检索条件的内容");
            }

            //分页循环数组
            $scope.pagesArr = [];
            for(var i=1;i<=$scope.pagesNum;i++){
                $scope.pagesArr.push(i);
            }
        });

        $scope.pageSelectClass = true;
        $("#pageInner").find(".pages-select-list li").eq($scope.page - 1).addClass("select");

        //搜索跳转
        // $scope.searchBtn = function(e){
        //     var url = $(e).attr("data-url");
        //     var se = url.split("&");

        //     if(se[1] != ""){
        //         window.location.href = location.href + url;
        //         $scope.sensitiveWords = se[1];
        //     }else{
        //         addTips("请填写合作方名称");
        //     }
        // };

        //合作方式
        $scope.cooperationMethod = function(str){
            var s = '';
            if(str === "cm"){
                s = '<span class="agreement">可以使用</span>';
            }
            else if(str === "cc"){
                s = '<span class="verbal-agreement">口头授权</span>';
            }
            else if(str === "ca"){
                s = '<span class="do-not-use">不可使用</span>';
            }
            else if(str === "cd"){
                s = '<span class="agreement">签订协议</span>';
            }
            return s;
        };

        //获取时间
        $scope.getTime = function(startTime,endTime){
            var t = "";
            if(startTime != 0 && endTime != 0){
                var sTime = new Date(parseInt(startTime) * 1000);
                var sYear = sTime.getFullYear();
                var sMonth = sTime.getMonth() + 1;
                var sDay = sTime.getDate();
                var eTime = new Date(parseInt(endTime) * 1000);
                var eYear = eTime.getFullYear();
                var eMonth = eTime.getMonth() + 1;
                var eDay = eTime.getDate();
                t = sYear + "-" + addZero(sMonth) + "-" + addZero(sDay) + " 至 " + eYear + "-" + addZero(eMonth) + "-" + addZero(eDay);
            }
            return t;
        };

        //删除敏感词
        $scope.deleteManuscripts = function(e){
            if(confirm("确认要删除合作方【" + $(e).attr("data-sitename") + "】吗?")){
                var id = $(e).attr("data-id");
                $http.post('/dashboard/remove_source',{id: id},{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
                    if(json.status === 1){
                        addTips("删除成功");
                        $(e).parents("tr").hide();
                    }else{
                        addTips(json.msg);
                    }
                });
            }
        };
    })

    //浏览敏感词
    .controller("browseSensitiveWordsCtrl",function($scope,$http,$routeParams,$interval){

        document.title = "环球网监控平台-浏览敏感词";
        $("body").removeClass("pendingBody");
        $interval.cancel(TIMER);

        //页面分页搜索参数
        $scope.pageCsArr = $routeParams.cs.split("&");

        //当前页
        $scope.page = parseInt($scope.pageCsArr[0]);

        //敏感词
        $scope.mg = $scope.pageCsArr[1] || "";

        //维度
        $scope.wd = $scope.pageCsArr[2] || "";

        //维度-tag
        $scope.wdTag = $scope.pageCsArr[3] || "";

        //翻页&搜索
        var cs = {};
        if($scope.wd){
            cs = {
                page: $scope.page,
                word: $scope.mg,
                tags: $scope.wd,
                attr: $scope.wdTag
            };

            TAG_SAVE = {
                wd: $scope.wd,
                wdTag: $scope.wdTag
            };

        }else{
            cs = {
                page: $scope.page
            };

            TAG_SAVE = {};
        }

        //分页
        $http.post('/dashboard/list_word',cs,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
            //搜索字段
            if($scope.pageCsArr.length > 1){
                $scope.pageCsArr.splice(0,1);
                $scope.ssArr = "&" + $scope.pageCsArr.join("&");
            }else{
                $scope.ssArr = "";
            }

            //总条目数
            $scope.pagesTotal = json.total;

            //总分页数
            $scope.pagesNum = json.pages || 1;

            //上页
            $scope.pagePrev = $scope.page - 1 >= 1 ? ($scope.page - 1) + $scope.ssArr : 1 + $scope.ssArr;

            //下页
            $scope.pageNext = $scope.page + 1 <= $scope.pagesNum ? ($scope.page + 1) + $scope.ssArr : $scope.pagesNum + $scope.ssArr;

            //首页
            $scope.pageFirst = 1 + $scope.ssArr;

            //末页
            $scope.pageEnd = $scope.pagesNum + $scope.ssArr;

            //当前用户的纬度
            $scope.usernameWd = cookieUtil.get("classify");

            //分配给页面显示的数据
            $scope.listData = json.results;
            if(json.results.length <= 0){
                addTips("暂未有符合检索条件的内容");
            }

            //分页循环数组
            $scope.pagesArr = [];
            for(var i=1;i<=$scope.pagesNum;i++){
                $scope.pagesArr.push(i);
            }
        });

        $scope.pageSelectClass = true;
        $("#pageInner").find(".pages-select-list li").eq($scope.page - 1).addClass("select");

        //时间
        $scope.getTime = function(sTime){
            var newDate = new Date(parseInt(sTime) * 1000);
            var year = newDate.getFullYear();
            var month = newDate.getMonth() + 1;
            var day = newDate.getDate();
            var hour = newDate.getHours();
            var minutes = newDate.getMinutes();

            return year + "-" + addZero(month) + "-" + addZero(day) + " " + addZero(hour) + ":" + addZero(minutes);
        };

        //删除敏感词
        $scope.deleteTags = function(e){
            if(confirm("确认要删除敏感词【" + $(e).attr("data-mgc") + "】吗?")){
                var tags = $(e).attr("data-tags");
                var id = $(e).attr("data-id");
                $http.post('/dashboard/remove_word',{tags: tags, id: id},{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
                    if(json.status === 1){
                        addTips("删除成功");
                        $(e).parents("tr").hide();
                    }else{
                        addTips(json.msg);
                    }
                });
            }
        };

        //搜索状态还原
        if($scope.mg){
            //敏感词
            $scope.sensitiveWords = $scope.mg;
        }

    })

    //添加管理人
    .controller("addAdminCtrl",function($scope,$http,$routeParams,$interval){

        document.title = "环球网监控平台-添加管理人";
        $("body").removeClass("pendingBody");
        $interval.cancel(TIMER);

        //纬度
        $http({method: 'get', url: '/dashboard/word_classify'}).success(function(json){
            $scope.tagList = json;
        });

        //是否显示审核分类
        $scope.changeRole = function(str){
            $scope.theUserRole = str;
        };

        //验证用户名
        $scope.yzUsername = function(e){
            var val = $(e).val();
            var $parent = $(e).parents(".value");
            if(val != ""){
                $http.post('/dashboard/check_username',{ username: val },{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
                    if(json.status === 0){
                        addTips("当前用户名不可用");
                        $(".add-admin").attr("data-error","1");
                    }else{
                        $(".add-admin").attr("data-error","0");
                    }
                });
            }
        };

        //添加管理人
        $scope.addAdminPost = function(e){

            if($(e).attr("data-error") != "1"){
                //用户名
                var username = $(".username input").val();

                //真实姓名
                var realName = $(".real-name input").val();

                //初始密码
                var password = $(".password input").val();

                //权限设置
                var competence = $(".competence .ui-drop-down-list .select").attr("data-id");

                //审核分类
                var auditCategory = competence === "auditor" ? $(".audit-category-select-inner .ui-radio-select a").attr("data-id") : "";

                //提交
                if(username === ""){
                    addTips("请填写用户名");
                }
                else if(getCharLength(username) > 20){
                    addTips("用户名不能超过20个字符");
                }
                else if(realName === ""){
                    addTips("请填写真实姓名");
                }
                else if(getCharLength(realName) > 20){
                    addTips("真实姓名不能超过20个字符");
                }
                else if(password === ""){
                    addTips("请填写初始密码");
                }
                else{
                    //提交参数
                    var cs = {
                        username: username,
                        realname: realName,
                        password: password,
                        role: competence,
                        classify: auditCategory
                    };

                    $http.post('/dashboard/add_user',cs,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
                        if(json.status === 1){
                            addTips("添加成功");
                        }else{
                            addTips(json.msg);
                        }
                    });
                }
            }else{
                addTips("当前用户名不可用");
            }
        };
    })

    //管理管理员
    .controller("browseAdminCtrl",function($scope,$http,$routeParams,$interval,$timeout){

        document.title = "环球网监控平台-管理管理员";
        $("body").removeClass("pendingBody");
        $interval.cancel(TIMER);

        $http.post('/dashboard/list_user',{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
            $scope.listData = json;
        });

        //时间
        $scope.getTime = function(sTime){
            var newDate = new Date(parseInt(sTime) * 1000);
            var year = newDate.getFullYear();
            var month = newDate.getMonth() + 1;
            var day = newDate.getDate();
            var hour = newDate.getHours();
            var minutes = newDate.getMinutes();

            return year + "-" + addZero(month) + "-" + addZero(day) + " " + addZero(hour) + ":" + addZero(minutes);
        };

        //管理员类型
        $scope.sAdmin = function(str){
            var e;
            if(str === "administrator"){
                e = "管理员";
            }
            else if(str === "auditor"){
                e = "审核人员";
            }
            else if(str === "reviewer"){
                e = "复审人员";
            }

            return e;
        };

        //删除
        $scope.deleteAdmin = function(e){
            if(confirm("确认要删除【" + $(e).attr("data-realname") + "】吗?")){
                var id = $(e).attr("data-id");
                $http.post('/dashboard/remove_user',{id: id},{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
                    if(json.status === 1){
                        addTips("删除成功");
                        $(e).parents("tr").hide();
                    }else{
                        addTips(json.msg);
                    }
                });
            }
        };

        //修改管理员跳转
        $scope.setupAdmin = function(e){

            var s = $(e).attr("data-id") + "/$/" + $(e).attr("data-role") + "/$/" + $(e).attr("data-username") + "/$/" + $(e).attr("data-realname") + "/$/" + $(e).attr("data-classify");
            cookieUtil.set("tempuserinfo",s);

            $timeout(function(){
                window.location.href = '#/modifyAdmin/' + $(e).attr("data-username");
            },100);

        };
    })

    //修改管理员
    .controller("modifyAdminCtrl",function($scope,$http,$routeParams,$interval,$timeout){

        document.title = "环球网监控平台-修改管理员";
        $("body").removeClass("pendingBody");
        $interval.cancel(TIMER);

        //获取信息
        var co = cookieUtil.get("tempuserinfo").split("/$/");
        $scope.id = co[0];
        $scope.role = co[1];
        $scope.username = co[2];
        $scope.realname	= co[3];
        $scope.classify	= co[4];
        $scope.theUserRole = $scope.role;

        //管理员类型
        $scope.sAdmin = function(str){
            var e;
            if(str === "administrator"){
                e = "管理员";
            }
            else if(str === "auditor"){
                e = "审核人员";
            }
            else if(str === "reviewer"){
                e = "复审人员";
            }

            return e;
        };

        //纬度
        $http({method: 'get', url: '/dashboard/word_classify'}).success(function(json){
            $scope.tagList = json;
        });

        //是否显示审核分类
        $scope.changeRole = function(str){
            $scope.theUserRole = str;
        };

        //提交修改
        $scope.modifyAdminPost = function(){

            //真实姓名
            var realName = $(".real-name input").val();

            //初始密码
            var password = $(".password input").val() || "";

            //权限设置
            var competence = $(".competence .ui-drop-down-list .select").attr("data-id");

            //审核分类
            var auditCategory = competence === "auditor" ? $(".audit-category-select-inner .ui-radio-select a").attr("data-id") : "";

            //提交
            if(realName === ""){
                addTips("请填写真实姓名");
            }
            else if(getCharLength(realName) > 20){
                addTips("真实姓名不能超过20个字符");
            }
            else{
                //提交参数
                var cs = {
                    id: $scope.id,
                    realname: realName,
                    password: password,
                    role: competence,
                    classify: auditCategory
                };

                $http.post('/dashboard/update_user',cs,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
                    if(json.status === 1){
                        addTips("修改成功");
                        $timeout(function(){
                            window.location.href = '#/browseAdmin';
                        },2000);
                    }else{
                        addTips(json.msg);
                    }
                });
            }
        };

    })

    //账号设置
    .controller("setupAdminCtrl",function($scope,$http,$routeParams,$interval,$timeout){

        document.title = "环球网监控平台-账号设置";
        $("body").removeClass("pendingBody");
        $interval.cancel(TIMER);

        //获取信息
        $scope.role = cookieUtil.get("role");
        $scope.realname	= cookieUtil.get("realname");
        $scope.id = cookieUtil.get("id");

        //管理员类型
        $scope.sAdmin = function(str){
            var e;
            if(str === "administrator"){
                e = "管理员";
            }
            else if(str === "auditor"){
                e = "审核人员";
            }
            else if(str === "reviewer"){
                e = "复审人员";
            }

            return e;
        };

        //提交修改
        $scope.setupAdminPost = function(){

            //用户名
            var username = $(".username").text();

            //真实姓名
            var realName = $(".real-name input").val();

            //原密码
            var password = $(".password input").val();

            //密码1
            var password_1 = $(".new-password-1 input").val();

            //密码2
            var password_2 = $(".new-password-2 input").val();

            //提交
            if(realName === ""){
                addTips("请填写真实姓名");
            }
            else if(password === ""){
                addTips("请填写原密码");
            }
            else if(password_1 === ""){
                addTips("请填写新密码");
            }
            else if(password_1 != password_2){
                addTips("新密码与确认密码不一致");
            }
            else{
                //提交参数
                var cs = {
                    id: $scope.id,
                    realname: realName,
                    password: password,
                    repassword: password_1
                };

                $http.post('/dashboard/update_user_self',cs,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
                    if(json.status === 1){
                        addTips("修改成功");
                        $timeout(function(){
                            window.location.href = '/logout';
                        },2000);
                    }else{
                        addTips(json.msg);
                    }
                });
            }
        };

    })

    //待审核内容
    .controller("pendingCtrl",function($scope,$http,$routeParams,$interval,$timeout){

        document.title = "环球网监控平台-待审核内容";
        $interval.cancel(TIMER);

        //用户纬度
        $scope.usernameWd = cookieUtil.get("classify");

        //鼠标选中文字
        mouseSelectPx($(".add-keywords-remark-inner"),$(".monitoring-value"));

        //获取图片纬度 图片审核使用
        $http({method: 'get', url: '/dashboard/tags_image'}).success(function(json){
            IMG_TAGS = json;
        });

        //获取图片纬度 图片tag选择
        $http({method: 'get', url: '/dashboard/tags_images'}).success(function(json){
            $scope.imageUgc = json;
        });

        //获取新UGC
        getUgc();
        function getUgc(){
            var sv = saveUgc("get");
            if(sv){
                //读取
                clJson(sv);
            }else{
                var uid = new Date().valueOf();
                var requestId = "?_" + (++uid).toString(36);
                $http({method: 'get', url: '/dashboard/list_ugc' + requestId}).success(function(json){
                    if(json.status <= 0){
                        //开启心跳
                        $("body").removeClass("something");
                        $("#taggingOperatingInner").hide();
                        $("#pendingSurplusInner").find(".sun").html("0");
                        TIMER = $interval(function(){
                            $http({method: 'get', url: '/dashboard/list_ugc'}).success(function(json){
                                if(json.status > 0){
                                    clJson(json);
                                }
                            });
                        },10000);
                    }else{
                        //正常
                        clJson(json);
                    }
                });
            }
        }
        function clJson(json){

            //删除添加的关键词
            $(".monitoring-value .add-key-words").remove();

            //ugc是图片还是文字
            if(json.check === "ugc"){
                $("#pendingInner").find(".t-box,.b-box").show();
                $(".normal-ugc").show();
                $(".image-ugc").hide();
                $("#postBtn").attr("data-type","ugc");
            }else{
                $("#pendingInner").find(".t-box,.b-box").hide();
                $(".normal-ugc").hide();
                $(".image-ugc").show();
                $("#postBtn").attr("data-type","image");
            }

            $interval.cancel(TIMER);
            $scope.listugc = json;
            $scope.siteId = json.siteid;
            $scope.jobid = json.jobid;
            $scope.wdType = IMG_TAGS;

            $timeout(function(){
                var sArr = json.type.split(",");
                $(".dimension-tag-approval .mu").hide();
                for(var i=0;i<sArr.length;i++){
                    $(".dimension-tag-approval ." + sArr[i]).show();
                }
            },100);

            //存储json
            if(json.status === 1){
                saveUgc("save",json);
            }

            $("body").addClass("something");
            $("#taggingOperatingInner").show();
        }

        //获取审核纬度选项
        $http({method: 'get', url: '/dashboard/tags_ugc'}).success(function(json){
            $scope.tagsUgc = json;
        });

        //获取tag对应的class
        $scope.tagClass = function(str){
            return tagClass(str);
        };

        //时间
        $scope.getTime = function(sTime){
            var newDate = new Date(parseInt(sTime) * 1000);
            var year = newDate.getFullYear();
            var month = newDate.getMonth() + 1;
            var day = newDate.getDate();
            var hour = newDate.getHours();
            var minutes = newDate.getMinutes();

            return month + "月" + day + "日 " + addZero(hour) + ":" + addZero(minutes);
        };

        //保存备注
        $scope.saveRemark = function(){
            var val = $(".remark-value-textarea").val();

            //提交
            if(val === ""){
                addTips("请填写备注");
            }else{
                //提交参数
                var cs = {
                    remark: val,
                    siteid: $scope.siteId
                };

                $http.post('/dashboard/remark',cs,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
                    if(json.status === 1){
                        addTips("添加成功");
                        $(".add-keywords-remark-inner").hide();
                    }else{
                        addTips(json.msg);
                    }
                });
            }
        };

        //保存关键词
        $scope.saveKeyword = function(){
            var val = $(".keywords-input").val();
            var dimension = $(".dimension .show-t").attr("data-id");
            var dimensionTag = $(".dimensionTag .show-t").attr("data-id");

            //提交
            if(val === ""){
                addTips("请填写敏感词");
            }else{
                //提交参数
                var cs = {
                    tags: dimension,
                    attr: dimensionTag,
                    siteid: $scope.siteId,
                    words: val
                };

                $http.post('/dashboard/add_word',cs,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform})
                .success(function(json){
                    if(json.status === 1){
                        addTips("添加成功");
                        $(".monitoring-value").append('<a class="add-key-words" href="javascript:void(0);"><var>' + val + '</var></a>');
                        $(".add-keywords-remark-inner").hide();
                    }else{
                        addTips(json.msg);
                    }
                });
            }
        };

        //打开关闭 关键词与备注
        $scope.openMonitoring = function(sw){
            var $pendingInner = $("#pendingInner");
            var sws = $pendingInner.hasClass("open-monitoring-inner");

            if(sws){
                $pendingInner.removeClass("open-monitoring-inner");
                $(".add-keywords-remark-inner").hide();
            }else{
                if(!sw){
                    $pendingInner.addClass("open-monitoring-inner");
                }
                else if(sw){
                    $(".add-keywords-remark-inner").hide();
                }
            }
        };

        //提交
        $scope.pendingPost = function(str){
            if(str || $(".dimension-tag-approval .select-tag").length){
                var cs = {};
                var check = $("#postBtn").attr("data-type") === "ugc" ? "ugc" : "image";

                if(str){
                    //正常
                    cs = {
                        status : 1,
                        check : check,
                        siteid : $scope.siteId,
                        jobid : $scope.jobid
                    }
                }else{
                    //提交tag
                    var $box = $("#postBtn").attr("data-type") === "ugc" ? $(".normal-ugc") : $(".image-ugc");
                    var $mu = $box.find(".mu");
                    var bm = [];

                    for(var i=0;i<$mu.length;i++){
                        var pm = [];
                        for(var j=0;j<$mu.eq(i).find(".select-tag").length;j++){
                            var id = $mu.eq(i).find(".select-tag").eq(j).attr("data-id");
                            pm.push(id);
                        }
                        bm.push($mu.eq(i).attr("data-id") + "|" + pm.join(","));
                    }
                    cs = {
                        status : 0,
                        siteid : $scope.siteId,
                        jobid : $scope.jobid,
                        check : check,
                        tags : bm.join("$")
                    }
                }

                $http.post('/dashboard/handle_ugc',cs,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
                    if(json.status > 0){
                        //提交成功获取新的UGC
                        $(".dimension-tag-approval .tag-list span").removeClass("select-tag");
                        saveUgc("remove");
                        getUgc();
                    }

                    addTips(json.msg);
                });
            }else{
                addTips("你忘记打标签了：）");
            }

        };

        //内容长度限制
        $scope.getContent = function(str){
            str = str ? str : "";
            var em = {};
            if(str.length > 500){
                em = {
                    val : str.substring(0,500),
                    _val : str
                };

            }else{
                em = {
                    val : str || "",
                    _val : ""
                };
            }
            return em;
        };

        //显示全部内容
        $scope.viewFull = function(e){
            var $parent = $(e).parents(".monitoring-value");
            $parent.find(".show-text").html($(e).attr("data-save-val"));
            $(e).hide();
        };

        //获取tag对应的class
        $scope.tagClass = function(str){
            return tagClass(str);
        };

        //转整数
        $scope.parseint = function(str){
            return parseInt(str);
        };

        $timeout(function(){
            var h = $("#taggingOperatingInner").height();
            $("#main").css({
                paddingBottom : h + "px"
            });
        },200);
    })

    //已审核内容
    .controller("approvedCtrl",function($scope,$http,$routeParams,$timeout,$interval,$sce){

        document.title = "环球网监控平台-已审核内容";
        $("body").removeClass("pendingBody");
        $interval.cancel(TIMER);

        //获取图片纬度
        $http({method: 'get', url: '/dashboard/tags_image'}).success(function(json){
            IMG_TAGS = json;
            $scope.wdType = IMG_TAGS;
        });

        //查看细节
        $scope.openMonitoring = function(e){
            var $monitoringInner = $(e).parents("li.monitoring-inner");
            $monitoringInner.addClass("open-monitoring-inner");
        };

        //关闭细节
        $scope.closeMonitoring = function(e){
            var $monitoringInner = $(e).parents("li.monitoring-inner");
            $monitoringInner.removeClass("open-monitoring-inner");
            $monitoringInner.removeClass("correction-monitoring-inner");
            $monitoringInner.find(".completed-degree-inner .correction").html("纠错");
        };

        //页面分页搜索参数
        $scope.pageCsArr = $routeParams.cs.split("&");

        //当前页
        $scope.page = parseInt($scope.pageCsArr[0]);

        //关键词
        $scope.gjc = $scope.pageCsArr[1];

        //链接URL
        $scope.ljurl = $("#searchOptions").find(".searchurl input").val();

        //开始时间
        $scope.stime = $scope.pageCsArr[2];

        //结束时间
        $scope.etime = $scope.pageCsArr[3];

        //翻页&搜索
        var cs = {};
        if($scope.gjc || $scope.ljurl || $scope.stime || $scope.etime){
            cs = {
                page: 1,
                keyword: $scope.gjc,
                url: encodeURIComponent($scope.ljurl),
                start_time: $scope.stime,
                end_time: $scope.etime
            }
        }else{
            cs = {
                page: $scope.page
            }
        }

        //分页
        $http.post('/dashboard/list_finish',cs,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){

            //搜索字段
            if($scope.pageCsArr.length > 1){
                $scope.pageCsArr.splice(0,1);
                $scope.ssArr = "&" + $scope.pageCsArr.join("&");
            }else{
                $scope.ssArr = "";
            }

            //总条目数
            $scope.pagesTotal = json.total;

            //总分页数
            $scope.pagesNum = json.pages || 1;

            //上页
            $scope.pagePrev = $scope.page - 1 >= 1 ? ($scope.page - 1) + $scope.ssArr : 1 + $scope.ssArr;

            //下页
            $scope.pageNext = $scope.page + 1 <= $scope.pagesNum ? ($scope.page + 1) + $scope.ssArr : $scope.pagesNum + $scope.ssArr;

            //首页
            $scope.pageFirst = 1 + $scope.ssArr;

            //末页
            $scope.pageEnd = $scope.pagesNum + $scope.ssArr;

            //分配给页面显示的数据
            $scope.listData = json.results;
            if(json.results.length <= 0){
                addTips("暂未有符合检索条件的内容");
            }

            //分页循环数组
            $scope.pagesArr = [];
            for(var i=1;i<=$scope.pagesNum;i++){
                $scope.pagesArr.push(i);
            }

            $timeout(function(){
                var startDateTextBox = $('#example_1_start');
                var endDateTextBox = $('#example_1_end');

                $.timepicker.datetimeRange(
                    startDateTextBox,
                    endDateTextBox,
                    {
                        //minInterval: (1000*60), // 1m
                        timeFormat: "HH:mm",
                        dateFormat: "yy-mm-dd",
                        start: {}, // start picker options
                        end: {} // end picker options
                    }
                );

                $scope.timeStart = $scope.stime;
                $scope.timeEnd = $scope.etime;

                $scope.timeChange = function(){
                    $scope.timeStart = $("#example_1_start").val();
                    $scope.timeEnd = $("#example_1_end").val();
                };

            },800);
        });

        $scope.pageSelectClass = true;
        $("#pageInner").find(".pages-select-list li").eq($scope.page - 1).addClass("select");

        //时间
        $scope.getTime = function(sTime){
            var newDate = new Date(parseInt(sTime) * 1000);
            var year = newDate.getFullYear();
            var month = newDate.getMonth() + 1;
            var day = newDate.getDate();
            var hour = newDate.getHours();
            var minutes = newDate.getMinutes();

            return year + "-" + addZero(month) + "-" + addZero(day) + " " + addZero(hour) + ":" + addZero(minutes);
        };

        //内容长度限制
        $scope.getContent = function(str){
            str = str ? str : "";
            var em = {};
            if(str.length > 500){
                em = {
                    val : str.substring(0,500),
                    _val : str
                };

            }else{
                em = {
                    val : str || "",
                    _val : ""
                };
            }
            return em;
        };

        //显示全部内容
        $scope.viewFull = function(e){
            var $parent = $(e).parents(".monitoring-value");
            $parent.find(".show-text").html($(e).attr("data-save-val"));
            $(e).hide();
        };

        //获取tag对应的class
        $scope.tagClass = function(str){
            return tagClass(str);
        };
        $scope.tagImgClass = function(str){
            var e = "fc";
            for(var i=0;i<IMG_TAGS.length;i++){
                if(IMG_TAGS[i].attr === str){
                    e = IMG_TAGS[i];
                }
            }

            return e;
        };

        //纠错&保存
        $scope.correction = function(e){
            var $monitoringInner = $(e).parents("li.monitoring-inner");
            var $mu = $monitoringInner.find(".monitoring-dimension li");
            var bm = [];
            var cs = {};

            if($monitoringInner.hasClass("correction-monitoring-inner")){
                if(TEMP){
                    //保存
                    for(var i=0;i<$mu.length;i++){
                        var pm = [];
                        for(var j=0;j<$mu.eq(i).find("dd.select-tag").length;j++){
                            var id = $mu.eq(i).find("dd.select-tag").eq(j).attr("data-id");
                            pm.push(id);
                        }
                        bm.push($mu.eq(i).attr("data-id") + "|" + pm.join(","));
                    }

                    cs = {
                        siteid : $monitoringInner.attr("data-id"),
                        tags : bm.join("$")
                    };

                    $http.post('/dashboard/re_handle_ugc',cs,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
                        if(json.status > 0){
                            addTips("纠错成功");
                            $(e).html("纠错");
                            $monitoringInner.removeClass("correction-monitoring-inner");

                            //重新打分
                            var $fraction = $monitoringInner.find(".monitoring-dimension li .dimension-fraction");
                            for(var i=0;i<json.result.length;i++){
                                $fraction.eq(i).html(json.result[i].score);
                            }
                        }else{
                            addTips(json.msg);
                        }
                    });
                }else{
                    $(e).html("纠错");
                    $monitoringInner.removeClass("correction-monitoring-inner");
                }
            }else{
                //纠错
                $monitoringInner.addClass("correction-monitoring-inner");
                $(e).html("保存");
                TEMP = false;
            }
        };

        //搜索状态还原
        if($routeParams.cs.split("&").length > 1){
            //关键词
            $scope.keyword = $scope.gjc;

            //url
            $scope.linkUrl = $scope.ljurl;

            //开始时间
            $scope.timeStart = $scope.pageCsArr[2];

            //结束时间
            $scope.timeEnd = $scope.pageCsArr[3];
        }

        //$timeout(function(){
        //    var $minImgListInner = $(".minImgListInner");
        //    for(var i=0;i<$minImgListInner.length;i++){
        //        var $li = $minImgListInner.eq(i).find(".list-li .active");
        //        for(var j=0;j<$li.length;j++){
        //            var ct = $li.eq(j).attr("data-ct");
        //            if(ct){
        //                console.log(tagImgClass(ct).tags)
        //                $li.eq(j).addClass(tagClass(tagImgClass(ct).tags).className);
        //                $li.eq(j).html(tagImgClass(ct).label);
        //            }
        //        }
        //    }
        //},1000);
    })

    //管理维度
    .controller("browseTagCtrl",function($scope,$http,$routeParams,$interval,$timeout){

        document.title = "环球网监控平台-管理审核维度";
        $("body").removeClass("pendingBody");
        $interval.cancel(TIMER);

        //页面分页搜索参数
        $scope.pageCsArr = $routeParams.cs.split("&");

        //当前页
        $scope.page = parseInt($scope.pageCsArr[0]);

        //分页
        $http.post('/dashboard/list_classify_all',{ page: $scope.page },{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){

            //搜索字段
            if($scope.pageCsArr.length > 1){
                $scope.pageCsArr.splice(0,1);
                $scope.ssArr = "&" + $scope.pageCsArr.join("&");
            }else{
                $scope.ssArr = "";
            }

            //总条目数
            $scope.pagesTotal = json.total;

            //总分页数
            $scope.pagesNum = json.pages || 1;

            //上页
            $scope.pagePrev = $scope.page - 1 >= 1 ? ($scope.page - 1) + $scope.ssArr : 1 + $scope.ssArr;

            //下页
            $scope.pageNext = $scope.page + 1 <= $scope.pagesNum ? ($scope.page + 1) + $scope.ssArr : $scope.pagesNum + $scope.ssArr;

            //首页
            $scope.pageFirst = 1 + $scope.ssArr;

            //末页
            $scope.pageEnd = $scope.pagesNum + $scope.ssArr;

            //分配给页面显示的数据
            $scope.listData = json.results;
            if(json.results.length <= 0){
                addTips("暂未有符合检索条件的内容");
            }

            //分页循环数组
            $scope.pagesArr = [];
            for(var i=1;i<=$scope.pagesNum;i++){
                $scope.pagesArr.push(i);
            }
        });

        $scope.pageSelectClass = true;
        $("#pageInner").find(".pages-select-list li").eq($scope.page - 1).addClass("select");

        //获取时间
        $scope.getTime = function(sTime){
            var newDate = new Date(parseInt(sTime) * 1000);
            var year = newDate.getFullYear();
            var month = newDate.getMonth() + 1;
            var day = newDate.getDate();
            var hour = newDate.getHours();
            var minutes = newDate.getMinutes();

            return year + "-" + addZero(month) + "-" + addZero(day) + " " + addZero(hour) + ":" + addZero(minutes);
        };

        //删除
        $scope.deleteTag = function(e){
            if(confirm("确认要删除【" + $(e).attr("data-name") + " --> " + $(e).attr("data-label") + "】吗?")){
                var id = $(e).attr("data-id");
                $http.post('/dashboard/remove_classify',{id: id},{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
                    if(json.status === 1){
                        addTips("删除成功");
                        $(e).parents("tr").hide();
                    }else{
                        addTips(json.msg);
                    }
                });
            }
        };
    })

    //添加维度
    .controller("addTagCtrl",function($scope,$http,$routeParams,$interval,$timeout){

        document.title = "环球网监控平台-添加审核维度";
        $("body").removeClass("pendingBody");
        $interval.cancel(TIMER);

        //获取维度类型
        $http.post('/dashboard/classify_type',{ level : 1 },{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(jsonA){
            $scope.tagType = jsonA[0].check_name;
            $scope.tagTypeJson = jsonA;

            //获取对应类型的纬度
            $http.post('/dashboard/classify_type',{ level : 2 , type : jsonA[0].check },{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(jsonB){
                $scope.dimensionName = jsonB[0].check_name;
                $scope.tagListJson = jsonB;
            });
        });

        //切换维度
        $scope.updateTagType = function(type,name){
            $scope.updateType = type;
            $http.post('/dashboard/classify_type',{ level : 2 , type : type },{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(jsonC){
                $scope.tagListJson = jsonC;
                $scope.dimensionName = jsonC[0].check_name;
            });
        };

        //切换
        $scope.cqs = function(e,s,c){
            var $parent = $(e).parents(".a-box");
            var $a = $parent.find(".cqs-a");
            var $b = $parent.find(".cqs-b");
            if(s === 'a'){
                $a.removeClass("hidden");
                $b.addClass("hidden");
                $parent.attr("data-tp","a");
                if(c === "t-1"){
                    $(".tag-o-inner").attr("data-tp","a");
                    $(".audit-category .select-one-dimension").removeClass("hidden");
                    $(".audit-category .dimension").removeClass("hidden");
                    $(".audit-category .ui-text").addClass("hidden");
                }
            }
            else if(s === 'b'){
                $a.addClass("hidden");
                $b.removeClass("hidden");
                $parent.attr("data-tp","b");
                if(c === "t-2"){
                    $(".tag-o-inner").attr("data-tp","b");
                    $(".audit-category .select-one-dimension").addClass("hidden");
                    $(".audit-category .dimension").addClass("hidden");
                    $(".audit-category .ui-text").removeClass("hidden");
                }
            }
        };

        //验证权重
        $scope.yzQz = function(e){
            var val = $(e).val();
            if(val > 0 &&  val <= 1){
                $(".add-tag-btn").attr("error","0");
            }else{
                $(".add-tag-btn").attr("error","1");
                addTips("权重值必须大于0并小于等于1");
            }
        };

        //添加TAG
        $scope.addTagPost = function(){

            //审核类型中文
            var tagTypeZh = $(".tag-type-inner").attr("data-tp") === "a" ? $(".tag-type-inner .cqs-a .ui-drop-down-list .select").text() : $(".tag-type-inner .cqs-b .zh-name").val();

            //审核类型英文
            var tagTypeEn = $(".tag-type-inner").attr("data-tp") === "a" ? $(".tag-type-inner .cqs-a .ui-drop-down-list .select").attr("data-id") : $(".tag-type-inner .cqs-b .en-name").val();

            //一级审核维度中文
            var tagOZh = $(".tag-o-inner").attr("data-tp") === "a" ? $(".tag-o-inner .cqs-a .ui-drop-down-list .select").text() : $(".tag-o-inner .cqs-b .zh-name").val();

            //一级审核维度英文
            var tagOEn = $(".tag-o-inner").attr("data-tp") === "a" ? $(".tag-o-inner .cqs-a .ui-drop-down-list .select").attr("data-id") : $(".tag-o-inner .cqs-b .en-name").val();

            //新增二级审核维度中文
            var tagTZh = $(".tag-t-inner .zh-name").val();

            //新增二级审核维度英文
            var tagTEn = $(".tag-t-inner .en-name").val();

            //权重
            var qz = $(".qz-num input").val();

            //备注
            var remark = $(".remark textarea").val();

            //提交
            if($(".add-tag-btn").attr("error") === "1"){
                addTips("权重值必须大于0并小于等于1");
            }
            else if(tagTypeZh === "" || tagTypeEn === ""){
                addTips("审核类型名称不能为空");
            }
            else if(tagOZh === "" || tagOEn === ""){
                addTips("一级纬度名称不能为空");
            }
            else if(tagTZh === "" || tagTEn === ""){
                addTips("二级审核维度名称不能为空");
            }
            else if(qz === ""){
                addTips("权重不能为空");
            }
            else{
                //提交参数
                var cs = {
                    check: tagTypeEn,
                    check_name: tagTypeZh,
                    name: tagOZh,
                    tags: tagOEn,
                    label: tagTZh,
                    attr: tagTEn,
                    weight: qz,
                    remark: remark
                };

                $http.post('/dashboard/add_classify',cs,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
                    if(json.status === 1){
                        addTips("添加成功");
                        $timeout(function(){
                            window.location.href = '#/browseTag/1';
                        },2000);
                    }else{
                        addTips(json.msg);
                    }
                });
            }
        };
    });


//过滤器，输出html
tagApp.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    }
}]);



//---------------------------------------------------【审核维度获取&切换】
function dimensionCtrl($scope,$http){
    //获取wd
    var url = window.location.href;
    $scope.pzWd = TAG_SAVE.wd || "";
    $scope.pzWdTag = TAG_SAVE.wdTag || "";
    var ce = url.indexOf("browseSensitiveWords") > 0 ? "list" : "add";
    var cs = {
        type : ce
    };

    //获取审核维度
    $http.post('/dashboard/list_tags',cs,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(jsonA){
        $scope.dimension = jsonA[0].tags; //维度
        $scope.dimensionName = jsonA[0].name; //维度 - name

        //选中
        if($scope.pzWd){
            for(var i=0;i<jsonA.length;i++){
                if(jsonA[i].tags === $scope.pzWd){
                    $scope.dimension = jsonA[i].tags; //维度
                    $scope.dimensionName = jsonA[i].name; //维度 - name
                    break;
                }
            }
        }else{
            $scope.pzWd = jsonA[0].tags;
        }

        $scope.tagList = jsonA;

        //获取审核维度-tag
        var listClassify = $scope.pzWd ? $scope.pzWd : jsonA[0].tags;
        $http.post('/dashboard/list_classify',{ tags: listClassify },{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(jsonB){
            $scope.classify = jsonB;
            $scope.dimensionTag = $("#showAll").length > 0 ? "all": jsonB[0].attr; //维度 - tag
            $scope.dimensionTagName = $("#showAll").length > 0 ? "全部": jsonB[0].label; //维度 - tag name

            //选中
            if($scope.pzWdTag){
                for(var i=0;i<jsonB.length;i++){
                    if(jsonB[i].attr === $scope.pzWdTag){
                        $scope.dimensionTag = jsonB[i].attr; //维度 - tag
                        $scope.dimensionTagName =jsonB[i].label; //维度 - tag name
                        $(".dimensionTag .ui-drop-down-list li").removeClass("select");
                        break;
                    }
                }
            }
        });
    });

    //切换维度
    $scope.updateDimension = function(str,name){
        $scope.dimension = str;
        $scope.dimensionName = name;

        //切换维度后获取对应的tag
        $http.post('/dashboard/list_classify',{ tags: str },{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},transformRequest: transform}).success(function(json){
            $scope.classify = json;
            $scope.dimensionTag = $("#showAll").length > 0 ? "all": json[0].attr; //维度 - tag
            $scope.dimensionTagName = $("#showAll").length > 0 ? "全部": json[0].label; //维度 - tag name
        });
    };

    //切换维度-tag
    $scope.updateDimensionTag = function(str,name){
        $scope.dimensionTag = str;
        $scope.dimensionTagName = name;
    };
}


//---------------------------------------------------【页面加载 include】
function pageOnload($scope,$http){

    //转换特殊符号
    $scope.clearFh = function(e){
        if(e){
            var rs = "";
            var pattern = new RegExp("[`~!%@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]");
            for (var i = 0; i < e.length; i++) {
                rs = rs + e.substr(i, 1).replace(pattern, '');
            }
            return rs;
        }

    };

    //获取用户权限
    $scope.userRole = cookieUtil.get("role");

    //头部
    $scope.page_header = 'include/header.html';

    //导航
    $scope.page_siteNav = 'include/siteNav.html';

    //侧边导航
    $scope.clickNav = function(e) {
        var $dd = $("#siteNav").find("dd");
        $dd.removeClass("select");
        $(e).parent().addClass("select");
    };

    $scope.toNav = function(e) {
        var $siteNav = $("#siteNav");
        if($siteNav.hasClass("site-nav-hidden")){
            $siteNav.attr("class","site-nav-show");
        }else{
            $siteNav.attr("class","site-nav-hidden");
        }
    };

    //日期
    $scope.dateUI_timepicker = function(){
        var startDateTextBox = $('#example_1_start');
        var endDateTextBox = $('#example_1_end');

        $.timepicker.datetimeRange(
            startDateTextBox,
            endDateTextBox,
            {
                //minInterval: (1000*60), // 1m
                timeFormat: "HH:mm",
                dateFormat: "yy-mm-dd",
                start: {}, // start picker options
                end: {} // end picker options
            }
        );

        //设置初始时间
        //var _newDate = new Date();
        //var _year = _newDate.getFullYear();
        //var _month = _newDate.getMonth() + 1;
        //var _day = _newDate.getDate();
        //var _hour = _newDate.getHours();
        //var _minutes = _newDate.getMinutes();
        //var newDate = new Date(_newDate.getTime() - 1000*60*60*24);
        //var year = newDate.getFullYear();
        //var month = newDate.getMonth() + 1;
        //var day = newDate.getDate();
        //var hour = newDate.getHours();
        //var minutes = newDate.getMinutes();
        //var sT = year + "-" + addZero(month) + "-" + addZero(day) + " " + addZero(hour) + ":" + addZero(minutes);
        //var eT = _year + "-" + addZero(_month) + "-" + addZero(_day) + " " + addZero(_hour) + ":" + addZero(_minutes);
        //$scope.timeStart = sT;
        //$scope.timeEnd = eT;
        //$scope.timeChange = function(){
        //    $scope.timeStart = $("#example_1_start").val();
        //    $scope.timeEnd = $("#example_1_end").val();
        //};
    };

    //登录信息
    $scope.username = cookieUtil.get("username");
}


//---------------------------------------------------【基础事件】
$(function(){
    allFun();
});
function allFun(){

    //多选
    $(document).on("click",".ui-select-inner",function(){
        $(this).find(".ui-select").toggleClass("ui-select-s");

        //--> 反选
        var parentBody = $(this).parents(".all-ui-select-body");
        if(parentBody){
            if(!$(this).find(".ui-select").hasClass("ui-select-s")){
                parentBody.find(".ui-all-select").removeClass("ui-select-s");
            }
        }

        //--> 全选
        var st = true;
        var $uiSelect = parentBody.find(".ui-select-inner .ui-select");
        for(var i=0;i<$uiSelect.length;i++){
            if(!$uiSelect.eq(i).hasClass("ui-select-s")){
                st = false;
            }
        }
        if(st){
            parentBody.find(".ui-all-select").addClass("ui-select-s");
        }
    });

    //全选
    $(document).on("click",".all-ui-select-inner .select-all,.all-ui-select-body .all-select-inner",function(){
        var parentBody = $(this).parents(".all-ui-select-body");
        parentBody.find(".ui-select").addClass("ui-select-s");
        parentBody.find(".ui-all-select").addClass("ui-select-s");
    });

    //反选
    $(document).on("click",".all-ui-select-inner .uncheck-all",function(){
        var parentBody = $(this).parents(".all-ui-select-body");
        parentBody.find(".ui-select").removeClass("ui-select-s");
        parentBody.find(".ui-all-select").removeClass("ui-select-s");
    });

    //单选
    $(document).on("click",".ui-radio-inner .ui-radio",function(){
        var parentBody = $(this).parents(".ui-radio-inner");
        parentBody.find(".ui-radio").removeClass("ui-radio-select");
        $(this).addClass("ui-radio-select");
    });

    //小图审核
    //$(document).on("mouseenter",".minImgListInner .tag-list-bull",function(){
    //    $(this).find("ul").show();
    //});
    //$(document).on("mouseleave",".minImgListInner .tag-list-bull",function(){
    //    $(this).find("ul").hide();
    //});
    //$(document).on("click",".minImgListInner .tag-list-bull li",function(){
    //    var tClass = $(this).attr("class");
    //    var tHtml = $(this).text();
    //    $(this).parents(".tag-list-bull").find(".active").attr("class","active " + tClass).html(tHtml).show();
    //    $(this).parents(".tag-list-bull").find("ul").prepend($(this));
    //    //
    //    $(this).parents(".list-li").attr("data-xz",$(this).attr("data-id"));
    //});

    //大图审核
    $(document).on("mouseenter",".slide .tag-list-bull .active",function(){
        $(this).parents(".tag-list-bull").find("ul").show();
    });
    $(document).on("mouseleave",".slide .tag-list-bull ul",function(){
        if($(this).parents(".tag-list-bull").find(".active").html() != ""){
            $(this).parents(".tag-list-bull").find("ul").hide();
        }
    });
    $(document).on("click",".slide .tag-list-bull li",function(){
        var tClass = $(this).attr("class");
        var tHtml = $(this).text();
        var $parent = $(this).parents(".tag-list-bull");
        $parent.find(".active").attr("class","active " + tClass).html(tHtml).show();
        $parent.find("ul").prepend($(this));
        $parent.find("ul").hide();
        var index = $(this).parents("li").eq(0).index();
        var $av = $(".slide").find(".btn-list-inner li");
        $av.eq(index).addClass("av");
        //选中
        $(this).parents(".li").attr("data-xz",$(this).attr("data-id"));
        $.ajax({
            type: 'post',
            url: '/dashboard/handle_image',
            data: {
                siteid : $("#pendingInner").attr("data-siteid"),
                tags : $(this).attr("data-typeid") + "|" + $(this).attr("data-id"),
                url : $(this).parents("li.li").attr("data-url")
            } ,
            dataType: 'json',
            success:function(data) {
                if(json.status <= 0){
                    addTips(json.msg);
                }
            }
        });
    });

    //下拉菜单
    $(document).on("mouseenter",".ui-drop-down-inner",function(){
        $(this).find(".ui-drop-down-list").show();
    });
    $(document).on("mouseleave",".ui-drop-down-inner",function(){
        $(this).find(".ui-drop-down-list").hide();
    });

    $(document).on("click",".ui-drop-down-list li",function(){
        var $uiDropDownInner = $(this).parents(".ui-drop-down-inner");
        $uiDropDownInner.find(".ui-drop-down-list li").removeClass("select");
        $uiDropDownInner.find(".ui-drop-down-list").hide();
        $(this).addClass("select");
        $uiDropDownInner.find(".show-t").html($(this).html());
    });

    //关键词与备注
    $(document).on("mouseenter",".add-keywords-remark-inner .nav li",function(){
        var $muValue = $(".add-keywords-remark-inner .mu-value");
        var $li = $(".add-keywords-remark-inner li");
        var $btn = $(".add-keywords-remark-inner .btn .save");
        $li.removeClass("select");
        $(this).addClass("select");
        $muValue.addClass("hidden");
        $btn.addClass("hidden");
        $muValue.eq($(this).index()).removeClass("hidden");
        $btn.eq($(this).index()).removeClass("hidden");
    });

    //tag 多选
    $(document).on("click",".correction-monitoring-inner .monitoringDetail .dimension-tag",function(){
        $(this).toggleClass("select-tag");
        TEMP = true;
    });
    //ugc
    $(document).on("click",".normal-ugc .tag-list span",function(){
        $(this).toggleClass("select-tag");
    });
    //image
    $(document).on("click",".image-ugc .tag-list span",function(){
        $(this).parents(".tag-list").find("span").removeClass("select-tag");
        $(this).addClass("select-tag");
    });
}


//---------------------------------------------------【提示】
var TIPS_TIMER;
function addTips(e){

    if($("#popTips").length < 1){

        var html = '<div id="popTips">' + e + '</div>';
        $("body").append(html);
        $("#popTips").css({
            "left" : ($(window).width() - parseInt($("#popTips").width())) / 2 + "px"
        });
        $("#popTips").fadeIn();
        TIPS_TIMER = setTimeout(function(){
            $("#popTips").fadeOut("normal",function(){
                $("#popTips").remove();
            });
        },2000);

    }else{

        if($("#popTips").length > 0){
            $("#popTips").html(e);
            clearTimeout(TIPS_TIMER);
            TIPS_TIMER = setTimeout(function(){
                $("#popTips").fadeOut("normal",function(){
                    $("#popTips").remove();
                });
            },2000);
        }

    }
}


//---------------------------------------------------【日期小于10加零】
function addZero(e){
    var str;
    if(e < 10){
        str = "0" + e.toString();
    }else{
        str = e;
    }
    return str;
}


//---------------------------------------------------【post】
function transform(data){
    return $.param(data);
}


//---------------------------------------------------【COOKIE】
var cookieUtil = {
    //读取
    get: function (name) {
        var cookieName = encodeURIComponent(name) + "=";
        var cookieStart = document.cookie.indexOf(cookieName);
        var cookieValue = null;
        if (cookieStart > -1) {
            var cookieEnd = document.cookie.indexOf(";", cookieStart); //从cookieStart开始检索字符串";"
            if (cookieEnd == -1) {//没有检索到
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }
        return cookieValue;
    },
    //设置
    set: function (name, value, expires, path, domain, secure) { //键名,键值,保存时间,路径,域,失效日期
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        if (expires instanceof Date) {
            cookieText += "; expires=" + expires.toGMTString();
        }
        if (path) {
            cookieText += "; path=" + path;
        }
        if (domain) {
            cookieText += "; domain=" + domain;
        }
        if (secure) {
            cookieText += "; secure";
        }
        document.cookie = cookieText;
    },
    //删除
    remove: function (name, path, domain, secure) {
        this.set(name, "", new Date(0), path, domain, secure);
    }
};


//---------------------------------------------------【鼠标选中文字】
function mouseSelectPx(eleShare, eleContainer) {
    var eleContainerWarp;

    if(eleContainer){
        eleContainerWarp = $(eleContainer);
    }else{
        eleContainerWarp = $(document);
    }

    function getText(){
        if(document.selection){
            return document.selection.createRange().text;
        }else{
            return window.getSelection().toString();
        }
    }

    eleContainerWarp.mouseup(function(e){
        e = e || window.event;
        var txt = getText();
        var sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        var left = (e.clientX - 40 < 0) ? e.clientX + 30 : e.clientX + 30;
        var top = (e.clientY + 10 < 0) ? e.clientY + sh - 50 : e.clientY + sh - 50;

        if (txt) {
            $(eleShare).css({
                "display" : "inline",
                "left" : left + "px",
                "top" : top + "px"
            });

            $(eleShare).find(".keywords-input").val(txt);

        } else {
            if(!$("#pendingInner").hasClass("open-monitoring-inner")){
                $(eleShare).hide();
            }

        }
    });

    eleContainerWarp.mousedown(function(){
        if($(eleShare).is(":visible") && !$("#pendingInner").hasClass("open-monitoring-inner")){
            $(eleShare).hide();
        }
    });

}


//---------------------------------------------------【loading】
function loading(n){
    if(n === 1){
        $("body").append("<div id='ajaxLoadingGif'></div>");
    }else{
        $("#ajaxLoadingGif").remove();
    }
}


//---------------------------------------------------【字符串截取】
function cutStr(str,L){
    var result = '',
        strlen = str.length, // 字符串长度
        chrlen = str.replace(/[^\x00-\xff]/g,'**').length; // 字节长度

    if(chrlen<=L){return str;}

    for(var i=0,j=0;i<strlen;i++){
        var chr = str.charAt(i);
        if(/[\x00-\xff]/.test(chr)){
            j++; // ascii码为0-255，一个字符就是一个字节的长度
        }else{
            j+=2; // ascii码为0-255以外，一个字符就是两个字节的长度
        }
        if(j<=L){ // 当加上当前字符以后，如果总字节长度小于等于L，则将当前字符真实的+在result后
            result += chr;
        }else{ // 反之则说明result已经是不拆分字符的情况下最接近L的值了，直接返回
            return result;
        }
    }
}


//---------------------------------------------------【获取tag对应的class】
function tagImgClass(str){
    var e = {};
    for(var i=0;i<IMG_TAGS.length;i++){
        if(IMG_TAGS[i].attr === str){
            e = IMG_TAGS[i];
        }
    }

    return e;
}

function tagClass(str){
    var tagType = {};

    //色情
    if(str === "porn"){
        tagType = {
            className : "dim-pornography",
            min : "色",
            text : "色情"
        }
    }
    //时政
    else if(str === "polit"){
        tagType = {
            className : "dim-politics",
            min : "政",
            text : "时政"
        }
    }
    //版权
    else if(str === "copr"){
        tagType = {
            className : "dim-leader",
            min : "版",
            text : "版权"
        }
    }
    //道德尺度
    else if(str === "moral"){
        tagType = {
            className : "dim-leader",
            min : "德",
            text : "道德尺度"
        }
    }
    //广告
    else if(str === "spam"){
        tagType = {
            className : "dim-advertising",
            min : "广",
            text : "广告"
        }
    }
    //社会事件
    else if(str === "social"){
        tagType = {
            className : "dim-social-events",
            min : "社",
            text : "社会事件"
        }
    }
    //违法
    else if(str === "illegal"){
        tagType = {
            className : "dim-illegal",
            min : "法",
            text : "违法"
        }
    }
    //未审核
    else if(str === "NA"){
        tagType = {
            className : "NA-dimension",
            min : "未",
            text : "未审核"
        }
    }
    //正常
    else{
        tagType = {
            className : "normal-dimension",
            min : "正",
            text : "正常"
        }
    }

    return tagType;
}


//---------------------------------------------------【未审核居中】
function wshCenter(){
    var sH = parseInt($("body").height()) - parseInt($("#header").height()) - parseInt($("#taggingOperatingInner").height());
    var $pendingInner = $("#pendingInner");

    //$pendingInner.css({
    //    height: sH + "px"
    //});
}


//---------------------------------------------------【未审核数据存储】
function saveUgc(e,json){
    if(!!window.localStorage){
        //存储
        if(e === "save" && !localStorage.getItem('hqTag')){
            localStorage.setItem('hqTag',JSON.stringify(json));
        }
        //读取
        else if(e === "get"){
            return JSON.parse(localStorage.getItem('hqTag'));
        }
        //删除
        else if(e === "remove"){
            localStorage.removeItem('hqTag');
        }
    }
}


//---------------------------------------------------【计算字数】
function getCharLength(str){
    var iLength = 0;
    for(var i = 0;i<str.length;i++){
        if(str.charCodeAt(i) > 255){
            iLength += 2;
        }else{
            iLength += 1;
        }
    }

    return iLength;
}


//---------------------------------------------------【幻灯片】
$(function(){

    //小图切换大图
    $(document).on("click",".minImgListInner .mg",function(){
        var html = '<div class="btn"><div class="btn-list-inner"><ul></ul></div><a class="prev die" href="javascript:void(0);"><s></s></a><a class="next die" href="javascript:void(0);"><s></s></a></div><div class="img-list-inner"><ul class="img-list">';
        var $li = $(this).parents(".minImgListInner").find(".list-li");

        for(var i=0;i<$li.length;i++){
            var xz = $li.eq(i).attr("data-xz") || "";
            html += '<li data-xz="' + xz + '" class="li" data-url="' + $li.eq(i).attr("data-url") + '">';
            html += '<div class="mg"><img onload="imgCl(this,600,410);" src="' + $li.eq(i).attr("data-url") + '"></div>';
            html += '<div class="tag-list-bull">';

            if(xz){
                html += '<div class="active ' + tagClass(tagImgClass(xz).tags).className + '" style="display:block;">' + tagImgClass(xz).label + '</div>';
                html += '<ul style="display:none;">';
            }else{
                html += '<div class="active"></div>';
                html += '<ul>';
            }

            var sArr = IMG_TAGS;

            if(xz){
                html += '<li data-typeid="' + tagImgClass(xz).tags + '" data-id="' + xz + '" class="' + tagClass(tagImgClass(xz).tags).className + '">' + tagImgClass(xz).name + '</li>';
                for(var j=0;j<sArr.length;j++){
                    if(sArr[j].attr != xz){
                        html += '<li data-typeid="' + sArr[j].tags + '" data-id="' + sArr[j].attr + '" class="' + tagClass(sArr[j].tags).className + '">' + sArr[j].name + '</li>';
                    }
                }
            }else{
                for(var j=0;j<sArr.length;j++){
                    html += '<li data-typeid="' + sArr[j].tags + '" data-id="' + sArr[j].attr + '" class="' + tagClass(sArr[j].tags).className + '">' + sArr[j].name + '</li>';
                }
            }

            html += '</ul></div></li>';
        }
        html += '</ul><a class="prev" href="javascript:void(0);"><s></s></a><a class="next" href="javascript:void(0);"><s></s></a></div>';
        var $p = $(this).parents(".monitoring-value");
        $p.append('<div class="slide"></div>');
        $p.find(".slide").html(html);
        $p.find(".minImgListInner").remove();

        //大图初始化
        var $slide = $p.find(".slide");
        var slideShow = new SLIDESHOW($slide);
        $slide.find(".btn li").bind("click",function(){
            slideShow.active($(this));
        });
        $slide.find(".img-list-inner .prev,.img-list-inner .next").bind("click",function(){
            if($(this).hasClass("prev")){
                slideShow.active($(this),"prev");
            }else{
                slideShow.active($(this),"next");
            }
        });
        $slide.find(".btn .prev,.btn .next").bind("click",function(){
            if($(this).hasClass("prev")){
                slideShow.mg("prev");
            }else{
                slideShow.mg("next");
            }
        });
    });

    //大图切换小图
    $(document).on("click",".slide .mg",function(){
        var html = '<ul class="img-list clearfix">';
        var $li = $(this).parents(".slide").find(".li");

        for(var i=0;i<$li.length;i++){
            var xz = $li.eq(i).attr("data-xz") || "";
            html += '<li data-xz="' + $li.eq(i).attr("data-xz") + '" class="list-li" data-url="' + $li.eq(i).attr("data-url") + '">';
            html += '<div class="mg"><img onload="imgCl(this,95,95);" src="' + $li.eq(i).attr("data-url") + '"></div>';
            html += '<div class="tag-list-bull">';
            html += '<div class="t"></div>';

            if(xz){
                html += '<div class="active ' + tagClass(tagImgClass(xz).tags).className + '" style="display:block;">' + tagImgClass(xz).label + '</div>';
                html += '<ul style="display:none;">';
            }else{
                html += '<div class="active"></div>';
                html += '<ul>';
            }

            var sArr = IMG_TAGS;

            if(xz){
                html += '<li data-id="' + xz + '" class="' + tagClass(tagImgClass(xz).tags).className + '">' + tagImgClass(xz).label + '</li>';
                for(var j=0;j<sArr.length;j++){
                    if(sArr[j].attr != xz){
                        html += '<li title="' + sArr[j].name + '" data-id="' + sArr[j].attr + '" class="' + tagClass(sArr[j].tags).className + '">' + sArr[j].label + '</li>';
                    }
                }
            }else{
                for(var j=0;j<sArr.length;j++){
                    html += '<li title="' + sArr[j].name + '" data-id="' + sArr[j].attr + '" class="' + tagClass(sArr[j].tags).className + '">' + sArr[j].label + '</li>';
                }
            }

            html += '</ul>';
            html += '</div></li>';
        }
        html += '</ul>';
        $(this).parents(".monitoring-value").append('<div class="minImgListInner"></div>');
        $(this).parents(".monitoring-value").find(".minImgListInner").html(html);
        $(this).parents(".monitoring-value").find(".slide").remove();
    });

});

//构造函数
function SLIDESHOW(dom){
    //初始化
    var html = "";
    for(var i=0;i<dom.find(".img-list li img").length;i++){
        var $pic = dom.find(".img-list li img").eq(i);
        html += '<li><div><img onload="imgCl(this,95,95);" src="' + $pic.attr("src") + '"></div></li>';
    }
    dom.find(".btn ul").html(html);
    dom.find(".btn li").eq(0).addClass("active");

    this.dom = dom;
    this.silderShow = dom.find(".img-list").eq(0); //幻灯片容器
    this.silderBtn = dom.find(".btn li"); //幻灯片指示器
    this.imgWidth = parseInt(dom.css("width")); //幻灯片容器的宽度（移动的单位距离）
    this.imgNum = this.silderShow.find(".li").length; //幻灯片的数量
    this.se = Math.ceil(this.silderBtn.length / 6);
    dom.find(".btn").attr("data-se",1);
    if(this.se > 1){
        dom.find(".btn .next").removeClass("die");
    }
}

//点击幻灯片指示器
SLIDESHOW.prototype.active = function(e,n){
    var index; //当前点击的指示器的index值
    var yIndex = this.dom.find(".btn li.active").index();

    if(n){
        index = yIndex;
        if(n === "prev"){
            index = index > 0 ? index - 1 : index;
        }else{
            index = index < this.imgNum - 1 ? index + 1 : index;
        }
    }else{
        index = $(e).index();
    }
    this.silderBtn.removeClass("active");
    this.silderBtn.eq(index).addClass("active");

    //计算幻灯片容器的移动距离
    var mun = "-" + index * this.imgWidth;
    this.silderShow.css({
        marginLeft : mun + "px"
    });

    //btn滚动
    var dataSe = this.dom.find(".btn").attr("data-se");
    var np = Math.ceil((index + 1) / 6); //btn当前第几页
    if(dataSe != np){
        this.mg("to",np);
    }
};

SLIDESHOW.prototype.mg = function(n,m){
    var sn;
    var mun;
    var btn = this.dom.find(".btn");
    var nowSe = parseInt(btn.attr("data-se"));
    var btnW = this.silderBtn.width() + 6;
    var sw = btnW * 6;

    //上一组
    if(n === "prev"){
        if(nowSe > 1){
            sn = nowSe - 1;
        }
    }
    //下一组
    else if(n === "next"){
        if(nowSe < this.se){
            sn = nowSe + 1;
        }
    }
    //指定
    else if(n === "to"){
        btn.attr("data-se",m);
        sn = m;
    }

    //移动
    btn.attr("data-se",sn);
    mun = "-" + (sn - 1) * sw;
    if(mun){
        btn.find("ul").css({
            marginLeft : mun + "px"
        });
    }

    //按钮变灰
    if(this.se > 1){
        var dataSe = parseInt(btn.attr("data-se"));
        if( dataSe <= 1 ){
            btn.find(".prev").addClass("die");
            btn.find(".next").removeClass("die");
        }
        if( dataSe > 1){
            btn.find(".prev").removeClass("die");
        }
        if( dataSe < this.se){
            btn.find(".next").removeClass("die");
        }
        if( dataSe >= this.se ){
            btn.find(".next").addClass("die");
            btn.find(".prev").removeClass("die");
        }
    }
};

//图片大小处理
function imgCl(e,w,h){
    if(e.width > w){
        $(e).css("width",w + "px");

        if(e.height > h){
            $(e).css("width","auto");
            $(e).css("height",h + "px");
        }
    }

    if(e.height > h){
        $(e).css("width","auto");
        $(e).css("height",h + "px");
    }
}

