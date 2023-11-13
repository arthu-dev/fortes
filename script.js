function logar() {
  var login = document.getElementsByID("login").value;
  var senha = document.getElementsByID("senha").value;

  if (login == "cliente@fortes.com.br" && senha == "fortes10") {
    alert("Sucesso");
  } else {
    alert("Usuário ou senha incorretos");
  }
}
