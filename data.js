function dataDeHoje(){
  
    let data    = new Date();
    let dia     = String(data.getDate()).padStart(2, '0');
    let mes     = String(data.getMonth() + 1).padStart(2, '0');
    let ano     = data.getFullYear();
    let hora    = data.getHours();          
    let min     = data.getMinutes();        
    let seg     = data.getSeconds();         
  
    let data_ = ano + '-' +  mes + '-' + dia + " " + hora + ':' + min + ':' + seg ;
  
    return data_.toString();
  
  };
module.exports = dataDeHoje