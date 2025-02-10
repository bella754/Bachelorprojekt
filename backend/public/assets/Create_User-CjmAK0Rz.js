import{r as l,c as p,a as y,b as t,k as v,m,n as N,t as f,e as b,F as S,g as c}from"./index-BMeWYnJQ.js";import{_,S as w}from"./Sidenavigation-Ck9_xBIO.js";const E={class:"create_user"},k={class:"create_user_form"},C={key:0,class:"success"},V={key:1,class:"error"},x={__name:"Create_User",setup(M){const r=l(""),s=l(""),o=l(""),n=l("Standard User"),u=l(""),i=l(""),g="https://horus-290d.onrender.com";async function U(){if(!r.value||!s.value||!o.value||!n.value){i.value="Bitte fülle alle Felder aus.",u.value="";return}try{const d=await fetch(`${g}/api/new-user`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:r.value,email:s.value,department:o.value,role:n.value})});if(!d.ok)throw new Error("Fehler beim Erstellen des Nutzers.");const e=await d.json();u.value="Nutzer erfolgreich erstellt!",i.value="",r.value="",s.value="",o.value="",n.value="Standard User"}catch(d){console.error("Error creating user:",d),i.value="Es gab ein Problem beim Erstellen des Nutzers.",u.value=""}}return(d,e)=>(c(),p(S,null,[y(w,{class:"sidenavigation"}),t("div",E,[e[9]||(e[9]=t("h1",{class:"create_user_headline"},"Nutzer erstellen",-1)),t("div",k,[e[5]||(e[5]=t("label",{for:"name"},"Name:",-1)),v(t("input",{type:"text",id:"name","onUpdate:modelValue":e[0]||(e[0]=a=>r.value=a),placeholder:"Name eingeben..."},null,512),[[m,r.value]]),e[6]||(e[6]=t("label",{for:"email"},"E-Mail:",-1)),v(t("input",{type:"email",id:"email","onUpdate:modelValue":e[1]||(e[1]=a=>s.value=a),placeholder:"E-Mail eingeben..."},null,512),[[m,s.value]]),e[7]||(e[7]=t("label",{for:"department"},"Department:",-1)),v(t("input",{type:"text",id:"department","onUpdate:modelValue":e[2]||(e[2]=a=>o.value=a),placeholder:"Department eingeben..."},null,512),[[m,o.value]]),e[8]||(e[8]=t("label",{class:"label",for:"role"},"Rolle:",-1)),v(t("select",{id:"role","onUpdate:modelValue":e[3]||(e[3]=a=>n.value=a)},e[4]||(e[4]=[t("option",{value:"Standard User"},"Standard User",-1),t("option",{value:"Controller"},"Controller",-1),t("option",{value:"Reviewer"},"Reviewer",-1)]),512),[[N,n.value]]),t("button",{class:"button",onClick:U}," Nutzer erstellen "),u.value?(c(),p("p",C,f(u.value),1)):b("",!0),i.value?(c(),p("p",V,f(i.value),1)):b("",!0)])])],64))}},D=_(x,[["__scopeId","data-v-1c0b72a8"]]);export{D as default};
