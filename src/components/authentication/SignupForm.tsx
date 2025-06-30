"use client"
import React, { useId, useState } from 'react'
import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { signup } from '@/app/actions/auth-actions'
import { redirect } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const passwordValidationRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')

const formSchema = z.object({

  full_name: z.string().min(3,{
    message: "Please enter a valid email address!"
  }),
  email: z.string().email({
    message: "Please enter a valid email address!"
  }),
  password: z.string(
    { required_error: "Password is required." }
  ).min(8,{
    message: "Password must be at least 8 charactor long."
  }).regex(
    passwordValidationRegex, {
        message:"Password should have 0-9,a-z,A-Z,!-*"
    }
  ),
  confirmPassword: z.string({
    required_error:"Required."
  })

}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"]
})

function SignupForm({className}:{className?: String}) {

    const[loading, setLoading] = useState(false);

    const toastId = useId();
      // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name:"",
      email: "",
      password:"",
      confirmPassword: "",
    },
  })

    // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Signing up...", {
      id: toastId,
    });
    setLoading(true);
    console.log(values)

    const formData = new FormData();
    formData.append("full_name", values.full_name);
    formData.append("email", values.email);
    formData.append("password", values.password);

    const {success, error} = await signup(formData);

    if(!success) {
      toast.error(
        String(error), {
          id: toastId
        }
      )
      setLoading(false);
    }else{
      toast.success("Account created successfully! Please check your email to verify your account.", {
          id: toastId
      })
      setLoading(false);
      redirect("/login");
    }
    
  }
  return (
    <div className={cn("grid gap-6", className)}>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder="Enter Your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder="Confirm Your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='w-full' disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}Sign Up
        </Button>
      </form>
    </Form>
    </div>
  )
}

export default SignupForm