const parentDir = "mod/js/"; var V, S, oneTimeChange = false;

var Module = {
	setup: {
		import_modules: {
			hotkeys: {
				id: "hotkeys",
				path: `${parentDir}modules/hotkeys.js`,
			},
			passageModder: {
				id: "passageModder",
				path: `${parentDir}modules/passageModder.js`,
			},
		}
	},
	loadScreen: {
		promises: [],
		html: `<div id="loadingScreen"><div>Loading...<div id="bar1"></div><div id="bar2"></div></div></div>`,
		node: null
	},
	updateSugarCube() {
		S = window.SugarCube.State;
		V = S.variables;
		V.passage = S.passage;
		if (!testEnvironment) {
		}
	}
}, modules = [];
Module.setup.run = function () {
	//tooltip and loading screen (too small to bother with promises)
	$('body').append(`<link rel="stylesheet" href="mod/css/loadScreen.css">`)
	$('body').append(Module.loadScreen.html);

	return new Promise(res_setupComplete => {
		//setup variables
		Module.updateSugarCube()

		let scripts = [], moduleArr = [];

		for (const key in Module.setup.import_modules) {
			let file_path = Module.setup.import_modules[key].path,
				file_load = config.includes(key);

			if (file_load) {
				scripts.push(file_path);
				moduleArr.push(key)
			}
		}
		loadScripts(scripts).then(value => {
			moduleArr.forEach(module_key => {
				let module = window[module_key];

				modYes = config.includes(module_key);
				module.enabled = modYes;

				//init
				if (!module.setup.loaded && modYes) {
					Module.loadScreen.promises.push(
						module.setup.run().then(value => {
						})
					);
					module.setup.loaded = true;
					module.enabled = modYes;

					if (!modules.includes(window[module_key]))
						modules.push(window[module_key]);
				}
			})
			res_setupComplete();
		})
	})
}
	/*
		setup: {
			run(),				//init event; must return a promise
			trigger: true,		//should run() trigger
			loaded: false,		//check run() was already executed
			events: ["ready"],	//where run() should be executed
		},
		update: {
			run(){},	//update event
			events: []	//where should run() be executed
		}

		//all events are run on document
	*/

$(document).ready(() => {
	//import config
	$('body').append(`<script src="${parentDir}config.js"></script>`)
	if (!window.hasOwnProperty("setupBlocker")) {
		// remove loading screen
		let clrLoadScreen = Module.loadScreen.promises
		clrLoadScreen.push(Module.setup.run())

		Promise.all(clrLoadScreen).then(values => {
			setTimeout(() => {
				$('#loadingScreen p').text("Complete!")
				setTimeout(() => {
					$('#loadingScreen').fadeOut(500, () => {
						$(this).remove();
						$('#quickNav > div:first-child').fadeIn(300)
					})
				}, 1500)
			}, 750);


			//UPDATES
			let delay = 200;
			setTimeout(function () {
				//update variables
				Module.updateSugarCube()
				for (const key in modules) {
					let module = modules[key],
						update = module.update;

					//update
					update.events.forEach(eType => {
						if (eType != "ready") {
							$(document).on(eType, function (e) {
								setTimeout(() => {
									Module.updateSugarCube();
									module.update.run(e);
								}, delay)
							})
						}
						else {
							module.update.run({ type: "ready" });
						}
					})
				}
			}, delay);
		})
	}
})


function loadScripts(scripts) {
	let scriptsLoaded = 0,
		check = 0;

	scripts.forEach(scriptPath => {
		if (!$(`script[src="${scriptPath}"]`)[0]) {
			let script = document.createElement("script");
			check++;
			script.src = `${scriptPath}`
			script.addEventListener('load', () => {
				scriptsLoaded++;
				//console.log(`loaded ${scriptPath}`);
			});
			document.body.appendChild(script);
		}
	})

	return new Promise(loadedAll => {
		let checkInterval = setInterval(() => {
			if (scriptsLoaded == check) {
				loadedAll();
				clearInterval(checkInterval)
			}
		}, 50)
	})
}
function cs(text) {
	console.log(text)
}

