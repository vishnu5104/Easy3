import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default async function SubdomainPage({
  params,
}: {
  params: { subdomain: string };
}) {
  const { subdomain } = params;
  console.log("SubdomainPage: Rendering page for subdomain:", subdomain);

  try {
    const marketplace = await prisma.marketplace.findUnique({
      where: { subdomain },
    });
    console.log("SubdomainPage: Tenant retrieved:", marketplace);

    if (!marketplace) {
      console.log("SubdomainPage: Tenant not found, redirecting to 404");
      notFound();
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-8">
          Welcome to {marketplace.name}
        </h1>
        <Link href={`/details`} className="w-full max-w-md">
          <Card className="w-full cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{marketplace.name}</CardTitle>
              <CardDescription>Subdomain: {subdomain}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click to view more details
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    );
  } catch (error) {
    console.error("SubdomainPage: Error fetching marketplace:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold text-red-500">Error</h1>
        <p>There was an error loading the marketplace information.</p>
      </div>
    );
  }
}
