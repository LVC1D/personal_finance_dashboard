import InvestmentStat from '../components/InvestmentStat';
// import InvestmentAdder from '../components/InvestmentAdder';
import LiveStockFeed from '../components/LiveStockFeed';

export default function Investments() {
    return (
        <div className='grid-container'>
            <div className="grid-balance">
                <InvestmentStat/>
            </div>
            <div className="grid-column">
                <div className="grid-item">
                    <LiveStockFeed/>
                </div>
                {/* <div className="grid-item">
                    <InvestmentAdder/>
                </div> */}
            </div>
        </div>
    );
}