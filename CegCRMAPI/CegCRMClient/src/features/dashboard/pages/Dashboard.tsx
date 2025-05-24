import PageWrapper from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <PageWrapper>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Hoş geldiniz 👋</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Aktif Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">12</p>
              <p className="text-sm text-muted-foreground">Bugün açılan: 3</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Müşteri Sayısı</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">87</p>
              <p className="text-sm text-muted-foreground">Yeni kayıt: 5</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bekleyen Satış</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">9</p>
              <p className="text-sm text-muted-foreground">Son 7 gün</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
