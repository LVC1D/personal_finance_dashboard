import { useState, useEffect, useMemo } from 'react';
import {addInvestment} from '../slices/investmentSlice';
import '../styles/Investments.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {useSelector, useDispatch} from 'react-redux';

export default function MonthPicker() {
    const symbols = useMemo(() => ['FAKEPACA'], []);
    const [prices, setPrices] = useState(new Array(symbols.length).fill(null));
    const [priceColors, setPriceColors] = useState('black');
    const {isLoading, hasError} = useSelector((state) => state.investments);
    const {user} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const investmentSchema = Yup.object().shape({
        amount: Yup.number().required('Amount is required'),
    });

    useEffect(() => {
        let ws = new WebSocket('wss://stream.data.sandbox.alpaca.markets/v2/test');

        ws.onopen = () => {
            ws.send(JSON.stringify({
                action: 'auth',
                key: import.meta.env.VITE_ALPACA_CLIENT,
                secret: import.meta.env.VITE_ALPACA_SECRET, 
            }))

            ws.send(JSON.stringify({
                action: 'subscribe',
                quotes: symbols,
            }))
        };

        ws.onmessage = event => {
            const data = JSON.parse(event.data);
            if (data[0]?.T === 'error' && data[0].code === 402) {
                console.error('Authentication failed:', data[0].msg);
                ws.close();
            } else if (data[0]?.T === 'error' && data[0].code === 404) {
                console.error('Authentication timeout:', data[0].msg);
                ws.close();
            } else if (data[0]?.T === 'success' && data[0].msg === 'authenticated') {
                // Authentication succeeded, proceed with subscription
                ws.send(
                    JSON.stringify({
                        action: 'subscribe',
                        quotes: symbols,
                    })
                );
            } else {
                if (data[0]?.T === 'q') {
                    const symbol = data[0].S;
                    const price = parseFloat(data[0].ap).toFixed(2);
                    const index = symbols.indexOf(symbol);

                    setPrices((prevPrices) => {
                        const updatedPrices = [...prevPrices];
                        const lastPrice = prevPrices[index]?.price;
                        const newColor = !lastPrice || lastPrice === price ? 'black' : price > lastPrice ? 'green' : 'red';

                        setPriceColors((prevColors) => {
                            const updatedColors = [...prevColors];
                            updatedColors[index] = newColor;
                            return updatedColors;
                        });

                        updatedPrices[index] = { symbol, price };
                        return updatedPrices;
                    });
                }
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket closed. Reconnecting...');
            setTimeout(() => {
                ws = new WebSocket('wss://stream.data.sandbox.alpaca.markets/v2/test');
            }, 1500);
        };

        return () => {
            ws.close();
        }
    }, [symbols]);

    return (
        <div>
            <h3>Live Stocks Quotes</h3>
            <ul id='live-ticker'>
            {prices
                    .filter(priceData => priceData !== null)
                    .map((stock, index) => (
                        <li key={index}>
                            <p><strong>{stock.symbol.toUpperCase()}</strong>: <span style={{ color: priceColors[index] }}>${stock.price}</span></p>
                            <Formik
                                initialValues={{
                                    amount: '',
                                }}
                                validationSchema={investmentSchema}
                                onSubmit={(values, { setSubmitting }) => {
                                    setSubmitting(true);
                                    dispatch(addInvestment({
                                        userId: user.id,
                                        assetName: stock.symbol.toUpperCase(),
                                        amount: values.amount,
                                        openPrice: stock.price,
                                    }));
                                    setSubmitting(false);
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <div >
                                        <Form>
                                            <Field className='field-input' type="number" name="amount" placeholder="Amount" />
                                            <ErrorMessage name="amount" component="div" />

                                            <button type="submit" disabled={isSubmitting}>
                                                Invest
                                            </button>
                                            {isLoading && <p>Loading...</p>}
                                            {hasError && <p>Failed to add an investment</p>}
                                        </Form>
                                    </div>
                                )}
                            </Formik>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}