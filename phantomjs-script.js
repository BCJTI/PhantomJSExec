'use strict';

var page = require('webpage').create(),
	system = require('system'),
	address, output,
	maxTimeOut = 14000;

function waitFor(testFx, onReady, timeOutMillis) {
	var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, 
		start = new Date().getTime(),
		condition = testFx(),
		interval = setInterval(function () {
			var elapsed = (new Date()).getTime() - start;
			if ((elapsed < maxtimeOutMillis) && !condition) {
				condition = testFx();
			} else {
				clearInterval(interval);
				onReady(elapsed, !condition);
			}
		}, 250);
};

address = system.args[1];
output = system.args[2];
page.viewportSize = { width: 1366, height: 667 };
page.clipRect = {
	top: 18,
	left: 219,
	width: 1120,
	height: 630
};

function everyThingOk() {
	return page.evaluate(function () {
		return window.status === 'TiraSS';
	});
}

if (system.args[3] === '--debug') {
	page.onConsoleMessage = function (message) { console.log(message); };
}

page.open(address, function (status) {
	if (status !== 'success') {
		console.log('Unable to load the address!');
		phantom.exit(1);
	} else {
		page.evaluate(function () {
			if (contapassada == null) {
				var contapassada = 0;
				var intseted = setInterval(function () {
					if (contapassada === 1) {
						return;
					}
					if (angular.element(document.body).injector().get('$rootScope').mmReady) {
						contapassada = 1;
						clearInterval(intseted);
						console.log('mmReady === true; Removendo interval.');
						var geraSS = function () {
							window.status = 'TiraSS';
							console.log('Ready to go!');
						};
						console.log('Esperando fade de %fadeTimeOut% ms');
						setTimeout(function () {
							console.log('Esperando carregar o conteudo dinamico ou o timeout de 13000 ms');
							(function (_contentContainer, callback) { 
								var _content = _contentContainer.find('img, iframe, frame, script').filter(function () {
									return !this.complete;
								});
								var content_length = _content.length;
								var content_load_cntr = 0;
								console.log('Carregando ' + content_length);
								if (content_length) {
									if (content_load_cntr === content_length) {
										console.log('Tudo previamente processado');
										callback();
									} else {
										_content.on('load', function () {
											content_load_cntr++;
											if (content_load_cntr === content_length) {
												console.log(content_load_cntr + ' itens carregados de ' + content_length + '...');
												setTimeout(function () {
													console.log('Chamando todos os carros...');
													callback();
												}, 1000);
											}
										});
									}
								} else {
									console.log('Nenhum item a ser carregado.');
									callback();
								}
							})(angular.element('.slide'), geraSS);
						}, 250);
					}
				}, 250);
			}
			return 0;
		});
		waitFor(everyThingOk, function (elapsed, timedout) {
			page.render(output);
			phantom.exit(timedout ? 1 : 0);
		}, maxTimeOut);
	}
});
