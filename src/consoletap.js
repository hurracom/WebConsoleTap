// Source: https://github.com/sunnykgupta/jsLogger

let getTimeStamp = function(){
	let now = new Date();
	// copy/pasted from stack
	let date = now.getFullYear() + "-" + (((now.getMonth()+1) < 10)?"0":"") + (now.getMonth()+1) + "-" +  ((now.getDate() < 10)?"0":"") + now.getDate();
    let time = ((now.getHours() < 10)?"0":"") + now.getHours() +":"+ ((now.getMinutes() < 10)?"0":"") + now.getMinutes() +":"+ ((now.getSeconds() < 10)?"0":"") + now.getSeconds() + "." + ((now.getMilliseconds() < 100)?((now.getMilliseconds() < 10)?"00":"0"):"") + now.getMilliseconds();
    return date + " " + time;
};

window.console = (function (origConsole) {

    if (!window.console || !origConsole) {
        origConsole = {};
    }

    var isDebug = true, isSaveLog = true;

    return {
        log: function () {
            isDebug && origConsole.log && origConsole.log.apply(origConsole, arguments);
            this.addLog(arguments, "LOG");
        },
        warn: function () {
            isDebug && origConsole.warn && origConsole.warn.apply(origConsole, arguments);
            this.addLog(arguments, "WARN");
        },
        error: function () {
            isDebug && origConsole.error && origConsole.error.apply(origConsole, arguments);
            this.addLog(arguments, "ERROR");
        },
        info: function () {
            isDebug && origConsole.info && origConsole.info.apply(origConsole, arguments);
            this.addLog(arguments, "INFO");
        },
        debug: function (bool) {
            isDebug = bool;
        },
        saveLog: function (bool) {
            isSaveLog = bool;
        },
        addLog: function (args, array) {
            if (!isSaveLog) {
                return;
            }
            // copy the content from the "Array-like" object into a real array, so it can be cloned properly
            argCopy = [];
            for (let i = 0; i < args.length; i++){
            	argCopy.push(args[i]);
            }
            try {
	            window.postMessage({
	                "action": "store",
	                "type": (array || "logs"),
	                "data": argCopy,
	                "timestamp": getTimeStamp()
	            }, "*");
            }
            catch(err) {
	            window.postMessage({
	                "action": "store",
	                "type": (array || "logs"),
	                "data": ["Error while serializing object: " + err],
	                "timestamp": getTimeStamp()
	            }, "*");
            }
        },
        requestDump: function () {
            window.postMessage({"action": "dump"}, "*");
        },
        getDump: function () {
            let dumpEl = document.getElementById("WebConsoleTapDump");
            return dumpEl ? dumpEl.value : undefined;
        }
    };

}(window.console));
