import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Header from "@/components/sections/header/Header";
import { routing } from "@/i18n/routing";

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations("HomePage");

  return (
    <div>
      <Header />
      <main className="flex min-h-svh items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <Button>Button</Button>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      </main>
    </div>
  );
}
