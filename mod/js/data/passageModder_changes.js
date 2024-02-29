passageModder.changes = { //turn into class later
	"qwerty": {
		passage: "zzz-template",
		effect() {
			console.log("test")
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