quickMod v0.3

new features:
	made all three panels draggable
	added quickActs and quickRoom panels
	added active/inactive modes to the panels
	added reset-position button to all three panel
	added hotkeys to quickNav
	
	COMPLETE reorganisation of setup.js and config.js
		setup.js now loads config.js and modLoader.js
		Module:
			renamed to modLoader,
			turned into class instance (of _modLoader)
			moved to mod/js/modLoader.js
			imports more data from config
		config:
			list of mods now defined in config.js, not setup.js
			miscellaneous variables now properties of config obj 
	
bug fixes:
	irregular tooltip behaviour
	rogue if statement in Module causing CORS error (somehow?)