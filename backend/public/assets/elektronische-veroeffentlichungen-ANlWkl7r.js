import{r as h,c as n,a as B,b as d,t as p,u as i,F as m,i as v,p as D,g as l,e as b,k as u,n as x,m as c}from"./index-CYLzpNoR.js";import{_ as F,S as I}from"./Sidenavigation-heGTWfdG.js";import f from"./elektronische-veroeffentlichungen-E5kgDHgz.js";const S={class:"form_container"},A={class:"form_headline"},T={class:"form"},$=["for"],j={key:0,class:"form_description"},q=["id","onUpdate:modelValue"],C=["value"],K=["id","onUpdate:modelValue","placeholder"],L=["id","onUpdate:modelValue"],O=["id","onUpdate:modelValue","placeholder"],P=["id","onUpdate:modelValue"],R=["id","onUpdate:modelValue"],Z={__name:"elektronische-veroeffentlichungen",setup(z){const g=D(),V=h(g.query.userID),t=h({}),a=f.properties,_=f.required||[],U="https://horus-290d.onrender.com";Object.keys(a).forEach(r=>{t.value[r]=""});function w(){let r=!0;return fieldErrors.value={},_.forEach(s=>{const e=t.value[s];(!e||e==="")&&(fieldErrors.value[s]="Dieses Feld darf nicht leer sein.",r=!1),a[s].type==="integer"&&(Number.isInteger(Number(e))||(fieldErrors.value[s]="Bitte nur ganze Zahlen eingeben.",r=!1)),a[s].type==="number"&&isNaN(e)&&(fieldErrors.value[s]="Bitte eine gültige Zahl eingeben.",r=!1)}),r}async function E(){if(!w()){alert("Bitte alle Fehler beheben, bevor du das Formular absendest.");return}try{const s=await(await fetch(`${U}/api/new-activity/elektronische-veroeffentlichungen/${V.value}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.value)})).json();alert("Formular erfolgreich gesendet!")}catch(r){console.error("Error submitting form:",r)}}function N(r){!["Backspace","Tab","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Delete"].includes(r.key)&&!/^\d$/.test(r.key)&&r.preventDefault()}return(r,s)=>(l(),n(m,null,[B(I),d("div",S,[d("h1",A,p(i(f).title),1),d("form",T,[(l(!0),n(m,null,v(i(_),e=>(l(),n("div",{key:e},[d("label",{class:"form_label",for:e},p(e),9,$),i(a)[e].description?(l(),n("p",j,p(i(a)[e].description),1)):b("",!0),i(a)[e].enum?u((l(),n("select",{key:1,class:"form_input",id:e,"onUpdate:modelValue":o=>t.value[e]=o},[(l(!0),n(m,null,v(i(a)[e].enum,o=>(l(),n("option",{key:o,value:o},p(o),9,C))),128))],8,q)),[[x,t.value[e]]]):i(a)[e].type==="textarea"?u((l(),n("textarea",{key:2,class:"form_input form_input_textarea",id:e,"onUpdate:modelValue":o=>t.value[e]=o,placeholder:"Bitte "+e+" angeben"},null,8,K)),[[c,t.value[e]]]):i(a)[e].type==="integer"?u((l(),n("input",{key:3,step:"1",min:"0",placeholder:"Nur ganze Zahlen",class:"form_input",id:e,"onUpdate:modelValue":o=>t.value[e]=o,type:"number",onKeydown:N},null,40,L)),[[c,t.value[e]]]):i(a)[e].type==="string"?u((l(),n("input",{key:4,class:"form_input",id:e,"onUpdate:modelValue":o=>t.value[e]=o,type:"text",placeholder:"Bitte "+e+" angeben"},null,8,O)),[[c,t.value[e]]]):i(a)[e].type==="number"?u((l(),n("input",{key:5,class:"form_input",id:e,"onUpdate:modelValue":o=>t.value[e]=o,type:"number"},null,8,P)),[[c,t.value[e]]]):i(a)[e].type==="date"?u((l(),n("input",{key:6,class:"form_input",id:e,"onUpdate:modelValue":o=>t.value[e]=o,type:"date"},null,8,R)),[[c,t.value[e]]]):b("",!0)]))),128))]),d("button",{class:"form_submit",onClick:s[0]||(s[0]=e=>E())},"Erstellen")])],64))}},H=F(Z,[["__scopeId","data-v-04f83b5c"]]);export{H as default};
