import { cn } from "@/98-lib/utils"
import { Button } from "@/02-components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/02-components/ui/card"
import { Input } from "@/02-components/ui/input"
import { Label } from "@/02-components/ui/label"
import { useState } from "react"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { userService } from "@/03-http/base/services/user"
import useBreadcrumbs from "@/04-hooks/use-breadcrums"
import { useAuth } from "@/04-hooks/use-auth"
import { ThemeSelector } from "@/02-components/ui/theme-selector"

const Login = ({ className, ...props }: React.ComponentProps<"div">) => {

  useBreadcrumbs([{ label: 'Login', url: '#' }])
  const [cardDescription, setCardDescription] = useState(<span>Inserisci la tua mail e la password</span>);
  const navigate = useNavigate();
  const { setSessionUser } = useAuth();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: { email: string, password: string }) => {
    const user = (await userService.getUserToLog(data.email, data.password, 0))[0];

    if (user) {
      setSessionUser(user);
      navigate('/');
    }
    else {
      setCardDescription(<span className="text-red-400">L'email o la password sono errate</span>);
    }
  }

  return (
    <div className="flex flex-col gap-2 items-center h-[calc(100vh-8rem)] w-full justify-center p-6 md:p-10">
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
                      placeholder="luca.gazzardi@email.com"
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
      <ThemeSelector />
    </div>
  )
}
export default Login