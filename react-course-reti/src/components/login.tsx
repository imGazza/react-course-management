import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getUser } from "@/http/user"
import { useContext, useState } from "react"
import { AuthContext } from "@/providers/auth/auth-context"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"

const Login = ({ className, ...props}: React.ComponentProps<"div">) => {

  const [cardDescription, setCardDescription] = useState(<span>Enter your email below to login to your account</span>);
  const navigate = useNavigate();
  const { setSessionUser } = useContext(AuthContext);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: { email: string, password: string }) => {
    const user = await getUser(data.email, data.password);
    if (user) {
      setSessionUser(user);
      navigate('/');
    }
    else {
      setCardDescription(<span className="text-red-400">Invalid email or password</span>);
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                {cardDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      {...register("email", { required: true })}                      
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      {...register("password", { required: true })}
                      id="password"
                      type="password"
                      placeholder="password"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
export default Login