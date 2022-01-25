const puppeteer = require('puppeteer')
const preparaURL = require('./preparaURL')
const fs = require('fs');

/* let arrAnosCarros = ()=>{// array com ids dos anos do carro
  let i = 0
  let anos = [1950]
  while( i < 8 ){
      
      anos.push(anos[i]+5)
      i++
  }
  while( i < 41 ){
      
      anos.push(anos[i]+1)
      i++
  }
  anos.forEach(ano=>{
      ano.toString()
  })
  return anos.toString().split(',')
}

function formataParametrosEmURL(urls){
  return `${urls[0]}&${urls[1]}&${urls[2]}`
}

function formataNomeCarro(str){
  let urlNome = ''
  const hasUpper = (str) => /[A-Z]/.test(str);

  if(hasUpper(str)){
      str = str.split(/(?=[A-ZÀ-Ú])/)        
      str[str.indexOf(' ')] = '%20'
      str = `${str[0]}%20${str[1]}`
  }
  
  urlNome = `q=${str}`
  return urlNome
}

function formataAnoCarro(anoInicio, anoFinal){
  let arrAnos = arrAnosCarros()
  let urlAnos = `re=${arrAnos.indexOf(anoInicio)}&rs=${arrAnos.indexOf(anoFinal)}`
  return urlAnos
} 

function formataPrecoCarro(precoInicial, precoFinal){
  return `pe=${precoFinal}&ps=${precoInicial}`
};
 */


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

