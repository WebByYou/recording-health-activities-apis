import { supabase } from "./supabase.service";

const registerUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const authService = {
  registerUser,
};
