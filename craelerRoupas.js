const puppeteer = require('puppeteer')
const preparaURLRoupas = require('./preparaURLRoupas')
const dataDeHoje = require('./data')
const fs = require('fs')

function geraTexto(url, listRoupas, data_de_hoje){

    return `${JSON.stringify(url, null, 2)} \n ${JSON.stringify(listRoupas, null, 2)} \n ${data_de_hoje}`
  
}

function geraArquivo(texto_arquivo, pesquisa, data_de_hoje){

    fs.writeFile( `./roupas/${pesquisa.pesquisa}-${data_de_hoje}.txt`,
    texto_arquivo,
    err => {
        if(err) throw new Error(err);
        console.log('Sucesso!')
        console.log(pesquisa)
    }) 
  
}

async function visitaPagina(page, url){
    await page.goto(url);

    const listaDeRoupas = await page.evaluate(()=>{

        let listaRoupasHTML = document.getElementsByClassName('fnmrjs-1 gIEtsI') 

        if(listaRoupasHTML.length == 0) listaRoupasHTML = document.getElementsByClassName('sc-1fcmfeb-2') 
        
        let listaRoupas     = [].slice.call(listaRoupasHTML)
        let list           = []

        let temMaisPaginas = document.querySelectorAll('.sc-248j9g-1')
        
        let verificapaginas = temMaisPaginas.length > 0 ? temMaisPaginas[0].href : false // verifica se pesquisa possui mais de uma pagina

        console.log(verificapaginas)

        listaRoupas.forEach(e=>{

            let nomeAnuncio    = e.childNodes[2].firstChild.firstChild.firstChild.innerText
            let precoAnuncio;
            if( e.childNodes[2].firstChild.childNodes[1].firstChild.firstChild.innerText != null){
                precoAnuncio   = e.childNodes[2].firstChild.childNodes[1].firstChild.firstChild.innerText
            }else{
                precoAnuncio = 'Sem preço no anuncio'
            }
            
            let link           = e.parentNode.href
            let numeroContato1 = e.parentNode.href.split('-')
            let numeroContato  = numeroContato1[numeroContato1.length-1]

            obj = {
                nome  : nomeAnuncio,
                preço : precoAnuncio,
                link  : link,
                'numero-contato' : numeroContato
            }

            list.push(obj)
            
        })

        return {
           lista : list, // lista de roupas
           temMaisPaginas : verificapaginas // se possui mais paginas
        }
      
        
    })
    return {
        lista: listaDeRoupas.lista,
        pesquisa: url,
        proximaPagina : listaDeRoupas.temMaisPaginas
    }
}
function retornaPaginaURL (str){

    return str.split('?')[1].split('&')[0].split('=')[1]

};

async function visitaProximasPaginas(page, url){
    let roupasList = []
    //await page.exposeFunction("retornaPaginaURL", retornaPaginaURL);

    while(url != false){
        console.log('continuando')
        await page.goto(url);
       
        let listaDeRoupas = await page.evaluate(async (url)=>{

            let nextUrl;
            let temMaisPaginas = document.querySelectorAll('.sc-248j9g-1')          
            let verificapaginas = temMaisPaginas.length > 0 ? temMaisPaginas[0].href : false // verifica se pesquisa possui mais de uma pagina

            function retornaPaginaURL (str){

                return str.split('?')[1].split('&')[0].split('=')[1]
            
            };
            
            if(verificapaginas != false){

                atual = retornaPaginaURL(url)
                proxima = retornaPaginaURL(temMaisPaginas[0].href)
                nextUrl = proxima < atual ? false : temMaisPaginas[0].href
                console.log(nextUrl)
            }

            let listaRoupasHTML = document.getElementsByClassName('fnmrjs-1 gIEtsI') 

            //if(listaRoupasHTML.length == 0) listaRoupasHTML = document.getElementsByClassName('sc-1fcmfeb-2') 
            

            let listaRoupas     = [].slice.call(listaRoupasHTML)
            let list            = []

            listaRoupas.forEach(e=>{
                let nomeAnuncio = e.childNodes[2].firstChild.firstChild.firstChild.innerText

                let precoAnuncio;

                if( e.childNodes[2].firstChild.childNodes[1].firstChild.hasChildNodes()){
                    precoAnuncio   = e.childNodes[2].firstChild.childNodes[1].firstChild.firstChild.innerText
                }else{
                    precoAnuncio   = 'Sem preço no anuncio'
                }
                
                let link           = e.parentNode.href
                let numeroContato1 = e.parentNode.href.split('-')
                let numeroContato  = numeroContato1[numeroContato1.length-1]
    
                obj = {
                    nome  : nomeAnuncio,
                    preço : precoAnuncio,
                    link  : link,
                    'numero-contato' : numeroContato
                }
    
                list.push(obj)
                
            })

            return {
                nextUrl : nextUrl,
                list    : list
            } 

        },url)

        roupasList.push(listaDeRoupas.list)

        url = listaDeRoupas.nextUrl
        
    }

    return roupasList
};

(async function crawler() {

    const argumento = process.argv.slice()
    const url_pesquisa  = preparaURLRoupas(argumento)// pega a url formatada com a pesquisa
    
    const url       = url_pesquisa.filtro
    const browser   = await puppeteer.launch({headless: false});
    const page      = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    let listaDeRoupas = await visitaPagina(page, url)
    let listaDeRoupas2;
    
    if(listaDeRoupas.proximaPagina) listaDeRoupas2 = await visitaProximasPaginas( page, listaDeRoupas.proximaPagina )

    listaDeRoupas.lista.push(listaDeRoupas2)

    const lista = listaDeRoupas.lista

    
    console.log(lista)
    

    const data = dataDeHoje()

    const infoPesquisa = {
        'total de amostras' : listaDeRoupas.lista.length,
        'pesquisa'          : url_pesquisa.pesquisa,
        'data da pesquisa'  : data
    }

    listaDeRoupas.infoPesquisa = infoPesquisa
    
    const texto = geraTexto(url_pesquisa.pesquisa, listaDeRoupas, data)

    geraArquivo(texto, infoPesquisa, data)
    
    //await browser.close(); 
    
  
  })();

