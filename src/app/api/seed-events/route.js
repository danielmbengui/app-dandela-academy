import { NextResponse } from "next/server";
import { doc, setDoc, collection, getCountFromServer, query } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { firestore } from "@/contexts/firebase/config";

const COLLECTION = "EVENTS";
const STATUS_OPEN = "open";

/** Événements de test à insérer (FR / EN / PT) */
const SEED_EVENTS = [
  {
    title: "Atelier Excel avancé",
    description: "Session pratique sur les tableaux croisés dynamiques et les formules avancées. Apportez votre ordinateur.",
    translate: {
      fr: {
        title: "Atelier Excel avancé",
        description: "Session pratique sur les tableaux croisés dynamiques et les formules avancées. Apportez votre ordinateur.",
      },
      en: {
        title: "Advanced Excel workshop",
        description: "Hands-on session on pivot tables and advanced formulas. Bring your laptop.",
      },
      pt: {
        title: "Workshop Excel avançado",
        description: "Sessão prática sobre tabelas dinâmicas e fórmulas avançadas. Traga o seu computador.",
      },
    },
    start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // dans 7 jours
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // +3h
    location: "Salle A - Dandela Academy",
    max_attendees: 20,
    subscribers: [],
    status: STATUS_OPEN,
    photo_url: "",
  },
  {
    title: "Webinaire : Bien démarrer avec Word",
    description: "Découvrez les bases de Microsoft Word : mise en forme, styles, en-têtes et pieds de page. En ligne.",
    translate: {
      fr: {
        title: "Webinaire : Bien démarrer avec Word",
        description: "Découvrez les bases de Microsoft Word : mise en forme, styles, en-têtes et pieds de page. En ligne.",
      },
      en: {
        title: "Webinar: Getting started with Word",
        description: "Learn the basics of Microsoft Word: formatting, styles, headers and footers. Online.",
      },
      pt: {
        title: "Webinar: Começar com o Word",
        description: "Aprenda o básico do Microsoft Word: formatação, estilos, cabeçalhos e rodapés. Online.",
      },
    },
    start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    location: "En ligne / Online",
    max_attendees: 50,
    subscribers: [],
    status: STATUS_OPEN,
    photo_url: "",
  },
  {
    title: "Journée portes ouvertes Dandela Academy",
    description: "Visite des locaux, présentation des formations et échanges avec l'équipe. Café et collation offerts.",
    translate: {
      fr: {
        title: "Journée portes ouvertes Dandela Academy",
        description: "Visite des locaux, présentation des formations et échanges avec l'équipe. Café et collation offerts.",
      },
      en: {
        title: "Dandela Academy open day",
        description: "Tour of the premises, presentation of courses and Q&A with the team. Coffee and snacks provided.",
      },
      pt: {
        title: "Dia de portas abertas Dandela Academy",
        description: "Visita às instalações, apresentação dos cursos e conversa com a equipa. Café e lanche oferecidos.",
      },
    },
    start_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
    location: "Siège Dandela Academy",
    max_attendees: 30,
    subscribers: [],
    status: STATUS_OPEN,
    photo_url: "",
  },
];

function toFirestoreEvent(ev, uid, uid_intern, Ts = Timestamp) {
  const fromDate = (d) => (d instanceof Date && Ts.fromDate ? Ts.fromDate(d) : d);
  const now = Ts.now ? Ts.now() : Timestamp.now();
  return {
    uid,
    uid_intern,
    title: ev.title,
    description: ev.description,
    translate: ev.translate || {},
    start_date: fromDate(ev.start_date),
    end_date: fromDate(ev.end_date),
    location: ev.location || "",
    max_attendees: ev.max_attendees ?? 0,
    subscribers: ev.subscribers ?? [],
    status: ev.status || STATUS_OPEN,
    photo_url: ev.photo_url || "",
    created_time: now,
    last_edit_time: now,
  };
}

export async function GET() {
  try {
    const useAdmin = !!(
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    );

    let db = firestore;
    let Ts = Timestamp;
    if (useAdmin) {
      const adminModule = await import("@/contexts/firebase/configAdmin");
      db = adminModule.firestoreAdmin;
      Ts = adminModule.Timestamp;
    }

    let existingCount = 0;
    if (db.collection) {
      const snapshot = await db.collection(COLLECTION).get();
      existingCount = snapshot.size;
    } else {
      const countSnap = await getCountFromServer(query(collection(db, COLLECTION)));
      existingCount = countSnap.data().count;
    }

    const created = [];
    for (let i = 0; i < SEED_EVENTS.length; i++) {
      const ev = SEED_EVENTS[i];
      const uid = `seed-event-${Date.now()}-${i}`;
      const uid_intern = existingCount + i + 1;
      const data = toFirestoreEvent(ev, uid, uid_intern, Ts);
      if (db.collection) {
        await db.collection(COLLECTION).doc(uid).set(data);
      } else {
        await setDoc(doc(db, COLLECTION, uid), data);
      }
      created.push({ uid, title: ev.translate?.fr?.title || ev.title });
    }

    return NextResponse.json({
      ok: true,
      message: `${created.length} événement(s) ajouté(s) dans Firestore.`,
      created,
    });
  } catch (error) {
    console.error("seed-events error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Erreur lors de l'ajout des événements." },
      { status: 500 }
    );
  }
}
