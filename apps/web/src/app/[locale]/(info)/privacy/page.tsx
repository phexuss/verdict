import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function PrivacyPage() {
  const t = useTranslations('PrivacyPolicyPage');
  const s = useTranslations('PrivacyPolicyPage.sections');

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
            title={s('dataWeCollectTitle')}
            body={s('dataWeCollectBody')}
          />
          <LegalSection title={s('howWeUseTitle')} body={s('howWeUseBody')} />
          <LegalSection title={s('authTitle')} body={s('authBody')} />
          <LegalSection title={s('tmdbTitle')} body={s('tmdbBody')} />
          <LegalSection title={s('sharingTitle')} body={s('sharingBody')} />
          <LegalSection title={s('retentionTitle')} body={s('retentionBody')} />
          <LegalSection title={s('securityTitle')} body={s('securityBody')} />
          <LegalSection title={s('childrenTitle')} body={s('childrenBody')} />
          <LegalSection title={s('rightsTitle')} body={s('rightsBody')} />
          <LegalSection
            title={s('internationalTitle')}
            body={s('internationalBody')}
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
