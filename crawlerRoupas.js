const puppeteer = require('puppeteer')
const preparaURLRoupas = require('./preparaURLRoupas')
const dataDeHoje = require('./data')
const db = require('./mysql/connect')
const fs = require('fs')

function geraTexto(url, listRoupas, data_de_hoje){

    return ` ${JSON.stringify(listRoupas, null, 2)} `
  
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
        let list            = []

        let temMaisPaginas  = document.querySelectorAll('.sc-248j9g-1')
        
        let verificapaginas = temMaisPaginas.length > 0 ? temMaisPaginas[0].href : false // verifica se pesquisa possui mais de uma pagina

        listaRoupas.forEach(e=>{
            list.push( e.parentNode.href)
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

            }

            let listaRoupasHTML = document.getElementsByClassName('fnmrjs-1 gIEtsI') 

            //if(listaRoupasHTML.length == 0) listaRoupasHTML = document.getElementsByClassName('sc-1fcmfeb-2') 
            

            let listaRoupas     = [].slice.call(listaRoupasHTML)
            let list            = []

            listaRoupas.forEach(e=>{              
    
                list.push( e.parentNode.href)
                
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

    const argumento     = process.argv.slice()

    const url_pesquisa  = preparaURLRoupas(argumento)// pega a url formatada com a pesquisa
    
    const url           = url_pesquisa.filtro

    const browser       = await puppeteer.launch({headless: false});

    const page          = await browser.newPage();

    page.setDefaultNavigationTimeout(0);

    console.log('Coletando amostras da OLX')

    let listaDeRoupas = await visitaPagina(page, url)

    let listaDeRoupas2;
    
    if(listaDeRoupas.proximaPagina){ // junto as listas

        listaDeRoupas2 = await visitaProximasPaginas( page, listaDeRoupas.proximaPagina )

        listaDeRoupas2.forEach(pag=>{
            pag.forEach(roupa=>{
                listaDeRoupas.lista.push(roupa)
            })
            
        })
    }

    const lista = listaDeRoupas.lista

    console.log('Amostras coletadas')

    const data = dataDeHoje()

    let listaRoupas = []

    for(i=0; i<lista.length; i++){
        listaRoupas.push(await visitaAnuncio(lista[i], page))
        console.log(`|Dado coletado| ${i+1} de ${lista.length}`)
    }

    console.log('Inserindo amostras no banco de dados')

    listaRoupas.forEach(async roupa=>{
        await db.insertRoupa(roupa, data)
    })

    console.log('Amostras inseridas!')

    console.log('Fim!')

    //await browser.close(); 
    
  
  })();

async function visitaAnuncio(link, page){

    await page.goto(link)

    let dadosRoupa = await page.evaluate((link)=>{

        let preco = document.getElementsByClassName('sc-1wimjbb-0 JzEH sc-ifAKCX cmFKIN') != undefined ? [... document.getElementsByClassName('sc-1wimjbb-0 JzEH sc-ifAKCX cmFKIN')][0].innerText : null

        let titulo = document.getElementsByClassName('sc-45jt43-0 eCghYu sc-ifAKCX cmFKIN') != undefined ? [... document.getElementsByClassName('sc-45jt43-0 eCghYu sc-ifAKCX cmFKIN')][0].innerText : null

        let descricao = document.getElementsByClassName('sc-1sj3nln-1 eOSweo sc-ifAKCX cmFKIN') != undefined ? [... document.getElementsByClassName('sc-1sj3nln-1 eOSweo sc-ifAKCX cmFKIN')][0].innerText : null

        let detalhes = document.getElementsByClassName('sc-57pm5w-0 sc-1f2ug0x-2 dBeEuJ') != undefined ? [... document.getElementsByClassName('sc-57pm5w-0 sc-1f2ug0x-2 dBeEuJ')] : null
        
        let local = document.getElementsByClassName('sc-1f2ug0x-1 ljYeKO sc-ifAKCX kaNiaQ') != undefined ? [... document.getElementsByClassName('sc-1f2ug0x-1 ljYeKO sc-ifAKCX kaNiaQ')] : null 
        

        let bairro, cidade, cep, novoUsado, genero;

        if (detalhes) {
            novoUsado = detalhes[2] != undefined ? detalhes[2].innerText : null 
            genero    = detalhes[3] != undefined ? detalhes[3].innerText : null
        }
        
        if (local) {
            cep    = local[0] != undefined ? local[0].innerText : null
            cidade = local[1] != undefined ? local[1].innerText : null
            bairro = local[2] != undefined ? local[2].innerText : null
        }
        return {

            preco     : preco,
            titulo    : titulo,
            descricao : descricao,
            novoUsado : novoUsado,
            genero    : genero,
            cep       : cep,
            cidade    : cidade,
            bairro    : bairro,
            link      : link

        }

    }, link)
    
    return dadosRoupa
}