"use client"
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { login } from '@/app/actions/auth-actions'
import { redirect } from 'next/navigation'

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address!"
  }),
  password: z.string().min(8,{
    message: "Password must be at least 8 charactor long."
  }),


})

function LoginForm({className}:{className?: String}) {

    const [loading, setLoading] = useState(false);
    const toastId = React.useId();    
      // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password:"",
    },
  })

    // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    toast.loading("Signing in...", {
      id: toastId,
    })
    console.log(values)
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    const {success, error} = await login(formData);

    if(!success) {
      toast.error(
        String(error), {
          id: toastId
        }
      )
      setLoading(false);
    }else{
      toast.success("Logged in successfully!", {
          id: toastId
      })
      setLoading(false);
      redirect("/dashboard");
    }
  }
  return (
    <div className={cn("grid gap-6", className)}>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <Button type="submit" className='w-full' disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}Login
        </Button>
      </form>
    </Form>
    </div>
  )
}

export default LoginForm