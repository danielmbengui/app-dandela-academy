"use client";

export default function TermsOfUsePage() {
  return (
    <div className="page">
      <main className="container">
        {/* HERO */}
        <section className="hero-card">
          <p className="breadcrumb">Informations légales</p>
          <h1>Conditions d’utilisation</h1>
          <p className="subtitle">
            Règles encadrant l’utilisation de la plateforme Dandela Academy
          </p>

          <p className="hero-description">
            Les présentes conditions d’utilisation définissent les règles
            d’accès et d’utilisation de la plateforme <strong>Dandela Academy</strong>.
            En utilisant nos services, vous acceptez l’intégralité de ces conditions.
          </p>
        </section>

        {/* CONTENU */}
        <section className="content">
          <div className="card">
            <h2>1. Objet</h2>
            <p>
              Dandela Academy est une plateforme de formation proposant des cours,
              des sessions pédagogiques, des évaluations et des certifications.
              Les présentes conditions ont pour objet de définir les modalités
              d’utilisation de ces services.
            </p>
          </div>

          <div className="card">
            <h2>2. Accès à la plateforme</h2>
            <p>
              L’accès à certaines fonctionnalités nécessite la création d’un
              compte utilisateur. Vous vous engagez à fournir des informations
              exactes et à maintenir la confidentialité de vos identifiants.
            </p>
          </div>

          <div className="card">
            <h2>3. Comptes utilisateurs</h2>
            <ul className="list">
              <li>Un utilisateur ne peut posséder qu’un seul compte</li>
              <li>Le partage de compte est strictement interdit</li>
              <li>Vous êtes responsable de toute activité effectuée depuis votre compte</li>
            </ul>
          </div>

          <div className="card">
            <h2>4. Rôles et accès</h2>
            <p>
              Certaines pages ou fonctionnalités sont accessibles uniquement
              selon votre rôle (étudiant, professeur, administrateur). Toute
              tentative d’accès non autorisé pourra entraîner une suspension
              ou une suppression du compte.
            </p>
          </div>

          <div className="card">
            <h2>5. Utilisation des contenus</h2>
            <ul className="list">
              <li>Les contenus pédagogiques sont réservés à un usage personnel</li>
              <li>Toute reproduction ou diffusion sans autorisation est interdite</li>
              <li>Les supports restent la propriété de Dandela Academy ou des formateurs</li>
            </ul>
          </div>

          <div className="card">
            <h2>6. Inscriptions aux cours</h2>
            <p>
              L’inscription à un cours ou à une session est personnelle et non
              transférable. Dandela Academy se réserve le droit d’annuler une
              session en cas de force majeure ou de nombre insuffisant de participants.
            </p>
          </div>

          <div className="card">
            <h2>7. Évaluations et certifications</h2>
            <p>
              Les résultats, notes et certifications délivrés sont strictement
              liés aux performances réelles de l’utilisateur. Toute tentative
              de fraude entraînera l’annulation des résultats concernés.
            </p>
          </div>

          <div className="card">
            <h2>8. Comportement des utilisateurs</h2>
            <ul className="list">
              <li>Respect des formateurs et des autres apprenants</li>
              <li>Interdiction de propos offensants, discriminatoires ou illégaux</li>
              <li>Utilisation loyale de la plateforme</li>
            </ul>
          </div>

          <div className="card">
            <h2>9. Suspension et résiliation</h2>
            <p>
              Dandela Academy se réserve le droit de suspendre ou de supprimer
              un compte en cas de non-respect des présentes conditions, sans
              préavis ni indemnité.
            </p>
          </div>

          <div className="card">
            <h2>10. Responsabilité</h2>
            <p>
              Dandela Academy met tout en œuvre pour assurer la disponibilité
              et la qualité des services, mais ne saurait être tenue responsable
              des interruptions temporaires ou des pertes de données indépendantes
              de sa volonté.
            </p>
          </div>

          <div className="card">
            <h2>11. Modification des conditions</h2>
            <p>
              Les présentes conditions peuvent être modifiées à tout moment.
              Les utilisateurs seront informés des changements importants.
              L’utilisation continue de la plateforme vaut acceptation des
              nouvelles conditions.
            </p>
          </div>

          <div className="card">
            <h2>12. Droit applicable</h2>
            <p>
              Les présentes conditions sont soumises au droit suisse. En cas
              de litige, les tribunaux compétents seront ceux du siège de
              Dandela Academy, sauf disposition légale contraire.
            </p>
          </div>

          <div className="card">
            <h2>13. Contact</h2>
            <p>
              Pour toute question relative aux conditions d’utilisation,
              vous pouvez nous contacter à :
              <br />
              <strong>contact@dandela-academy.com</strong>
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
