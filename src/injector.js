// Inject our Console Tap into the page
var initialize = function(){
	var s = document.createElement('script');
	s.src = chrome.extension.getURL('consoletap.js');
	s.onload = function() {
		this.remove();
	};
	(document.head || document.documentElement).appendChild(s);
};

// Run the init
initialize();
