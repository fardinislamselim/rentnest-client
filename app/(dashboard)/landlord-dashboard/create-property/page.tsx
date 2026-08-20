import React from "react";
import Container from "@/components/layout/container";
import CreatePropertyForm from "@/components/dashboard/create-property-form";

export const metadata = {
  title: "Create Property - RentNest",
  description: "Create a new rental property listing.",
};

export default async function CreatePropertyPage() {
  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        <CreatePropertyForm />
      </Container>
    </div>
  );
}
