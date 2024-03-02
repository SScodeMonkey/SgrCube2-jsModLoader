function addHours(hours = 1) {
	V.gameDate.setHours(V.gameDate.getHours() + hours);
	V.daycount -= 10;

	let hour = V.gameDate.getHours() > 12 ? `${V.gameDate.getHours() - 12}` : `${V.gameDate.getHours()}`,
		mins = V.gameDate.getMinutes() > 9 ? `${V.gameDate.getMinutes()}` : `0${V.gameDate.getMinutes()}`,
		ampm = V.gameDate.getHours() > 12 ? "AM" : "PM"

	$('.acts2 .alt3b strong').text(`${hour}:${mins} ${ampm}`)
	qNpc.update();
}