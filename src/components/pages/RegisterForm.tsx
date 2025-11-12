"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/components/context/UserContext";

interface RegisterFormProps {
  setIsLoggedIn: (value: boolean) => void;
  setIsLoginOpen: (value: boolean) => void;
  onClose?: () => void;
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.email({
    message: "Invalid email format.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const RegisterForm = ({
  setIsLoggedIn,
  setIsLoginOpen,
  onClose,
}: RegisterFormProps) => {
  const { setUser } = useUser();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoggedIn(true);
    setUser({ username: values.username, favourites: [], invoices: [] });
    if (onClose) onClose();
    toast.success("User Registered!", {
      action: {
        label: "Close",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  }

  function openLogin() {
    if (onClose) onClose();
    setIsLoginOpen(true);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="justify-center text-center space-y-6"
      >
        <h1 className="text-xl font-bold">Register</h1>
        <p>Enter your data to register</p>
        <hr />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" mx-auto mt-5">Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="shadcn"
                  {...field}
                  className="w-[50%] mx-auto"
                />
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
              <FormLabel className=" mx-auto mt-5">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="shadcn"
                  {...field}
                  className="w-[50%] mx-auto"
                />
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
              <FormLabel className=" mx-auto mt-5">Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="shadcn"
                  {...field}
                  className="w-[50%] mx-auto mb-5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-3">
          <Button type="submit" className="w-[50%] mx-auto">
            Submit
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              openLogin();
            }}
          >
            Existing user? Login here
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
