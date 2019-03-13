$(document).ready(function(){

    console.log("启动jQuery");
    loadContent('home.html');
    //加载头
    $(".header").load("header.html",function () {
        var userinfo=$.session.get("userInfo");
        if ( userinfo!=undefined&&userinfo!=''&&userinfo!='null')
        {
            var userdata= jQuery.parseJSON(userinfo);
            loginLater(userdata.users.RealName);
        }

    });
    //加载脚本
    $(".footer").load("footer.html");

	//登录确认
    $(document).on("click","#loginSubmit",function () {
        if ($("#loginUsername").val()==""||$("#loginUsername").val().length<1)
        {
            $("#login .modal-body .username-title-login").show();
            return;
        }
        if ($("#loginPassword").val()==""||$("#loginPassword").val().length<6)
        {
            $("#login .modal-body .username-title-password").show();
            return;
        }
        var userinfo=new Object();
        userinfo.UserName=$("#loginUsername").val();
        userinfo.PassWord=$("#loginPassword").val();
        $.ajax({
            type:"post",
            url:"http://frontapi.bighotel.vip/Api/UserLogin",
            contentType: "application/json;charset=utf-8",
            dataType:"json",
            data: JSON.stringify(userinfo),
            success:function(data){
                var result=jQuery.parseJSON(data);
                if(result.Success==true)
                {
                    var data=jQuery.parseJSON(result.Data);
                    loginLater(data.users.RealName);
                   // $.cookie('userData',result.Data);
                    $.session.set("userInfo",result.Data);
                    $.session.set("token",data.access_token);
                    $('#login').modal('hide');
                }
                else
                {
                    alert("登录失败："+result.Msg);
                }
            },
            error:function(jqXHR){
                console.log("Error: "+jqXHR.status);
            }
        });
    })
    //注册确认
    $(document).on("click","#registerSubmit",function () {
        //$('#register').modal('hide');
        if ($("#UserName").val()==""||$("#UserName").val().length<1)
        {
            $(".modal-body .username-title").show();
            return;
        }
        if ($("#PassWord").val()==""||$("#PassWord").val().length<6)
        {
            $(".modal-body .password-title").show();
            return;
        }
        if ($("#ConfirmPassword").val()==""||$("#PassWord").val()!=$("#ConfirmPassword").val())
        {
            $(".modal-body .confirmpassword-title").show();
            return;
        }
        if ($("#RealName").val()==""||$("#RealName").val().length<1)
        {
            $(".modal-body .realname-title").show();
            return;
        }
        if ($("#Phone").val()==""||$("#Phone").val().length<1)
        {
            $(".modal-body .Phone-title").show();
            return;
        }
        var userinfo=new Object();
        userinfo.id=0;
        userinfo.UserName=$("#UserName").val();
        userinfo.PassWord=$("#PassWord").val();
        userinfo.ConfirmPassword=$("#ConfirmPassword").val();
        userinfo.RealName=$("#RealName").val();
        userinfo.Phone=$("#Phone").val();
        userinfo.Sex=0;
        $.ajax({
            type:"post",
            url:"http://frontapi.bighotel.vip/Api/UserRegister",
            contentType: "application/json;charset=utf-8",
            dataType:"json",
            data: JSON.stringify(userinfo),
            success:function(data){
               var result=jQuery.parseJSON(data);
                if(result.Code==0)
                {
                    alert("注册成功");
                    $('#register').modal('hide');
                    $('#login').modal('show');
                }
                else
                {
                    alert("注册失败");
                }
            },
            error:function(jqXHR){
                console.log("Error: "+jqXHR.status);
            }
        });
    })
    //注销
    $(document).on("click","#login-out",function () {
        console.log("注销");
        $('.header .login-panel .user-infor').hide();
        $('.header .login-panel .user-panel').show();
       // $.cookie('userData', null);
        $.session.remove("token");
        $.session.remove("userInfo");
    })


 });

