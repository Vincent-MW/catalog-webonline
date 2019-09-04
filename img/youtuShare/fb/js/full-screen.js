function callFullScreen() {
	var docElm = document.documentElement;
	//W3C    
	if(docElm.requestFullscreen) {
		docElm.requestFullscreen();
	}
	//FireFox    
	else if(docElm.mozRequestFullScreen) {
		docElm.mozRequestFullScreen();
	}
	//Chrome等    
	else if(docElm.webkitRequestFullScreen) {
		docElm.webkitRequestFullScreen();
	}
	//IE11
	else if(docElm.msRequestFullscreen) {
		docElm.msRequestFullscreen();
	}
}

function callExitFullScreen() {
	if(document.exitFullscreen) {
		document.exitFullscreen();
	} else if(document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if(document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
	} else if(document.msExitFullscreen) {
		document.msExitFullscreen();
	}
}