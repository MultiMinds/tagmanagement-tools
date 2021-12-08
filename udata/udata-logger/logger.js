(function(){
    var CHECK_UDATA_INTERVAL = 300;
    var MANUAL_CHECK_UDATA_INTERVAL = 300;
    var MANUAL_CHECK_TIMEOUT = 3000;

    var isIframe = window.location !== window.parent.location;
    var timer = 0;
    var manualIndex = 0;
    checkUdata();

    function checkUdata(){
        if(timer > MANUAL_CHECK_TIMEOUT){
            initManualUdataReader();
        }else if(window.udata && udata.addListener){
            initListener();
        }else{
            timer += CHECK_UDATA_INTERVAL;
            setTimeout(checkUdata, CHECK_UDATA_INTERVAL);
        }
    }

    function initListener(){
        udata.addListener(function(ev){
            logEvent(udata[udata.modifiedEvents.indexOf(ev)]);
        });
    }

    function initManualUdataReader(){
        if(window.udata){
            debugLog("[Udata Debugger] Udata library not loaded")
            checkUdataManualForNewEvents();
        }
    }

    function checkUdataManualForNewEvents(){
        for(var i=manualIndex; i<udata.length; i++, manualIndex++){
            logEvent(udata[i], "udata library not loaded");
        }
        setTimeout(checkUdataManualForNewEvents, MANUAL_CHECK_UDATA_INTERVAL);
    }

    function logEvent(event, prefix){
        // (prefix) udata (iframe) <event name> <Event Object>
        var log = [
            prefix ? "(" + prefix + ")" : "",
            "udata",
            event.event_name
        ];
        debugLog(log.join(" "), event);
    }

    function debugLog(message){
        var args = [];
        var iframePlugin = isIframe ? "(iframe)" : "";
        args[0] = "%c[Udata Debugger" + iframePlugin + "]:::%c " + message;
        args[1] = isIframe ? "background-color:#bdbd42;color:white" : "background-color:#74ad36;color:white";
        args[2] = "";
        args = args.concat(Array.prototype.slice.call(arguments, 1));
        console.log.apply(this, args);
    }
})();