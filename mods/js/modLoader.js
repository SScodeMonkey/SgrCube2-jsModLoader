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

class _modLoader {
	constructor() {
		this.import_modules = {}
		config.loaded.forEach(modKey => {
			let module = mods[modKey];
			if (!this.import_modules.hasOwnProperty(modKey))
				this.import_modules[modKey] = module;
		})
		this.loadingScreen = config.loadingScreen
		this.loadingScreen.promises = [];
	}
	updateSugarCube() {
		S = window.SugarCube.State;
		V = S.variables;
		V.passage = S.passage;
	}
	setup() {
		//tooltip and loading screen (too small to bother with promises)
		$('body').append(`<link rel="stylesheet" href="mod/css/loadingScreen.css">`)
		$('body').append(this.loadingScreen.code);

		return new Promise(res_setupComplete => {
			//setup variables
			this.updateSugarCube()

			let scripts = [], moduleArr = [];

			for (const key in this.import_modules) {
				let file_path = this.import_modules[key].path,
					file_load = config.loaded.includes(key);

				if (file_load) {
					scripts.push(file_path);
					moduleArr.push(key)
				}
			}
			loadScripts(scripts).then(value => {
				moduleArr.forEach(module_key => {
					let module = window[module_key];

					let modYes = config.loaded.includes(module_key);
					module.enabled = modYes;

					//init
					if (!module.setup.loaded && modYes) {
						let moduleInit = module.setup.run()
						moduleInit.then(value => {
							this.loadingScreen.promises.push(moduleInit)
							module.setup.loaded = true;
							module.enabled = modYes;
							if (!modules.includes(window[module_key]))
								modules.push(window[module_key]);
						})
					}
				})

				let checkInterval = setInterval(() => {
					if (this.loadingScreen.promises.length == moduleArr.length) {
						Promise.all(this.loadingScreen.promises).then(value => {
							res_setupComplete();
						})
						clearInterval(checkInterval)
					}
				}, 10)
			})
		})
	}
}