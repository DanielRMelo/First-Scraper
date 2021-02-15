const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	const url = 'https://olavodecarvalho.org/sobre-kant-e-o-artigo-dos-academicos-franceses';
	await page.goto(url);

	
	const articleName = url.substr(url.lastIndexOf('/') + 1);

	const article = await browser.newPage();
	article.setDefaultNavigationTimeout(0);
	await article.goto(url);
	await article.evaluate(() => {
		const title = document.getElementById('page-title').innerText;
		const text = document.getElementById('main-content').innerHTML;

		document.querySelectorAll('body').forEach(elem => {
			elem.innerHTML = ''
		})

		document.querySelector('body').innerHTML = `
				<h1>${title}</h1>
				${text.split('Comments')[0]}
		`
	});
	await article.pdf({ path: `./articles/${articleName}.pdf`, format: 'A4' });
	await article.close()

	await browser.close();
})();