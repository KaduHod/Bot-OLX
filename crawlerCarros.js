const puppeteer = require('puppeteer')
const preparaURL = require('./preparaURL')
const dataDeHoje = require('./data')
const fs = require('fs');

function geraTexto(objResultadoPesquisa, carsList, data_de_hoje){

  return `${JSON.stringify(objResultadoPesquisa, null, 2)} \n ${JSON.stringify(carsList, null, 2)} \n ${data_de_hoje}`

}

function geraArquivo(objResultadoPesquisa, texto_arquivo, pesquisa, data_de_hoje){

  fs.writeFile( `./carros/${pesquisa.nomeCarro}-${data_de_hoje}.txt`,
  texto_arquivo,
  err => {
      if(err) throw new Error(err);
      console.log('Sucesso!')
      console.log(objResultadoPesquisa)
  }) 

}

async function visitaPagina(page, url){

  await page.goto(url);//acesso a pagina da url


  const carsList = await page.evaluate(()=>{

    let objPesquisaCrawler = []
    let link;

    let temMaisPaginas = document.querySelectorAll('.sc-248j9g-1')
    if(temMaisPaginas.length > 0) link = temMaisPaginas[0].href
    else {
      url = false
      link = false
    }
    let ListaCarros = document.getElementsByClassName('fnmrjs-0 fyjObc')
    let list = [].slice.call(ListaCarros)
    /* let ListaCarros  = document.getElementsByClassName('fnmrjs-0 fyjObc')
    let ListaCarros2 = document.getElementsByClassName('fnmrjs-1 gietsi')
    let list1        = [].slice.call(ListaCarros)
    let list2        = [].slice.call(ListaCarros2) */
    //const list = list1.concat(list2)
    // logica de filhos entre list 1 e list 2 é diferente, necessario alteração
    
    list.forEach( e => {

      let link  = e.href
      let nome  = e.firstChild.childNodes[2].firstChild.firstChild.firstElementChild.innerText
      let preco = e.firstChild.childNodes[2].firstChild.childNodes[1].firstChild.firstChild.innerText

      objPesquisaCrawler.push({

        link  : link,
        nome  : nome,
        preco : preco

      })
    })  

    let retorno = {
      objPesquisaCrawler:objPesquisaCrawler,
      linkProximaPagina: link
    }

    return retorno

  }) 

  return carsList
}


(async function crawler() {

  const argumento = process.argv.slice()
  const url_pesquisa  = preparaURL(argumento)// pega a url formatada com a pesquisa
  const pesquisa  = url_pesquisa.objPesquisa
  const url       = url_pesquisa.url
  const browser   = await puppeteer.launch({headless: false});
  const page      = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  let carsList1 = await visitaPagina(page, url)
  let carsList2 = await visitaProximasPaginas(page, carsList1.linkProximaPagina)
  const carsList = carsList1.objPesquisaCrawler.concat(carsList2[0]) 

  console.log(carsList)

  

  let objResultadoPesquisa = {
    'Total de amostras' : carsList.length,
    'Carro pesquisado'  : pesquisa.nomeCarro,
    'Ano'               : `${pesquisa.anoInicio} até ${pesquisa.anoFinal}`,
    'Preço'             : `${pesquisa['preçoInicial']} até ${pesquisa['preçoFinal']}`
  }

  const data_de_hoje = dataDeHoje()
  
  const texto_arquivo = geraTexto(objResultadoPesquisa, carsList, data_de_hoje)

  geraArquivo(objResultadoPesquisa, texto_arquivo, pesquisa, data_de_hoje)

  await browser.close();
  

})();

async function visitaProximasPaginas(page, url){
  let carsList = []
  while(url != false){
    await page.goto(url)

    let listaDeCarros = await page.evaluate(url=>{
      
      function retornaPagina(stri){         
        return stri.split('?')[1].split('&')[0].split('=')[1]
      }

      let nextUrl;
      let temMaisPaginas = document.querySelectorAll('.sc-248j9g-1')
      if(temMaisPaginas.length > 0){
        atual = retornaPagina(url)
        proxima = retornaPagina(temMaisPaginas[0].href)
        if(proxima < atual){
          nextUrl = false
          console.log('todas as paginas visitadas')
        }else{
          nextUrl = temMaisPaginas[0].href
        }
        
      } 
      let ListaCarros = document.getElementsByClassName('fnmrjs-0 fyjObc')
      let list= [].slice.call(ListaCarros)
    /* let ListaCarros  = document.getElementsByClassName('fnmrjs-0 fyjObc')
    let ListaCarros2 = document.getElementsByClassName('fnmrjs-1 gietsi')
    let list1        = [].slice.call(ListaCarros)
    let list2        = [].slice.call(ListaCarros2) */
    //const list = list1.concat(list2)

      let objPesquisaCrawler = []

      list.forEach( e => {

        let link  = e.href
        let nome  = e.firstChild.childNodes[2].firstChild.firstChild.firstElementChild.innerText
        let preco = e.firstChild.childNodes[2].firstChild.childNodes[1].firstChild.firstChild.innerText
  
        objPesquisaCrawler.push({
  
          link  : link,
          nome  : nome,
          preco : preco
  
        })
      })

      return {
        listaCarros : objPesquisaCrawler,
        nextUrl : nextUrl
      }
    }, url)

    url = listaDeCarros.nextUrl
    carsList.push(listaDeCarros.listaCarros)
    if(url != false) console.log('indo proxima pagina')
  } 
  return carsList
  
}

