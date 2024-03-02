var hotkeys = {
	id: "hotkeys",
	setup: {
		loaded: false
	},
	update: {
		events: ["ready", ":passageend", "e:link_pressed"]
	},
	dependencies: [
		`${parentDir}misc/state.js`,
		`${parentDir}misc/position.js`
	],
	links: [],
	can_trigger: true, //to prevent accidental hotkey spam
	cooldown(time = 10) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(true);
			}, time)
		});
	}
}

hotkeys.setup.run = function () { //setup event listeners
	return new Promise(resolve => {
		var num_arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
		var input_text_arr = ['text', 'password', 'number', 'email', 'tel', 'url', 'search', 'date', 'datetime', 'datetime-local', 'time', 'month', 'week']
		function tcd(){
			hotkeys.cooldown().then((value) => { hotkeys.can_trigger = value });
		}
		document.addEventListener('keydown', function(event){
			if (!(document.activeElement.tagName == 'INPUT' || input_text_arr.includes(document.activeElement.type))){
				if (hotkeys.can_trigger){
					hotkeys.can_trigger = false
				
					if (num_arr.includes(event.key)){
						if(event.key-1 < hotkeys.links.length){
							$(hotkeys.links[event.key-1]).trigger("click");
							tcd();
						}
						else hotkeys.can_trigger = true
					}
					else {
						switch(event.key){
							case '`':
								addHours(-1);
								tcd(); break;
						
							case 's':
								V.stampoints += 20;
								$('#shorizontalhealthbar').css('width', `${V.stampoints/V.masterstamina*100}%`);
								$('#shorizontalhealthbar').attr('title', `${V.stampoints}/${V.masterstamina} Stamina Points`)
								tcd(); break;
							
							case 'q': //quick navigation
								$('#quickNav > div:first-of-type').trigger("click");
								tcd(); break;
						
							default:
								hotkeys.can_trigger = true
								break;
						}
					}
				}
			}
		})

		resolve();
	})
}
hotkeys.update.run = function (e) {
	//RESET
	hotkeys.links = []

	//create hotkeys.links
	let last_tag = 1;
	$("#story a.link-internal:not(:hidden)").toArray().forEach((link, i) => {
		let passageTrigger = ["Home", "Home1", "Home2"].includes(V.passage), //for .link-image buttons (don't want to trigger on overworld)
			buttonTrigger = $(link).css('background-color') == "rgba(114, 0, 0, 0.1)" || $(link).hasClass('link-image') && passageTrigger,
			exceptionsTrigger = $(link).parents().hasClass("alt4")

		if (buttonTrigger && !exceptionsTrigger) {
			if ($(link).find('p.hotkey_tag')[0]) $(link).find('p.hotkey_tag').remove()
			hotkeys.createTag(link, last_tag)
			hotkeys.links.push(link);
			last_tag++;

			$(link).on('click', function () {
				const link_pressed_e = new CustomEvent("e:link_pressed", {
					detail: {
						"html": link.innerHTML,
						//"content": txt.length ? txt : link.find('img').length ? link.find('img').attr('src') : ""
					}
				});
				document.dispatchEvent(link_pressed_e);
			})
		}
	})
	hotkeys.can_trigger = true
}
hotkeys.createTag = function(node, tagValue){
	let position = {
		x: Math.round(getOffset(node).left),
		y: Math.round(getOffset(node).right),
	}

	$(node).prepend(`<p class="hotkey_tag">[${tagValue}]</p>`);
	$(node).css({ 'position': 'relative' });
	$(node).find('img').css({ 'z-index': 1 });
	$(node).find('p').offset({ left: position.x, top: position.y })
}