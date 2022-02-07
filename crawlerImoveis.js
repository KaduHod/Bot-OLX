const puppeteer = require('puppeteer')
const preparaURL = require('./preparaUrl')
const dataDeHoje = require('./../data')
const db = require('./../mysql/connect')
const fs = require('fs');
const start = require('./preparaUrl')

const url_padrao = 'https://pr.olx.com.br/regiao-de-curitiba-e-paranagua/bairro-novo/imoveis/venda'



async function crawler(){
    //let url = start() função que pega parametros de pesquisa
    const browser   = await puppeteer.launch({headless: false,ignoreHTTPSErrors: true});
    const page      = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    let links = await visitaTodasAsPaginas(page, url_padrao)
    console.log(links)
}
    


async function visitaTodasAsPaginas(page, url){
    let arr_links_de_paginas = []
    var cont = 0
    
    while(url){

        arr_links_de_paginas.push(url)

        await page.goto(url);
        let link = await page.evaluate(()=>{ 

            // codigos para verificar se crawler vai para a proxima pagina
                let linkProxPagina = [... document.getElementsByClassName('sc-248j9g-1 lfGTeV')][0]
                let paginaAtual = window.location.toString()
                let temLetrasDeProximaPaginaNaUrl = paginaAtual.indexOf('?o=')>-1
                let paginaAtualNum = temLetrasDeProximaPaginaNaUrl ? paginaAtual.toString().split('?o=')[1] : '0'
                let verifica = parseInt(linkProxPagina.href.split('?o=')[1]) > parseInt(paginaAtualNum)            
                return url = verifica ? linkProxPagina.href : false
            
            

        })
        cont++
        url = link
        if(cont>5) url = false
        
    }

    return arr_links_de_paginas
    

   

   
}
(()=>{
    crawler()
})()