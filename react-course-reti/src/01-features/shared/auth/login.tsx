import { cn } from "@/98-lib/utils"
import { Button } from "@/02-components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/02-components/ui/card"
import { Input } from "@/02-components/ui/input"
import { Label } from "@/02-components/ui/label"
import { useContext, useState } from "react"
import { AuthContext } from "@/06-providers/auth/auth-context"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { userService } from "@/03-http/base/services/user"

const Login = ({ className, ...props}: React.ComponentProps<"div">) => {

  //TODO: Fix the scrolling in the login page

  const [cardDescription, setCardDescription] = useState(<span>Inserisci la tua mail e la password</span>);
  const navigate = useNavigate();
  const { setSessionUser } = useContext(AuthContext);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: { email: string, password: string }) => {
    const user = await userService.getUserToLog(data.email, data.password);
    if (user) {
      setSessionUser(user);
      navigate('/');
    }
    else {
      setCardDescription(<span className="text-red-400">L'email o la password è errata</span>);
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle>Effettua l'accesso al tuo account</CardTitle>
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