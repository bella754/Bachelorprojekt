import{r as f,c as r,a as x,b as d,t as m,u as i,F as _,i as g,p as E,g as s,e as b,k as u,n as F,m as c}from"./index-DPDcnapp.js";import{_ as I,S}from"./Sidenavigation-RB7lK5yz.js";import h from"./einrichtung-eines-internationalen-studiengangs-uIXjO-6H.js";const A={class:"form_container"},T={class:"form_headline"},$={class:"form"},j=["for"],q={key:0,class:"form_description"},C=["id","onUpdate:modelValue"],K=["value"],L=["id","onUpdate:modelValue","placeholder"],O=["id","onUpdate:modelValue"],P=["id","onUpdate:modelValue","placeholder"],R=["id","onUpdate:modelValue"],Z=["id","onUpdate:modelValue"],z={__name:"einrichtung-eines-internationalen-studiengangs",setup(M){const V=E(),U=f(V.query.userID),t=f({}),o=h.properties,v=h.required||[],w="https://horus-290d.onrender.com",p=f({});Object.keys(o).forEach(a=>{t.value[a]=""});function N(){let a=!0;return p.value={},v.forEach(l=>{const e=t.value[l];(!e||e==="")&&(p.value[l]="Dieses Feld darf nicht leer sein.",a=!1),o[l].type==="integer"&&(Number.isInteger(Number(e))||(p.value[l]="Bitte nur ganze Zahlen eingeben.",a=!1)),o[l].type==="number"&&isNaN(e)&&(p.value[l]="Bitte eine gültige Zahl eingeben.",a=!1)}),a}async function B(){if(!N()){alert("Bitte alle Fehler beheben, bevor du das Formular absendest.");return}try{const l=await(await fetch(`${w}/api/new-activity/einrichtung-eines-internationalen-studiengangs/${U.value}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.value)})).json();alert("Formular erfolgreich gesendet!")}catch(a){console.error("Error submitting form:",a)}}function D(a){!["Backspace","Tab","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Delete"].includes(a.key)&&!/^\d$/.test(a.key)&&a.preventDefault()}return(a,l)=>(s(),r(_,null,[x(S),d("div",A,[d("h1",T,m(i(h).title),1),d("form",$,[(s(!0),r(_,null,g(i(v),e=>(s(),r("div",{key:e},[d("label",{class:"form_label",for:e},m(e),9,j),i(o)[e].description?(s(),r("p",q,m(i(o)[e].description),1)):b("",!0),i(o)[e].enum?u((s(),r("select",{key:1,class:"form_input",id:e,"onUpdate:modelValue":n=>t.value[e]=n},[(s(!0),r(_,null,g(i(o)[e].enum,n=>(s(),r("option",{key:n,value:n},m(n),9,K))),128))],8,C)),[[F,t.value[e]]]):i(o)[e].type==="textarea"?u((s(),r("textarea",{key:2,class:"form_input form_input_textarea",id:e,"onUpdate:modelValue":n=>t.value[e]=n,placeholder:"Bitte "+e+" angeben"},null,8,L)),[[c,t.value[e]]]):i(o)[e].type==="integer"?u((s(),r("input",{key:3,step:"1",min:"0",placeholder:"Nur ganze Zahlen",class:"form_input",id:e,"onUpdate:modelValue":n=>t.value[e]=n,type:"number",onKeydown:D},null,40,O)),[[c,t.value[e]]]):i(o)[e].type==="string"?u((s(),r("input",{key:4,class:"form_input",id:e,"onUpdate:modelValue":n=>t.value[e]=n,type:"text",placeholder:"Bitte "+e+" angeben"},null,8,P)),[[c,t.value[e]]]):i(o)[e].type==="number"?u((s(),r("input",{key:5,class:"form_input",id:e,"onUpdate:modelValue":n=>t.value[e]=n,type:"number"},null,8,R)),[[c,t.value[e]]]):i(o)[e].type==="date"?u((s(),r("input",{key:6,class:"form_input",id:e,"onUpdate:modelValue":n=>t.value[e]=n,type:"date"},null,8,Z)),[[c,t.value[e]]]):b("",!0)]))),128))]),d("button",{class:"form_submit",onClick:l[0]||(l[0]=e=>B())},"Erstellen")])],64))}},Q=I(z,[["__scopeId","data-v-bff66361"]]);export{Q as default};
