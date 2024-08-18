const incomeRouter = require('express').Router();
const {body, validationResult} = require('express-validator')

module.exports = (pool, ensureAuthenticated, totalIncome) => {
    incomeRouter.get('/', ensureAuthenticated, async (req, res, next) => {
        const userId = parseInt(req.query.userId);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }

        await pool.query('SELECT * FROM income WHERE user_id = $1', [userId], (err, result) => {
            if (err) {
                console.error("Error fetching income:", err);
                res.status(500).json({ message: err.message });
            } else {
                res.status(200).json(result.rows);
            }
        });
    });

    incomeRouter.get('/:id', ensureAuthenticated, async (req, res, next) => {
        const incomeId = parseInt(req.params.id);
        const userId = parseInt(req.query.userId);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        } 

        await pool.query('SELECT * FROM income WHERE id = $1 AND user_id = $2', [incomeId, userId], (err, result) => {
            if (err) {
                console.error("Error fetching income:", err);
                res.status(500).json({ message: err.message });
            } else if (!result.rows[0]) {
                res.status(404).json({message: "No income entry found"});
            } else {
                res.status(200).json(result.rows[0]);
            }
        });
    });

    incomeRouter.post('/', ensureAuthenticated, async (req, res, next) => {
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
            const result = await pool.query('INSERT INTO income (user_id, category, amount, description) VALUES($1, $2, $3, $4) RETURNING *',
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
    
            const incomeTotal = await totalIncome(userId, pool);
    
            await pool.query('UPDATE users SET total_income = $1 WHERE id = $2', [parseFloat(incomeTotal), userId]);
    
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    });

    incomeRouter.put('/:id', ensureAuthenticated, async (req, res, next) => {
        const incomeId = parseInt(req.params.id);
        if (!incomeId) {
            res.status(400).json({ message: "Ther desired income is not found." });
            return;
        }   

        const {category, amount, description} = req.body;

        if (!category || isNaN(amount)) {
            res.status(404).json({message: "Invalid details."});
            return;
        }

        try {
            const result = await pool.query(
                'UPDATE income SET category = $1, amount = $2, description = $3 WHERE id = $4 RETURNING *', 
                [category, amount, description, incomeId]
            );
    
            if (result.rows.length === 0) {
                res.status(404).json({ message: "Income not found." });
                return;
            }
    
            const userId = result.rows[0].user_id;
            const incomeTotal = await totalIncome(userId, pool);
    
            await pool.query('UPDATE users SET total_income = $1 WHERE id = $2', [parseFloat(incomeTotal), userId]);
    
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }      
    });

    incomeRouter.delete('/:id', ensureAuthenticated, async (req, res, next) => {
        const incomeId = parseInt(req.params.id);
        if (!incomeId) {
            res.status(400).json({ message: "Ther desired income is not found." });
            return;
        }  

        await pool.query('DELETE FROM income WHERE id = $1', [incomeId], 
            (err) => {
                if (err) {
                    res.status(500).json("Couldn't delete the entry because of: ", err.message);
                    return; 
                }
                res.status(204).json({message: "Successfully deleted the entry."})
            }
        )
    })

    return incomeRouter;
}