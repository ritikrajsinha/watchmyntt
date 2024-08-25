import bcrypt from "bcrypt";
export const hashPassword = async (password) => {
  try {
    const hashedpassword = await bcrypt.hash(password, 10);
    return hashedpassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparepassword=async(password,hashedpassword)=>{
    try {
        const isMatch = await bcrypt.compare(password, hashedpassword);
        return isMatch;
    }catch(error)
    {
        console.log(error);
    
    }

};
