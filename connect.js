async function connect(){
    const mysql = require('mysql2/promise')

    const connection = await mysql.createConnection('mysql://root:root@localhost:3306/crawler')

    console.log('conectou no MYSQL')

    global.connection = connection

    return connection
}



async function insertCar(cars, data){
    const conn = await connect();
    cars.forEach(async car =>{
        let portas;
        if(car['Portas'] == undefined){
            portas = null
        } else {
            portas = parseInt(car['Portas'].split(' ')[0])
        }
        
        let carro = {
            'NomeDoAnuncio'    : car['Nome do Anuncio'] || null ,
            'Modelo'           : car['Modelo'] || null,
            'Marca'            : car['Marca'] || null,
            'Preço'            : car['Preço'] || null,
            'TipoDeVeículo'    : car['Tipo De veículo'] || null,
            'Ano'              : car['Ano'] || null,
            'Quilometragem'    : car['Quilometragem'] || null,
            'PotênciaDoMotor'  : car['Potência do motor'] || null,
            'Combustível'      : car['Combustível'] || null,
            'Câmbio'           : car['Câmbio'] || null,
            'Direção'          : car['Direção'] || null,
            'Cor'              : car['Cor'] || null,
            'FinalDePlaca'     : car['Final de placa'] || null,
            'Portas'           : portas,
            'link'             : car['link'] || null,
        }

        const sql = "INSERT INTO crawler.carros (NomeDoAnuncio, Modelo, Marca, Preço, TipoDeVeículo, Ano,Quilometragem,PotênciaDoMotor, Combustível , Câmbio, Direção, Cor, FinalDePlaca, Portas, link, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
        
        const values = [carro['NomeDoAnuncio'], carro['Modelo'], carro['Marca'],carro['Preço'],carro['TipoDeVeículo'], carro['Ano'], carro['Quilometragem'], carro['PotênciaDoMotor'],carro['Combustível'],carro['Câmbio'],carro['Direção'],carro['Cor'],carro['FinalDePlaca'],carro['Portas'],carro['link'], data];
        await conn.query(sql, values);   
    })   
    
}
async function insertRoupa(roupa, data){
    try {
        const conn = await connect();

        console.log(roupa)

        const sql = "INSERT INTO crawler.roupas (NomeDoAnuncio, Preço, Descrição, NovoOuUsado, Gênero,  CEP, Cidade, Bairro, Link, created_at) VALUES (?,?,?,?,?,?,?,?,?,?);"

        let preco = parseFloat(roupa.preco.split(' ')[1])

        const values = [roupa.titulo, preco, roupa.descricao, roupa.novoUsado, roupa.genero , roupa.cep, roupa.cidade, roupa.bairro, roupa.link, data ]

        await conn.query(sql, values); 
    } catch (error) {
        throw new Error(error)
    }
     
    
}

module.exports = {connect, insertCar, insertRoupa}
    