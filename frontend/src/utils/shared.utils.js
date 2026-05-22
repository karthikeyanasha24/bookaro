import { dateFormate } from "../models/string.model";

export const renterCurrentStatus = (status, card) => {
    switch (status) {
        case "interest sent":
            return "Interest received";
        case "offer sent":
            return "Offer received";
        case "cancelled":
            return "Cancelled";
        case "invite user for a visit":
            return `${card?.buyerId?.fullName} must book a visit slot`;
        case "request to change the pre-sale slot":
            return `${card?.buyerId?.fullName} requested to change pre-signing slots`;
        case "request to change the home inventory slot":
            return `${card?.buyerId?.fullName} requested to change home inventory slots`;
        case "request to change the final signing slot":
            return `${card?.buyerId?.fullName} requested to change final signing slots`;
        case "request to change the visit slot":
            return `${card?.buyerId?.fullName} requested to change slots`;
        case "owner changed the slot":
            return `You changed the slot`;
        case "owner changed the pre-signing slot":
            return `You changed the pre-signing slot`;
        case "owner changed the home inventory slot":
            return `You changed the home inventory slot`;
        case "visit accept by user":
            return `Visit booked - ${dateFormate(card?.finalVisitDate?.date)} (${card?.finalVisitDate?.from
                } - ${card?.finalVisitDate?.to})`;
        case "visit hosted":
            return `The visit took place on ${dateFormate(
                card?.finalVisitDate?.date
            )}`;
        case "review submit by user":
            return `Visit review received`;
        case "application submit by user":
            return "Application file received";
        case "owner accept the application":
            return `You accepted ${card?.buyerId?.fullName} application`;
        case "preslot opened by owner":
            return `You opened pre signing date`;
        case "home inventory opened by owner":
            return `You opened home inventory slot`;
        case "owner reject the application":
            return `You refused the application`;
        case "offer refused by owner":
            return "You refused the offer";
        case "offer refused by user":
            return `Offer refused by ${card?.buyerId?.fullName}`;
        case "offer submit by owner":
            return `You sent a counter-offer`;
        case "offer accept by owner":
            return `You accepted ${card?.buyerId?.fullName} purchase offer`;
        case "offer accept by user":
            return `Offer accepted`;
        case "signing date booked by owner":
            return `You opened home inventory and signing date on ${dateFormate(
                card?.ownerPresale
            )}`;
        case "preslot booked by user":
            return `${card?.buyerId?.fullName
                } opened a signing date on ${dateFormate(card?.userPresale)}`;
        case "preslot accept by owner":
            return `You booked a contract signing date on ${dateFormate(card?.finalPresale)}`;
        case "preslot accept by user":
            return `${card?.buyerId?.fullName} has book a date for contract signing on ${dateFormate(card?.finalSignSlot?.date)} (${card?.finalSignSlot?.from
                } - ${card?.finalSignSlot?.to})`;
        case "home inventory accept by user":
            return `${card?.buyerId?.fullName} has book a date for home inventory on ${dateFormate(card?.finalHomeInventorySlot?.date)} (${card?.finalHomeInventorySlot?.from
                } - ${card?.finalHomeInventorySlot?.to})`;
        case "contract signed by owner":
            return `Rental contract has been signed`;
        case "contract signed by user":
            return `Rental contract has been signed`;
        case "saleslot booked by owner":
            return `You opened final sale signing dates`;
        case "saleslot booked by user":
            return `${card?.buyerId?.fullName
                } opened final sale signing date on ${dateFormate(card?.userSale)}`;
        case "renter assigned":
            return `Renter Assigned`

        default:
            return status;
    }
};

