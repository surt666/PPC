var urlbase = "/messaging-v1/"

var flow = {
    init:function() {
        flow.repaintFlowsSelect("fflows", true);
        $("select#fflows").change(function () {
            var name = $("select#fflows option:selected").text();
            flow.loadFlow(name);
        });
        $("#wfGem").click(flow.saveFlow);
    },
    repaintFlowsSelect: function(targetId, nyt, value) {
        $.get(urlbase + "loadflows", function(data) {
            var flows = $("#" + targetId);
            flows.empty();
            if (nyt) {
                flows.append('<option value="">-- Nyt --</option>');
            }
            $(data).each(function(k, element) {
                flows.append('<option value="' + element + '">' + element + '</option>');
            });
            if (value) {
                flows.val(value);
            }
        });
    },
    loadFlow: function(name) {
        if (name == "-- Nyt --") {
            $("#title").val("");
            $("#fflow").val("");
            return false;
        }
        $.get(urlbase + "loadflow/" + name, function(data) {
            $("#title").attr("value", name);
            $("#fflow").val(data);
        });
    },
    saveFlow: function() {
        console.log("in flow save flow ");

        var name = $("#title").val();
        var workflow = $("#fflow").val();
        var data = { "name":name, "workflow": workflow };

        console.log("still in flow save flow ");

        $.ajax({
            type: "POST",
            accepts: "application/json",
            cache: false,
            contentType: "text/plain",
            url: "/message/flow",
            dataType: "json",
            data: JSON.stringify(data),
            error: function(request, error) {
                alert(error);
            },
            success: function(result) {
                console.log("return save flow ");

                flow.repaintFlowsSelect("fflows", true);
                $("#wfSavedConfirm").show().fadeOut(2000);
            }
        });
        console.log("in flow save flow ");

        return false;
    }
}

var smstemplate = {
    init:function() {

        smstemplate.repaintSmsTemplatesSelect("smstemplates", true, null);

        $("#savesmstemplate").click(function() {
            smstemplate.saveTemplateClick("smstemplates", "smstemplatename")
        });

        $("#smstemplates").change(function() {
            var templateName = $("#smstemplates option:selected").val();
            if (templateName != "") {
                smstemplate.loadSmsTemplate(templateName);
                $("#savesmstemplate").html("Save");
                $("#smstemplatename").css('background-color', 'white');
            }
            else {
                $("#smstemplatename").val("");
                $("#smstemplate").html("");
                $("#smstestdata").val("{}")
                $("#smsresult").hide();
            }
        });
    },
    saveTemplateClick:function(selectorId, nameTextFieldId) {
        var templateName = $("#" + selectorId + " option:selected").val();
        if (templateName == "") {
            templateName = $("#" + nameTextFieldId).val();
        }
        if (templateName == "") {
            alert("Navn skal angives");
        }
        else {
            smstemplate.saveSmsTemplate(templateName);
        }
    },
    repaintSmsTemplatesSelect: function(targetId, nyt, selectedId) {
        template.repaintTemplatesSelect(targetId, nyt, selectedId, "sms");
    },
    loadSmsTemplate:function(templateName) {
        $.get(urlbase + "smstemplate/" + templateName, function(data) {
            var dataJson = JSON.parse(data);
            $("#smstemplatename").val(templateName);
            $("#smstemplate").val(dataJson.template);
            $('#smstestdata').val(dataJson.testdata);
        });
    },
    saveSmsTemplate:function(smsTemplateName) {
        var template = $('#smstemplate').val();
        var testdata = $("#smstestdata").val();
        var data = {"template":template, "testdata": testdata};
        $.ajax({
            type: "POST",
            accepts: "application/json",
            cache: false,
            contentType: "text/plain",
            url: "/message/smstemplate/" + smsTemplateName,
            dataType: "json",
            data: JSON.stringify(data),
            error: function(request, error) {
                alert(error);
            },
            success: function(result) {
                $("#smssaved").show().fadeOut(2000);
                smstemplate.repaintSmsTemplatesSelect("smstemplates", true, smsTemplateName);
            }
        });
    }
}

