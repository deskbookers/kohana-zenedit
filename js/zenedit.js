function zenEdit(editor, mode, lightTheme, darkTheme)
{
	// Public methods
	this.mode = function(mode) {
		return (mode == null ? editor.getSession().getMode().$id.replace('ace/mode/', '') : editor.getSession().setMode('ace/mode/' + mode));
	};

	this.theme = function(theme) {
		return (theme == null ? editor.getTheme().replace('ace/theme/', '') : editor.setTheme('ace/theme/' + theme));
	}

	this.darkTheme = function(theme) {
		if (theme == null)
			return darkTheme;

		if (this.theme() == darkTheme)
			this.theme(theme);
		darkTheme = theme;
	};

	this.lightTheme = function(theme) {
		if (theme == null)
			return lightTheme;
		
		if (this.theme() == lightTheme)
			this.theme(theme);
		lightTheme = theme;
	};

	this.getAce = function() {
		return editor;
	}

	// Default themes and settings
	var editor = ace.edit(editor);
	var lightTheme = lightTheme == null ? 'chrome' : lightTheme;
	var darkTheme = darkTheme == null ? 'monokai' : darkTheme;

	editor.setTheme('ace/theme/' + lightTheme);
	editor.getSession().setMode('ace/mode/' + (mode == null ? 'html' : mode));
	editor.setDisplayIndentGuides(true);                         // Show lines showing indent level
	editor.setShowPrintMargin(false);                            // Disable print margen (verticle line)
	editor.renderer.setVScrollBarAlwaysVisible(true);            // Always show verticle scrollbar
	editor.setOption('scrollPastEnd', true);                     // You can scroll to the end of the file
	editor.getSession().setUseSoftTabs(false);                   // Use real tab \t

	// Add buttons
	var button = document.createElement('button');
	button.setAttribute('type','button');
	button.tabIndex = 200;
	button.className = "zenedit_button fullscreen";
	button.title = "Fullscreen";
	button.onclick = toggleFullscreen;
	editor.container.appendChild(button);

	// Add buttons
	var buttonTheme = document.createElement('button');
	buttonTheme.setAttribute('type','button');
	buttonTheme.tabIndex = 201;
	buttonTheme.className = "zenedit_button theme";
	buttonTheme.title = "Theme";
	buttonTheme.onclick = toggleTheme;
	editor.container.appendChild(buttonTheme);

	document.onkeydown = function(evt) {
		evt = evt || window.event;
		if (evt.keyCode == 27)
			closeFullscreen();
	};

	function closeFullscreen() {
		if ( ! editor.container.className.contains('zenedit_fullscreen'))
			return;
		editor.unsetStyle('zenedit_fullscreen');
		editor.renderer.onResize(true); // Triger resize based on new the new width/height etc
	}

	function openFullscreen() {
		if (editor.container.className.contains('zenedit_fullscreen'))
			return;
		editor.setStyle('zenedit_fullscreen');
		editor.renderer.onResize(true); // Triger resize based on new the new width/height etc
	}

	function toggleFullscreen() {
		return editor.container.className.contains('zenedit_fullscreen') ? closeFullscreen() : openFullscreen();
	}

	function toggleTheme() {
		return (editor.getTheme() == 'ace/theme/' + darkTheme ? editor.setTheme('ace/theme/' + lightTheme) : editor.setTheme('ace/theme/' + darkTheme));
	}
}