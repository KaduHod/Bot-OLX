const puppeteer = require('puppeteer')
const preparaURL = require('./preparaURL')
const dataDeHoje = require('./data')
const db = require('./mysql/connect')
const fs = require('fs');

function geraTexto(objResultadoPesquisa, carsList, data_de_hoje){

  return `${JSON.stringify(carsList, null, 2)}`

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

async function visitaPaginaIndividual(page, carro){
  let url = carro.link
  
  //await page.goto(url, {waitUntil : 'networkidle2' })
  await page.goto(url)
    let dados = await page.evaluate( (carro) =>{
      let caracteristicas = [...document.getElementsByClassName('sc-hmzhuo eNZSNe sc-jTzLTM iwtnNi')]
      caracs = caracteristicas.map((categoria)=>{
    
        dado = categoria.childNodes
        obj = {}
          
        obj[`${dado[0].innerText}`] = dado[1].innerText
        return obj
      
          
      })

      let caracteristcasOBJ = caracteristicas.reduce(( acc, curr )=>{
        let key = curr.childNodes[0].innerText
        let value = curr.childNodes[1].innerText
      
        acc[`${key}`] = value
    
        return acc 
        
      },{})

      caracteristcasOBJ['Nome do Anuncio'] = carro.nome
      caracteristcasOBJ['Preço'] = carro.preco
      caracteristcasOBJ['link'] = carro.link
      
      return caracteristcasOBJ
    }, carro)

    return dados
  
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

    console.log(link)
    //let verificapaginas = temMaisPaginas.length > 0 ? temMaisPaginas[0].href : false
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
      let preco1 = e.firstChild.childNodes[2].firstChild.childNodes[1].firstChild.firstChild.innerText
      let preco2 = preco1.split(' ')[1].split('.')
      let preco = parseFloat(preco2[0]+preco2[1])

      

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

  console.log(url_pesquisa)
  const pesquisa  = url_pesquisa.objPesquisa
  const url       = url_pesquisa.url
  
  const browser   = await puppeteer.launch({headless: false,ignoreHTTPSErrors: true});
  const page      = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  console.log('Coletando dados da OLX')

  let carsList1 = await visitaPagina(page, url)  

  if(carsList1.linkProximaPagina){ // junto as duas listas
    let carsList2 = await visitaProximasPaginas( page, carsList1.linkProximaPagina )
    carsList2.forEach(pag=>{
        pag.forEach(carro=>{
          carsList1.objPesquisaCrawler.push(carro)
        })
        
    })
  }

  console.log('Links coletados!')

  const carsList = carsList1.objPesquisaCrawler
  //console.log(carsList)
  const data_de_hoje = dataDeHoje()

  console.log('Quantidade de links: '+ carsList.length)


  let teste  =  []

  console.log('Coletando dados')
  //teste = await visitaPaginaIndividual(page, [carsList[0]])
  for(i=0; i<carsList.length;i++){
    let dado = await visitaPaginaIndividual(page, carsList[i])
    teste.push(dado)
    console.log(` |${i} --  Dado coletado|`)
  } 

  console.log('Dados coletados')
  console.log('Quantidade de amostras : ' + teste.length)


  console.log('Inserindo dados na DB')


  db.insertCar(teste, data_de_hoje)

  console.log('Dados inseridos no mysql')

  

  let objResultadoPesquisa = {
    'Total de amostras' : carsList.length,
    'Carro pesquisado'  : pesquisa.nomeCarro,
    'Ano'               : `${pesquisa.anoInicio} até ${pesquisa.anoFinal}`,
    'Preço'             : `${pesquisa['preçoInicial']} até ${pesquisa['preçoFinal']}`
  }

  
  
  //const texto_arquivo = geraTexto( carsList )

  //geraArquivo(objResultadoPesquisa, texto_arquivo, pesquisa, data_de_hoje)

  //await browser.close();
  

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

      let objPesquisaCrawler = []

      list.forEach( e => {

        let link  = e.href
        let nome  = e.firstChild.childNodes[2].firstChild.firstChild.firstElementChild.innerText
        let preco1 = e.firstChild.childNodes[2].firstChild.childNodes[1].firstChild.firstChild.innerText
        let preco2 = preco1.split(' ')[1].split('.')
        let preco = parseFloat(preco2[0]+preco2[1])
  
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

