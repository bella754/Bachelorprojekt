import{r as v,o as k,g as d,c,b as s,a as g,w as a,h as i,u as r,R as l,d as f,e as p,t as m}from"./index-jLO2RzT8.js";const y="/assets/tu-berlin-logo-C_l78clU.svg",b=(u,t)=>{const n=u.__vccOpts||u;for(const[_,o]of t)n[_]=o;return n},w={key:0},E={key:1,class:"sidenavigation"},L={class:"sidenavigation_header"},x={class:"sidenavigation_links"},B={class:"sidenavigation_footer"},C={class:"sidenavigation_userinfo"},N={__name:"Sidenavigation",setup(u){const t=v(null),n=v(!0);async function _(){try{const e=await(await fetch("/current-user",{method:"GET",headers:{"Content-Type":"application/json"}})).json();e&&e.user&&(t.value=e.user)}catch(o){console.error("Error getting user data:",o)}finally{n.value=!1}}return k(_),(o,e)=>n.value?(d(),c("div",w,"Lade Daten...")):(d(),c("div",E,[s("div",L,[e[6]||(e[6]=s("img",{class:"sidenavogation_logo",src:y,alt:"Logo TU Berlin"},null,-1)),s("div",x,[g(r(l),{class:"sidenavigation_link",to:"/"},{default:a(()=>e[0]||(e[0]=[i("Home")])),_:1}),g(r(l),{class:"sidenavigation_link",to:"/my_entries"},{default:a(()=>e[1]||(e[1]=[i("Meine Einträge")])),_:1}),g(r(l),{class:"sidenavigation_link",to:"/new_entry"},{default:a(()=>e[2]||(e[2]=[i("Neuen Eintrag")])),_:1}),t.value.role!=="Standard User"?(d(),f(r(l),{key:0,class:"sidenavigation_link",to:"/all_entries"},{default:a(()=>e[3]||(e[3]=[i("Alle Einträge")])),_:1})):p("",!0),t.value.role=="Controller"?(d(),f(r(l),{key:1,class:"sidenavigation_link",to:"/users"},{default:a(()=>e[4]||(e[4]=[i("Mitarbeitende verwalten")])),_:1})):p("",!0),e[5]||(e[5]=s("a",{class:"sidenavigation_link",href:"https://shibboleth-test.tu-berlin.de/idp/profile/Logout"},"Logout",-1))])]),s("div",B,[s("div",C,m(t.value.name),1)])]))}},h=b(N,[["__scopeId","data-v-60266812"]]);export{h as S,b as _};
