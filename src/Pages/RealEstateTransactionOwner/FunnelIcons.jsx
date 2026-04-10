export default function FunnelIcons({ card }) {
    return <>
        <ul className="flex items-center justify-between p-4">
            {[
                "calendar",
                "home",
                "stars",
                "euro",
                "hands",
                "calendar",
                // "doc",
                "key",
            ].map((icon, idx) => {
                let iconVal = card[`icon${idx + 1}`];
                let rejected = card?.funnelStatus == 'owner reject the application' ? true : false

                return (
                    <li key={idx} className={`lg:w-[14%]`}>
                        <img
                            alt={icon}
                            src={`assets/img/transaction/${iconVal ? icon + "-fill" : icon
                                }${icon == 'euro' && rejected ? '-red' : ''}.png`}
                            className="w-[20px]"
                        />
                    </li>
                );
            })}
        </ul>
    </>
}