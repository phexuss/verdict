import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

type TermsPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TermsOfUsePage' });
  return {
    title: t('title'),
    description: t('intro'),
    openGraph: { title: `${t('title')} — Verdict` },
  };
}

export default async function TermsOfUsePage() {
  const t = await getTranslations('TermsOfUsePage');
  const s = await getTranslations('TermsOfUsePage.sections');

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <article className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('title')}
          </h1>
          <p className="text-sm text-muted-foreground">{t('effectiveDate')}</p>
          <p className="text-base text-muted-foreground">{t('intro')}</p>
        </header>

        <section className="space-y-6">
          <LegalSection
            title={s('acceptanceTitle')}
            body={s('acceptanceBody')}
          />
          <LegalSection
            title={s('eligibilityTitle')}
            body={s('eligibilityBody')}
          />
          <LegalSection title={s('serviceTitle')} body={s('serviceBody')} />
          <LegalSection title={s('tmdbTitle')} body={s('tmdbBody')} />
          <LegalSection
            title={s('acceptableUseTitle')}
            body={s('acceptableUseBody')}
          />
          <LegalSection
            title={s('openSourceTitle')}
            body={s('openSourceBody')}
          />
          <LegalSection title={s('ipTitle')} body={s('ipBody')} />
          <LegalSection
            title={s('availabilityTitle')}
            body={s('availabilityBody')}
          />
          <LegalSection
            title={s('disclaimerTitle')}
            body={s('disclaimerBody')}
          />
          <LegalSection title={s('liabilityTitle')} body={s('liabilityBody')} />
          <LegalSection
            title={s('terminationTitle')}
            body={s('terminationBody')}
          />
          <LegalSection title={s('changesTitle')} body={s('changesBody')} />
          <LegalSection title={s('contactTitle')} body={s('contactBody')} />
        </section>

        <div className="flex justify-center pt-2">
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-4xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            {t('back')}
          </Link>
        </div>
      </article>
    </main>
  );
}

function LegalSection({ title, body }: { title: string; body: string }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-medium tracking-tight">{title}</h2>
      <p className="leading-7 text-muted-foreground">{body}</p>
    </section>
  );
}
