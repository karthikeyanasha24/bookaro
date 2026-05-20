const getActiveFunnelStep = (status) => {
  const map = {
    "interest sent": 1,
    "invite user for a visit": 1,
    "owner changed the slot": 1,
    "request to change the visit slot": 1,
    "slot booked by user": 1,
    "visit accept by user": 1,
    "visit hosted": 2,
    "review submit by user": 3,
    "application submit by user": 3,
    "owner accept the application": 4,
    "offer sent": 4,
    "offer submit by owner": 4,
    "offer accept by owner": 4,
    "offer accept by user": 4,
    "offer refused by owner": 4,
    "offer refused by user": 4,
    "preslot opened by owner": 5,
    "home inventory opened by owner": 5,
    "request to change the pre-sale slot": 5,
    "request to change the home inventory slot": 6,
    "preslot booked by user": 5,
    "signing date booked by owner": 5,
    "preslot accept by user": 6,
    "preslot accept by owner": 6,
    "home inventory accept by user": 6,
    "contract signed by user": 6,
    "contract signed by owner": 6,
    "saleslot booked by owner": 6,
    "saleslot booked by user": 6,
    "renter assigned": 7,
    "transfered": 7,
    "renter transfered": 7,
    "confirmation by user": 7,
    "owner reject the application": 3,
  };

  return map[status?.trim()] || null;
};

export default function FunnelIcons({ card }) {
  const activeStep = getActiveFunnelStep(card?.funnelStatus);
  const icons = [
    "calendar",
    "home",
    "stars",
    "euro",
    "hands",
    "calendar",
    "key",
  ];
  const rejected = card?.funnelStatus === "owner reject the application";

  return (
    <>
      <ul className="flex items-center justify-between p-4">
        {icons.map((icon, idx) => {
          const step = idx + 1;
          const isActive = activeStep === step;
          const imageName = `${icon}${isActive ? "-fill" : ""}${icon === "euro" && rejected ? "-red" : ""}`;

          return (
            <li key={idx} className="lg:w-[14%] flex items-center justify-center">
              <img
                alt={icon}
                src={`/assets/img/transaction/${imageName}.png`}
                className={`w-[20px] ${isActive ? "opacity-100" : "opacity-50"}`}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}
