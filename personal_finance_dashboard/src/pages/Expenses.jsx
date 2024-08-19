import ExpenseStat from '../components/ExpenseStat';
import ExpenseAdder from '../components/ExpenseAdder';
import '../styles/Dashboard.css';

export default function Expenses() {
    return (
        <div className='grid-container'>
            <div className="grid-balance">
                <ExpenseStat/>
            </div>
            <div className="grid-balance">
                <ExpenseAdder/>
            </div>
        </div>
    );
}