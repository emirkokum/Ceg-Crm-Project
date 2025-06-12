import { useParams, useNavigate } from "react-router-dom";
import { useCustomerById, useCustomerTickets, useCustomerInteractions } from "@/features/hooks/userCustomerApi";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { TicketsCard } from "@/components/dashboard/TicketsCard";
import { InteractionsOverviewCard } from "@/components/dashboard/InteractionsOverviewCard";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: customer, isLoading, error } = useCustomerById(id || "");
  const { data: tickets = [] } = useCustomerTickets(id || "");
  const { data: interactions = [] } = useCustomerInteractions(id || "");

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMMM yyyy", { locale: tr });
    } catch (error) {
      return "Tarih bilgisi mevcut değil";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  if (error || !customer) {
    toast.error("Müşteri bilgileri yüklenirken bir hata oluştu");
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-6">
        <p className="text-red-500">Müşteri bilgileri yüklenemedi</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Temel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                {customer.email}
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
                {customer.phone}
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{customer.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Kayıt Tarihi: {formatDate(customer.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ek Bilgiler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Müşteri Tipi:</span>{" "}
                {customer.type === "Person" ? "Bireysel" : "Kurumsal"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TicketsCard 
          tickets={tickets}
          title="Müşteri Ticketları"
          description="Müşteriye ait ticket geçmişi"
          showResolutionRate={false}
        />
        
        <InteractionsOverviewCard 
          interactions={interactions}
          title="Müşteri Etkileşimleri"
          description="Müşteri etkileşim geçmişi"
          showDistribution={true}
          filterByDate={false}
        />
      </div>
    </div>
  );
} 