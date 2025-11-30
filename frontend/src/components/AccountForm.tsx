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

  const onSubmit: SubmitHandler<AccountFormFields> = async (data) => {
    try {
      const res = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password, accountType: data.accountType }),
        credentials: 'include'
      });

      console.log('Response status:', res.status);
      const result = await res.json();
      console.log('Response JSON:', result);

        if (student) {
          setAccountData({
            type: "student",
            id: student.student_id,
            firstName: student.firstname,
            lastName: student.lastname,
          });
          console.log("Student logged in:", student);
          navigate("/dashboard");
        } else {
          setError("root", {
            message: "Invalid email or password.",
          });
        }
      } else if (data.accountType === "faculty") {
        // Find faculty by email and password
        const facultyMember = faculty.find(
          (f) => f.email === data.email && f.password === data.password
        );

        if (facultyMember) {
          setAccountData({
            type: "faculty",
            id: facultyMember.faculty_id,
            firstName: facultyMember.firstname,
            lastName: facultyMember.lastname,
          });
          console.log("Faculty logged in:", facultyMember);
          navigate("/dashboard");
        } else {
          setError("root", {
            message: "Invalid email or password.",
          });
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('root', { message: 'Unexpected error' });
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