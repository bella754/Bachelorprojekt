import{r as f,c as a,a as x,b as i,t as p,u as r,F as m,i as h,p as A,g as n,e as v,k as u,n as B,m as d}from"./index-BMeWYnJQ.js";import{_ as N,S}from"./Sidenavigation-Ck9_xBIO.js";import _ from"./vortrag-auf-tagungen-konferenzen-qU77qAGf.js";const E={class:"form_container"},I={class:"form_headline"},T={class:"form"},z=["for"],K={key:0,class:"form_description"},$=["id","onUpdate:modelValue"],j=["value"],q=["id","onUpdate:modelValue","placeholder"],C=["id","onUpdate:modelValue"],F=["id","onUpdate:modelValue","placeholder"],L=["id","onUpdate:modelValue"],O=["id","onUpdate:modelValue"],P={__name:"vortrag-auf-tagungen-konferenzen",setup(R){const g=A(),b=f(g.query.userID),t=f({}),s=_.properties,V=_.required||[],U="https://horus-290d.onrender.com";Object.keys(s).forEach(l=>{t.value[l]=""});async function w(){console.log("formData in frontend: ",t.value);try{const c=await(await fetch(`${U}/api/new-activity/vortrag-auf-tagungen-konferenzen/${b.value}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.value)})).json()}catch(l){console.error("Error submitting form:",l)}}function D(l){!["Backspace","Tab","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Delete"].includes(l.key)&&!/^\d$/.test(l.key)&&l.preventDefault()}return(l,c)=>(n(),a(m,null,[x(S),i("div",E,[i("h1",I,p(r(_).title),1),i("form",T,[(n(!0),a(m,null,h(r(V),e=>(n(),a("div",{key:e},[i("label",{class:"form_label",for:e},p(e),9,z),r(s)[e].description?(n(),a("p",K,p(r(s)[e].description),1)):v("",!0),r(s)[e].enum?u((n(),a("select",{key:1,class:"form_input",id:e,"onUpdate:modelValue":o=>t.value[e]=o},[(n(!0),a(m,null,h(r(s)[e].enum,o=>(n(),a("option",{key:o,value:o},p(o),9,j))),128))],8,$)),[[B,t.value[e]]]):r(s)[e].type==="textarea"?u((n(),a("textarea",{key:2,class:"form_input form_input_textarea",id:e,"onUpdate:modelValue":o=>t.value[e]=o,placeholder:"Bitte "+e+" angeben"},null,8,q)),[[d,t.value[e]]]):r(s)[e].type==="integer"?u((n(),a("input",{key:3,step:"1",min:"0",placeholder:"Nur ganze Zahlen",class:"form_input",id:e,"onUpdate:modelValue":o=>t.value[e]=o,type:"number",onKeydown:D},null,40,C)),[[d,t.value[e]]]):r(s)[e].type==="string"?u((n(),a("input",{key:4,class:"form_input",id:e,"onUpdate:modelValue":o=>t.value[e]=o,type:"text",placeholder:"Bitte "+e+" angeben"},null,8,F)),[[d,t.value[e]]]):r(s)[e].type==="number"?u((n(),a("input",{key:5,class:"form_input",id:e,"onUpdate:modelValue":o=>t.value[e]=o,type:"number"},null,8,L)),[[d,t.value[e]]]):r(s)[e].type==="date"?u((n(),a("input",{key:6,class:"form_input",id:e,"onUpdate:modelValue":o=>t.value[e]=o,type:"date"},null,8,O)),[[d,t.value[e]]]):v("",!0)]))),128))]),i("button",{class:"form_submit",onClick:c[0]||(c[0]=e=>w())},"Erstellen")])],64))}},y=N(P,[["__scopeId","data-v-3fe47ed0"]]);export{y as default};
