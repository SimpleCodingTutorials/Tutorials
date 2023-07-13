birthDate.addEventListener("input",function(){
  calculateAge(birthDate.value);
});

function calculateAge(dateString) {
  if(!dateString){
    ageDiv.innerHTML="";
    return;
  }
  let today=new Date();
  let birthDate=new Date(dateString);
  if(birthDate>today){
    ageDiv.innerHTML="Invalid Date";
    return;
  }
  let age=today.getFullYear()-birthDate.getFullYear();
  let m= today.getMonth()-birthDate.getMonth();
  let d=today.getDate()-birthDate.getDate();
  if(m<0 || (m===0 && today.getDate()<birthDate.getDate())){
    age--;
    m+=12;
  }
  if(d<0) {
    m--;
    d+=new Date(today.getFullYear(),today.getMonth(),0).getDate();
  }
  ageDiv.innerHTML=`${age} years,${m} months, and ${d} day`;
}