//加载页面
function loadContent(url) {
    if(url=='home.html')
    {
        $('.banner').load(url);
        $('.container .main').hide();
        $("#index-main").removeClass("index-main");
        return;
    }
	else {
        $("#index-main").addClass("index-main");
        $('.index-banner').remove();
        var token = $.session.get('token');
        if (url == 'supplier.html') {
            $('.container .main').load(url,function () {
                $.ajax({
                    type: "get",
                    url: "http://frontapi.bighotel.vip/Api/GetSupplierList",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        var result = jQuery.parseJSON(data);
                        if (result.Success == true) {
                            var dom = "";
                            for (let index in result.Data) {
                                dom = dom + " <div class='col-lg-2'><img class='img-rounded center-block' src='http://bg.bighotel.vip" + result.Data[index].iLogo + "' width='150' height='150' alt=''>";
                                dom = dom + " <h4 class='supplier-h4'>" + result.Data[index].iName + "</h4>";
                                dom = dom + "</div>";
                            }
                            ;
                            if (dom.length > 0) {
                                $('.main .supplier-row').append(dom);
                            }
                        }
                        else {
                            console.log("获取失败：" + result.Msg);
                        }
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", token);
                    },
                    error: function (jqXHR) {
                        console.log("Error: " + jqXHR.status);
                    }
                });
            });
            $('.container .main').show();
            return;
        }
        if (url == 'management.html') {
            $('.container .main').load(url,function () {
                $.ajax({
                    type: "get",
                    url: "http://frontapi.bighotel.vip/Api/GetArticleList?pageIndex=1&pageSize=10",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        var result = jQuery.parseJSON(data);
                        if (result.Success == true) {
                            var dom = "";
                            for (let index in result.Data.Items) {
                                dom = dom + " <li>";
                                dom = dom + " <span id='wzjj' class='float-right article-time'><strong>" + result.Data.Items[index].EntryTime + "</strong></span>";
                                dom = dom + "   <a href='#' class='article-title' onclick='ClickManageDetail(" + result.Data.Items[index].ID + ")'>" + result.Data.Items[index].Title + "</a>";
                                dom = dom + "</li>";
                            }
                            ;
                            if (dom.length > 0) {
                                $('.main .management-ul').append(dom);
                            }
                            var domPage = "";
                            for (var i = 1; i <= result.Data.TotalPages; i++) {
                                domPage=domPage+" <li class='property-page-first> <a href='# aria-label=\"Previous\"><span aria-hidden=\"true\">&laquo;</span></a></li>";
                                domPage = domPage + "<li><a href=\"#\" onclick='ClickManagePage(" + i + ")'>" + i + "</a></li>";
                                domPage=domPage+" <li><a href=\"#\" aria-label=\"Next\"><span aria-hidden=\"true\">&raquo;</span></a></li>";
                            }
                            $('.main .management-page .pagination').append(domPage);

                        }
                        else {
                            console.log("获取失败：" + result.Msg);
                        }
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", token);
                    },
                    error: function (jqXHR) {
                        console.log("Error: " + jqXHR.status);
                    }
                });
            })
            $('.container .main').show();
            return;
        }
        if (url == 'property.html') {
            $('.container .main').load(url,function () {
                $.ajax({
                    type: "get",
                    url: "http://frontapi.bighotel.vip/Api/GetArticleList?pageIndex=1&pageSize=10",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        var result = jQuery.parseJSON(data);
                        if (result.Success == true) {
                            var dom = "";
                            for (let index in result.Data.Items) {
                                dom = dom + " <li>";
                                dom = dom + " <span id='wzjj' class='float-right article-time'><strong>" + result.Data.Items[index].EntryTime + "</strong></span>";
                                dom = dom + "   <a href='#' class='article-title' onclick='ClickPropertyDetail(" + result.Data.Items[index].ID + ")'>" + result.Data.Items[index].Title + "</a>";
                                dom = dom + "</li>";
                            }
                            ;
                            if (dom.length > 0) {
                                $('.main .property-ul').append(dom);
                            }
                            var domPage = "";
                            for (var i = 1; i <= result.Data.TotalPages; i++) {
                                domPage=domPage+" <li class='property-page-first> <a href='# aria-label=\"Previous\"><span aria-hidden=\"true\">&laquo;</span></a></li>";
                                domPage = domPage + "<li><a href=\"#\" onclick='ClickPropertyPage(" + i + ")'>" + i + "</a></li>";
                                domPage=domPage+" <li><a href=\"#\" aria-label=\"Next\"><span aria-hidden=\"true\">&raquo;</span></a></li>";
                            }
                            $('.main .property-page .pagination').append(domPage);
                        }
                        else {
                            console.log("获取失败：" + result.Msg);
                        }
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", token);
                    },
                    error: function (jqXHR) {
                        console.log("Error: " + jqXHR.status);
                    }
                });
            })
            $('.container .main').show();
            return;
        }
        if (url == 'selectmonth.html' || url == 'selectYear.html') {
            var token= $.session.get('token');
            if(token==''||token==undefined)
            {
                alert("请先登录");
                return;
            }
            $('.container .main').load(url,function () {
                $.ajax({
                    type: "get",
                    url: "http://frontapi.bighotel.vip/Api/GetSQList",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        var result = jQuery.parseJSON(data);
                        if (result.Success == true) {
                            var dom = "";
                            for (let index in result.Data) {
                                dom = dom + "<option value='" + result.Data[index].ID + "'>" + result.Data[index].Name + "</option>";
                            }
                            if (dom.length > 0) {
                                $('.main .select-div .select-shangquan .form-control').append(dom);
                            }
                            let date=new Date;
                            let year=date.getFullYear();
                            $("#select-year").find("option[value='"+year+"']").attr("selected",true);
                        }
                        else {
                            console.log("获取失败：" + result.Msg);
                        }
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", token);
                    },
                    error: function (jqXHR) {
                        console.log("Error: " + jqXHR.status);

                    }
                });
            })
            $('.container .main').show();
            return;
        }
        if (url=='specialist.html')
        {
            $('.container .main').load(url,function () {
                $.ajax({
                    type:"get",
                    url:"http://frontapi.bighotel.vip/Api/GetExpertProList?pageIndex=1&pageSize=20",
                    contentType: "application/json;charset=utf-8",
                    dataType:"json",
                    success:function(data){
                        var result=jQuery.parseJSON(data);
                        if(result.Success==true)
                        {
                            var dom="";
                            for (let index in result.Data.Items) {
                                dom=dom+"<div class=\"specialist\">";
                                dom = dom + "<div class=\"views-field-field-tu-pian \">";
                                dom = dom + " <img src='http://bg.bighotel.vip"+result.Data.Items[index].PicUrl+"' width=\"200\" height=\"250\"></div>";
                                dom = dom + "<div class=\"views-field\">";
                                dom = dom + " <span class=\"views-field-title\">"+result.Data.Items[index].Name+"</span></div>";
                                dom = dom + "<div class=\"views-field\">";
                                dom = dom + " <div class=\"field-content\"><b>"+result.Data.Items[index].Title+"</b></div></div>";
                                dom = dom + " <div class=\"views-field\">";
                                dom = dom + "  <div class=\"suojin\">";
                                dom=dom+result.Data.Items[index].Description;
                                dom=dom+"</div></div></div>";
                            }
                            $('#specialist').append(dom);
                        }
                        else
                        {
                            console.log("获取失败："+result.Msg);
                        }
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", token);
                    },
                    error:function(jqXHR){
                        console.log("Error: "+jqXHR.status);
                    }
                });
            });
            $('.container .main').show();
            return;
        }
        if(url=='select.html')
        {
            $('.container .main').load(url);
            $('.container .main').show();
            return;
        }
        if(url=='about.html')
        {
            $('.container .main').load(url,function () {
                $.ajax({
                    type:"get",
                    url:"http://frontapi.bighotel.vip/Api/GetAboutUs",
                    contentType: "application/json;charset=utf-8",
                    dataType:"json",
                    success:function(data){
                        var result=jQuery.parseJSON(data);
                        if(result.Success==true)
                        {
                            $('#about-main').append(result.Data.DetailsPage);
                        }
                        else
                        {
                            console.log("获取失败："+result.Msg);
                        }
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", token);
                    },
                    error:function(jqXHR){
                        console.log("Error: "+jqXHR.status);
                    }
                });
            });
            $('.container .main').show();

            return;
        }
    }
}
//loadContent('about.html');

