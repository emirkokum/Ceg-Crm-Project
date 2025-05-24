import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Kayıt bilgileri:", email, password);
    alert("Kayıt başarılı! Giriş yapabilirsiniz.");
    navigate("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleRegister} className="space-y-4 w-80">
        <h1 className="text-2xl font-semibold text-center">Kayıt Ol</h1>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="w-full" type="submit">
          Kayıt Ol
        </Button>
      </form>
    </div>
  );
}
