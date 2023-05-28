import express from 'express'
import accounts from '../models/accountModel.js'
import dotenv from 'dotenv'

dotenv.config();
const AccountRouter = express.Router();

AccountRouter.post("/deposit", async (req, res) => {
  try {
    const { name, amount } = req.body;
    if (isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    let user = await accounts.findOne({ name });
    if (!user) {
      const newAccount = new accounts({
        name: name,
        balance: parseFloat(amount),
      });
      user = await newAccount.save();
    } else {
      user.balance += parseFloat(amount);
      await user.save();
    }
    return res.json(user);
  } catch (error) {
    console.error("Error during deposit:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

AccountRouter.get("/details", async (req, res) => {
  try {
    const accounts = await accounts.find();
    return res.json(accounts);
  } catch (error) {
    console.error("Error retrieving account details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
AccountRouter.get("/:_id", async (req, res) => {
  try {
    const accountsid = await accounts.findById(req.params._id);
    console.log(accountsid);
    return res.status(200).send(accountsid);
  } catch (error) {
    res.status(500).send(error);
  }
});
AccountRouter.post("/withdraw", async (req, res) => {
  try {
    const { name, amount } = req.body;
    if (isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    const user = await accounts.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.balance < parseFloat(amount)) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    user.balance -= parseFloat(amount);
    await user.save();
    return res.json({
      message: "Withdrawal successful",
      balance: user.balance,
    });
  } catch (error) {
    console.error("Error during withdrawal:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
AccountRouter.post("/verify", async (req, res) => {
  try {
    let { token } = req.body;
    let user = await Verify(token);
    console.log(user);
    res.send({ user });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: error,
    });
  }
});
async function Verify(token) {
  let user = jwt.verify(token, process.env.JWT_SECRET);
  return user;
}

function generateToken(payload) {
  let token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
}


export default AccountRouter;