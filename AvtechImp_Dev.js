// ==UserScript==
// @name          Avtech Improvements
// @namespace     http://klogzoog.com/
// @version       0.6.9.2
// @description   Avtech Dispatch Featured Unit Search and Flight Details
// @match         https://avtc.avtechcloud.com/
// @include       http://avtc.avtechcloud.com/*
// @include       https://avtc.avtechcloud.*/* 
// @copyright     2014, klogzoog
// @run-at        document-end
// @updateURL     https://raw.githubusercontent.com/klogzoog/AvtechImp/master/AvtechImp_Dev.js
// @require       https://jquery-timer.googlecode.com/svn/trunk/jquery.timer.js
// @require       http://swip.codylindley.com/jquery.popupWindow.js
// ==/UserScript==

$(function(){
    var dataa;
    var Enpressed = 0;
    form = '<div class="header-button-right"><span id="infov"></span><input placeholder="please wait..." type="text" id="unitSearch" value=""> | </div>';
    inActform = '<div class="header-button-right"><span id="infov"></span><input placeholder="please wait..." type="text" id="inActSearch" value=""></div>';
    // $("#dispatchInprogressCallsHeader").find(".dispatch-calls-close").after(form);
    header = $("#dispatchActiveEmployeesHeader");
    //header = $(".notifications");
    inActheader = $("#dispatchInactiveEmployeesHeader");
    
    header.append(form);
    inActheader.append(inActform);
    $("#infov").html("<small>Press + to begin: </small>");
    var clksel;
    $("#dispatchActiveEmployeeDetailGrid").mouseenter(function(){
        clksel = "#dispatchActiveEmployeeDetailGrid .k-grid-content .k-selectable tbody tr td";
    });
    $(clksel).click(function(){
        
        //console.log("click");
    });
    var fltdata, flight, l;
    <!--var timer = $.timer(function(){
        var x;
        if (avtc.dispatchState.dispatchActiveEmployeeCallDetailGrid._data !== undefined){
            l = avtc.dispatchState.dispatchActiveEmployeeCallDetailGrid._data.length;
        } else {
            //console.log("no data found");
        }
        
        var o = l;
        
        //$("#dispatchActiveEmployeeDetailGrid .k-grid-content .k-selectable colgroup").append("<col style='width:190px'>");
        
        for (i = 0; i < o; i++){
            
            
            var fa = avtc.dispatchState.dispatchActiveEmployeeCallDetailGrid._data[i].FlightNumber;
            var EmpdetailGrid = "#dispatchActiveEmployeeDetailGrid .k-grid-content .k-selectable tbody tr:eq("+i+") td:eq(1)";
            
            $(EmpdetailGrid).html('<a data-q="'+i+'" id="flfind">'+fa+'</a>');
            $(EmpdetailGrid).css('cursor','pointer');
            
            
            
            $("#flfind[data-q='"+i+"']").on('click', {el:i}, function(v){
                
                //console.log(v.data.el);
                e = v.data.el;
                a = avtc.dispatchState.dispatchActiveEmployeeCallDetailGrid._data[e].CallTime;
                r = avtc.dispatchState.dispatchActiveEmployeeCallDetailGrid._data[e].RequirementName;
                d = new Date(a);
                t = d.getTime();
                f = avtc.dispatchState.dispatchActiveEmployeeCallDetailGrid._data[e].FlightNumber;
                //console.log("Flight No# " + avtc.dispatchState.dispatchActiveEmployeeCallDetailGrid._data[e].FlightNumber);
                //console.log("Time : " + t);
                searchInCalls(f,t,r);
            });
        }
        
    });
    
    timer.set({ time : 1000, autostart : true });
    -->
    
    
    function searchInCalls(f, t, r){
        var s, o , k;
        var openDepCalls = avtc.dispatchState.openDepartureCallsGrid;
        var openArrCalls = avtc.dispatchState.openCallsGrid;
        var futureCalls = avtc.dispatchState.futureCallsGrid;
        var inprogCalls = avtc.dispatchState.inprogressCallsGrid;
        
        var openDepdata = $.grep(openDepCalls._data, function(v){
            d = new Date(v.Time);
            ta = d.getTime();
            return (ta == t && v.FlightNumber == f && v.Requirement == r);
        });
        var openArrdata = $.grep(openArrCalls._data, function(v){
            d = new Date(v.Time);
            ta = d.getTime();
            return (ta == t && v.FlightNumber == f && v.Requirement == r);
        });
        var inprogdata = $.grep(inprogCalls._data, function(v){
            d = new Date(v.Time);
            ta = d.getTime();
            return (ta == t && v.FlightNumber == f && v.Requirement == r);
        });
        var futuredata = $.grep(futureCalls._data, function(v){
            d = new Date(v.Time);
            ta = d.getTime();
            return (ta == t && v.FlightNumber == f && v.Requirement == r);
        });
        
        if (openDepdata.length !== 0) {
            s = 0; o = openDepdata; k = openDepCalls;
        } else if (openArrdata.length !== 0) {
            s = 0; o = openArrdata; k = openArrCalls;
        } else if (inprogdata.length !== 0) {
            s = 1; o = inprogdata; k = inprogCalls;
        } else if (futuredata.length !== 0) {
            s = 2; o = futuredata; k = futureCalls;
        } else {s = 3}
        
        var str = k._cellId;
        var stra = str.slice(0,-12);
        
        $.each(o, function(key, value){
            
            var kuid = " .k-selectable tbody tr[data-uid='" + value.uid +"']";
            var buid = "#"+ stra +" .k-grid-content";
            
            var tabStrip = "#dispatchCalls #callsTabList li:eq("+s+")";
            
            $(tabStrip).click();
            $(buid+kuid+" td").mousedown();
            $(buid+kuid+" td").mouseup();
            $(buid+kuid+" td").trigger("click");
            $(buid).scrollTo(kuid, 0);
            $(buid+kuid).addClass("k-state-selected");
            
        });
    }
    /**  setTimeout(function(){
                        
                        $("#flfind").click(function(){
                            f = $("input")  
                        })
                        d = new Date(avtc.dispatchState.dispatchActiveEmployeeCallDetailGrid._data[0].CallTime);
                        t = d.getTime();
                        console.log("Flight No# " + avtc.dispatchState.dispatchActiveEmployeeCallDetailGrid._data[0].FlightNumber);
                        console.log("Time : " + t);
                    }, 1000);**/
    
    
    //$("#unitSearch").val("Unit#?");
    
    //while ($(selectorval).length == 0) {
    selectorval = "#callsInProgressGrid .k-grid-content .k-selectable tbody tr:eq(0)";
    
    
    // Check Flight from klogzoog website
    $("#futureInfo").html('<button hidden="hidden" class="example4demo">\></button>');
    
    function openwindow(){
        var a = avtc.dispatchState.dispatchDetailListView.dataSource._view[0].DepartureFlightName;
        var b = avtc.dispatchState.dispatchDetailListView.dataSource._view[0].ArrivalFlightName;
        var c = avtc.dispatchState.dispatchDetailListView.dataSource._view[0].DepartureFlightNumber;
        var d = avtc.dispatchState.dispatchDetailListView.dataSource._view[0].ArrivalFlightNumber;
        var g = avtc.dispatchState.dispatchDetailListView.dataSource._view[0].IsArriving;
        var e, f, x, y;
        if (g == true) {x = b; y = d} else if (g == false) {x = a; y = c} else {};
        var fltName = x.slice(0,2);
        var fltNum = y
        $(".example4demo").popupWindow({ 
            windowURL:'http://klogzoog.com/flights/?a='+fltName+'&f='+fltNum+'&t='+g,
            witdh : '200',
            height: '200',
            windowName:'klogz',
            //centerScreen:1
        });
        $(".example4demo").click();
    }
    
    function selectSearch(v){
        var actEmp = avtc.dispatchState.activeEmployeesGrid;
        var searchTerm = v;
        if (searchTerm){
            var search = new RegExp(searchTerm , "i");
            $("#unitSearch").blur();
            var arr = $.grep(actEmp._data, function(value) {
                return search.test(value.Name);
            });
            
            
            if (actEmp._data.length === 0){$("#infov").text("Did not find any..");}
            
            
            $.each(arr, function(key, value){
                var kuid = " .k-selectable tbody tr[data-uid='" + value.uid +"']";
                var buid = "#activeEmployeesGrid .k-grid-content";
                if (arr.length == 1){
                    $(buid+kuid+" td").mousedown();
                    $(buid+kuid+" td").mouseup();
                    $(buid+kuid+" td").click();
                    
                    console.log(value.uid);
                    console.log(kuid[0]);
                } else if (arr.length > 1){
                    e = 1;
                    $("#infov").html("<small>(press the + for next)  </small>" + e + " / "+ arr.length );
                }
                    $(buid).scrollTo(kuid, 10);
                $(buid+kuid).addClass("k-state-selected");
                console.log(arr.length);
            });
        } 
    }
    function selectInActSearch(v){
        var actEmp = avtc.dispatchState.inactiveEmployeesGrid;
        var searchTerm = v;
        if (searchTerm){
            var search = new RegExp(searchTerm , "i");
            $("#inActSearch").blur();
            var arr = $.grep(actEmp._data, function(value) {
                return search.test(value.Name);
            });
            
            
            if (actEmp._data.length === 0){$("#infov").text("Did not find any..");}
            
            
            $.each(arr, function(key, value){
                var kuid = " .k-selectable tbody tr[data-uid='" + value.uid +"']";
                var buid = "#inactiveEmployeesGrid .k-grid-content";
                if (arr.length == 1){
                    $(buid+kuid+" td").mousedown();
                    $(buid+kuid+" td").mouseup();
                    $(buid+kuid+" td").click();
                    
                    //console.log(value.uid);
                    //console.log(kuid[0]);
                } else if (arr.length > 1){
                    e = 1;
                    $("#infov").html("<small>(press the + for next)  </small>" + e + " / "+ arr.length );
                }
                    $(buid).scrollTo(kuid, 10);
                $(buid+kuid).addClass("k-state-selected");
                //console.log(arr.length);
            });
        } 
    }
    
    
    $("#unitSearch").focus(function(){
        // Select input field contents
        this.select();
        //$("#unitSearch").val("");
        $("#infov").html("<small></small>");
    });
    $("#inActSearch").focus(function(){
        
        this.select();
        
        $("#infov").html("<small></small>");
    });
    
    // refresh unit search by 1 hr
    var refUnitSearch = $.timer(function(){
        start();
        var autocomplete = $("#unitSearch").data("kendoAutoComplete");
        autocomplete.refresh();
    });
    
    
    setTimeout(function () {
        start();
        startUnitSearch();
        refUnitSearch.set({ time : 3600000, autostart : true }); //3600000
    }, 4000);
    
    var name = [];
    var inActname = []; 
    
    function start() {

        dataa = avtc.dispatchState.activeEmployeesGrid;
        datau = avtc.dispatchState.inactiveEmployeesGrid;
        
        var namedata = $.grep(dataa._data, function(value) {
            return (value.Name);
        });
        $.each(namedata, function(key, value){
            name.push(value.Name);
        });
        
        
        var inActnamedata = $.grep(datau._data, function(value) {
            return (value.Name);
        });
        $.each(inActnamedata, function(key, value){
            inActname.push(value.Name);
        });
        
        name.sort();
        
    }
    
    function startUnitSearch (){
        
        $("#unitSearch").kendoAutoComplete({
            dataSource: name,
            filter: "startswith",
            placeholder: "Search Unit...",
            highlightFirst: false,
            suggest: true,
            select: function(e){
                var searchTerm = e.item.text();
                selectSearch(searchTerm);
            },
        });
        
        $("#inActSearch").kendoAutoComplete({
            dataSource: inActname,
            filter: "contains",
            placeholder: "Search Unit...",
            highlightFirst: false,
            suggest: true,
            select: function(e){
                var searchTerm = e.item.text();
                selectInActSearch(searchTerm);
            },
        });
    };
    
    /**
    $("#unitSearch").focusout(function(){
        // 
        console.log("not focus");
        Enpressed = 0;
    });
    */
    $(document).keyup(function(p) {
        if (p.keyCode == 27) { //stop if press escape (27)
            timer.stop();
            e = 0;
            $("#unitSearch").prop('disabled', false);
            $("#unitSearch").val("");
        }});
    $(window).keyup(function(p){
        if ( p.which == 107 ) {
            $("#unitSearch").focus();
            $("#inActSearch").focus()
            dataa = avtc.dispatchState.activeEmployeesGrid;
        } else if ( p.which == 192 ){
            openwindow();
        }});
    
    
    $("#unitSearch").keyup(function(p){
        if ( p.which == 13 ) {
            var searchTerm = $("#unitSearch").val(); // search term
            selectSearch(searchTerm);
        }});
    
    $("#inActSearch").keyup(function(p){
        if ( p.which == 13 ) {
            var searchTerm = $("#inActSearch").val(); // search term
            selectInActSearch(searchTerm);
        }});
    
    
});
