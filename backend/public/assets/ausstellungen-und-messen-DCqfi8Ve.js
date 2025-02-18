const e="http://json-schema.org/draft-07/schema#",t="Ausstellungen und Messen",i="object",n={Zeitraum:{type:"string",pattern:"^\\d{2}\\.\\d{2}\\.\\d{2} - \\d{2}\\.\\d{2}\\.\\d{2}$",description:"The time range in the format DD.MM.YY - DD.MM.YY, where the second date is equal to or later than the first date. Validation of this condition must be performed programmatically."},"akad. Grad":{type:"string",description:"The academic degree of the participant"},Vorname:{type:"string",description:"The first name of the participant"},Nachname:{type:"string",description:"The last name of the participant"},Name:{type:"string",description:"The name associated with the exhibition or fair"},"Ausstellung-, Messe":{type:"string",description:"The type of event: exhibition or fair"},Ort:{type:"string",description:"The location of the event"},Land:{type:"string",description:"The country where the event is held"},Art:{type:"string",enum:["Nat.","Int."],description:"The nature or category of the event: Nat. (National) or Int. (International)"},Exponat:{type:"string",description:"The exhibit displayed"},"Teilnahme an":{type:"string",description:"Details of participation in the event"},Freigabe:{type:"boolean",description:"Approval or release status of the event"},Gewicht:{type:"string",enum:["Ja","Nein"],description:"Indicates whether weight is applicable: Ja (Yes) or Nein (No)"},Regel:{type:"number",description:"The rule or regulation associated with the event, represented as a numeric value"}},r=["Zeitraum","Vorname","Nachname","Name","Ort","Land","Art"],a=!1,s={$schema:e,title:t,type:i,properties:n,required:r,additionalProperties:a};export{e as $schema,a as additionalProperties,s as default,n as properties,r as required,t as title,i as type};
