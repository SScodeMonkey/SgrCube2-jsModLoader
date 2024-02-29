var tooltipPromise = { timeout: null, exists: false }
function makeTooltip(elem, text, cssParams = {}) {
	$(elem)
		.on("mouseenter", e => {
			if (!tooltipPromise.exists) {
				tooltipPromise.exists = true
				new Promise(resolve => {
					tooltipPromise.timeout = setTimeout(function () {
						let tooltip = $('#tooltip');
						tooltip.css({
							'display': 'flex',
							'left': getOffset(elem).left + 20,
							'top': getOffset(elem).top + 20,
							'opacity': 1
						});
						tooltip.text(text)
						tooltip.css(cssParams)
						resolve()
					}, 250)
				}).then(value => {
					tooltipPromise.exists = false
				})
			}
			else alert('unexpected behaviour on mouseenter')
		}).on("mouseleave", e => {
			if (tooltipPromise.exists) {
				tooltipPromise.exists = false
				clearTimeout(tooltipPromise.timeout)
				$('#tooltip').css({
					'display': "none",
					'opacity': 0,
				})
			}
		})
}

//init
$(document).ready(() => {
	if (!document.querySelector('#tooltip')) {
		$('body').append('<div id="tooltip"></div>')
		$('body').append(`<link rel="stylesheet" href="mod/css/tooltip.css">`)
	}
	cs(V.passage)
	$(document).on(':passagedisplay', function (e) {
		cs(V.passage)
	})
})