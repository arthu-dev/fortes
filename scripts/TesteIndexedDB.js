
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;


let request = indexedDB.open('MeuDB', 1);
let db;

request.onerror = function(event) {
    console.log('Erro ao abrir o banco de dados:', event.target.errorCode);
  };
  
  // Evento chamado apenas na criação do banco ou quando a versão é atualizada
  request.onupgradeneeded = function(event) {
    db = event.target.result;
  
    // Cria uma nova 'tabela' chamada 'ExemploTable' com um campo 'id' como chave primária
    let objectStore = db.createObjectStore('ExemploTable', { keyPath: 'id', autoIncrement:true });
  
    // Define os campos que deseja armazenar na 'tabela'
    

    // Criando índices para os campos que serão utilizados
    objectStore.createIndex('data', 'data', { unique: false });
    objectStore.createIndex('refeicao', 'refeicao', { unique: false });
    objectStore.createIndex('pratoDoDia', 'pratoDoDia', { unique: false });
    objectStore.createIndex('totalFeito', 'totalFeito', { unique: false });
    objectStore.createIndex('totalConsumindo', 'totalConsumindo', { unique: false });
    objectStore.createIndex('totalDesperdicado', 'totalDesperdicado', { unique: false });
    objectStore.createIndex('valorTotal', 'valorTotal', { unique: false });
    objectStore.createIndex('precoUnitario', 'precoUnitario', { unique: false });
  
  
    console.log('Banco de dados criado com sucesso!');
  };
  
  // Evento acionado quando a conexão com o banco é aberta com sucesso
  request.onsuccess = function(event) {
    db = event.target.result;
    console.log('Conexão bem-sucedida com o banco de dados');
  
     // Exemplo de adição de dados com uma data como chave primária
  let transaction = db.transaction(['ExemploTable'], 'readwrite');
  let objectStore = transaction.objectStore('ExemploTable');

  
  // Dados a serem adicionados
  let dados = {
    id:1,
    data: "2023-11-15", 
    refeicao: 'Almoço',
    pratoDoDia: 'Lasanha',
    totalFeito: 10,
    totalConsumindo: 8,
    totalDesperdicado: 2,
    valorTotal: 50.0,
    precoUnitario: 5.0
  };

  let request = objectStore.add(dados);

  request.onsuccess = function(event) {
    console.log('Dados adicionados com sucesso!');
  };

  request.onerror = function(event) {
    console.log('Erro ao adicionar dados:', event.target.errorCode);
  };
};
  // Exemplo de função para buscar dados na tabela
  function buscarDadosData(dataBusca) {
    let transaction = db.transaction(['ExemploTable'], 'readonly');
    let objectStore = transaction.objectStore('ExemploTable');
  
    // Criando um índice para o campo 'data', caso não exista
    if (!objectStore.indexNames.contains('data')) {
      objectStore.createIndex('data', 'data');
    }
  
    // Obtendo um índice
    let dataIndex = objectStore.index('data');
  
    // Usando o índice para buscar todos os registros correspondentes à data '2023-11-15'
    let range = IDBKeyRange.only(dataBusca);
    let request = dataIndex.openCursor(range);
  
    request.onsuccess = function(event) {
      let cursor = event.target.result;
      if (cursor) {
        // Exibindo dados correspondentes à data buscada
        console.log('Dados encontrados:', cursor.value);
        cursor.continue(); // Continua a busca por mais dados correspondentes
      } else {
        console.log('Busca concluída.');
      }
    };
    
    request.onerror = function(event) {
      console.log('Erro na busca:', event.target.errorCode);
    };
  }