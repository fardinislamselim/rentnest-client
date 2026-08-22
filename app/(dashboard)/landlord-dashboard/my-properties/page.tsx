import Container from "@/components/layout/container";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MyPropertiesList from "@/components/dashboard/my-properties-list";

export const metadata: import("next").Metadata = {
  title: "My Properties | RentNest Landlord Dashboard",
  description: "Manage all your property listings, track availability, and handle tenant requests.",
};

export default function MyPropertiesPage() {
  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                My Properties
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Manage all your property listings, track availability, and handle
                tenant requests.
              </p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-xl gap-2">
              <Link href="/landlord-dashboard/create-property">
                <PlusCircle className="h-4 w-4" />
                Add Property
              </Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <MyPropertiesList />
      </Container>
    </div>
  );
}
