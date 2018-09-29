import textarea from 'storm-textarea';
import OptionsSync from 'webext-options-sync';
import indentTextarea from './libs/indent-textarea';

textarea('textarea', {
	events: ['input']
});

document.querySelector('[name="customCSS"]').addEventListener('keydown', event => {
	if (event.key === 'Tab' && !event.shiftKey) {
		indentTextarea(event.target);
		event.preventDefault();
	}
});

document.querySelector('#enable-on-this-domain-btn').addEventListener('click', event => {
	const actionId = 'webext-domain-permission-toggle:add-permission';
	const {name: extensionName} = chrome.runtime.getManifest();
	let options = Object.assign({
		title: `Enable ${extensionName} on this domain`,
		reloadOnSuccess: `Do you want to reload this page to apply ${extensionName}?`
	}, {});

	chrome.tabs.query({'active': true}, function (tabs) {
		const currentUrl = "" + tabs[0].url;
		chrome.permissions.request({
			origins: [
				`${new URL(currentUrl).origin}/*`
			]
		}, granted => {
			if (chrome.runtime.lastError) {
				console.error(`Error: ${chrome.runtime.lastError}`, currentUrl);
				alert(`Error: ${chrome.runtime.lastError.message}`);
			} else if (granted && options.reloadOnSuccess && confirm(options.reloadOnSuccess)) {
				chrome.tabs.reload(tabId);
			}
		});
		console.error(currentUrl);
	});
});

new OptionsSync().syncForm('#options-form');
