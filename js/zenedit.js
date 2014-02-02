/* Requires: //cdnjs.cloudflare.com/ajax/libs/ace/1.1.01/ace.js */

function zenEdit(editor, mode, lightTheme, darkTheme)
{
	// Public methods
	this.mode = function(mode) {
		return (mode == null ? editor.getSession().getMode().$id.replace('ace/mode/', '') : editor.getSession().setMode('ace/mode/' + mode));
	};

	this.theme = function(theme) {
		return (theme == null ? editor.getTheme().replace('ace/theme/', '') : editor.setTheme('ace/theme/' + theme));
	};

	this.darkTheme = function(theme) {
		if (theme == null)
			return darkTheme;

		if (this.theme() == darkTheme)
			this.theme(theme);
		darkTheme = theme;
		saveTheme();
	};

	this.lightTheme = function(theme) {
		if (theme == null)
			return lightTheme;
		
		if (this.theme() == lightTheme)
			this.theme(theme);
		lightTheme = theme;
		saveTheme();
	};

	this.getAce = function() {
		return editor;
	};

	// When ever we want to make a textarea into an editor we have to some funky stuff, so do that!
	// Check if we have to insert a special div
	var originalEditor = null;
	if (typeof editor == 'string')
		originalEditor = document.getElementById(editor);
	if(typeof editor == 'object')
		originalEditor = editor;
	
	// Replace textarea for a div and hide the textarea
	if (originalEditor != null && originalEditor.tagName.toLowerCase() == 'textarea')
	{
		// Create our replacement div
		var div = document.createElement('div');
		div.id = editor = 'zeneditor';
		div.style.height = originalEditor.offsetHeight + 'px';
		div.style.width = originalEditor.offsetWidth + 'px';
		div.innerHTML = originalEditor.innerHTML;

		// Hide the old one and insert it before the old one
		originalEditor.style.display = 'none';
		originalEditor.parentNode.insertBefore(div, originalEditor);

		// Setup an event listener for when the form is getting submitted so we can update the original textarea
		var form = closest(originalEditor, 'form');
		if (form.addEventListener) {
			form.addEventListener('submit', function(){originalEditor.innerHTML = editor.getValue();}, false);
		} else if (form.attachEvent) {
			form.attachEvent('onsubmit', function(){originalEditor.innerHTML = editor.getValue();});
		}
	}

	// Defaults and settings
	var oldHtmlOverflow = document.body.parentNode.style.overflow;
	var editor = ace.edit(editor);
	var lightTheme = lightTheme == null ? 'chrome' : lightTheme;
	var darkTheme = darkTheme == null ? 'monokai' : darkTheme;
	var cookieTheme = getCookie('zenedit_theme');
	editor.setTheme('ace/theme/' + (cookieTheme == null ? lightTheme : (cookieTheme == 'dark' ? darkTheme : lightTheme)));
	editor.getSession().setMode('ace/mode/' + (mode == null ? 'html' : mode));
	editor.setDisplayIndentGuides(true);                         // Show lines showing indent level
	editor.setShowPrintMargin(false);                            // Disable print margin (vertical line)
	editor.setOption('scrollPastEnd', true);                     // You can scroll to the end of the file
	editor.getSession().setUseSoftTabs(false);                   // Use real tab \t
	editor.getSession().setTabSize(4);                           // Default tab size

	// Update cookie expiration
	saveTheme();

	// Create simple system to move the editor around in DOM for fullscreen and normal screen
	var placeholder = document.createElement('div');
	placeholder.style.display = 'none';
	editor.container.parentNode.insertBefore(placeholder, editor.container);

	// Add buttons
	var button = document.createElement('button');
	button.setAttribute('type','button');
	button.tabIndex = 200;
	button.className = 'zenedit_button fullscreen';
	button.title = 'Fullscreen';
	button.onclick = toggleFullscreen;
	editor.container.appendChild(button);

	// Add buttons
	var buttonTheme = document.createElement('button');
	buttonTheme.setAttribute('type','button');
	buttonTheme.tabIndex = 201;
	buttonTheme.className = 'zenedit_button theme';
	buttonTheme.title = 'Theme';
	buttonTheme.onclick = toggleTheme;
	editor.container.appendChild(buttonTheme);

	document.onkeydown = function(evt) {
		evt = evt || window.event;
		if (evt.keyCode == 27)
			closeFullscreen();
	};

	function closest(el, tagName) {
		tagName = tagName.toLowerCase();
		do {
			el = el.parentNode;
			if (el.tagName.toLowerCase() == tagName)
				return el;
		} while (el.parentNode);
		return null;
	}

	function closeFullscreen() {
		if ( ! editor.container.className.contains('zenedit_fullscreen'))
			return;
		placeholder.parentNode.insertBefore(editor.container, placeholder); // Move the editor to the body DOM
		document.body.parentNode.style.overflow = oldHtmlOverflow; // Reset the main scrollbar
		editor.unsetStyle('zenedit_fullscreen');
		editor.renderer.onResize(true); // Trigger resize, so Ace can grab the new width/height settings etc
	}

	function openFullscreen() {
		if (editor.container.className.contains('zenedit_fullscreen'))
			return;
		document.body.appendChild(editor.container); // Move the editor to the body DOM
		document.body.parentNode.style.overflow = 'hidden'; // Hide the main scrollbar
		editor.setStyle('zenedit_fullscreen');
		editor.renderer.onResize(true); // Trigger resize, so Ace can grab the new width/height settings etc
		editor.focus();
	}

	function toggleFullscreen() {
		return editor.container.className.contains('zenedit_fullscreen') ? closeFullscreen() : openFullscreen();
	}

	function toggleTheme() {
		var result = (editor.getTheme() == 'ace/theme/' + darkTheme ? editor.setTheme('ace/theme/' + lightTheme) : editor.setTheme('ace/theme/' + darkTheme));
		saveTheme();
		return result;
	}

	function getCookie(name) {
		var cookies = document.cookie.split(';');
		for(var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var keyvalue = cookie.split('=');
			if (keyvalue[0] == name)
				return keyvalue[1];
		}
		return null;
	}

	function saveTheme() {
		var date = new Date();
		date.setTime(date.getTime() + (7*24*60*60*1000));
		document.cookie = 'zenedit_theme='+(editor.getTheme() == 'ace/theme/' + darkTheme ? 'dark' : 'light')+'; expires=' + date.toGMTString()+'; path=/';
	}
}