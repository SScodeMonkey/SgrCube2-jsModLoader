passageModder.changes = { //turn into class later
	"basic_trainingDiscipline": {
		passage: "NewTrain",
		effect() {
			
			let companions = [
				V.npc[`av${V.cs1_girlid}`],
				V.npc[`av${V.cs2_girlid}`],
				V.npc[`av${V.cs3_girlid}`],
				V.npc[`av${V.cs4_girlid}`],
			]
				

			if (!document.querySelector('.story > .ulvendor')) {
				passageModder.storyWrapper();

				companions.forEach((companion) => {
					if (companion) {
						let randomRoll = Math.round(Math.random() * 100),
							rThreshold = Math.round((100 - companion.discipline) / 150 * 100);

						if (randomRoll <= rThreshold && $('#story').html().includes(`${companion.girlname}`)) {
							if (companion.discipline < 100) companion.discipline++
							$('.scrollWrapper').append(`${companion.girlname}'s <b>discipline</b> <div class="green">increased (rolls: ${randomRoll}/${rThreshold})</div> by 1<br>`)
						}
					}
				})
			}

			
			/*switch (V.adpos2){
				case 1: //strength
					break;
				case 2: //stamina
					break;
				case 3: //dexterity
					break;
				case 4: //melee
					break;
				case 5: //ranged
					break;
				case 6: //philosophy
					break;
			}*/
		},
		fired: false,
		events: [":passagedisplay", "ready"]
	},
	"4train_perDay": {
		passage: "EduMaster",
		effect() {
			let trainingLimit = $('h3:contains("You can only improve")')
			if (trainingLimit[0]) {
				if (V.trained <= 3) trainingLimit.remove()
				else replaceDOMtext(trainingLimit, "twice", "four times")
			}
		},
		fired: false,
		events: [":passagedisplay", "ready"]
	},
}

passageModder.changes_map = { //keys are passage names, arrays contain keys to passageModder.changes for that passage
	//"NewTrain": ["basic_trainingDiscipline"],
}

function replaceDOMtext(dom, text1, text2) {
	return $(dom)[0].innerHTML = $(dom)[0].replace(text1, text2)
}