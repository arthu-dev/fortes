const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

let request = indexedDB.open('Notificoes_DB', 1);
let db;

request.onerror = function (event) {
    console.log('Erro ao abrir o banco de dados:', event.target.errorCode);
};

request.onupgradeneeded = function (event) {
    db = event.target.result;

    let objectStore = db.createObjectStore('NotificacaoFunci', { keyPath: 'id', autoIncrement: true });

    objectStore.createIndex('data', 'data', { unique: false });
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
            let transaction = db.transaction(['NotificacaoFunci'], 'readwrite');
            let objectStore = transaction.objectStore('NotificacaoFunci');

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
function formatarData(data) {
    const dataObj = new Date(data);

    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
}
function adicionarDados() {
    let mensagem = document.getElementById("descrição").value;
    let dataForm = formatarData(document.getElementById("dataSelecionada").value);
    let dados = {
        "data": dataForm,
        "mensagem": mensagem
    }
    let transaction = db.transaction(['NotificacaoFunci'], 'readwrite');
    let objectStore = transaction.objectStore('NotificacaoFunci');

    if (mensagem == "" || dataForm === NaN) { alert("Campos em branco") } else {
        let request = objectStore.add(dados);
        request.onsuccess = function () {
            console.log('Dados adicionados com sucesso!');
        };

        request.onerror = function (event) {
            console.log('Erro ao adicionar dados:', event.target.errorCode);
        };

    }

}

function deletarDados() {

    let transaction = db.transaction(['NotificacaoFunci'], 'readwrite');
    let objectStore = transaction.objectStore('NotificacaoFunci');

    let request = objectStore.clear();

    request.onsuccess = function (event) {
        console.log('Todos os registros foram apagados com sucesso!');
    };

    request.onerror = function (event) {
        console.log('Erro ao apagar os registros:', event.target.errorCode);
    };
}

function mostrarTodosDados() {
    let transaction = db.transaction(['NotificacaoFunci'], 'readonly');
    let objectStore = transaction.objectStore('NotificacaoFunci');

    let request = objectStore.openCursor();
    const tabela = document.getElementById('dados');
    tabela.innerHTML = ''; //zera a tabela, talvez n seja necessario

    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cursor.value.mensagem}</td>
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
function verificarTabelaVazia() {
    //problema aqui, acho que chama essa funcao antes de chamar o banco e da erro
    let transaction = db.transaction('NotificacaoFunci', 'readonly');
    let objectStore = transaction.objectStore('NotificacaoFunci');

    let request = objectStore.count();

    request.onsuccess = async function (event) {
        const count = event.target.result;
        if (count === 0) {
            await adicionarDadosDoJson();
            await mostrarTodosDados();
        } else {
            await mostrarTodosDados();
        }

    };

}


window.onload = function () {
    verificarTabelaVazia();
};
