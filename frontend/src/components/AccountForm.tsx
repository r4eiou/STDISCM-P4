import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAccount } from "@/AccountContext";
import { useState } from "react";
import { toast } from "react-toastify";

const accountFormSchema = z.object({
  accountType: z.enum(["student", "faculty"], {
    message: "Please select an account type.",
  }),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

type AccountFormFields = z.infer<typeof accountFormSchema>;

export default function AccountForm() {
  const { setAccountType, setAccountData } = useAccount();
  const [loginError, setLoginError] = useState<string | null>(null);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormFields>({
    defaultValues: { accountType: "student", email: "", password: "" },
    resolver: zodResolver(accountFormSchema),
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const onSubmit: SubmitHandler<AccountFormFields> = async (data) => {
    const attemptLogin = async () => {
      setLoginError(null);
      
      try {
        const res = await fetch(`${BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            accountType: data.accountType,
          }),
          credentials: "include",
        });
        
        const result = await res.json();
        if (res.ok) {
          localStorage.setItem("token", result.token);
          setAccountType(data.accountType);
          setAccountData({
            type: result.user.accountType,
            id: result.user.id,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            email: result.user.email,
          });

          toast.success("Login successful!");
          setLoginError(null);
          navigate("/dashboard");

        } 
        else {
          setLoginError(result.error || "Login failed. Invalid credentials.");
        }
      } catch (err) {
        console.error("Login fetch error:", err);
        setLoginError("Server unavailable.");
      }
    };

    attemptLogin();
  };

  return (
    <>
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription className="mb-14">
              Enter your account details below to access portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="my-8">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="accountType">Account Type</Label>
                <RadioGroup
                  value={watch("accountType")}
                  onValueChange={(value) =>
                    setValue("accountType", value as "student" | "faculty")
                  }
                  className="flex flex-row gap-30"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="faculty" id="faculty" />
                    <Label htmlFor="faculty">Faculty</Label>
                  </div>
                </RadioGroup>
                {errors.accountType && (
                  <div className="text-red-500">
                    {errors.accountType.message}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="m@example.com"
                />
                {errors.email && (
                  <div className="text-red-500">{errors.email.message}</div>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input {...register("password")} type="password" />
                {errors.password && (
                  <div className="text-red-500">{errors.password.message}</div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting ? "Loading..." : "Login"}
            </Button>
            {loginError && <div className="text-red-600 mt-2">{loginError}</div>}
          </CardFooter>
          {errors.password && (
            <div className="text-destructive-foreground">
              {errors.password.message}
            </div>
          )}
        </form>
      </Card>
    </>
  );
}