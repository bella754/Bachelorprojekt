import{_ as m,S as h}from"./Sidenavigation-Bh2WWG8S.js";import{r as u,o as y,c as r,a as f,b as o,F as l,i as w,e as v,g as n,d as g,w as k,h as N,t as E,u as b,f as x}from"./index-BUUCowTa.js";const j={class:"new-entry"},B={key:0,class:"new-entry_formselection"},C={__name:"New_Entry",setup(L){const i=u([]),c=Object.assign({}),s=u(null),d="https://horus-290d.onrender.com";b();async function p(){try{const e=await(await fetch(`${d}/api/current-user`,{method:"GET",headers:{"Content-Type":"application/json"}})).json();e&&e.user&&(s.value=e.user)}catch(t){console.error("Error getting user data:",t)}}return y(async()=>{await p();for(const t in c)c[t]().then(e=>{i.value.push({name:e.title||t.split("/").pop().replace(".json",""),path:t})})}),(t,e)=>{const _=x("RouterLink");return n(),r(l,null,[f(h,{class:"sidenavigation"}),o("div",j,[e[0]||(e[0]=o("h1",{class:"new-entry_headline"},"Neuen Eintrag hinzufügen",-1)),e[1]||(e[1]=o("h3",{class:"new-entry_subheadline"},"Wählen Sie bitte ein Formular aus",-1)),s.value?(n(),r("div",B,[(n(!0),r(l,null,w(i.value,a=>(n(),g(_,{class:"new-entry_formlink",key:a.name,to:{path:"/new_entry/form",query:{userID:s.value._id,activityTitle:a.name}}},{default:k(()=>[N(E(a.name),1)]),_:2},1032,["to"]))),128))])):v("",!0)])],64)}}},T=m(C,[["__scopeId","data-v-56e1b2f1"]]);export{T as default};
