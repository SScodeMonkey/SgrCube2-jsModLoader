var tooltipPromise = { timeout: null, exists: false }

function makeTooltip(node, text, cssParams = {}) { //unsafe (uses eval(), so be careful)
	$(node)
		.on("mouseover", e => {
			if (!tooltipPromise.exists) {
				tooltipPromise.exists = true
				new Promise(resolve => {
					tooltipPromise.timeout = setTimeout(function () {
						let tooltip = $('#tooltip');
						let tt_text = eval('`' + text + '`');

						tooltip.css({
							'display': 'flex',
							'left': getOffset(e.target).left + 20,
							'top': getOffset(e.target).top + 20,
							'opacity': 1
						});
						tooltip.text(tt_text)
						tooltip.css(cssParams)
						resolve()
					}, 250)
				}).then(value => {
					tooltipPromise.exists = true
				})
			}
			//else alert('unexpected behaviour on mouseenter')
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
})