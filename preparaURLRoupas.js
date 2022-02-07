function preparaURLRoupas(arguments){
    let str = []
    
    let arrArgs = preparaArgumento(arguments)
    arrArgs.forEach( (e,index) => {
        if(index < (arrArgs.length -1)){
            str.push(e + '%20')
            
        }else{
            str.push(e)
        }
        
        
    })

    let stringPesquisa = 'https://pr.olx.com.br/regiao-de-curitiba-e-paranagua/moda-e-beleza?q='

    str.forEach(e=>{
        stringPesquisa += e
    })
    return {
        filtro : stringPesquisa,
        pesquisa : arrArgs.join(' ')
    }
}

function preparaArgumento(arguments){// separo apenas argumentos digitados
    let str = []
    if(arguments.length > 2 ){
        arguments.forEach((argumento, index) => {
            if(index > 1){
                str.push(argumento)
            }
        });
    }
    return str

}

module.exports = preparaURLRoupas