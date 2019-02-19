// handle storing logs in local storage
var logger = function(msg) {
//	console.log("Got message: ", msg.data);
	if (msg.data.action === "store") {
		browser.storage.local.get("consoleTap").then(function(content){
			if (!content["consoleTap"]) {
				content["consoleTap"] = [];
			}
			content["consoleTap"].push({
				"timestamp": msg.data.timestamp,
				"type": msg.data.type,
				"message": msg.data.data,
				"url": msg.source.location.href
			});
			browser.storage.local.set(content);
		}, function(error){
			browser.storage.local.set({"consoleTap": []});
		});
	}
	else if (msg.data.action === "dump") {
		browser.storage.local.get("consoleTap").then(function(content){
			// drop old dump
			let old = document.getElementById("WebConsoleTapDump");
			if (old) {
				old.remove();
			}
			// create new element
			var s = document.createElement('input');
			s.id = "WebConsoleTapDump";
			s.type = "hidden";
			s.value = JSON.stringify(content["consoleTap"] || []);
			s.onload = function() {
				this.remove();
			};
			(document.head || document.documentElement).appendChild(s);
			// finally clear the local storage after we dump the contents
			browser.storage.local.remove("consoleTap");
		});
	}
	else {
		console.error("Unsupported action received: ", msg.data)
	}
};
window.addEventListener("message", logger, false);
