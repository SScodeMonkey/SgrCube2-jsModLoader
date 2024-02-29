function getOffset(element) { //not including padding and border
	const viewport = $(element)[0].getBoundingClientRect();
	return {
		left: viewport.left + window.scrollX,
		top: viewport.top + window.scrollY
	};
}