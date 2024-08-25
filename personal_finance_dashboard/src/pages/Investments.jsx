import InvestmentStat from '../components/InvestmentStat';
import MonthPicker from '../components/MonthPicker';
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
                <div className="grid-item">
                    <MonthPicker/>
                </div>
            </div>
        </div>
    );
}