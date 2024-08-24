const express = require('express');
const userRouter = express.Router();
// const {body, validationResult} = require('express-validator');

module.exports = (pool, ensureAuthenticated) => {
    
        userRouter.get('/', ensureAuthenticated, async (req, res) => {
    
            await pool.query('SELECT * FROM users', (err, result) => {
                if (err) {
                    console.error("Error getting user:", err);
                    res.status(500).json({ message: err.message });
                } else {
                    res.status(200).json(result.rows);
                }
            });
        });
        
        userRouter.get('/:id', ensureAuthenticated, async (req, res) => {
            const userId = req.params.id;
            await pool.query('SELECT * FROM users WHERE id = $1', [userId], (err, result) => {
                if (err) {
                    console.error("Error getting user:", err);
                    res.status(500).json({ message: err.message });
                } else if (!result.rows[0]) {
                    res.status(404).json({ message: "User not found" });
                } else {
                    res.status(200).json(result.rows[0]);
                }
            });
        });

        userRouter.get('/:id/balances', ensureAuthenticated, async (req, res) => {
            const userId = parseInt(req.params.id);
            if (!req.params.id || isNaN(req.params.id)) {
                res.status(400).json({message: 'Invalid user'});
                return;
            }

            await pool.query(`
                SELECT json_agg(json_build_object('type', type, 'data', value)) AS result
                FROM (
                SELECT 'Income' AS type, total_income AS value
                FROM users
                WHERE id = $1
                UNION ALL
                SELECT 'Expenses' AS type, total_expenses AS value
                FROM users
                WHERE id = $1
                UNION ALL
                SELECT 'Investments' AS type, total_investments AS value
                FROM users
                WHERE id = $1
                ) subquery;
                `, [userId], (err, result) => {
                    if (err) {
                        console.error("Error getting user:", err);
                        res.status(500).json({ message: err.message });
                    } else if (!result.rows) {
                        res.status(404).json({ message: "User not found" });
                    } else {
                        res.status(200).json(result.rows[0].result);
                    }
                }
            );

        })

        // userRouter.put('/:id', ensureAuthenticated, [
        //     body('username').isString().isLength({ min: 3 }).trim().escape(),
        //     body('address').isString().isLength({ min: 6 }).trim().escape().blacklist("'\"`;\\/\\#%")
        // ], async (req, res) => {
        //     const errors = validationResult(req);
        //     if (!errors.isEmpty()) {
        //         return res.status(400).json({ message: errors.array() });
        //     }
            
        //     const userId = req.params.id;
        //     const { username, address } = req.body;
        //     await pool.query('UPDATE users SET username = $1, address = $2 WHERE id = $3', [username, address, userId], (err, result) => {
        //         if (err) {
        //             console.error("Error updating user:", err);
        //             res.status(500).json({ message: err.message });
        //         } else {
        //             res.status(200).json({ message: "User updated" });
        //         }
        //     });
        // });
    
        return userRouter;
}