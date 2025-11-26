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

const accountFormSchema = z.object({
  accountType: z.enum(["student", "faculty"], {
    message: "Please select an account type.",
  }),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

type AccountFormFields = z.infer<typeof accountFormSchema>;

export default function AccountForm({
  setAccountType,
}: {
  setAccountType: (value: "student" | "faculty" | null) => void;
}) {
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

  const onSubmit: SubmitHandler<AccountFormFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAccountType(data.accountType);
      console.log("Form submitted successfully:", data);
    } catch (error) {
      setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
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
