import{r as v,o as y,g as l,c as f,b as o,a as g,w as n,h as a,u as i,R as r,d as p,e as k,t as w}from"./index-Bclo-y69.js";const C="/assets/tu-berlin-logo-C_l78clU.svg",E=(d,t)=>{const s=d.__vccOpts||d;for(const[u,c]of t)s[u]=c;return s},L={key:0},h={key:1,class:"sidenavigation"},x={class:"sidenavigation_header"},B={class:"sidenavigation_links"},N={class:"sidenavigation_footer"},S={class:"sidenavigation_userinfo"},U={__name:"Sidenavigation",setup(d){const t=v(null),s=v(!0),u="https://horus-290d.onrender.com";async function c(){try{const e=await(await fetch(`${u}/current-user`,{method:"GET",headers:{"Content-Type":"application/json"}})).json();e&&e.user&&(t.value=e.user)}catch(_){console.error("Error getting user data:",_)}finally{s.value=!1}}async function m(){console.log("in frontend logout function"),window.location.href="https://horus-290d.onrender.com/logout"}return y(c),(_,e)=>s.value?(l(),f("div",L,"Lade Daten...")):(l(),f("div",h,[o("div",x,[e[6]||(e[6]=o("img",{class:"sidenavogation_logo",src:C,alt:"Logo TU Berlin"},null,-1)),o("div",B,[g(i(r),{class:"sidenavigation_link",to:"/"},{default:n(()=>e[1]||(e[1]=[a("Home")])),_:1}),g(i(r),{class:"sidenavigation_link",to:"/my_entries"},{default:n(()=>e[2]||(e[2]=[a("Meine Einträge")])),_:1}),g(i(r),{class:"sidenavigation_link",to:"/new_entry"},{default:n(()=>e[3]||(e[3]=[a("Neuen Eintrag")])),_:1}),t.value.role!=="Standard User"?(l(),p(i(r),{key:0,class:"sidenavigation_link",to:"/all_entries"},{default:n(()=>e[4]||(e[4]=[a("Alle Einträge")])),_:1})):k("",!0),t.value.role=="Controller"?(l(),p(i(r),{key:1,class:"sidenavigation_link",to:"/users"},{default:n(()=>e[5]||(e[5]=[a("Mitarbeitende verwalten")])),_:1})):k("",!0),o("div",{class:"sidenavigation_link",onClick:e[0]||(e[0]=b=>m())},"Logout")])]),o("div",N,[o("div",S,w(t.value.name),1)])]))}},V=E(U,[["__scopeId","data-v-6381bf21"]]);export{V as S,E as _};
