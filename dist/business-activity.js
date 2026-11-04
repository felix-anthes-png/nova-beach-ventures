export const BUSINESS_ACTIVITY_TYPES=Object.freeze({
  "transit-bakery":"bakery",
  "village-gym":"gym",
  "sports-fitness":"gym",
  "sports-padel":"padel",
  "village-laundry":"laundry",
  "beach-seafood":"restaurant",
  "beach-surf":"surf-rental",
  "transit-parking":"parking",
  "innovation-conference":"conference"
});

export function businessActivityState({businessId,broken=false,stock=0,activeGuests=0,queuedGuests=0,clockMinutes=0}={}){
  const type=BUSINESS_ACTIVITY_TYPES[businessId]||null,available=Math.max(0,stock),open=Boolean(type&&!broken&&available>0),engaged=Math.max(0,activeGuests),queued=Math.max(0,queuedGuests);
  return {
    type,
    open,
    running:Boolean(open&&(engaged>0||queued>0)),
    activeGuests:engaged,
    queuedGuests:queued,
    intensity:open?Math.min(3,Math.max(1,engaged+Math.ceil(queued/2))):0,
    phase:((clockMinutes%60)+60)%60/60,
    occupied:open?Math.min(4,Math.max(engaged,queued>0?1:0)):0
  };
}
