// messages_en

let locale = 'en';

let messages = {
	en: {
		basic: 'button',
		// can have variables
		var: 'hello, {name}',
		// can be nested
		deep: {
			one: 'one',
			two: 'two',
		},
	}
};

document.addEventListener('alpine-i18n:ready', function () {
	window.AlpineI18n.create(locale, messages);
});