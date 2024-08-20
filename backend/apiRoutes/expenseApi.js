const expenseRouter = require('express').Router();
const {body, validationResult} = require('express-validator');
const { totalIncome } = require('../helpers');

module.exports = (pool, ensureAuthenticated, totalExpenses) => {
    expenseRouter.get('/', ensureAuthenticated, async (req, res, next) => {
        let userId = parseInt(req.query.userId);

        // Validate the userId
        if (!userId || isNaN(userId) || userId !== req.user?.id) {
            return res.status(400).json({ message: "Invalid or missing user ID" });
        }

        await pool.query('SELECT * FROM expenses WHERE user_id = $1', [userId], (err, result) => {
            if (err) {
                console.error("Error fetching expense:", err);
                res.status(500).json({ message: err.message });
            } else {
                res.status(200).json(result.rows);
            }
        });
    });

    expenseRouter.get('/:id', ensureAuthenticated, async (req, res, next) => {
        const expenseId = parseInt(req.params.id);
        const userId = parseInt(req.query.userId);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        } 

        await pool.query('SELECT * FROM expenses WHERE id = $1 AND user_id = $2', [expenseId, userId], (err, result) => {
            if (err) {
                console.error("Error fetching expense:", err);
                res.status(500).json({ message: err.message });
            } else if (!result.rows[0]) {
                res.status(404).json({message: "No expense entry found"});
            } else {
                res.status(200).json(result.rows[0]);
            }
        });
    });

    expenseRouter.post('/', ensureAuthenticated, async (req, res, next) => {
        const userId = parseInt(req.query.userId);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }  

        const {category, amount, description} = req.body;

        if (!category || isNaN(amount)) {
            res.status(404).json({message: "Invalid details."});
            return;
        }

        try {
            const result = await pool.query('INSERT INTO expenses (user_id, category, amount, description) VALUES($1, $2, $3, $4) RETURNING *',
                [
                    userId,
                    category,
                    amount,
                    description
                ]
            );
    
            if (result.rows.length === 0) {
                res.status(404).json({ message: "Expense not found." });
                return;
            }
    
            const expenseTotal = await totalExpenses(userId, pool);
    
            await pool.query('UPDATE users SET total_expenses = $1 WHERE id = $2', [parseFloat(expenseTotal), userId]);
    
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    });

    expenseRouter.put('/:id', ensureAuthenticated, async (req, res, next) => {
        const expenseId = parseInt(req.params.id);
        if (!expenseId) {
            res.status(400).json({ message: "Ther desired expense is not found." });
            return;
        }   

        const {category, amount, description} = req.body;

        if (!category || isNaN(amount)) {
            res.status(404).json({message: "Invalid details."});
            return;
        }

        try {
            const result = await pool.query(
                'UPDATE expenses SET category = $1, amount = $2, description = $3 WHERE id = $4 RETURNING *', 
                [category, amount, description, expenseId]
            );
    
            if (result.rows.length === 0) {
                res.status(404).json({ message: "Expense not found." });
                return;
            }
    
            const userId = result.rows[0].user_id;
            const expenseTotal = await totalExpenses(userId, pool);
    
            await pool.query('UPDATE users SET total_expenses = $1 WHERE id = $2', [parseFloat(expenseTotal), userId]);
    
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }       
    });

    expenseRouter.delete('/:id', ensureAuthenticated, async (req, res, next) => {
        const expenseId = parseInt(req.params.id);
        if (!expenseId) {
            res.status(400).json({ message: "Ther desired expense is not found." });
            return;
        }  

        await pool.query('DELETE FROM expenses WHERE id = $1', [expenseId], 
            (err, result) => {
                if (err) {
                    res.status(500).json("Couldn't delete the entry because of: ", err.message);
                    return; 
                } 
                res.status(204).json({message: "Successfully deleted the entry."})
            }
        )
    })

    return expenseRouter;
}