"use server"

import { createClient } from "@/lib/superbase/server";
import { redirect } from "next/navigation";


interface AuthResponse {
    error: string | null;
    success: boolean;
    data: any;
}

export async function signup(formdata: FormData): Promise<AuthResponse>{

    const superbase = await createClient();
    const data = {
        email: formdata.get("email") as string,
        password: formdata.get("password") as string,
        options:{
            data: {
                full_name: formdata.get("full_name") as string
            }
        }
    }
    const { data: user, error } = await superbase.auth.signUp(data);
    return{

        error: error ? error.message : "There was an error signing up",
        success: !error,
        data: user
    }

}
export async function login(formdata: FormData): Promise<AuthResponse>{

    const superbase = await createClient();
    const data = {
        email: formdata.get("email") as string,
        password: formdata.get("password") as string,
    }
    const { data: user, error } = await superbase.auth.signInWithPassword(data);
    return{

        error: error ? error.message : "There was an error signing in",
        success: !error,
        data: user
    }

}

export async function logout(): Promise<void>{
    const superbase = await createClient();
    await superbase.auth.signOut();
    redirect("/login");
}