//登录过后操作
function loginLater(name) {
    $('.header .user-panel').hide();
    var dom = "<div class='user-infor'><div class='user-headimg'><div><img src='img/pic4.jpg'/></div></div><div class='user-name'>"+name+"</div><div class='login-out' id='login-out'>退出</div></div>"
    $('.header .login-panel').append(dom);
}

//物业供需获取详情
function ClickPropertyDetail(id) {
    var token= $.session.get('token');
    $('.container .main').load('propertydetail.html');
    $.ajax({
        type:"get",
        url:"http://frontapi.bighotel.vip/Api/GetArticeInfoByID?ID="+id,
        contentType: "application/json;charset=utf-8",
        dataType:"json",
        success:function(data){
            var result=jQuery.parseJSON(data);
            if(result.Success==true)
            {
                $('.main .property-detail').append(result.Data[0].DetailsPage);
            }
            else
            {
                console.log("获取失败："+result.Msg);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", token);
        },
        error:function(jqXHR){
            console.log("Error: "+jqXHR.status);
        }
    });
}
//物业供需分页事件
function ClickPropertyPage(pageIndex) {
    var token= $.session.get('token');
    $.ajax({
        type:"get",
        url:"http://frontapi.bighotel.vip/Api/GetArticleList?pageIndex=1&pageSize=10",
        contentType: "application/json;charset=utf-8",
        dataType:"json",
        success:function(data){
            var result=jQuery.parseJSON(data);
            if(result.Success==true)
            {
                var dom="";
                for(let index in result.Data.Items) {
                    dom=dom+" <li>";
                    dom=dom+" <span id='wzjj' class='float-right article-time'><strong>"+result.Data.Items[index].EntryTime+"</strong></span>";
                    dom=dom+"   <a href='#' class='article-title' onclick='ClickPropertyDetail("+result.Data.Items[index].ID+")'>"+result.Data.Items[index].Title+"</a>";
                    dom=dom+"</li>";
                };
                if (dom.length>0)
                {
                    $('.main .property-ul').html(dom);
                }
                var domPage="";
                for(var i=1;i<=result.Data.TotalPages;i++)
                {
                    domPage=domPage+" <li class='property-page-first> <a href='# aria-label=\"Previous\"><span aria-hidden=\"true\">&laquo;</span></a></li>";
                    domPage=domPage+"<li><a href=\"#\" onclick='ClickPropertyPage("+i+")'>"+i+"</a></li>";
                    domPage=domPage+" <li><a href=\"#\" aria-label=\"Next\"><span aria-hidden=\"true\">&raquo;</span></a></li>";
                }
                $('.main .property-page .pagination').html(domPage);
            }
            else
            {
                console.log("获取失败："+result.Msg);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", token);
        },
        error:function(jqXHR){
            console.log("Error: "+jqXHR.status);
        }
    });
   
}

//管理案列获取详情
function ClickManageDetail(id) {
    var token= $.session.get('token');
    $('.container .main').load('managementdetail.html');
    $.ajax({
        type:"get",
        url:"http://frontapi.bighotel.vip/Api/GetArticeInfoByID?ID="+id,
        contentType: "application/json;charset=utf-8",
        dataType:"json",
        success:function(data){
            var result=jQuery.parseJSON(data);
            if(result.Success==true)
            {
                $('.main .manage-detail').append(result.Data[0].DetailsPage);
            }
            else
            {
                console.log("获取失败："+result.Msg);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", token);
        },
        error:function(jqXHR){
            console.log("Error: "+jqXHR.status);
        }
    });
}


//管理案列分页事件
function ClickManagePage(pageIndex) {
    var token= $.session.get('token');
    $.ajax({
        type:"get",
        url:"http://frontapi.bighotel.vip/Api/GetArticleList?pageIndex="+pageIndex+"&pageSize=10",
        contentType: "application/json;charset=utf-8",
        dataType:"json",
        success:function(data){
            var result=jQuery.parseJSON(data);
            if(result.Success==true)
            {
                var dom="";
                for(let index in result.Data.lists) {
                    dom=dom+" <li>";
                    dom=dom+" <span id='wzjj' class='float-right article-time'><strong>"+result.Data.lists[index].EntryTime+"</strong></span>";
                    dom=dom+"   <a href='#' class='article-title' onclick='ClickManageDetail("+result.Data.lists[index].ID+")'>"+result.Data.lists[index].Title+"</a>";
                    dom=dom+"</li>";
                };

                if (dom.length>0)
                {
                    $('.main .management-ul').append(dom);
                }
                var domPage="";
                for(var i=1;i<=result.Data.TotalPages;i++)
                {
                    domPage=domPage+" <li class='property-page-first> <a href='# aria-label=\"Previous\"><span aria-hidden=\"true\">&laquo;</span></a></li>";
                    domPage=domPage+"<li><a href=\"#\" onclick='ClickManagePage("+i+")'>"+i+"</a></li>";
                    domPage=domPage+" <li><a href=\"#\" aria-label=\"Next\"><span aria-hidden=\"true\">&raquo;</span></a></li>";
                }
                $('.main .management-page .pagination').html(domPage);
            }
            else
            {
                console.log("获取失败："+result.Msg);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", token);
        },
        error:function(jqXHR){
            console.log("Error: "+jqXHR.status);
        }
    });
}

//年份查询
function selectYear() {
    var sqid= $(".select-city-input option:selected").val();
    var year= $("#select-year option:selected").text();
    var token= $.session.get('token');
    if(token==''||token==undefined)
    {
        alert("请先登录");
        return;
    }
    $.ajax({
        type:"get",
        url:"http://frontapi.bighotel.vip/Api/GetYearData?pageIndex=1&pageSize=1000&year="+year+"&SQID="+sqid,
        contentType: "application/json;charset=utf-8",
        dataType:"json",
        success:function(data){
            var result=jQuery.parseJSON(data);
            if(result.Success==true)
            {
                var dom="";
                for(let index in result.Data.data.Items) {
                    dom=dom+"  <tr>";
                    dom=dom+"<td>"+result.Data.data.Items[index].imonth+"</td>";
                    dom=dom+"<td>"+result.Data.data.Items[index].averagePrice+"</td>";
                    dom=dom+"<td>"+result.Data.data.Items[index].occupancy+"</td>";
                    dom=dom+"<td>"+result.Data.data.Items[index].operatingIncome+"</td>";
                    dom=dom+"<td>"+result.Data.data.Items[index].roomIncome+"</td>";
                    dom=dom+"<td>"+result.Data.data.Items[index].foodIncome+"</td>";
                    dom=dom+"<td>"+result.Data.data.Items[index].recreationIncome+"</td>";
                    dom=dom+"</tr>";
                };

                if (dom.length>0)
                {
                    $('.main .select-table .table-year').html(dom);
                }

            }
            else
            {
                console.log("获取失败："+result.Msg);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", token);
        },
        error:function(jqXHR){
            console.log("Error: "+jqXHR.status);
        }
    });
}

//月份查询
function selectmonth() {
    var sqid= $(".select-city-input option:selected").val();
    var monthstr= $("#month-select option:selected").text();
    var token= $.session.get('token');
    if(token==''||token==undefined)
    {
        alert("请先登录");
        return;
    }
    var date=new Date;
    var year=date.getFullYear();
    $.ajax({
        type:"get",
        url:"http://frontapi.bighotel.vip/Api/GetMonthData?pageIndex=1&pageSize=1000&year="+year+"&SQID="+sqid+"&month="+monthstr,
        contentType: "application/json;charset=utf-8",
        dataType:"json",
        success:function(data){
            var result=jQuery.parseJSON(data);
            if(result.Success==true)
            {
                var dom="";
                for(let index in result.Data.data.Items) {
                   dom=dom+"  <tr>";
                    dom=dom+"<td>"+result.Data.data.Items[index].imonth+"</td>";
                    dom=dom+"<td>"+result.Data.data.Items[index].averagePrice+"</td>";
                    dom=dom+"<td>"+result.Data.data.Items[index].occupancy+"</td>";
                    dom=dom+"<td>"+result.Data.data.Items[index].operatingIncome+"</td>";
                    dom=dom+"<td>"+result.Data.data.Items[index].roomIncome+"</td>";
                    dom=dom+"<td>"+result.Data.data.Items[index].foodIncome+"</td>";
                    dom=dom+"<td>"+result.Data.data.Items[index].recreationIncome+"</td>";
                    dom=dom+"</tr>";
                };

                if (dom.length>0)
                {
                    $('.main .select-table .table-month').html(dom);
                }

            }
            else
            {
                console.log("获取失败："+result.Msg);
            }
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", token);
        },
        error:function(jqXHR){
            console.log("Error: "+jqXHR.status);
        }
    });
}


//月份下载
function downmonth() {
    var sqid= $(".select-city-input option:selected").val();
    var monthstr= $("#month-select option:selected").text();
    var date=new Date;
    var year=date.getFullYear();
    var userinfo=$.session.get("userInfo");
    var username='';
    if ( userinfo!=undefined&&userinfo!=''&&userinfo!='null')
    {
        var userdata= jQuery.parseJSON(userinfo);
        username=userdata.users.UserName;
    }
    if(username==''||username==undefined)
    {
        alert("请先登录");
        return;
    }
    var para=new Object();
    para.CityID=490;
    para.AreaID=sqid;
    para.iYear=year;
    para.iMonth=monthstr;
    para.UserName=username;
    para.RF=2;

    $.post("http://report.bighotel.vip/api/V1/quote/ExportHotelMonthReport?T={T}&S={S}&V={V}&TS={TS}&sign={sign}&user={user}",
        para,
        function(result,status){
            var a=result;
            if (result.code!=1)
            {
                alert("下载失败");
                return;
            }
            if (result.code==1)
            {
                //document.getElementById('linkmontha').href="http://report.bighotel.vip"+result.data;
                window.open("http://report.bighotel.vip"+result.data);
            }
        }
    );
    return;
}

//年度下载
function downyear() {
    var sqid= $(".select-city-input option:selected").val();
    var year= $("#select-year option:selected").text();
    var userinfo=$.session.get("userInfo");
    var username='';
    if ( userinfo!=undefined&&userinfo!=''&&userinfo!='null')
    {
        var userdata= jQuery.parseJSON(userinfo);
        username=userdata.users.UserName;
    }
    if(username==''||username==undefined)
    {
        alert("请先登录");
        return;
    }
    var para=new Object();
    para.CityID=490;
    para.AreaID=sqid;
    para.iYear=year;
    para.UserName=username;
    para.RF=2;

    $.post("http://report.bighotel.vip/api/V1/quote/ExportHotelYearReport?T={T}&S={S}&V={V}&TS={TS}&sign={sign}&user={user}",
        para,
        function(result,status){
            var a=result;
            if (result.code!=1)
            {
                alert("下载失败");
                return;
            }
            if (result.code==1)
            {
               // document.getElementById('linkmontha').href="http://report.bighotel.vip"+result.data;
                window.open("http://report.bighotel.vip"+result.data);
            }
        });
}



