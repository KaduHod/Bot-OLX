const path = 'https://pr.olx.com.br/regiao-de-curitiba-e-paranagua/'
const readline = require('readline-sync')

let categorias = ['Venda - casas e apartamentos', 'Aluguel - casas e apartamentos', 'Terrenos, sítios e fazendas', 'Comércio e insdustria', 'Temporada']

//Preco min e max
// area min e max
// num quartos min e max
// num banheiros min e max
// vagas garagem: 1,2,3,4,5+


function start(){


    const content = {}
    content.bairro = askAndReturnBairro()
    content.tipoImovel = askAndReturnTipoImovel()
    askAndReturnFilters()

    function askAndReturnBairro(){

        const bairros = [
            'Bairro novo',
            'Boa Vista',
            'Boqueirao',
            'Cajuru',
            'Cidade Industrial',
            'Fazendinha Portao',
            'Matriz',
            'Pinheirinho',
            'Santa Felicidade',
            'Grande Curitiba',
            'Sem bairro especifico'
        ]

        let prefixes = [
            'bairro-novo/imoveis',
            'boa-vista/imoveis',
            'boqueirao/imoveis',
            'cajuru/imoveis',
            'cidade-industrial/imoveis',
            'fazendinha-portao/imoveis',
            'matriz/imoveis',
            'pinheirinho/imoveis',
            'santa-felicidade/imoveis',
            'grande-curitiba/imoveis',
            'imoveis/'
        ]

        let tipoEscolhido = readline.keyInSelect(bairros, 'Qual o tipo do imovel')
        return prefixes[tipoEscolhido]
    }

    function askAndReturnTipoImovel(){
        const tipos = [
            'Venda e aluguel - casas e apartamentos',
            'Venda - Apartamentos',
            'Venda - Casas',
            'Venda - Comercio e industria',
            'Venda e aluguel - Terrenos, sitios e fazendas',
            'Venda e aluguel - Terrenos e lotes',
            'Venda e aluguel - Sitios e chacaras',
            'Venda e aluguel - Fazendas',
            'Venda - Terrenos, sitios e fazendas',
            'Venda - Terrenos e lotes',
            'Venda - Sitios e chacaras',
            'Venda - Fazendas',
            'Aluguel - casas e apartamentos',
            'Aluguel - Casas',
            'Aluguel - Apartamentos',
            'Aluguel - Quartos',
            'Aluguel - Terrenos, sitios e fazendas',
            'Aluguel - Terrenos e lotes',
            'Aluguel - Sitios e chacaras',
            'Aluguel - Fazendas',
            'Aluguel - Comercio e industria',
            'Temporada',
            'Temporada - Apartamento',
            'Temporada - Casa',
            'Temporada - Quarto individual',
            'Temporada - Quarto compartilhado',
            'Temporada - Hotel, hostel e pousada',
            'Temporada - Sitio, fazenda e chacara'
        ]

        let prefixes = [
            '/venda',// 1
            '/venda/apartamentos',// 1
            '/venda/casas',// 1
            '/comercio-e-industria',//// 2
            '/terrenos',//// 2
            '/terrenos/lotes',//// 2
            '/terrenos/sitios-e-chacaras',//// 2
            '/terrenos/fazendas',//// 2
            '/terrenos/compra',//// 2
            '/terrenos/lotes/compra',//// 2
            '/terrenos/sitios-e-chacaras/compra',//// 2
            '/terrenos/fazendas/compra',//// 2
            '/aluguel',// 1
            '/aluguel/casas',// 1
            '/aluguel/apartamentos',// 1
            '/aluguel/aluguel-de-quartos',//1 
            '/terrenos/aluguel', //// 2
            '/terrenos/lotes/aluguel', //// 2
            '/terrenos/sitios-e-chacaras/aluguel', //// 2
            '/terrenos/fazendas/aluguel', //// 2
            '/comercio-e-industria/aluguel', ////2
            '/temporada', //3 
            '/temporada/apartamentos',//3 
            '/temporada/casas',//3 
            '/temporada/quartos',//3 
            '/temporada/quartos-compartilhados',//3 
            '/temporada/hotel-hostel-e-pousadas',//3 
            '/temporada?snt=6'//3 
        ]

        let tipoEscolhido = readline.keyInSelect(tipos, 'Qual o tipo do imovel')
        return prefixes[tipoEscolhido]
    }

    function askAndReturnFilters(){

        let filter1 = [// filtro com preco, area, num quartos, num banheiros e vagas garagem
            '/venda',
            '/venda/apartamentos',
            '/venda/casas',
            '/aluguel',
            '/aluguel/apartamentos',
            '/aluguel/casas',
            '/aluguel/aluguel-de-quartos'
        ]

        let filter2 = [// filtro com preco area e vagas garagem
            '/comercio-e-industria',
            '/terrenos',
            '/terrenos/lotes',
            '/terrenos/sitios-e-chacaras',
            '/terrenos/fazendas',
            '/terrenos/compra',
            '/terrenos/lotes/compra',
            '/terrenos/sitios-e-chacaras/compra',
            '/terrenos/fazendas/compra',
            '/terrenos/aluguel', 
            '/terrenos/lotes/aluguel',
            '/terrenos/sitios-e-chacaras/aluguel',
            '/terrenos/fazendas/aluguel',
            '/comercio-e-industria/aluguel'
        ]

        let filter3 = [// filtro com preço num quartos num camas
            '/temporada',
            '/temporada/apartamentos',
            '/temporada/casas',
            '/temporada/quartos',
            '/temporada/quartos-compartilhados',
            '/temporada/hotel-hostel-e-pousadas',
            '/temporada?snt=6'
        ]

        if(filter1.indexOf(content.tipoImovel) > -1 ){//se tipo de pesquisa tem parametros do filtro um
            let precoMin = readline.question('Digite o preco minimo: ')
            let precoMax = readline.question('Digite o preco maximo: ')

            let idArea = [
                '0',
                '30',
                '60',
                '90',
                '120',
                '150',
                '180',
                '200',
                '250',
                '300',
                '400',
                '500',
                'Acima de 500',
                'Sem especificar'
            ]

            let areaMin = readline.keyInSelect(idArea ,'Escolha a area minimo: ')
            let areaMax;
            if(areaMin != 13) areaMax = readline.keyInSelect(idArea, 'Escolha a area maximo: ')
             

            let atd = [1,2,3,4,5, 'sem especificar']

            let numQuartosMin   = readline.keyInSelect(atd,  'Numero de quartos (min)'  )
            if(numQuartosMin != 5)  numQuartosMax = readline.keyInSelect(atd,  'Numero de quartos (max)'  )
            let vagasGaragem = readline.keyInSelect(atd,  'Vagas da garagem'   )

            let numBanheirosMin = readline.keyInSelect(atd,  'Numero de banheiros (min)')
            if(numBanheirosMin != 5) numBanheirosMax = readline.keyInSelect(atd,  'Numero de banheiros (max)')

            if( numBanheirosMin != 5 ){
                content.numBanheirosMax = `bae=${atd[ numBanheirosMax ]}`
                content.numBanheirosMin = `bas=${atd[ numBanheirosMin ]}`
            } 

            if( vagasGaragem != 5 ) content.vagasGaragem = `gsp=${atd[ vagasGaragem ]}`

            content.precoMax = `pe=${precoMax}`
            content.precoMin = `ps=${precoMin}` 

            if( numQuartosMin != 5 ){
                content.numQuartosMax   = `roe=${atd[  numQuartosMax  ]}`
                content.numQuartosMin   = `ros=${atd[  numQuartosMin  ]}`
                
            }           

            if(areaMin != 13 ){
                content.areaMax = `se=${areaMax}`
                content.areaMin = `ss=${areaMin}`
            }            
        }
        if(filter2.indexOf(content.tipoImovel) > -1 ){//se tipo de pesquisa tem parametros do filtro dois
            
            let precoMin = readline.question('Digite o preco minimo: ')
            let precoMax = readline.question('Digite o preco maximo: ')

            let idArea = [
                '0',
                '30',
                '60',
                '90',
                '120',
                '150',
                '180',
                '200',
                '250',
                '300',
                '400',
                '500',
                'Acima de 500',
                'Sem especificar'
            ]

            let areaMin = readline.keyInSelect(idArea ,'Escolha o area minimo: ')
            let areaMax;
            if(areaMin != 13) areaMax = readline.keyInSelect(idArea, 'Escolha o area maximo: ')

            let atd = [1,2,3,4,5, 'sem especificar']
            let vagasGaragem = readline.keyInSelect(atd,  'Vagas da garagem'   )



            if( vagasGaragem != 5 ) content.vagasGaragem = `gsp=${atd[ vagasGaragem ]}`

            content.precoMax = `pe=${precoMax}`
            content.precoMin = `ps=${precoMin}`
            

            if(areaMin != 13 ){
                content.areaMax = `se=${areaMax}` 
                content.areaMin = `ss=${areaMin}`
            }            
        }
        if(filter3.indexOf(content.tipoImovel) > -1 ){//se tipo de pesquisa tem parametros do filtro tres
            
            let precoMin = readline.question('Digite o preco minimo: ')
            let precoMax = readline.question('Digite o preco maximo: ')

            let atd = [1,2,3,4,5, 'sem especificar']

            let numQuartosMin   = readline.keyInSelect(atd,  'Numero de quartos (min)'  )
            if(numQuartosMin != 5)  numQuartosMax = readline.keyInSelect(atd,  'Numero de quartos (max)'  )


            let camasValues = [
                '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','25','30','sem especificar'
            ]

            let numCamasMin = readline.keyInSelect(camasValues,  'Numero de camas (min)'  )
            let numCamasMax;
            
            if(numCamasMin != 22) numCamasMax = readline.keyInSelect(camasValues,  'Numero de camas (max)'  )

            if(numCamasMin != 22){
                content.numCamasMax = `be=${numCamasMax}`
                content.numCamasMin =`bs=${numCamasMin}` 
            }
            content.precoMax = `pe=${precoMax}`
            content.precoMin = `ps=${precoMin}`
            if( numQuartosMin != 5 ){
                content.numQuartosMax   = `roe=${atd[  numQuartosMax  ]}`
                content.numQuartosMin   = `ros=${atd[  numQuartosMin  ]}`
            }             
        }   
        
       
    }
    return formaUrl(content)
    
}

function formaUrl(obj){
    let url = path + obj['bairro'] + obj['tipoImovel'] + '?'
    let props = Object.keys(obj)
    props.forEach((prop)=>{
        if((prop !== 'bairro') || (prop !=='tipoImovel') ){
            let verifica = verifica_se_e_imovel_ou_bairro(prop)
            if(verifica) url += `&${obj[prop]}`
        } 
    })

    return url
}

function verifica_se_e_imovel_ou_bairro(str){
    if(str == 'bairro' || str == 'tipoImovel') return false
    return true
}

module.exports = start
