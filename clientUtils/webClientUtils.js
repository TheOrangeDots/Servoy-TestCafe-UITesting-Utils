import {Selector, t as TestController} from 'testcafe'

const mediaUploadFrameSelector = Selector(() => {
		var frames = document.querySelectorAll('iframe.wicket_modal')

		for (var i = 0; i < frames.length; i++) {
		   if (frames[i].contentDocument.querySelector('body.media-upload')) {
			   return frames[i]
		   }
		}
	})

const dialogFrameSelector = Selector(() => {
		var frames = document.querySelectorAll('iframe.wicket_modal')

		for (var i = 0; i < frames.length; i++) {
			if (!!( frames[i].offsetWidth || frames[i].offsetHeight || frames[i].getClientRects().length )) {
				return frames[i]
			}
		}
	})

export const elementByName = Selector(name => document.querySelector('[data-sv-element-name=' + name + ']'), {visibilityCheck: true})

export const formByName = Selector(name => document.querySelector('[data-sv-form-name=' + name + ']'), {visibilityCheck: true})

export const partByName = Selector(name => document.querySelector('[data-sv-form-part=' + name + ']'), {visibilityCheck: true})

const numberFormatter = new Intl.NumberFormat('nl').format //TODO softcode locale

class ServoyWebClient {
	get mediaUploadFrameSelector() { return mediaUploadFrameSelector }

	get dialogFrameSelector() { return dialogFrameSelector }

	/**
	 * @param {Array<String>} paths
	 */
	async uploadFiles(paths) {
		await TestController
			.switchToIframe(mediaUploadFrameSelector)
			.setFilesToUpload('.wicket-mfu-field', paths)
			.click('#filebutton')
			.switchToMainWindow()
			.wait(1000) //bug work-around, see https://github.com/DevExpress/testcafe-hammerhead/issues/199
	}

	async setField(selector, value, append) {
		//TODO handle dateFields

		//FIXME selectOnEnter behavior interferes with typeText, now doing a blunt .25s wait
		await TestController
			.click(selector)
			.wait(1250) //FIXME increased from 250 > 1250 for issue entering valies in grids

		let valueString = typeof value === 'number' ? numberFormatter(value) : value
		await TestController.typeText(selector, valueString, {replace: append instanceof Boolean ? !append : true})
	}
}

export default new ServoyWebClient()