var template = {
    init:function() {

        template.repaintMailTemplatesSelect("templates", true);

        $("#saveTemplate").click(function() {
            var templateName = $("#templates option:selected").val();
            if (templateName == "") {
                templateName = $("#templatename").val();
            }
            if (templateName == "") {
                alert("Navn skal angives");
            }
            else {
                template.saveTemplate(templateName);
            }
        });
        $("#templates").change(function() {
            var templateName = $("#templates option:selected").val();
            if (templateName != "") {
                template.loadTemplate(templateName);
                $("#saveTemplate").html("Save");
                $("#templatename").css('background-color', 'white');
            }
            else {
                $("#templatename").val("");
                $("#subject").val("");
                $("#template").html("");
                $("#testdata").val("{}")
                $("#result").hide();
            }
        });
        $("#templatename").change(function() {
            var newTemplateName = $("#templatename").val();
            var isNewTemplate = true;
            $("#templates > option").each(function() {
                if (this.value == newTemplateName) {
                    $("#saveTemplate").html("Overwrite");
                    $("#templatename").css('background-color', 'red');
                    $("#templates").val(this.value);
                    isNewTemplate = false;
                }
            });
            if (isNewTemplate) {
                $("#templates").val(1);
                $("#saveTemplate").html("Save");
                $("#templatename").css('background-color', 'white');
            }
        });
    },
    repaintMailTemplatesSelect: function(targetId, nyt, selectedId) {
        template.repaintTemplatesSelect(targetId, nyt, selectedId, "mail");
    },
    repaintTemplatesSelect: function(targetId, nyt, selectedId, serviceName) {
        $("#" + targetId).empty();
        if (nyt) {
            $("#" + targetId).append('<option value="" selected="selected">-- Ny --</option>');
        }
        $.get(urlbase + "template/type/" + serviceName, function(data) {
            $.each(data, function(index, templateName) {
                $("#" + targetId).append('<option value="' + templateName.name + '">' + templateName.name + '</option>');
            });
            if (selectedId) {
                $("#" + targetId).val(selectedId);
            }
            ;
        });
    },
    loadTemplate:function(templateName) {
        $.get(urlbase + "template/" + templateName, function(data) {
            var dataJson = JSON.parse(data);
            $("#templatename").val(templateName);
            $("#subject").val(dataJson.subject);
            $("#template").html(dataJson.template);
            $('#testdata').val(dataJson.testdata);
        });
    },
    saveTemplate:function(templateName) {
        var subject = $("#subject").val();
        var mailtemplate = $('#template').html();
        var testdata = $("#testdata").val();
        var data = {"subject": subject, "template":mailtemplate, "testdata": testdata};
        $.ajax({
            type: "POST",
            accepts: "application/json",
            cache: false,
            contentType: "text/plain",
            url: "/message/template/" + templateName,
            dataType: "json",
            data: JSON.stringify(data),
            error: function(request, error) {
                alert(error);
            },
            success: function(result) {
                $("#msaved").show().fadeOut(2000);
                template.repaintMailTemplatesSelect("templates", true, templateName);
            }
        });
    }
}

var mailpreview = {
    init: function() {
        $("#previewTemplate").click(function() {
            mailpreview.mergePreview();
        });
    },
    mergePreview:function() {
        var testdata = $("#testdata").val();
        var template = $("#template").html();
        var dd = {"data" : JSON.parse(testdata),  "template" : template};
        $.ajax({
            type: "POST",
            cache: false,
            contentType: "application/json",
            accepts: "text/html",
            url: "/message/previewmail",
            dataType: "html",
            data: JSON.stringify(dd),
            error: function(request, error, errorThrown) {
                alert("FEJL \n" + error + " \n" + errorThrown + " \n" + JSON.stringify(request));
            },
            success: function(result) {
                var anchor = '<a id="previewiframe" href="' + result + '?iframe=true&width=100%&height=100%"></a>';
                $("#result").html(anchor);
                $("#previewiframe").prettyPhoto({social_tools: ''}).click();
                $(".pp_description").html("");
            }
        });
    }
}

var previewsms = {
    init: function() {
        $("a[rel^='prettyPhoto']").prettyPhoto({
            social_tools: ''
        });
        $("#previewsmstemplate").click(function() {
            previewsms.mergePreview();
        });
    },
    mergePreview:function() {
        var testdata = $("#smstestdata").val();
        var template = $("#smstemplate").val();
        var dd = {"data" : JSON.parse(testdata),  "template" : template};
        $.ajax({
            type: "POST",
            cache: false,
            contentType: "application/json",
            accepts: "text/html",
            url: "/message/mergesms",
            dataType: "html",
            data: JSON.stringify(dd),
            error: function(request, error, errorThrown) {
                alert("FEJL \n" + error + " \n" + errorThrown + " \n" + JSON.stringify(request));
            },
            success: function(result) {
                $("#smsresult").html(result);
                $(".pp_description").html("");
            }
        });
    }
}

