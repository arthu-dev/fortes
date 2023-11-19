const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

let request = indexedDB.open('Notificacao_DB',1);
let db;

request.onerror = function (event) {
    console.log('Erro ao abrir o banco de dados:', event.target.errorCode);
};

request.onupgradeneeded = function (event) {
    db = event.target.result;

    let objectStore = db.createObjectStore('Notificacao', { keyPath: 'id', autoIncrement: true });

    objectStore.createIndex('data', 'data', { unique: false });
    objectStore.createIndex('titulo', 'titulo', { unique: false });
    objectStore.createIndex('mensagem', 'mensagem', { unique: false });


    console.log('Banco de dados criado com sucesso!');
};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log('Conexão bem-sucedida com o banco de dados');
};
function adicionarDadosDoJson() {
    fetch('json/dadosNotificacao.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let transaction = db.transaction(['Notificacao'], 'readwrite');
            let objectStore = transaction.objectStore('Notificacao');

            data.forEach(item => {
                let request = objectStore.add(item);
                request.onsuccess = function () {
                    console.log('Dados adicionados com sucesso!');
                };

                request.onerror = function (event) {
                    console.log('Erro ao adicionar dados:', event.target.errorCode);
                };
            });
        })
        .catch(error => {
            console.log('Erro ao buscar o arquivo JSON:', error);
        });
       
}
function adicionarDados(refeicao,quant,data) {
    fetch('json/dadosNotificacao.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let transaction = db.transaction(['Notificacao'], 'readwrite');
            let objectStore = transaction.objectStore('Notificacao');

            data.forEach(item => {
                let request = objectStore.add(item);
                request.onsuccess = function () {
                    console.log('Dados adicionados com sucesso!');
                };

                request.onerror = function (event) {
                    console.log('Erro ao adicionar dados:', event.target.errorCode);
                };
            });
        })
        .catch(error => {
            console.log('Erro ao buscar o arquivo JSON:', error);
        });
       
}

function deletarDados() {

    let transaction = db.transaction(['Notificacao'], 'readwrite');
    let objectStore = transaction.objectStore('Notificacao');

    let request = objectStore.clear();

    request.onsuccess = function (event) {
        console.log('Todos os registros foram apagados com sucesso!');
    };

    request.onerror = function (event) {
        console.log('Erro ao apagar os registros:', event.target.errorCode);
    };
}

function mostrarTodosDados() {
    let transaction = db.transaction(['Notificacao'], 'readonly');
    let objectStore = transaction.objectStore('Notificacao');

    let request = objectStore.openCursor();
    const tabela = document.getElementById('dados');
    tabela.innerHTML = ''; //zera a tabela, talvez n seja necessario

    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cursor.value.titulo}: ${cursor.value.mensagem}</td>
                <td>${cursor.value.data}</td>
            `;
            tabela.appendChild(row);
            cursor.continue();
        } else {
            console.log('Todos os dados foram exibidos.');
        }
    };

    request.onerror = function (event) {
        console.log('Erro ao buscar dados:', event.target.errorCode);
    };
}
window.onload = function(){
    mostrarTodosDados();
};
