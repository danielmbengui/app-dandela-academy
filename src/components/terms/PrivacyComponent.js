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
            <nav className="breadcrumb-nav">
                <Typography sx={{ color: 'var(--font-color)', fontSize: '0.875rem' }}>
                    <Link href={PAGE_TERMS_USAGE} className="breadcrumb-link">
                        {t('title-usage')}
                    </Link>
                    {" / "}
                    {t('title')}
                </Typography>
            </nav>
            
            {/* HERO */}
            <section className="hero-card">
                <p className="breadcrumb">{t('title-terms')}</p>
                <h1>{t('title')}</h1>
                <p className="subtitle">{t('subtitle')}</p>
                <div className="hero-description">
                    <Trans
                        t={t}
                        i18nKey={'hero-description'}
                        components={{
                            b: <strong />
                        }}
                    />
                </div>
            </section>

            {/* CONTENU */}
            <section className="content">
                {
                    chaptersTranslate?.map((chapter, index) => {
                        return (<div key={`${chapter.title}`} className="card">
                            <div className="card-header">
                                <span className="chapter-number">{index + 1}</span>
                                <h2>{chapter.title}</h2>
                            </div>
                            {
                                chapter.subtitle && <p className="chapter-subtitle">
                                    <Trans
                                        t={t}
                                        i18nKey={chapter.subtitle}
                                        components={{
                                            b: <strong />
                                        }}
                                    />
                                </p>
                            }
                            <Stack sx={{ py: 1, gap: 1.5 }}>
                                {
                                    chapter.subchapters?.map((subchapter, subIndex) => {
                                        return (<div key={`${subchapter.title}`} className="subchapter">
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
                                                        a: <a className="link" />
                                                    }}
                                                />
                                            </p>
                                            <ul className="list">
                                                {
                                                    subchapter?.content?.map((c, i) => {
                                                        return (<li key={`content-${subIndex}-${i}`}>
                                                            <Trans
                                                                t={t}
                                                                i18nKey={c}
                                                                values={{
                                                                    email: school?.emails?.[0],
                                                                    phone: school?.phones?.[0]
                                                                }}
                                                                components={{
                                                                    b: <strong />,
                                                                    a: <a className="link" />
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
                            {
                                chapter.footer && <p className="chapter-footer">
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
                                    />
                                </p>
                            }
                        </div>)
                    })
                }
            </section>
        </main>
        <style jsx>{`
      .page {
        min-height: 100vh;
        padding: 24px 12px 40px;
        display: flex;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      .page::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, 
          var(--primary-shadow) 0%, 
          var(--card-color) 25%,
          var(--card-color) 75%,
          var(--primary-shadow-xs) 100%
        );
        z-index: 0;
        opacity: 0.6;
      }

      :global(.dark) .page::before {
        background: linear-gradient(135deg, 
          rgba(38, 118, 255, 0.15) 0%, 
          var(--card-color) 25%,
          var(--card-color) 75%,
          rgba(38, 118, 255, 0.1) 100%
        );
        opacity: 1;
      }

      .container {
        width: 100%;
        max-width: 920px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        position: relative;
        z-index: 1;
      }

      .breadcrumb-nav {
        margin-bottom: 8px;
      }

      .breadcrumb-link {
        color: var(--primary);
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s ease;
        border-bottom: 1px solid transparent;
      }

      .breadcrumb-link:hover {
        color: var(--primary);
        border-bottom-color: var(--primary);
      }

      .hero-card {
        border-radius: 24px;
        border: 1px solid var(--card-border);
        background: var(--card-color);
        padding: 32px 28px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08),
                    0 1px 3px rgba(0, 0, 0, 0.05);
        position: relative;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      :global(.dark) .hero-card {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4),
                    0 1px 3px rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .hero-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, 
          var(--primary) 0%, 
          var(--primary-shadow-md) 50%,
          var(--primary) 100%
        );
      }

      .hero-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12),
                    0 2px 6px rgba(0, 0, 0, 0.08);
      }

      :global(.dark) .hero-card:hover {
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5),
                    0 2px 6px rgba(0, 0, 0, 0.4);
      }

      .breadcrumb {
        font-size: 0.75rem;
        color: var(--grey-light);
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 500;
      }

      h1 {
        margin: 0 0 12px;
        font-size: 2.25rem;
        font-weight: 700;
        color: var(--font-color);
        line-height: 1.2;
        letter-spacing: -0.02em;
      }

      .subtitle {
        font-size: 1rem;
        color: var(--grey-light);
        margin-bottom: 16px;
        font-weight: 400;
        line-height: 1.5;
      }

      .hero-description {
        font-size: 0.95rem;
        font-weight: 400;
        max-width: 100%;
        color: var(--font-color);
        line-height: 1.7;
        opacity: 0.9;
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .card {
        background: var(--card-color);
        border-radius: 20px;
        padding: 24px;
        border: 1px solid var(--card-border);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      :global(.dark) .card {
        border-color: rgba(255, 255, 255, 0.08);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .card:hover {
        border-color: var(--primary-shadow-sm);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        transform: translateY(-1px);
      }

      :global(.dark) .card:hover {
        border-color: rgba(38, 118, 255, 0.3);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .chapter-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: linear-gradient(135deg, var(--primary), var(--primary-shadow-md));
        color: var(--font-reverse-color);
        font-weight: 700;
        font-size: 1rem;
        flex-shrink: 0;
        box-shadow: 0 2px 8px var(--primary-shadow-sm);
      }

      .card h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--font-color);
        line-height: 1.3;
        flex: 1;
      }

      .chapter-subtitle {
        font-size: 0.9rem;
        color: var(--font-color);
        line-height: 1.6;
        margin-bottom: 16px;
        opacity: 0.85;
        padding-left: 48px;
      }

      .subchapter {
        padding-left: 48px;
      }

      .title-subchapter {
        margin-bottom: 8px;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--font-color);
        line-height: 1.5;
      }

      .list {
        padding-left: 20px;
        margin: 0;
        font-size: 0.9rem;
        color: var(--font-color);
        line-height: 1.8;
        list-style: none;
        position: relative;
      }

      .list::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0.5em;
        bottom: 0.5em;
        width: 2px;
        background: linear-gradient(180deg, 
          var(--primary-shadow-sm) 0%,
          var(--primary-shadow-xs) 100%
        );
        border-radius: 2px;
      }

      .list li {
        margin-bottom: 10px;
        padding-left: 24px;
        position: relative;
        opacity: 0.9;
      }

      .list li::before {
        content: '•';
        position: absolute;
        left: 0;
        color: var(--primary);
        font-weight: bold;
        font-size: 1.2em;
        line-height: 1.4;
      }

      .list li:last-child {
        margin-bottom: 0;
      }

      .chapter-footer {
        font-size: 0.9rem;
        color: var(--font-color);
        line-height: 1.6;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--card-border);
        opacity: 0.85;
        padding-left: 48px;
      }

      :global(.dark) .chapter-footer {
        border-color: rgba(255, 255, 255, 0.1);
      }

      .list a,
      .link {
        cursor: pointer;
        color: var(--primary);
        text-decoration: none;
        font-weight: 500;
        transition: all 0.2s ease;
        border-bottom: 1px solid transparent;
      }

      .list a:hover,
      .link:hover {
        color: var(--primary-shadow-md);
        border-bottom-color: var(--primary-shadow-sm);
      }

      @media (max-width: 768px) {
        .page {
          padding: 16px 8px 32px;
        }

        .container {
          gap: 20px;
        }

        .hero-card {
          padding: 24px 20px;
          border-radius: 20px;
        }

        h1 {
          font-size: 1.75rem;
        }

        .card {
          padding: 20px;
          border-radius: 16px;
        }

        .card-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .chapter-number {
          width: 32px;
          height: 32px;
          font-size: 0.9rem;
        }

        .chapter-subtitle,
        .subchapter,
        .chapter-footer {
          padding-left: 0;
        }

        .list {
          padding-left: 16px;
        }

        .list li {
          padding-left: 20px;
        }
      }
    `}</style>
    </div>);
}