var stat = {
  init: function(){
    stat.toogleLoadingOn();
    stat.refreshCategories();
    $("#statMenu a").each(function(){$(this).click(stat.menuListener);});
    $("#showOverview").click(function(){stat.showOverviewWindow();});
    $("#showDetails").click(function(){stat.showDetailWindow();});
    $("#showCustom").click(function(){stat.showCustomWindow();});
    $("#getOverviewStats").click(function(){stat.getOverviewStats();});
    $("#getDetailStats").click(function (){stat.getDetailStats();});
    $("#getCustomStats").click(function(){stat.getCustomStats();});
  },
  showOverviewWindow:function() {
    $('#overviewStatsDiv').show();
  },
  getOverviewStats:function(){
    stat.toogleLoadingOn();
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Category');
    data.addColumn('number', 'Antal requests');

    $("#categorySelector option").each(function(){
        categoryName = $(this).val();
        //getting the specific stats for every category
        if(categoryName.length != 0)
        {
            $.get(urlbase+"statistics/list/"+categoryName, function(categorydata){
                if(categorydata.status == 200){
                    d2 = JSON.parse(categorydata.response);
                    data.addRow([d2[0].name, d2[0].requests]);
                    // Det bør laves at funktionen drawChart kun eksekveres én gang.
                    // Som det er nu eksekveres den hver gang der lander et resultat på en kategori.
                    // Men hvordan laver man en wait på disse callbacks i $.each
                    var chart = new google.visualization.PieChart(document.getElementById('chart'));
                    stat.drawChart(data, chart);
                }
            });
        }
    });
  },
  showDetailWindow:function(){
    $('#detailStatsDiv').show();
  },
  getDetailStats:function(){
    stat.toogleLoadingOn();

    var url = urlbase+"statistics" +
        "?aggregate=1" +
        "&category=" + $("select#categorySelector option:selected").val();

    $.get(url, function(data){
        if (data.status == 200) {
            d = JSON.parse(data.response);
            // Når man forespørger statistisk data fra SendGrid med kategori, får man resultat i array.
            // Når man forespørger uden kategory, er resultat ikke et array.
            if ( d instanceof Array )
            {
                statdata = d[0];
            }
            else
            {
                statdata = d;
            }

            stat.drawBarChart(statdata);
        };
    });
  },
  showCustomWindow:function(){
    $("#customStatsDiv").show();
    $("#categorySelectorCopy").val(0);
    $('#days').val('');
    $('#start_date').val('');
    $('#end_date').val('');
    $('input[name=chartType][value=bar]').prop('checked', true);
  },
  getCustomStats:function(){
    stat.toogleLoadingOn();

    var category = $("#categorySelectorCopy option:selected").val();
    var days = $('#days').val();
    var start_date = $('#start_date').val();
    var end_date = $('#end_date').val();
    var chartType = $('input[name=chartType]:checked').val();

    var url = urlbase + "statistics?";
    if(category){url += "category=" + category + "&";}
    if(days){url += "days=" + days + "&";}
    if(start_date){url += "start_date=" + start_date + "&";}
    if(end_date){url += "end_date=" + end_date + "&";}

    // Ved charts af typen Pie og Bar skal data være aggregeret.
    // Ved chart at typen Column (eller hvilken visualitet der bliver brugt), skal data hentes non-aggregeret.
    if(chartType == 'column') {url += "aggregate=0";}
    if(chartType == 'bar' || chartType == 'pie') {url += "aggregate=1";}

    $.get(url, function(data){
        if (data.status == 200) {
            d = JSON.parse(data.response);
            if(chartType == 'pie')
            {
                stat.drawPieChart(d);
            }
            else if(chartType == 'bar')
            {
                stat.drawBarChart(d);
            }
            else if(chartType == 'column')
            {
                stat.drawColumnChart(d);
            }
        };
    });
  },
  refreshCategories:function(){
    $("#categorySelector").html('');
    $("#categorySelector").append('<option value="" selected>(Alle)</option>');
    $.get(urlbase+"statistics/list", function(data){
        if (data.status == 200) {
            d = JSON.parse(data.response);
            $.each(d, function(k,v){
                // Adding to select for detail view
                var categoryName = v.category;
                $("#categorySelector").append('<option value="'+ categoryName +'">' + categoryName + '</option>');
            });
            // Kopierer categorier over i ny selector.
            // Dette er lettere end at skulle skjule selector
            $('#categorySelectorCopy').html($('#categorySelector').html());
            stat.showOverviewWindow();
            stat.toogleLoadingOff();
        }
    });
  },
  drawPieChart:function(data) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Category');
    dataTable.addColumn('number', 'Antal');

    // Når man forespørger statistisk data fra SendGrid med kategori, får man {"name": <category>} med i resultatsæt.
    // Eftersom <category> er en String, kan dette ikke indsættes i chart.
    // Derfor tjekkes der for om typen er en Number i nedenstående addRow's

    stat.add(dataTable, data);

    var chart = new google.visualization.PieChart(document.getElementById('chart'));
    stat.drawChart(dataTable, chart);
  },
  drawBarChart:function(data){
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Category');
    dataTable.addColumn('number', 'Antal');

    stat.add(dataTable, data);

    var chart = new google.visualization.BarChart(document.getElementById('chart'));
    stat.drawChart(dataTable, chart);
  },
  drawColumnChart:function(data){
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Dato');
    dataTable.addColumn('number', 'requests');
    dataTable.addColumn('number', 'delivered');
    dataTable.addColumn('number', 'unique_opens');
    dataTable.addColumn('number', 'bounces');
    $.each(data, function(k,v){
        dataTable.addRow([v.date, v.requests, v.delivered, v.unique_opens, v.bounces]);
    });

    var chart = new google.visualization.ColumnChart(document.getElementById('chart'));
    stat.drawChart(dataTable, chart);
  },
  drawChart:function(data, chart){
    var options = {'width':600, 'height':400};
    chart.draw(data, options);
    stat.toogleLoadingOff();
  },
  toogleLoadingOn:function(){
    $("#loading").show();
    $("#chart").hide();
  },
  toogleLoadingOff:function(){
    $("#loading").hide();
    $("#chart").show();
  },
  menuListener:function(){
    $("#loading").hide();
    $("#chart").hide();
    $("#statMenu").find("a.active").removeClass("active");
    $(this).toggleClass("active");
    $('#overviewStatsDiv').hide();
    $('#detailStatsDiv').hide();
    $('#customStatsDiv').hide();
  },
  add:function(dataTable,data)
  {
    if ( data instanceof Array )
    {
        $.each(data, function(obj){
            stat.addToDataTable(dataTable, obj);
        });
    }
    else
    {
        stat.addToDataTable(dataTable, data);
    }
  },
  addToDataTable:function(dataTable, dataObject){
    $.each(dataObject, function(k,v){
        if( v.constructor === Number) // Vi indsætter data som er tal
        {
            dataTable.addRow([k, v]);
        }
    });
  }
}

