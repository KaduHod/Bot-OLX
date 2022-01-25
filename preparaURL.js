let arrAnosCarros = ()=>{// array com ids dos anos do carro
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

function preparaURL(arguments){
    //const argumento = process.argv.slice()
    

    const objPesquisa = {

        nomeCarro : arguments[2],
        anoInicio : arguments[3],
        anoFinal : arguments[4],
        preçoInicial : arguments[5],
        preçoFinal : arguments[6]

    }

    let urlArray = [

        formataPrecoCarro(objPesquisa.preçoInicial, objPesquisa.preçoFinal),
        formataNomeCarro(objPesquisa.nomeCarro)       ,
        formataAnoCarro(objPesquisa.anoInicio, objPesquisa.anoFinal) 

    ]
    const url = formataParametrosEmURL(urlArray)
    
    return url 
}



module.exports = preparaURL