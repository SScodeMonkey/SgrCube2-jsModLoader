var hotkeys = {
	id: "hotkeys",
	setup: {
		loaded: false
	},
	update: {
		events: ["ready", ":passagedisplay", "e:link_pressed"]
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

const validLink = function(link){
	return $(link).css('background-color') == "rgba(114, 0, 0, 0.1)" || $(link).hasClass('link-image')
}

hotkeys.setup.run = function () { //setup event listeners
	return new Promise(resolve => {
		var num_arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
		var input_text_arr = ['text', 'password', 'number', 'email', 'tel', 'url', 'search', 'date', 'datetime', 'datetime-local', 'time', 'month', 'week']
		function tcd(){
			hotkeys.cooldown().then((value) => { hotkeys.can_trigger = value });
		}
		document.addEventListener('keydown', function(event){ //TODO: make it pull hotkeys and functions from a dictionary and store it in data
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
hotkeys.update.run = function(e){
	//RESET
	hotkeys.links = []

	//create hotkeys.links
	let last_tag = 1;
	$("#story a.link-internal:not(:hidden)").toArray().forEach((link, i) => {
		if (validLink(link)){
			if ($(link).find('p.hotkey_tag')[0]) $(link).find('p.hotkey_tag').remove()
				let position = {
					x: Math.round(getOffset(link).left),
					y: Math.round(getOffset(link).right),
				}
					
				$(link).prepend(`<p class="hotkey_tag">[${last_tag}]</p>`);
				$(link).css({ 'position': 'relative' });
				$(link).find('img').css({ 'z-index': 1 });
				$(link).find('p').css({
					'font-size':	'9px',
					'font-weigth':	'normal',
					'color':		'white',
					'z-index':		2,
					'margin':		0,
					'padding':		1,
					'background':	'rgba(0, 0, 0, 0.6)',
					'border-radius':'10%',
					'width':		12,
					
					'position': 'absolute',
				});
				$(link).find('p').offset({left: position.x, top: position.y})
				
			hotkeys.links.push(link);
			last_tag++;
			
			$(link).on('click', function(){
				const link_pressed_e = new CustomEvent("e:link_pressed", {
					detail: {
						"html":	link.innerHTML,
						//"content": txt.length ? txt : link.find('img').length ? link.find('img').attr('src') : ""
					}
				});
				document.dispatchEvent(link_pressed_e);
			})
		}
	})
	hotkeys.can_trigger = true
}