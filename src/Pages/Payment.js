import { useState } from "react";
import { useSelector } from "react-redux";
import PageLayout from "../components/global/PageLayout";
import ApiClient from '../methods/api/apiClient';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import environment from "../environment";
const stripePromise = loadStripe(environment.stripe_public_key);
const PaymentForm = () => {
    const user = useSelector((state) => state.user);
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        const { token, error } = await stripe.createToken(cardElement);

        if (error) {
            setMessage(error.message);
        } else {
            try {
                const res = await ApiClient.post("cards/addCard", {
                    id: user?._id,
                    token: token.id
                });
            } catch (err) {
                console.log("err", err);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">Save Your Card</h2>
            <div className="border p-4 rounded mb-4">
                <CardElement />
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50" disabled={!stripe}>
                Save Card
            </button>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </form>
    );
};

const Payment = () => {
    return (
        <PageLayout>
            <div>
                <Elements stripe={stripePromise}>
                    <PaymentForm />
                </Elements>
            </div>
        </PageLayout>
    );
};

export default Payment;

