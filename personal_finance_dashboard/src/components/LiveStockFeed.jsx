import { useState, useEffect, useMemo } from 'react';
import {addInvestment} from '../slices/investmentSlice';
import '../styles/Investments.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {useSelector, useDispatch} from 'react-redux';

export default function LiveStockFeed() {
    const symbols = useMemo(() => ['btcusdt', 'ethusdt', 'adausdt', 'ltcusdt', 'solusdt', 'xrpusdt', 'xlmusdt', 'dotusdt', 'bnbusdt', 'linkusdt'], []);
    const [prices, setPrices] = useState(new Array(symbols.length).fill(null));
    const [priceColors, setPriceColors] = useState('black');
    const {isLoading, hasError} = useSelector((state) => state.investments);

    const {user} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const investmentSchema = Yup.object().shape({
        amount: Yup.number().required('Amount is required'),
    });

    useEffect(() => {
        const webSockets = symbols.map((symbol, index) => {
            const createWebSocket = () => {
                const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);
                let lastPrice = null;
                ws.onmessage = event => {
                    const parsedData = JSON.parse(event.data);
                    const price = parseFloat(parsedData.p).toFixed(2);
                    
                    setPrices(prevPrices => {
                        const updatedPrices = [...prevPrices];
                        updatedPrices[index] = { symbol, price };
                        const newColor = !lastPrice || lastPrice === price ? 'black' : price > lastPrice ? 'green' : 'red';

                        setPriceColors(prevColors => {
                            const updatedColors = [...prevColors];
                            updatedColors[index] = newColor;
                            return updatedColors;
                        });

                        lastPrice = price;
                        return updatedPrices;
                    });
                    
                };
    
                ws.onerror = (error) => {
                    console.error(`WebSocket error for ${symbol}:`, error);
                };
    
                ws.onclose = () => {
                    console.log(`${symbol} WebSocket closed. Attempting to reconnect...`);
                    setTimeout(createWebSocket, 1500); // Retry after 1.5 seconds
                    return <h3>Fetching new quotes...</h3>
                };
    
                return ws;
            };
    
            return createWebSocket();
        });
    
        return () => {
            webSockets.forEach(ws => ws.close());
        };
    }, [symbols]);

    return (
        <div>
            <h3>Live Crypto Quotes</h3>
            <ul id='live-ticker'>
                {prices
                    .filter(priceData => priceData !== null)
                    .map((crypto, index) => (
                        <li key={index}>
                            <p><strong>{crypto.symbol.toUpperCase()}</strong>: <span style={{ color: priceColors[index] }}>${crypto.price}</span></p>
                            <Formik
                                initialValues={{
                                    amount: '',
                                }}
                                validationSchema={investmentSchema}
                                onSubmit={(values, { setSubmitting }) => {
                                    setSubmitting(true);
                                    dispatch(addInvestment({
                                        userId: user.id,
                                        assetName: crypto.symbol.toUpperCase(),
                                        amount: values.amount,
                                        openPrice: crypto.price,
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