var kf = {
    data: {},
    init: function() {
        // load menu and data
        kf.reloadMenu();
        // load selects - flow, mail templates, sms templates
        flow.repaintFlowsSelect("kfflow");
        kf.repaintFlowTestsSelect("kftests", true);
        template.repaintMailTemplatesSelect("kfmailtpl");
        smstemplate.repaintSmsTemplatesSelect("kfsmstpl", false);

        $("select#kftests").change(function () {
            var name = $("select#kftests option:selected").text();
            kf.loadTest(name);
        });
        $("#wfGem").click(flow.saveFlow);
        // missing sms templates

        // listener on form save.
        $("#kfform").submit(kf.saveKF);
        $("#testSend").click(function() {
            var postdata = $("#testflow").val();

            $.ajax({
                type: 'POST',
                url: urlbase,
                data: $("#testflow").val(),
                contentType: "application/json",
                success: function(data) {
                    console.log(data);
                    readable = data.messageid;
                    $("#testTarget").append('<div class="alert-box success">' + readable + '</div>');
                }
            });
            return false;
        });
        $("#testGem").click(function() {
            kf.saveTest()
        });
/*
        $("#smstemplates").change(function() {
            var templateName = $("#smstemplates option:selected").val();
            if (templateName != "") {
                smstemplate.loadSmsTemplate(templateName);
                $("#savesmstemplate").html("Save");
                $("#smstemplatename").css('background-color', 'white');
            }
            else {
                $("#smstemplatename").val("");
                $("#smstemplate").html("");
                $("#smstestdata").val("{}")
                $("#smsresult").hide();
            }
        });
*/

    },
    reloadMenu:function() {
        // clean up select
        $("#kfMenu a").each(function() {
            $(this).unbind('click');
        });
        $("#kfMenu").empty().append('<dd><a href="#" id="kfe" class="active">Nyt flow</a></dd>');
        // load kontactform for left nav panel
        $.getJSON(urlbase + "kontaktform", function(d) {
            kf.data = d;
            $.each(kf.data, function(k, e) {
                kf.data[k] = JSON.parse(e);
                $("#kfMenu").append('<dd><a href="#" id="kfe' + k + '">' + k + '</a></dd>');
            });
            // add listensers to nav panel
            $("#kfMenu a").each(function() {
                $(this).click(kf.menuListener);
            });
        });

    },
    menuListener:function() {
        $("#kfMenu").find("a.active").removeClass("active");
        $(this).toggleClass("active")
        var k = $(this).text();
        if (k == "Nyt flow") {
            $("#kfnavn").val("");
            $("#kfflow").val("");
            $("#kfmailtpl").val("");
            $("#kfsmstpl").val("");
        } else {
            $("#kfnavn").val(k);
            $("#kfflow").val(kf.data[k]["flow"]);
            $("#kfmailtpl").val(kf.data[k]["mailtpl"]);
            $("#kfsmstpl").val(kf.data[k]["smstpl"]);
        }
    },
    saveKF : function() {
        var savedata = {};
        savedata["name"] = $("#kfnavn").val();
        savedata["kontaktform"] = {};
        savedata["kontaktform"]["flow"] = $("#kfflow option:selected").val();
        savedata["kontaktform"]["mailtpl"] = $("#kfmailtpl option:selected").val();
        savedata["kontaktform"]["smstpl"] = $("#kfsmstpl option:selected").val();
        $.ajax({
            type: 'POST',
            url: urlbase + "kontaktform",
            data: JSON.stringify(savedata),
            contentType: "application/json",
            success: function() {
                $("#kfSaved").show().fadeOut(2000);
                kf.reloadMenu();
            },
            error: function() {
                alert("some error!");
            }

        });
        return false;
    },
    repaintFlowTestsSelect: function(targetId, nyt, value) {
        $.get(urlbase + "loadflowtests", function(data) {
            var flowtests = $("#" + targetId);
            flowtests.empty();
            if (nyt) {
                flowtests.append('<option value="">-- Nyt --</option>');
            }
            $(data).each(function(k, element) {
                flowtests.append('<option value="' + element + '">' + element + '</option>');
            });
            if (value) {
                flowtests.val(value);
            }
        });
    },

    loadTest: function(name) {
        console.log("loader test " + name);
        if (name == "-- Nyt --") {
            $("#testtitle").val("");
            $("#testflow").val("");
            return false;
        }
        $.get(urlbase + "loadflowtest/" + name, function(data) {
            $("#testtitle").attr("value", name);
            $("#testflow").val(data);
        });
    },


    saveTest: function() {

        var filename = $("#testtitle").val();
        var testflow = $("#testflow").val();
        var data = { "filename":filename, "testflow": testflow };
        if (filename == "" || testflow == "" || testflow == "{}") {
            alert("Udfyld navn og indhold på test");
        }
        else {

            console.log("still in flow save test flow " + filename + testflow);

            $.ajax({
                type: "POST",
                accepts: "application/json",
                cache: false,
                contentType: "text/plain",
                url: urlbase + "testflow",
                dataType: "json",
                data: JSON.stringify(data),
                error: function(request, error) {
                    console.log("error testflow ");
                    alert(error);
                },
                success: function(result) {
                    console.log("return save testflow ");

                    kf.repaintFlowTestsSelect("kftests", true);
                    $("#testGemConfirm").show().fadeOut(2000);
                }
            });
            console.log("in flow save test flow ");
        }
        return false;
    }
};
