import bcrypt from 'bcrypt';

// Function to hash password
export const hashPassword = async (Password) => {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(Password, saltRounds);
  return hashed;
};

// Function to compare plain and hashed password
export const comparePassword = async (Password, hashedPassword) => {
  return await bcrypt.compare(Password, hashedPassword);
};