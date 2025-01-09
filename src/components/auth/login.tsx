"use client"

import { useState, useTransition } from "react";
import { toast } from "@/src/hooks/use-toast";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Button } from "../ui/button";
import { Separator } from '@/src/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import {
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage
} from '@/src/components/ui/form';
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authSlice";
import { account } from "../../lib/appwrite";
import { OAuthProvider } from "appwrite";

const FormSchema = z.object({
    email: z.string().email({message: "Veuillez entrer une adresse email valide"}),
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
});

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuthStore();
    const [isLoading, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        startTransition(async () => {
          try {
              await login( data.email,data.password);
              router.push("/dashboard");
              toast({
                title: "Connexion réussie",
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

    // async function handleGithubConnexion() {
    //     await account.createOAuth2Session(
    //         OAuthProvider.Github,
    //         'https://localhost:3000/dashboard',
    //         'https://localhost:3000/api/auth/callback',
    //     );
    // }

    
    async function handleGoogleConnexion() {
      const baseUrl = "https://simplydone.vercel.app";
      
      await account.createOAuth2Session(
        OAuthProvider.Google,
        `${baseUrl}/dashboard`,
        `${baseUrl}/api/auth/callback`
      );
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="z-10 mx-auto w-full max-w-sm rounded-md px-6 py-8 shadow grid gap-4">
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
                        "Se connecter"
                    )}
         </Button>
         <div className="flex items-center justify-center space-x-1">
            <Separator style={{ width: '9rem' }} className="bg-accent dark:bg-primary" />	
            <span className="text-muted-foreground font-bold text-sm ">OU</span>
            <Separator style={{ width: '9rem' }} className="bg-accent dark:bg-primary" />	
        </div>
        <Button type="button" variant="outline" className="w-full hover:bg-accent dark:hover:bg-primary" onClick={handleGoogleConnexion}>
            <FcGoogle className="mr-2 size-5" />
                Continuer avec Google
        </Button>
        {/* <Button type="button" variant="outline" className="w-full  hover:bg-accent dark:hover:bg-primary" onClick={handleGithubConnexion}>
            <Github className="mr-2 size-5" />
                Se connecter avec Github
        </Button> */}
        </form>
      </Form>
    )
}