import{r as _,c as s,a as x,b as d,t as m,u as i,F as f,i as b,p as F,g as r,e as g,k as u,n as E,m as c}from"./index-DPDcnapp.js";import{_ as I,S}from"./Sidenavigation-RB7lK5yz.js";import h from"./ausstellungen-und-messen-BHZD7CLa.js";const A={class:"form_container"},T={class:"form_headline"},$={class:"form"},j=["for"],q={key:0,class:"form_description"},C=["id","onUpdate:modelValue"],K=["value"],L=["id","onUpdate:modelValue","placeholder"],M=["id","onUpdate:modelValue"],O=["id","onUpdate:modelValue","placeholder"],P=["id","onUpdate:modelValue"],R=["id","onUpdate:modelValue"],Z={__name:"ausstellungen-und-messen",setup(z){const V=F(),U=_(V.query.userID),t=_({}),o=h.properties,v=h.required||[],w="https://horus-290d.onrender.com",p=_({});Object.keys(o).forEach(n=>{t.value[n]=""});function N(){let n=!0;return p.value={},v.forEach(l=>{const e=t.value[l];(!e||e==="")&&(p.value[l]="Dieses Feld darf nicht leer sein.",n=!1),o[l].type==="integer"&&(Number.isInteger(Number(e))||(p.value[l]="Bitte nur ganze Zahlen eingeben.",n=!1)),o[l].type==="number"&&isNaN(e)&&(p.value[l]="Bitte eine gültige Zahl eingeben.",n=!1)}),n}async function B(){if(!N()){alert("Bitte alle Fehler beheben, bevor du das Formular absendest.");return}try{const l=await(await fetch(`${w}/api/new-activity/ausstellungen-und-messen/${U.value}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.value)})).json();alert("Formular erfolgreich gesendet!")}catch(n){console.error("Error submitting form:",n)}}function D(n){!["Backspace","Tab","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Delete"].includes(n.key)&&!/^\d$/.test(n.key)&&n.preventDefault()}return(n,l)=>(r(),s(f,null,[x(S),d("div",A,[d("h1",T,m(i(h).title),1),d("form",$,[(r(!0),s(f,null,b(i(v),e=>(r(),s("div",{key:e},[d("label",{class:"form_label",for:e},m(e),9,j),i(o)[e].description?(r(),s("p",q,m(i(o)[e].description),1)):g("",!0),i(o)[e].enum?u((r(),s("select",{key:1,class:"form_input",id:e,"onUpdate:modelValue":a=>t.value[e]=a},[(r(!0),s(f,null,b(i(o)[e].enum,a=>(r(),s("option",{key:a,value:a},m(a),9,K))),128))],8,C)),[[E,t.value[e]]]):i(o)[e].type==="textarea"?u((r(),s("textarea",{key:2,class:"form_input form_input_textarea",id:e,"onUpdate:modelValue":a=>t.value[e]=a,placeholder:"Bitte "+e+" angeben"},null,8,L)),[[c,t.value[e]]]):i(o)[e].type==="integer"?u((r(),s("input",{key:3,step:"1",min:"0",placeholder:"Nur ganze Zahlen",class:"form_input",id:e,"onUpdate:modelValue":a=>t.value[e]=a,type:"number",onKeydown:D},null,40,M)),[[c,t.value[e]]]):i(o)[e].type==="string"?u((r(),s("input",{key:4,class:"form_input",id:e,"onUpdate:modelValue":a=>t.value[e]=a,type:"text",placeholder:"Bitte "+e+" angeben"},null,8,O)),[[c,t.value[e]]]):i(o)[e].type==="number"?u((r(),s("input",{key:5,class:"form_input",id:e,"onUpdate:modelValue":a=>t.value[e]=a,type:"number"},null,8,P)),[[c,t.value[e]]]):i(o)[e].type==="date"?u((r(),s("input",{key:6,class:"form_input",id:e,"onUpdate:modelValue":a=>t.value[e]=a,type:"date"},null,8,R)),[[c,t.value[e]]]):g("",!0)]))),128))]),d("button",{class:"form_submit",onClick:l[0]||(l[0]=e=>B())},"Erstellen")])],64))}},Q=I(Z,[["__scopeId","data-v-b634a151"]]);export{Q as default};
