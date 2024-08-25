const express = require('express');
const userRouter = express.Router();
const {body} = require('express-validator');
const bcrypt = require('bcryptjs');
const csrfProtection = require('../csrfConfig');

module.exports = (pool, ensureAuthenticated) => {
    
        userRouter.get('/', ensureAuthenticated, csrfProtection, async (req, res) => {
    
            await pool.query('SELECT * FROM users', (err, result) => {
                if (err) {
                    console.error("Error getting user:", err);
                    res.status(500).json({ message: err.message });
                } else {
                    res.status(200).json(result.rows);
                }
            });
        });
        
        userRouter.get('/:id', ensureAuthenticated, csrfProtection, async (req, res) => {
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

        userRouter.get('/:id/balances', ensureAuthenticated, csrfProtection, async (req, res) => {
            
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

        userRouter.put('/:id', ensureAuthenticated, csrfProtection, [
            body('email').isEmail(),
            body('name').isString().isLength({ min: 3 }).blacklist("'\"`;\\/\\#%"),
            body('password').isString().isLength({ min: 8 }).blacklist("'\"`;\\/\\#%")
        ], async (req, res) => {
            
            const userId = req.params.id;
            const { email, name, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            await pool.query('UPDATE users SET email = $1, name = $2, password = $3 WHERE id = $4', [email, name, hashedPassword, userId], (err, result) => {
                if (err) {
                    console.error("Error updating user:", err);
                    res.status(500).json({ message: err.message });
                } else {
                    res.status(200).json({ message: "User updated" });
                }
            });
        });
    
        return userRouter;
}