export const renterNextStatus = (status, card) => {
    switch (status) {
        case "interest sent":
            return "Invite user for a visit";
        case "offer sent":
            return "Invite user for a visit";
        case "invite for a visit":
            return "Invited";
        case "invite user for a visit":
            return "Host the visit";
        case "request to change the pre-sale slot":
            return "Change the pre-signing slot";
        case "request to change the home inventory slot":
            return "Change the home inventory slot";

        case "request to change the final signing slot":
            return "Change the final signing slot";

        case "request to change the visit slot":
            return "Change the visit slot";
        case "owner changed the slot":
            return `Waiting for ${card?.buyerId?.fullName} to book a slot`;
        case "owner changed the pre-signing slot":
            return `Waiting for ${card?.buyerId?.fullName} to book a pre-signing slot`;
        case "owner changed the home inventory slot":
            return `Waiting for ${card?.buyerId?.fullName} to book a home inventory slot`;
        case "slot booked by user":
            return "Host the visit";
        case "visit accept by owner":
            return "Host the visit";
        case "slot booked by owner":
            return "Host the visit";
        case "visit accept by user":
            return `Host the visit`;
        case "visit hosted":
            return `Waiting for visit review or Application from ${card?.buyerId?.fullName}`;
        case "review submit by user":
            return `Waiting for ${card?.buyerId?.fullName} to submit an offer`;
        case "application submit by user":
            return "Answer Application";
        case "owner accept the application":
            return `Open home inventory and signing dates`;
        case "preslot opened by owner":
            return `Awaiting for ${card?.buyerId?.fullName} to book pre-signing date`;
        case "home inventory opened by owner":
            return `Awaiting for ${card?.buyerId?.fullName} to book home inventory slot`;

        case "offer refused by user":
            return "Update your offer";
        case "offer submit by owner":
            return `Waiting ${card?.buyerId?.fullName} to answer`;
        case "offer accept by owner":
            return `Open pre-sale signing dates`;
        case "offer accept by user":
            return `Open pre-sale signing dates`;
        case "signing date booked by owner":
            return `Awaiting for ${card?.buyerId?.fullName} to book signing date`;
        case "preslot booked by user":
            return `Answer signing date`;
        case "preslot accept by owner":
            return `Contract signing and home inventory`;
        case "preslot accept by user":
            return `Contract signing and home inventory`;
        case "home inventory accept by user":
            return `Final Confirmation`;
        case "contract signed by owner":
            return `Open Home Inventory`;
        case "contract signed by user":
            return `Open Home Inventory`;
        case "saleslot booked by owner":
            return `Awaiting for ${card?.buyerId?.fullName} to book final sale signing date`;
        case "saleslot booked by user":
            return `Answer final sale signing`;

        default:
            return status;
    }
};

export const landerCurrentStatus = (status, card) => {
    switch (status) {
        case "interest sent":
            return "Interest sent";
        case "offer sent":
            return "Offer sent";
        case "cancelled":
            return "Cancelled";
        case "invite user for a visit":
            return "Visit invite received";
        case "request to change the visit slot":
            return "Visit invite received";
        case "owner changed the slot":
            return `${card?.propertyId?.addedBy?.fullName || "owner"} changed the slot`;
        case "owner changed the pre-signing slot":
            return `${card?.propertyId?.addedBy?.fullName || "owner"} changed the pre-signing slot`;
        case "owner changed the home inventory slot":
            return `${card?.propertyId?.addedBy?.fullName || "owner"} changed the home inventory slot`;

        case "visit accept by user":
            return `Visit booked - ${dateFormate(card?.finalVisitDate?.date)} (${card?.finalVisitDate?.from} - ${card?.finalVisitDate?.to})`;

        case "visit hosted":
            return `The visit took place on ${dateFormate(card?.finalVisitDate?.date)}`;
        case "review submit by user":
            return "Visit review submited";
        case "application submit by user":
            return "Application file sent";
        case "owner accept the application":
            return `${card?.propertyId?.addedBy?.fullName || "owner"} accepted your application`;
        case "owner reject the application":
            return `${card?.propertyId?.addedBy?.fullName || "owner"} did not accept your application`;
        case "preslot opened by owner":
            return `${card?.propertyId?.addedBy?.fullName || "owner"} has opened pre signing dates`;
        case "home inventory opened by owner":
            return `${card?.propertyId?.addedBy?.fullName || "owner"} has opened home inventory slots`;


        case "signing date booked by owner":
            return `${card?.propertyId?.addedBy?.fullName || "owner"} has opened signing and home inventory date on ${dateFormate(card?.ownerPresale)}`;
        case "request to change the pre-sale slot":
            return "You requested to change pre-signing slots";
        case "request to change the home inventory slot":
            return "You requested to change home inventory slots";

        case "offer refused by owner":
            return "Owner did not accept your offer";
        case "offer refused by user":
            return "You refused the offer";
        case "offer submit by owner":
            return `Counter-offer received`;
        case "offer accept by owner":
            return `${card?.propertyId?.addedBy?.fullName || "owner"} accepted your purchase offer`;
        case "offer accept by user":
            return `You accepted purchase offer`;

        case "preslot booked by user":
            return `You opened signing date on ${dateFormate(card?.userPresale)}`;
        case "preslot accept by owner":
            return `${card?.propertyId?.addedBy?.fullName || "owner"} has accepted a contract signing date on ${dateFormate(card?.finalPresale)}`;
        case "preslot accept by user":
            return `You booked a contract signing date on ${dateFormate(card?.finalSignSlot?.date)} (${card?.finalSignSlot?.from
                } - ${card?.finalSignSlot?.to})`;
        case "home inventory accept by user":
            return `You booked a home inventory date on ${dateFormate(card?.finalHomeInventorySlot?.date)} (${card?.finalHomeInventorySlot?.from
                } - ${card?.finalHomeInventorySlot?.to})`;
        case "contract signed by owner":
            return `Rental contract has been signed`;
        case "contract signed by user":
            return `Rental contract has been signed`;
        case "saleslot booked by owner":
            return `Owner opened final sale signing dates`;
        case "saleslot booked by user":
            return `You opened final sale signing dates on ${dateFormate(card?.userSale)}`;

        case "renter assigned":
            return `You are the tenant of this property.`

        default:
            return status;
    }
};

