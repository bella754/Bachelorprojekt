const e="http://json-schema.org/draft-07/schema#",t="Ämter und Gremienaktivität an der TU Berlin",i="object",r={Art:{type:"string",description:"The type or category of the activity"},"akad. Grad":{type:"string",description:"The academic degree of the individual involved"},Vorname:{type:"string",description:"The first name of the individual involved"},Nachname:{type:"string",description:"The last name of the individual involved"},Tätigkeit:{type:"string",description:"The specific activity or role performed"},Gremium:{type:"string",description:"The committee or body in which the activity was performed"},"weitere Angaben":{type:"string",description:"Additional information related to the activity"},Dauer:{type:"string",description:"The duration of the activity"},Wert:{type:"number",description:"The value or importance of the activity, represented as a numeric value"},Freigabe:{type:"string",enum:["Ja","Nein"],description:"Indicates whether the activity is approved or released. Options: Ja (Yes) or Nein (No)"},Gewicht:{type:"number",description:"The weight or significance of the activity, represented as a numeric value"},Regel:{type:"number",description:"The rule or regulation associated with the activity, represented as a numeric value"}},a=["Art","akad. Grad","Vorname","Nachname","Tätigkeit","Gremium","Dauer","Wert"],n=!1,o={$schema:e,title:t,type:i,properties:r,required:a,additionalProperties:n};export{e as $schema,n as additionalProperties,o as default,r as properties,a as required,t as title,i as type};
