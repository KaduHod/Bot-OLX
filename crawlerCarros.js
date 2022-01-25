const puppeteer = require('puppeteer')
const preparaURL = require('./preparaURL')
const fs = require('fs');

(async () => {
  const argumento = process.argv.slice()

  const url = preparaURL(argumento)

  const browser = await puppeteer.launch({headless: false});

  const page = await browser.newPage();

  await page.goto('https://pr.olx.com.br/regiao-de-curitiba-e-paranagua/autos-e-pecas/carros-vans-e-utilitarios?' + url);

  const carsList = await page.evaluate(()=>{

    let ListaCarros = document.getElementsByClassName('fnmrjs-0 fyjObc')

    var list = [].slice.call(ListaCarros)

    const objPesquisaCrawler = []

    list.forEach(e=>{
      let link = e.href
      let nome = e.firstChild.childNodes[2].firstChild.firstChild.firstElementChild.innerText
      let preco = e.firstChild.childNodes[2].firstChild.childNodes[1].firstChild.firstChild.innerText
      objPesquisaCrawler.push({
          link : link,
          nome : nome,
          preco : preco
      })
  })
    console.log(objPesquisaCrawler)
    return objPesquisaCrawler

  })
  
  await console.log(carsList)

  fs.writeFile(`${objPesquisa.nomeCarro}.txt`, JSON.stringify(carsList, null, 2), err =>{
      if(err) throw new Error('Erro');

      console.log('Sucesso!')
  }) 

  //await browser.close();

})();

