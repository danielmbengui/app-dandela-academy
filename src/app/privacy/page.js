"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="page">
      <main className="container">
        {/* HERO */}
        <section className="hero-card">
          <p className="breadcrumb">Informations légales</p>
          <h1>Politique de confidentialité</h1>
          <p className="subtitle">
            Protection et traitement de vos données personnelles
          </p>

          <p className="hero-description">
            Chez <strong>Dandela Academy</strong>, la protection de vos données
            personnelles est une priorité. Cette politique de confidentialité
            explique quelles données nous collectons, comment nous les utilisons
            et quels sont vos droits.
          </p>
        </section>

        {/* CONTENU */}
        <section className="content">
          <div className="card">
            <h2>1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données est :
              <br />
              <strong>Dandela Academy</strong>
              <br />
              Email : contact@dandela-academy.com
            </p>
          </div>

          <div className="card">
            <h2>2. Données collectées</h2>
            <ul className="list">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Adresse postale (le cas échéant)</li>
              <li>Photo de profil (facultative)</li>
              <li>Données de connexion et d’utilisation de la plateforme</li>
              <li>Résultats de cours, tests et certifications</li>
            </ul>
          </div>

          <div className="card">
            <h2>3. Finalité du traitement</h2>
            <ul className="list">
              <li>Création et gestion de votre compte utilisateur</li>
              <li>Accès aux cours et aux sessions de formation</li>
              <li>Suivi pédagogique et certification</li>
              <li>Communication liée à votre parcours de formation</li>
              <li>Amélioration continue de la plateforme</li>
            </ul>
          </div>

          <div className="card">
            <h2>4. Base légale</h2>
            <p>
              Le traitement de vos données repose sur :
            </p>
            <ul className="list">
              <li>Votre consentement</li>
              <li>L’exécution d’un contrat (accès aux formations)</li>
              <li>Le respect d’obligations légales</li>
            </ul>
          </div>

          <div className="card">
            <h2>5. Durée de conservation</h2>
            <p>
              Vos données sont conservées uniquement le temps nécessaire à la
              réalisation des finalités pour lesquelles elles ont été collectées,
              sauf obligation légale contraire.
            </p>
          </div>

          <div className="card">
            <h2>6. Partage des données</h2>
            <p>
              Vos données ne sont <strong>jamais vendues</strong>. Elles peuvent
              être partagées uniquement avec :
            </p>
            <ul className="list">
              <li>Les formateurs et intervenants pédagogiques</li>
              <li>Les prestataires techniques (hébergement, outils cloud)</li>
              <li>Les autorités légales si la loi l’exige</li>
            </ul>
          </div>

          <div className="card">
            <h2>7. Sécurité des données</h2>
            <p>
              Dandela Academy met en œuvre des mesures techniques et
              organisationnelles pour protéger vos données contre toute perte,
              accès non autorisé ou divulgation.
            </p>
          </div>

          <div className="card">
            <h2>8. Vos droits</h2>
            <ul className="list">
              <li>Droit d’accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l’effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit d’opposition</li>
              <li>Droit à la portabilité</li>
            </ul>
            <p>
              Pour exercer vos droits, vous pouvez nous contacter à :
              <br />
              <strong>contact@dandela-academy.com</strong>
            </p>
          </div>

          <div className="card">
            <h2>9. Cookies</h2>
            <p>
              La plateforme peut utiliser des cookies nécessaires à son bon
              fonctionnement et à l’amélioration de l’expérience utilisateur.
              Vous pouvez gérer vos préférences via votre navigateur.
            </p>
          </div>

          <div className="card">
            <h2>10. Modifications</h2>
            <p>
              Cette politique de confidentialité peut être mise à jour à tout
              moment. La version en vigueur est celle publiée sur cette page.
            </p>
          </div>
        </section>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #020617;
          padding: 32px 16px 40px;
          color: #e5e7eb;
          display: flex;
          justify-content: center;
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
          border: 1px solid #1f2937;
          background: radial-gradient(circle at top left, #111827, #020617);
          padding: 20px;
          box-shadow: 0 22px 55px rgba(0, 0, 0, 0.7);
        }

        .breadcrumb {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-bottom: 4px;
        }

        h1 {
          margin: 0 0 6px;
          font-size: 1.9rem;
        }

        .subtitle {
          font-size: 0.95rem;
          color: #9ca3af;
          margin-bottom: 10px;
        }

        .hero-description {
          font-size: 0.9rem;
          max-width: 700px;
        }

        .content {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .card {
          background: #020617;
          border-radius: 16px;
          padding: 16px;
          border: 1px solid #1f2937;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
        }

        .card h2 {
          margin: 0 0 8px;
          font-size: 1.05rem;
          color: #93c5fd;
        }

        .card p {
          font-size: 0.88rem;
          color: #e5e7eb;
        }

        .list {
          padding-left: 18px;
          font-size: 0.88rem;
        }

        .list li {
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}
