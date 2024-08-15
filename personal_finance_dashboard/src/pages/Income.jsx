import IncomeStat from '../components/IncomeStat';
import IncomeAdder from '../components/IncomeAdder';

export default function Income() {
    return (
        <div className="grid-container">
            <div className="grid-balance">
                <IncomeStat/>
            </div>
            <div className="grid-balance">
                <IncomeAdder/>
            </div>
        </div>
    );
}