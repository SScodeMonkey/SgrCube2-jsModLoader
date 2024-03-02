var passageModder = {
	id: "passageModder",
	setup: {
		loaded: false
	},
	update: {
		events: [":passageend", "e:link_pressed", "ready"]
	},
	dependencies: [
		`${parentDir}misc/state.js`,
		`${parentDir}data/passageModder_changes.js`,
	],
	prev_changes: [],
}

passageModder.setup.run = function () {
	return new Promise(resolve => {
		loadScripts(passageModder.dependencies).then(value => {
			for (const key in passageModder.changes) { //construct change map
				let change = passageModder.changes[key];
				if (passageModder.changes_map.hasOwnProperty(change.passage))
					passageModder.changes_map[change.passage].push(key)
				else
					passageModder.changes_map[change.passage] = [key]
			}
			resolve();
		})
	})
}

passageModder.update.run = function (e) {
	//setup vars
	let map = passageModder.changes_map,
		passage = V.passage;

	//reset passageModder.changes.fired
	passageModder.prev_changes.forEach(value => {
		if (passageModder.changes[value]) passageModder.changes[value].fired = false
	});
	passageModder.prev_changes = [];

	//add relevant passageModder.changes
	if (map.hasOwnProperty(passage)) {
		map[passage].forEach(changeKey => {
			let change = passageModder.changes[changeKey];
			if (change.events.includes(e.type) && !change.fired && typeof change.trigger === 'function' ? change.trigger() : true) {
				change.effect();
				change.fired = true;
				passageModder.prev_changes.push(changeKey);
			}
		})
	}
}

passageModder.storyWrapper = function (height = 315) { //use for .class
	let headsignDOM = $('.story .headsign')[0].outerHTML ?? "",
		stBottomDOM = $('.story .storybottom')[0].outerHTML ?? "",
		textContent = $('.story')[0].innerHTML.replace(headsignDOM, "").replace(stBottomDOM, "");
		
	$('.story > :not(.storybottom)').remove();
	$(".story").contents().filter(function () {
		return (this.nodeType == 3);
	}).remove();

	$('.story').append(headsignDOM);

	$('.story').append(`<div class="clearMe scrollWrapper"></div>`);
	$('.scrollWrapper').append(textContent)
	$('.scrollWrapper').append("<br>");
	$('.scrollWrapper').css({
		'height': height,
		'overflow-y': "scroll"
	})
}