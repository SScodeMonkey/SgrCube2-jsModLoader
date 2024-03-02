var config = {
	loaded: [ //disable module by commenting out its name in the array (comments in js are //)
		"hotkeys",
		"passageModder"
	],
	loadingScreen: {
		code: `<div id="loadingScreen"><div>Loading...<div id="bar1"></div><div id="bar2"></div></div></div>`,
		minTime: 1500,
		skip: false
	},
	testEnvironment: false,
	setupInit: true,
	maxTraining: 2,
}

var mods = {
	hotkeys: {
		id: "hotkeys",
		path: `${parentDir}modules/hotkeys.js`,
	},
	passageModder: {
		id: "passageModder",
		path: `${parentDir}modules/passageModder.js`,
	},
}
