const investmentRouter = require('express').Router();
const {body, validationResult} = require('express-validator');
const csrfProtection = require('../csrfConfig');

module.exports = (pool, ensureAuthenticated, totalInvestments) => {
    investmentRouter.get('/', ensureAuthenticated, csrfProtection, async (req, res, next) => {
        let userId = parseInt(req.query.userId);

        // Validate the userId
        if (!userId || isNaN(userId) || userId !== req.user?.id) {
            return res.status(400).json({ message: "Invalid or missing user ID" });
        }

        await pool.query('SELECT * FROM investments WHERE user_id = $1', [userId], (err, result) => {
            if (err) {
                console.error("Error fetching expense:", err);
                res.status(500).json({ message: err.message });
            } else {
                res.status(200).json(result.rows);
            }
        });
    });

    investmentRouter.get('/:id', ensureAuthenticated, csrfProtection, async (req, res, next) => {
        const investmentId = parseInt(req.params.id);
        const userId = parseInt(req.query.userId);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        } 

        await pool.query('SELECT * FROM investments WHERE id = $1 AND user_id = $2', [investmentId, userId], (err, result) => {
            if (err) {
                console.error("Error fetching investment:", err);
                res.status(500).json({ message: err.message });
            } else if (!result.rows[0]) {
                res.status(404).json({message: "No investment entry found"});
            } else {
                res.status(200).json(result.rows[0]);
            }
        });
    });

    investmentRouter.post('/', ensureAuthenticated, csrfProtection, [
        body('amount').isNumeric().trim().escape()
    ], async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
            
        const userId = parseInt(req.query.userId);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }  

        const {assetName, amount, openPrice} = req.body;

        if (!assetName || !openPrice || isNaN(amount)) {
            res.status(404).json({message: "Invalid details."});
            return;
        }

        try {
            const result = await pool.query('INSERT INTO investments (user_id, asset_name, amount, open_price) VALUES($1, $2, $3, $4) RETURNING *',
                [
                    userId,
                    assetName,
                    amount,
                    openPrice
                ]
            );
    
            if (result.rows.length === 0) {
                res.status(404).json({ message: "Investment not found." });
                return;
            }
    
            const investmentTotal = await totalInvestments(userId, pool);
    
            await pool.query('UPDATE users SET total_investments = $1 WHERE id = $2', [investmentTotal, userId]);
    
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    });

    investmentRouter.put('/:id', ensureAuthenticated, csrfProtection, [
        body('amount').isNumeric().trim().escape()
    ], async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
        
        const investmentId = parseInt(req.params.id);
        if (!investmentId) {
            res.status(400).json({ message: "Ther desired investment is not found." });
            return;
        }   

        const {assetName, amount, openPrice} = req.body;

        if (!assetName || !openPrice || isNaN(amount)) {
            res.status(404).json({message: "Invalid details."});
            return;
        }

        try {
            const result = await pool.query(
                'UPDATE investments SET asset_name = $1, amount = $2, open_price = $3 WHERE id = $4 RETURNING *', 
                [assetName, amount, openPrice, investmentId]
            );
    
            if (result.rows.length === 0) {
                res.status(404).json({ message: "Investment not found." });
                return;
            }
    
            const userId = result.rows[0].user_id;
            const investmentTotal = await totalInvestments(userId, pool);
    
            await pool.query('UPDATE users SET total_investments = $1 WHERE id = $2', [investmentTotal, userId]);
    
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }      
    });

    investmentRouter.delete('/:id', ensureAuthenticated, csrfProtection, async (req, res, next) => {
        const userId = parseInt(req.user.id);
        const investmentId = parseInt(req.params.id);
        if (!investmentId) {
            res.status(400).json({ message: "Ther desired income is not found." });
            return;
        }  

        await pool.query('DELETE FROM investments WHERE id = $1', [investmentId], 
            async (err, result) => {
                if (err) {
                    res.status(500).json("Couldn't delete the entry because of: ", err.message);
                    return; 
                }
                let investmentTotal = await totalInvestments(userId, pool);
                await pool.query('UPDATE users SET total_investments = $1 WHERE id = $2', [investmentTotal, userId]);
                const newInvestments = await pool.query('SELECT * FROM investments WHERE user_id = $1', [userId]); 
                res.status(200).json({message: "Successfully deleted the entry.", investments: newInvestments.rows})
            }
        )
    })

    return investmentRouter;
}