export const landerNextStatus = (status, card) => {
    switch (status) {
        case "interest sent":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "owner"} to send a visit invite`;
        case "offer sent":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "owner"} to send a visit invite`;
        case "invite user for a visit":
            return "Book a visit slot";
        case "request to change the visit slot":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "owner"} to change a visit slot`;
        case "owner changed the slot":
            return `Book a visit slot`;
        case "owner changed the pre-signing slot":
            return `Book a pre-signing slot`;
        case "owner changed the home inventory slot":
            return `Book a home inventory slot`;

        case "slot booked by user":
            return "Visit property";
        case "visit accept by owner":
            return "Visit property";
        case "visit hosted":
            return "Review the visit or send your application file";
        case "slot booked by owner":
            return `Visit property`;
        case "visit accept by user":
            return `Visit property`;
        case "review submit by user":
            return "Submit your application";
        case "application submit by user":
            return <span>Awaiting <span className="capitalize">{card?.propertyId?.addedBy?.fullName || "owner"}</span> to answer application file</span>;
        case "owner accept the application":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "owner"} to open signing dates`;
        case "preslot opened by owner":
            return `Book pre signing date`;
        case "home inventory opened by owner":
            return `Book home inventory slot`;

        case "request to change the pre-sale slot":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "owner"} to change a pre-signing slot`;
        case "request to change the home inventory slot":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "owner"} to change a home inventory slot`;
        case "signing date booked by owner":
            return `Book signing and home inventory date`;


        case "offer refused by owner":
            return "Update your offer";
        case "offer submit by owner":
            return `Answer counter-offer`;
        case "offer accept by owner":
            return `Awaiting OWNER to open pre-sales signing dates`;
        case "offer accept by user":
            return `Awaiting OWNER to open pre-sales signing dates`;

        case "preslot booked by user":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "owner"} to answer signing date`;
        case "preslot accept by owner":
            return `Contract signing and home inventory`;
        case "preslot accept by user":
            return `Contract signing and home inventory`;
        case "home inventory accept by user":
            return `Final Confirmation`;
        case "contract signed by owner":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "owner"} to open Home Inventory`;
        case "contract signed by user":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "owner"} to open Home Inventory`;
        case "saleslot booked by owner":
            return `Book final sale signing date`;
        case "saleslot booked by user":
            return `Awaiting OWNER to answer final sale signing dates`;

        default:
            return status;
    }
};

export const buyerCurrentStatus = (status, card) => {
    switch (status) {
        case "interest sent":
            return "Interest received";
        case "offer sent":
            return "Offer received";
        case "cancelled":
            return "Cancelled";
        case "invite user for a visit":
            return `${card?.buyerId?.fullName} must book a visit slot`;
        case "request to change the pre-sale slot":
            return `${card?.buyerId?.fullName} requested to change pre-signing slots`;
        case "request to change the final signing slot":
            return `${card?.buyerId?.fullName} requested to change final signing slots`;
        case "request to change the visit slot":
            return `${card?.buyerId?.fullName} requested to change slots`;
        case "owner changed the slot":
            return `You changed the slot`;
        case "owner changed the pre-signing slot":
            return `You changed the pre-signing slot`;
        case "owner changed the final signing slot":
            return `You changed the final signing slot`;

        // case "slot booked by user":
        //     return `${card?.buyerId?.fullName} has booked a visit slot`;
        // case "slot booked by owner":
        //     return `Visit slot booked on ${dateFormate(card?.ownerVisitDate)}`;
        case "visit accept by user":
            return `Visit booked - ${dateFormate(card?.finalVisitDate?.date)} (${card?.finalVisitDate?.from
                } - ${card?.finalVisitDate?.to})`

        case "visit hosted":
            return `The visit took place on ${dateFormate(
                card?.finalVisitDate?.date
            )}`;
        case "review submit by user":
            return `Visit review received`;
        case "offer submit by user":
            return "Purchase offer received";
        case "offer refused by owner":
            return "You refused the offer";
        case "offer refused by user":
            return `Offer refused by ${card?.buyerId?.fullName}`;
        case "offer submit by owner":
            return `You sent a counter-offer`;
        case "offer accept by owner":
            return `You accepted ${card?.buyerId?.fullName} purchase offer`;
        case "offer accept by user":
            return `Offer accepted`;
        case "preslot opened by owner":
            return `You opened pre-sale signing date`;
        case "preslot booked by owner":
            return `You opened pre-sale signing date on ${dateFormate(
                card?.ownerPresale
            )}`;
        case "preslot booked by user":
            return `${card?.buyerId?.fullName
                } opened pre-sale signing date on ${dateFormate(card?.userPresale)}`;
        case "preslot accept by owner":
            return `Pre-sale signing`;
        case "preslot accept by user":
            return `${card?.buyerId?.fullName} has book a date for contract signing on ${dateFormate(card?.finalSignSlot?.date)} (${card?.finalSignSlot?.from
                } - ${card?.finalSignSlot?.to})`;
        case "contract signed by owner":
            return `Pre-sale contract has been signed`;
        case "contract signed by user":
            if (!card.ownerSigned) return `Pre-sale signing`;
            else return `Pre-sale contract has been signed`;
        case "saleslot booked by owner":
            return `You opened final sale signing dates`;
        case "saleslot booked by user":
            return `${card?.buyerId?.fullName
                } opened final sale signing date on ${dateFormate(card?.userSale)}`;

        case "saleslot accept by user":
            return `${card?.buyerId?.fullName} booked a final sale signing date - ${dateFormate(card?.finalSaleSlot?.date)} (${card?.finalSaleSlot?.from
                } - ${card?.finalSaleSlot?.to})`;

        case "confirmation by owner":
            return `Final sale signing completed`;
        case "confirmation by user":
            return `Final sale signing completed`;

        case "buyer requested for document":
            return `Document Request Recived`;
        case "document send by owner":
            return `Document sent`;

        default:
            return status;
    }
};

export const buyerNextStatus = (status, card) => {
    switch (status) {
        case "interest sent":
            return "Invite user for a visit";
        case "offer sent":
            return "Invite user for a visit";
        case "invite for a visit":
            return "Invited";
        case "invite user for a visit":
            return "Host the visit";
        case "request to change the pre-sale slot":
            return "Change the pre-signing slot";
        case "request to change the final signing slot":
            return "Change the final signing slot";
        case "request to change the visit slot":
            return "Change the visit slot";
        case "owner changed the slot":
            return `Waiting for ${card?.buyerId?.fullName} to book a slot`;
        case "owner changed the pre-signing slot":
            return `Waiting for ${card?.buyerId?.fullName} to book a pre-signing slot`;
        case "owner changed the final signing slot":
            return `Waiting for ${card?.buyerId?.fullName} to book a final signing slot`;
        case "slot booked by user":
            return "Host the visit";
        case "visit accept by owner":
            return "Host the visit";
        case "slot booked by owner":
            return "Host the visit";
        case "visit accept by user":
            return `Host the visit`;
        case "visit hosted":
            return `Waiting for visit review or purchase offer from ${card?.buyerId?.fullName}`;
        case "review submit by user":
            return `Waiting for ${card?.buyerId?.fullName} to submit an offer`;
        case "offer submit by user":
            return "Answer offer";
        case "offer refused by user":
            return "Update your offer";
        case "offer submit by owner":
            return `Waiting ${card?.buyerId?.fullName} to answer`;
        case "offer accept by owner":
            return `Open pre-sale signing dates`;
        case "offer accept by user":
            return `Open pre-sale signing dates`;
        case "preslot opened by owner":
            return `Awaiting for ${card?.buyerId?.fullName} to book pre-signing date`;
        case "preslot booked by owner":
            return `Awaiting for ${card?.buyerId?.fullName} to book pre-signing date`;
        case "preslot booked by user":
            return `Answer pre-sale signing`;
        case "preslot accept by owner":
            return `Confirm signing`;
        case "preslot accept by user":
            return `Confirm signing`;
        case "contract signed by owner":
            if (!card.userSigned)
                return `Awaiting ${card?.buyerId?.fullName} to confirm signing`;
            else return `Open final sale contract dates`;
        case "contract signed by user":
            if (!card.ownerSigned) return `Confirm signing`;
            else return `Open final sale contract dates`;
        case "saleslot booked by owner":
            return `Awaiting for ${card?.buyerId?.fullName} to book final sale signing date`;
        case "saleslot booked by user":
            return `Answer final sale signing`;
        case "saleslot accept by user":
            return `Confirm final signing`;

        case "confirmation by owner":
            return `Transfer property ownership`;
        case "confirmation by user":
            return `Transfer property ownership`;

        case "buyer requested for document":
            return `Upload Document`;
        case "document send by owner":
            return `Awaiting for ${card?.buyerId?.fullName} to purchase offer`;

        default:
            return status;
    }
};

export const sellerCurrentStatus = (status, card) => {
    switch (status) {
        case "interest sent":
            return "Interest sent";
        case "offer sent":
            return "Offer sent";
        case "cancelled":
            return "Cancelled";
        case "invite user for a visit":
            return "Visit invite received";
        case "request to change the pre-sale slot":
            return "You requested to change pre-signing slots";
        case "request to change the final signing slot":
            return "You requested to change final signing slots";

        case "request to change the visit slot":
            return "You requested to change slots";
        case "owner changed the slot":
            return `${card?.propertyId?.addedBy?.fullName || "owner"} changed the slot`;
        case "owner changed the pre-signing slot":
            return `${card?.propertyId?.addedBy?.fullName || "owner"} changed the pre-signing slot`;
        case "owner changed the final signing slot":
            return `${card?.propertyId?.addedBy?.fullName || "owner"} changed the final signing slot`;


        case "visit accept by user":
            return `Visit booked - ${dateFormate(card?.finalVisitDate?.date)} (${card?.finalVisitDate?.from} - ${card?.finalVisitDate?.to})`;

        case "visit hosted":
            return `The visit took place on ${dateFormate(card?.finalVisitDate?.date)}`;
        case "review submit by user":
            return "Visit review submited";
        case "offer submit by user":
            return "Purchase offer sent";
        case "offer refused by owner":
            return "Owner did not accept your offer";
        case "offer refused by user":
            return "You refused the offer";
        case "offer submit by owner":
            return `Counter-offer received`;
        case "offer accept by owner":
            return `Owner accepted your purchase offer`;
        case "offer accept by user":
            return `You accepted purchase offer`;
        case "preslot opened by owner":
            return `${card?.propertyId?.addedBy?.fullName || "owner"} has opened pre-sale signing dates`;
        case "preslot booked by owner":
            return `${card?.propertyId?.addedBy?.fullName || "owner"} has opened pre-sale signing dates on ${dateFormate(card?.ownerPresale)}`;
        case "preslot booked by user":
            return `You opened pre-sale signing dates on ${dateFormate(card?.userPresale)}`;
        case "preslot accept by owner":
            return `Pre-sale signing`;
        case "preslot accept by user":
            return `You booked a date for contract signing on ${dateFormate(card?.finalSignSlot?.date)} (${card?.finalSignSlot?.from
                } - ${card?.finalSignSlot?.to})`;
        case "contract signed by owner":
            if (!card.userSigned) return `Pre-sale signing`;
            else return `Pre-sale contract has been signed`;
        case "contract signed by user":
            return `Pre-sale contract has been signed`;
        case "saleslot booked by owner":
            return `Owner opened final sale signing dates`;
        case "saleslot booked by user":
            return `You opened final sale signing dates on ${dateFormate(card?.userSale)}`;

        case "saleslot accept by user":
            return `You booked a final sale signing date - ${dateFormate(card?.finalSaleSlot?.date)} (${card?.finalSaleSlot?.from
                } - ${card?.finalSaleSlot?.to})`;
        case "confirmation by owner":
            return `Final sale signing completed`;
        case "confirmation by user":
            return `Final sale signing completed`;

        case "buyer requested for document":
            return `Document Request Sent`;
        case "document send by owner":
            return `Document send by ${card?.propertyId?.addedBy?.fullName || "owner"}`;

        default:
            return status;
    }
};

export const sellerNextStatus = (status, card) => {
    switch (status) {
        case "interest sent":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "owner"} to send a visit invite`;
        case "offer sent":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "owner"} to send a visit invite`;
        case "invite user for a visit":
            return "Book a visit slot";
        case "request to change the pre-sale slot":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "owner"} to change a pre-signing slot`;
        case "request to change the final signing slot":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "owner"} to change a final signing slot`;


        case "request to change the visit slot":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "owner"} to change a visit slot`;
        case "owner changed the slot":
            return `Book a visit slot`;
        case "owner changed the pre-signing slot":
            return `Book a pre-signing slot`;
        case "owner changed the final signing slot":
            return `Book a final signing date`;

        case "slot booked by user":
            return "Visit property";
        case "visit accept by owner":
            return "Visit property";
        case "visit hosted":
            return "Review the visit or send a purchase offer";
        case "slot booked by owner":
            return `Visit property`;
        case "visit accept by user":
            return `Visit property`;
        case "review submit by user":
            return "Submit a purchase offer";
        case "offer submit by user":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "Owner"} to answer purchase offer `;
        case "offer refused by owner":
            return "Update your offer";
        case "offer submit by owner":
            return `Answer counter-offer`;
        case "offer accept by owner":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "Owner"} to open pre-sales signing dates`;
        case "offer accept by user":
            return `Awaiting ${card?.propertyId?.addedBy?.fullName || "Owner"} to open pre-sales signing dates`;
        case "preslot opened by owner":
            return `Book pre-sale signing date`;
        case "preslot booked by owner":
            return `Book pre-sale signing date`;
        case "preslot booked by user":
            return `Awaiting OWNER to answer pre-sales signing dates`;
        case "preslot accept by owner":
            return `Confirm signing`;
        case "preslot accept by user":
            return `Confirm signing`;
        case "contract signed by owner":
            return `Awaiting for Owner to open final sale signing date`;
        case "contract signed by user":
            return `Awaiting for Owner to open final sale signing date`;
        case "saleslot booked by owner":
            return `Book final sale signing date`;
        case "saleslot booked by user":
            return `Awaiting OWNER to answer final sale signing dates`;
        case "saleslot accept by user":
            return `Confirm final signing`;
        case "confirmation by owner":
            return `Awaiting for Owner to transfer property ownership`;
        case "confirmation by user":
            return `Awaiting for Owner to transfer property ownership`;
        case "buyer requested for document":
            return `Awaiting for ${card?.propertyId?.addedBy?.fullName || "owner"} to send document`;
        case "document send by owner":
            return `Submit a purchase offer`;
            case "transferred":
                return `--`;
        default:
            return status;
    }
};

export const userCurrentStatus = (card) => {
    if (card.propertyType == 'rent') {
        return landerCurrentStatus(card.funnelStatus, card)
    } else {
        return sellerCurrentStatus(card.funnelStatus, card)
    }
};

export const ownerCurrentStatus = (card) => {
    if (card?.propertyType == 'rent') {
        return renterCurrentStatus(card?.funnelStatus, card)
    } else {
        return buyerCurrentStatus(card?.funnelStatus, card)
    }
};


export const ownerNextStatus = (card) => {
    if (card.propertyType == 'rent') {
        return renterNextStatus(card.funnelStatus, card)
    } else {
        return buyerNextStatus(card.funnelStatus, card)
    }
};

export const preSignDuration = [
    { name: '1 Hr', id: 60 },
    { name: '2 Hr', id: 120 },
    { name: '3 Hr', id: 180 },
    { name: '4 Hr', id: 240 },
]