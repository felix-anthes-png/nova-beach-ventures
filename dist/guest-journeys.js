export const ARRIVAL_MODES=Object.freeze({
  bus:Object.freeze({id:"bus",label:"campus bus",icon:"BUS"}),
  bicycle:Object.freeze({id:"bicycle",label:"bicycle",icon:"BIKE"}),
  foot:Object.freeze({id:"foot",label:"on foot",icon:"WALK"})
});

export const VENUE_JOURNEYS=Object.freeze({
  academy:Object.freeze({
    id:"academy",zone:"academy",entrance:Object.freeze({x:20,y:12.2}),indoorEntry:Object.freeze({x:7.5,y:8.8}),
    route:Object.freeze([Object.freeze({x:7.5,y:9.35}),Object.freeze({x:7.5,y:8.45}),Object.freeze({x:10.55,y:8.45}),Object.freeze({x:10.55,y:6.35}),Object.freeze({x:10.35,y:5.4})]),
    activity:"Attending a lecture",pose:"study",carry:null,followUp:Object.freeze({x:20.1,y:12.75,label:"Academic courtyard",activity:"Leaving class for the courtyard"})
  }),
  cafe:Object.freeze({
    id:"cafe",zone:"academy",entrance:Object.freeze({x:20,y:12.2}),indoorEntry:Object.freeze({x:7.5,y:8.8}),
    route:Object.freeze([Object.freeze({x:7.5,y:9.35}),Object.freeze({x:6.7,y:8.75}),Object.freeze({x:6.35,y:6.8}),Object.freeze({x:5.55,y:5.05}),Object.freeze({x:4.25,y:4.15}),Object.freeze({x:4.25,y:6.55})]),
    activity:"Eating at the café commons",pose:"eat",carry:"coffee",followUp:Object.freeze({x:17.55,y:14.25,label:"Café terrace"})
  }),
  merch:Object.freeze({
    id:"merch",zone:"hub",entrance:Object.freeze({x:34.5,y:14.2}),indoorEntry:Object.freeze({x:7.5,y:8.8}),
    route:Object.freeze([Object.freeze({x:6.8,y:8.25}),Object.freeze({x:6.55,y:6.7}),Object.freeze({x:5.25,y:5.05}),Object.freeze({x:4.8,y:7.7})]),
    activity:"Browsing the Merch Lab",pose:"browse",carry:"shopping-bag",followUp:Object.freeze({x:35.5,y:19.9,label:"Student lawn"})
  })
});

export function arrivalModeForGuest({groupId,gateId,cohortId=0,transitOpen=false}={}){
  if(transitOpen&&gateId==="transit")return ARRIVAL_MODES.bus;
  if(["student","staff","resident","local","athlete"].includes(groupId)&&cohortId%3===1)return ARRIVAL_MODES.bicycle;
  return ARRIVAL_MODES.foot;
}

export function venueJourneyForTarget(target){
  if(!target)return null;
  if(target.kind==="landmark"&&target.id==="academy")return VENUE_JOURNEYS.academy;
  if(target.kind!=="store")return null;
  return VENUE_JOURNEYS[target.id]||null;
}

export function interiorRouteForJourney(journey,slot=0,reverse=false){
  if(!journey)return [];
  const offset=(slot-1)*.14,entry={x:journey.indoorEntry.x+offset,y:journey.indoorEntry.y},route=[entry,...journey.route.map((point,index)=>({x:point.x+offset*(index<2?1:.35),y:point.y}))];
  return reverse?[...route].reverse():route;
}

export function journeyCarryForTarget(target){return venueJourneyForTarget(target)?.carry||null;}
