"use client"

import { useTransition } from "react";
import { toast } from "@/src/hooks/use-toast";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { Input } from './ui/input';
import { Button } from "./ui/button";
import { Separator } from '@/src/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { Github, LoaderCircle } from 'lucide-react';
import {
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage
} from '@/src/components/ui/form';
import clsx from "clsx";

const FormSchema = z.object({
    email: z.string().email({message: "Veuillez entrer une adresse email valide"}),
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
});

export default function LoginForm() {
    const [isLoading, startTransition] = useTransition();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        startTransition(() => {
            toast({
              title: "You submitted the following values:",
              description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                  <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
              ),
            })
        });
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
                <Input placeholder="Entrer votre mot de passe" {...field} />
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
        <Button variant="outline" className="w-full hover:bg-accent dark:hover:bg-primary">
            <FcGoogle className="mr-2 size-5" />
                Se connecter avec Google
        </Button>
        <Button variant="outline" className="w-full  hover:bg-accent dark:hover:bg-primary">
            <Github className="mr-2 size-5" />
                Se connecter avec Github
        </Button>
        </form>
      </Form>
    )
}