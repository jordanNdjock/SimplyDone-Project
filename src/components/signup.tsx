"use client"

import { toast } from "@/src/hooks/use-toast";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { Input } from './ui/input';
import { Button } from "./ui/button";
// import { Separator } from '@/src/components/ui/separator';
// import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useAuthStore } from '@/src/store/authSlice';

import {
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage
} from '@/src/components/ui/form';
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const FormSchema = z.object({
    email: z.string().email({message: "Veuillez entrer une adresse email valide"}),
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
    name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
});

export default function SignupForm() {
    const { signup } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, startTransition] = useTransition();
    const router = useRouter();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        startTransition(async () => {
          try {
              await signup(data.name, data.email,data.password);
              router.push("/dashboard");
              toast({
                title: "Inscription réussie",
                variant: "success",
              })
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
            toast({
              title: message,
              variant: "error",
            })
          }
      });
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="z-10 mx-auto w-full max-w-sm rounded-md px-6 py-8 shadow grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Entrer votre nom" {...field} />
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
                <Input placeholder="Entrer votre email" {...field} />
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
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrer votre mot de passe"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
         <Button 
                type="submit" 
                className={clsx (
                    "mt-2 w-full bg-accent hover:bg-purple-700 dark:bg-primary dark:hover:bg-blue-700",
                    isLoading ?
                    "bg-gray-400 cursor-not-allowed"
                    : "bg-accent hover:bg-purple-700 dark:bg-primary dark:hover:bg-blue-700"
                    )}>
                     {isLoading ? (
                        <>
                        <LoaderCircle className="animate-spin h-5 w-5 text-white" />
                        <span>Chargement...</span>
                        </>
                    ) : (
                        "Créer un compte"
                    )}
         </Button>
         {/* <div className="flex items-center justify-center space-x-1">
            <Separator style={{ width: '9rem' }} className="bg-accent dark:bg-primary" />	
            <span className="text-muted-foreground font-bold text-sm ">OU</span>
            <Separator style={{ width: '9rem' }} className="bg-accent dark:bg-primary" />	
        </div>
        <Button type="button" variant="outline" className="w-full hover:bg-accent dark:hover:bg-primary">
            <FcGoogle className="mr-2 size-5" />
                Créer un compte avec Google
        </Button>
        <Button type="button" variant="outline" className="w-full  hover:bg-accent dark:hover:bg-primary">
            <Github className="mr-2 size-5" />
                Créer un compte avec Github
        </Button> */}
        </form>
      </Form>
    )
}