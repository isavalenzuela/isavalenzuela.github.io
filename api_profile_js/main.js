const API_LARNU_URL = "https://larnu-api-upy5mhs63a-rj.a.run.app/api/v1/bootcamp/profile"

//Método addEventListener que escuche el formulario y haga un preventDefault
//para que no se ejecute el action (en HTML)


async function submitFormGetLarnuUser(form) {
  const email = form.elements['larnu-user-email'].value;
  const discordID = form.elements['discord-user-id'].value;

  let larnuUserResponse = "";

  // validar que email y discordID sean distintos de null, o undefined o !== ""

  if ( email.length <= 0 || discordID.length <=0 ) {
    alert("Ingresa el email con el que te registraste en Larnu y tu ID de Discord");
    return;
  }

  //manejar excepciones

  try {
    larnuUserResponse = await getLarnuUserByEmailAndID(email, discordID);
    console.log(larnuUserResponse)
    } catch (e) {
      alert("La búsqueda no arrojó resultados");
      console.log(`Error en servicios ${e}`)
      window.location.href = "index.html";
      return;
    }

  // si el servicio responde ok entonces, larnuUserResponse lo guardamos en el sessionStorage (con la ayuda de JSON.stringify())
  // y redireccionamos a la 2da pantalla donde le pegaremos al servicio pero con el metodo PATCH

  sessionStorage.setItem("larnuUserResponse", JSON.stringify(larnuUserResponse));
  window.location.href = "second_view.html";
}

//método que devuelva data del session storage

function getLarnuResponseFromStorage() {
  const larnuUserResponse = JSON.parse(sessionStorage.getItem("larnuUserResponse"));
  showLarnuUserResponse(larnuUserResponse);
  console.log('estoy aqui')
  console.log(larnuUserResponse);
}

//Método que utilizando axios devuelva una promesa del servicio 
//o endpoint de larnu

function getLarnuUserByEmailAndID(userEmail, userID) {
  const headers = {
    Email: userEmail,
    "Discord-id": userID
  };
  return new Promise((resolve, reject) => {
    axios
      .get(API_LARNU_URL, { headers })
      .then((response) => resolve(response.data));
  });
}

function showLarnuUserResponse(larnuDataInput) {

  const larnuNameSpan = document.getElementById("full-name");
  larnuNameSpan.innerText = larnuDataInput.user.fullName;

  const larnuBatchSpan = document.getElementById("batch");
  larnuBatchSpan.innerText = larnuDataInput.batch;

  const larnuLevelSpan = document.getElementById("level");
  larnuLevelSpan.innerText = larnuDataInput.level;
}

function patchHobbies(userEmail, userID, hobbies) {
  const headers = {
    Email: userEmail,
    "Discord-id": userID
  };
  const payload = {
    hobbies
  };
  return new Promise((resolve, reject) => {
    axios
      .patch(API_LARNU_URL, payload, { headers })
      .then((response) => resolve(response.data));
  });
}


async function submitFormHobbies(form) {
  const hobbies = form.elements['hobbies'].value;
  let patchHobbiesResponse = "";
  const larnuUserResponse = JSON.parse(sessionStorage.getItem("larnuUserResponse"));

  if ( hobbies.length <= 0 ) {
    alert("Ingresa tus hobbies");
    return;
  }
  
  try {
    patchHobbiesResponse = await patchHobbies(larnuUserResponse.user.email, larnuUserResponse.discordId, hobbies);
    console.log(patchHobbiesResponse)
    console.log(hobbies)
    } catch (e) {
      alert("La búsqueda no arrojó resultados");
      console.log(`Error en servicios ${e}`)
      window.location.href = "index.html";
      return;
    }

}