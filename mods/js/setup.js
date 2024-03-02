const parentDir = "mods/js/"; var V, S, modules=[], modLoader;
function loadScripts(_scripts) {
	return new Promise(loadedAll => {
		let scriptsLoaded = 0,
			scripts;

		loadPromises = [];

		if (typeof _scripts == "string") scripts = [_scripts]
		else if (Array.isArray(_scripts)) scripts = _scripts
		else {
			console.log("ERROR")
			loadedAll();
		}

		scripts.forEach(scriptPath => {
			if (!$(`script[src="${scriptPath}"]`)[0]) { //no safety check for wrong script dir, so be careful
				loadPromises.push(new Promise(resolve => {
					let script = document.createElement("script");
					script.src = `${scriptPath}`
					script.addEventListener('load', () => {
						scriptsLoaded++;
						resolve();
					});
					document.body.appendChild(script);
				}));
			}
		})
	
		let checkInterval = setInterval(() => {
			Promise.all(loadPromises).then(value => {
				loadedAll();
				clearInterval(checkInterval)
			})
		}, 50)
	})
}
function cs(text) {
	console.log(text)
}

$(document).ready(() => {
	loadScripts([
		`${parentDir}config.js`,
		`${parentDir}modLoader.js`,
	]).then(value => {
		modLoader = new _modLoader();
		modLoader.setup().then(value => {
			//loading screen
			let animationTime = !config.loadingScreen.skip ? config.loadingScreen.minTime : 0

			setTimeout(() => {
				$('#loadingScreen p').text("Complete!")
				setTimeout(() => {
					$('#loadingScreen').fadeOut(500, () => {
						$('#loadingScreen').remove();
						$('#quickNav > div:first-child').fadeIn(300)
					})
				}, animationTime * 2 / 3)
			}, animationTime / 3);

			//UPDATES
			let delay = 200;
			setTimeout(function () {
				//update variables
				for (const key in modules) {
					let module = modules[key],
						update = module.update;

					//update
					update.events.forEach(eType => {
						if (eType != "ready") {
							$(document).on(eType, function (e) {
								setTimeout(() => {
									modLoader.updateSugarCube();
									module.update.run(e);
								}, delay)
							})
						}
						else {
							setTimeout(() => {
								module.update.run({ type: "ready" });
							}, delay)
						}
					})
				}
			}, delay);
		})
	})
})