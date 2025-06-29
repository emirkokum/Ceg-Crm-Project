import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "@/types/auth";
import API from "@/api/axios";
import { AxiosError } from "axios";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { setRole } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const loginData = { email, password };

    try {
      const { data } = await API.post('/Auth/login', loginData);
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
      }
      
      if (data.data?.role) {
        const userRole = data.data.role as UserRole;
        const userInfo = {
          id: data.data.id,
          email: data.data.email,
          name: data.data.firstName,
          surname: data.data.lastName,
          role: userRole
        };
        setRole(userRole, userInfo);
      }
      
      toast.success('Giriş başarılı!');
      
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Login error details:', {
        error,
        isAxiosError: error instanceof AxiosError,
        response: error instanceof AxiosError ? error.response?.data : null,
        status: error instanceof AxiosError ? error.response?.status : null
      });
      
      if (error instanceof AxiosError) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const errorMessage = error.response.data?.message || error.response.data?.error || 'Giriş başarısız';
          toast.error(errorMessage);
        } else if (error.request) {
          // The request was made but no response was received
          toast.error('Sunucudan yanıt alınamadı. Bağlantınızı kontrol edin.');
        } else {
          // Something happened in setting up the request that triggered an Error
          toast.error('İstek kurulumunda hata. Lütfen tekrar deneyin.');
        }
      } else {
        toast.error(error instanceof Error ? error.message : 'Giriş başarısız. Bilgilerinizi kontrol edin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                  </a>
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/register" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
