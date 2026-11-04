const stockBand=(stock,capacity)=>stock<=0?"empty":stock<=Math.max(2,Math.ceil(capacity*.22))?"low":"ready";

export function venueVisualState({open=true,broken=false,stock=0,capacity=10,queueCount=0,rushMultiplier=1,recentDelivery=false,cleaning=false}={}){
  const repair=Boolean(broken),operating=Boolean(open&&!repair),stockLevel=stockBand(Math.max(0,stock),Math.max(1,capacity));
  return {
    status:repair?"repair":operating?"open":"closed",
    open:operating,
    repair,
    lightsOn:operating,
    shutters:!operating,
    stockLevel,
    emptyShelves:stockLevel==="empty",
    lowStock:stockLevel==="low",
    restocking:Boolean(recentDelivery&&!repair),
    queueCount:Math.max(0,queueCount),
    queueBarriers:Boolean(operating&&stockLevel!=="empty"&&(queueCount>=2||rushMultiplier>=1.55)),
    cleaning:Boolean(cleaning)
  };
}

export function eventPreparationState({scheduledEvent,currentDay,currentMinute,deckId}={}){
  if(!scheduledEvent||scheduledEvent.source!=="dj"||scheduledEvent.deckId!==deckId)return {preparing:false,minutesUntil:null};
  const dayOffset=(scheduledEvent.day??currentDay)-(currentDay??scheduledEvent.day),minutesUntil=dayOffset*1440+(scheduledEvent.startMinute??0)-(currentMinute??0);
  return {preparing:minutesUntil>=0&&minutesUntil<=1440,minutesUntil};
}
