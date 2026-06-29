import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useSelector } from "react-redux";
import ApiClient from "../../methods/api/apiClient";
import { stringSeprator } from "../../models/string.model";

const AddNewCard = ({ onClose,getCards }) => {
    const user = useSelector((state) => state.user);
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        if (!stripe || !elements) return;
        const cardElement = elements.getElement(CardElement);
        // const { token, error } = await stripe.createToken(cardElement);
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });
        if (error) {
            setMessage(error.message);
        } else {
            try {
                const res = await ApiClient.post(
                    "cards/addCard",
                    // { userId: user?._id, token: token.id },
                    { userId: user?._id, paymentMethodId: paymentMethod.id },
                );
                onClose();
                getCards();
            } catch (err) {
                console.log("err", err);
            }
        }
    };

    return (
        <div className=" bg-white  shadow-lg md:w-[500px] sm:w-[400px] w-[350px] mx-2 rounded-[20px]">
            <h2 className="p-6 ">
                <p className=" border-b text-[#976DD0] text-[18px] text-center pb-4">Add Card details</p>
                <div className="border p-4 rounded mt-12 mb-1">
                    <CardElement
                        onChange={() => setMessage('')}
                        options={{
                            hidePostalCode: true,
                            style: {
                                base: { '::placeholder': { color: '#aab7c4' }, },
                            },
                            disabled: true,
                        }}
                        onReady={(element) => {
                            setTimeout(() => element.update({ disabled: false }), 500);
                        }}
                    />
                </div>
                {message && <p className="mb-5 text-red-500 text-sm">{stringSeprator(message, 30)}</p>}
            </h2>

            <div className="flex border-t p-4 justify-between">
                <button onClick={onClose} className="text-[#868389] text-[18px] underline">
                    Cancel
                </button>
                <button onClick={() => handleSubmit()} className="bg-[#976DD0] px-4 py-[8px] text-white rounded-full font-[600] text-[14px]" disabled={!stripe}>
                    Save Card
                </button>
            </div>
        </div>
    )
}

export default AddNewCard