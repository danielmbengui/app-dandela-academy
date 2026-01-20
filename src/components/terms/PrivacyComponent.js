"use client";
import { PAGE_TERMS_USAGE } from "@/contexts/constants/constants_pages";
import { NS_TERMS_PRIVACY } from "@/contexts/i18n/settings";
import { useSchool } from "@/contexts/SchoolProvider";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import { Trans, useTranslation } from "react-i18next";

export default function PrivacyComponent() {
    const { t } = useTranslation([NS_TERMS_PRIVACY]);
    const chaptersTranslate = t('chapters', { returnObjects: true }) || [];
    const { school } = useSchool();
    return (<div className="page">
        <main className="container">
            <Typography sx={{ color: 'var(--font-color)' }}><Link href={PAGE_TERMS_USAGE} style={{ color: 'var(--primary)', fontWeight: 300 }}>{t('title-usage')}</Link>{" / "}{t('title')}</Typography>
            {/* HERO */}
            <section className="hero-card">
                <p className="breadcrumb">{t('title-terms')}</p>
                <h1>{t('title')}</h1>
                <p className="subtitle">{t('subtitle')}</p>
                <p className="hero-description">
                    <Trans
                        t={t}
                        i18nKey={'hero-description'}
                        components={{
                            b: <strong />
                        }}
                    />
                </p>
            </section>

            {/* CONTENU */}
            <section className="content">
                {
                    chaptersTranslate?.map((chapter, index) => {
                        return (<div key={`${chapter.title}`} className="card">
                            <h2>{index + 1}. {chapter.title}</h2>
                            {
                                chapter.subtitle && <p>
                                    <Trans
                                        t={t}
                                        i18nKey={chapter.subtitle}
                                        components={{
                                            b: <strong />
                                        }}
                                    />
                                </p>
                            }
                            <Stack sx={{ py: 0.5 }}>
                                {
                                    chapter.subchapters?.map((subchapter, index) => {
                                        return (<div key={`${subchapter.title}`}>
                                            <p className="title-subchapter">
                                                <Trans
                                                    t={t}
                                                    i18nKey={subchapter.title}
                                                    values={{
                                                        email: school?.emails?.[0],
                                                        phone: school?.phones?.[0]
                                                    }}
                                                    components={{
                                                        b: <strong />,
                                                        a: <a />
                                                    }}
                                                />
                                            </p>
                                            <ul className="list" style={{
                                                marginLeft: '0.5rem',
                                                listStyleType: 'disc',
                                            }}>
                                                {
                                                    subchapter?.content?.map((c, i) => {
                                                        return (<li key={`content-${index}-${i}`}>
                                                            <Trans
                                                                t={t}
                                                                i18nKey={c}
                                                                values={{
                                                                    email: school?.emails?.[0],
                                                                    phone: school?.phones?.[0]
                                                                }}
                                                                components={{
                                                                    b: <strong />,
                                                                    a: <a />
                                                                }}
                                                            />
                                                        </li>)
                                                    })
                                                }
                                            </ul>
                                        </div>)
                                    })
                                }
                            </Stack>
                            <p>
                                <Trans
                                    t={t}
                                    i18nKey={chapter.footer}
                                    values={{
                                        email: school?.emails?.[0],
                                        phone: school?.phones?.[0]
                                    }}
                                    components={{
                                        b: <strong />,
                                        a: <a className="link" />
                                    }}
                                /></p>
                        </div>)
                    })
                }
            </section>
        </main>
        <style jsx>{`
      .page {
        min-height: 100vh;
        background: var(--card-color);
        padding-top: 15px;
        padding-left: 5px;
        padding-right: 5px;
        padding-bottom: 30px;
        color: #e5e7eb;
        display: flex;
        justify-content: center;
        border-radius: 10px;
      }

      .container {
        width: 100%;
        max-width: 900px;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .hero-card {
        border-radius: 18px;
        border: 0.1px solid var(--card-border);
        background: radial-gradient(circle at top left, var(--primary-shadow), var(--card-color));
        padding: 20px;
        box-shadow: 5px 5px 30px 0px rgba(0, 0, 0, 0.3);
      }

      .breadcrumb {
        font-size: 0.75rem;
        color: var(--grey-light);
        margin-bottom: 0px;
      }

      h1 {
        margin: 0 0 0px;
        font-size: 1.9rem;
        color: var(--font-color);
      }

      .subtitle {
        font-size: 0.95rem;
        color: var(--grey-light);
        margin-bottom: 5px;
      }

      .hero-description {
        font-size: 0.9rem;
        font-weight: 400;
        max-width: 700px;
        color: var(--font-color);
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .card {
        background: var(--card-color);
        border-radius: 15px;
        padding: 16px;
        border: 1px solid var(--card-border);
       
      }

      .card h2 {
        margin: 0 0 4px;
        font-size: 1.05rem;
        font-weight:600;
        color: var(--font-color);
      }

      .card p {
        font-size: 0.88rem;
        color: var(--font-color);
      }

      .title-subchapter {
            margin-bottom:2px;
      }

      .list {
        padding-left: 18px;
        font-size: 0.88rem;
        color: var(--font-color);
      }

      .list li {
        margin-bottom: 4px;
      }
      .list a {
        cursor:'pointer';
        color: var(--primary);
      }
      .link {
        cursor:'pointer';
        color: var(--primary);
      }
    `}</style>
    </div>);
}
