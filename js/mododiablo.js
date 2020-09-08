const DISCLAIMER = '';
class Users{
  __data__ = localStorage.getItem('users');
  constructor(){
    if(this.__data__ != null){
      this.__data__ = JSON.parse(this.__data__);
    } else {
      this.__data__ = {header:['dni', 'nombre', 'apellido', 'empleador'], content: []};
      this.__update__();
    }
  }
  addUser(...args){
    let ret = true, pos = this.__find__(args[0]),
    rewrite = args.length == 5 && typeof args[4] == 'boolean' ? args[4] : false;
    args = args.length == 5 ? args.slice(0,-1) : args;
    if(args.length == 4 && pos === -1){
      this.__data__.content.push(args);
    } else if (args.length == 4 && pos !== -1 && rewrite){
        this.__data__.content[pos] = args;
        ret = true;
    } else {
        ret = false;
    }
    this.__update__();
    return ret;
  }
  getUser(dni){
    let ret =  null,
    p = this.__find__(dni);
    if(p !== -1){
      ret = creatObj(this.__data__.content[p], this.__data__.header);
    }
    return ret === {} ? null : ret;
  }
  removeUser(dni){
    let p = this.__find__(dni);
    if(p !== -1){
      this.__data__.content.splice(p, 1);
      this.__update__();
    }
    return p != -1;
  }
  __update__(){
    if(this.__validatedb__()){
      localStorage.setItem('users', JSON.stringify(this.__data__));
    }
  }
  __validatedb__(){
    let ret = true;
    ret = ret && this.__data__ != null;
    ret = ret && this.__data__ instanceof Object;
    if(ret) ['header', 'content'].forEach((x) => {ret = ret && Object.keys(this.__data__).indexOf(x) !== -1});
    return ret;
  }
  __find__(dni){
    let ret = -1;
    this.__data__.content.forEach((x, i) => {
      if (ret === -1 && x[0] == dni) ret = i;
    });
    return ret;
  }
}
const creatObj = (content, tags) => {
  let ret = {};
  if(content instanceof Array && tags instanceof Array && content.length === tags.length){
    content.forEach((x, i) => {ret[tags[i]] = x});
  }
  return ret;
};
const cleanAll = () => {document.querySelectorAll(`[data-role="page"]`).forEach((x, i) => {if(i!=0) x.style.display = 'none';})};
const switchPage = (pageId) => {
  let dataSet = document.querySelectorAll('[data-role="page"]'), n = -1;
  dataSet.forEach((x, i) => {if(x.id == pageId) n = i;x.style.display = 'none';});
  if(n != -1){
    dataSet[n].style.display = 'block'
  } else {
    dataSet[0].style.display = 'block';
  }
};
const getDniData = (dni) => {
  let db = new Users();
  let user = db.getUser(dni),
  ret = user !== null ? {"datos":[{
          "dni": user.dni,
          "estado": "Autorizado",
          "idestado": "2",
          "idorganizacion": "5063",
          "idpermiso_para_circular": "20088",
          "idprofesion": "2",
          "idvehiculo_tipo": "2",
          "patente": "LUNES A DOMINGO 24 HS",
          "persona": capitalizeAllText(`${user.nombre} ${user.apellido}`),
          "profesion": "Trabajador/a",
          "trabaja_en": user.empleador,
          "vehiculo_tipo": "------------------------"
    }],
  "estado": 1} : {estado: 0};
  return ret;
};
const capitalizeAllText = (str) => {
  let ret = []
  str.split(' ').forEach((x) => {ret.push(x.charAt(0).toUpperCase()+x.slice(1))});
  return ret.join(' ')
};
const addUser = () => {
  let inData = [], db = new Users(), ret;
  ['DNI', 'Nombre (solo nombre)', 'Apellido', 'Empleador'].forEach((x, i) => {
      inData.push(prompt(`${x}: `));
  });
  ret = db.addUser(...inData, true)
  ret ? alert('SUCCESS') : alert('FAILED: "Ya se ingreso ese usuario"');
  return ret;
}
const removeUser = () => {
  let db = new Users(), dni = prompt('Ingrese DNI del usuario a eliminar:'), ret = db.removeUser(dni);
  ret ? alert('SUCCESS') : alert('FAILED! (No existe el usuario)');
  return ret;
}
const disclaimerPopUp = () => {
  let firstTime = localStorage.getItem('firstTime');
  document.querySelector('div.disclaimer').style.display = firstTime ? 'none' : 'flex';
  localStorage.setItem('firstTime', 1);
};
