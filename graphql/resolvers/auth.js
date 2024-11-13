const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../Models/users');

module.exports = {
  users: async () => {
    try {
      const users = await User.find(); 
      return users.map(user => {
        return {
          ...user._doc,
          _id: user.id,
          password: null 
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    try {
        console.log("Starting login process for:", email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            throw new Error("User does not exist!");
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            console.log("Incorrect password");
            throw new Error("Password is incorrect!");
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            "somesupersecretkey",
            { expiresIn: "1h" }
        );

        console.log("Login successful:", { userId: user.id, token, tokenExpiration: 1 });
        return { userId: user.id, token, tokenExpiration: 1 };
    } catch (err) {
        console.error("Error in login:", err);
        throw err;
    }
}

};