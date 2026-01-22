import { ClassLessonTeacher } from "@/classes/ClassLesson";

export const LESSON_EXCEL_TEACHER_PT = new ClassLessonTeacher({
    uid_intern: 1,
    uid_teacher: "HRY7JbnFftWZocKtrIB1N1YuEJw1",
    uid_lesson:"zlUoi3t14wzC5cNhfS3J",
    //teacher = null,
    enabled: false,
    title: "Curso de Excel - Nova Turma",
    //title_normalized = "",
    subtitle: "Menos cliques, Mais resultados",
    //subtitle_normalized = "",
    description: "Quer trabalhar de forma mais ràpida, inteligente e profissional no Excel? Esta formaçāo é ideal para quem quer aumentar a produtividade e destacar-se no mercado de trabalho.",
    category: ClassLessonTeacher.CATEGORY.OFFICE,
    certified: true,
    goals: [
        "Atalhos e funções essenciais",
        "Automaçāo de tarefas repetitivas",
        "Criaçāo de relatórios eficientes",
        "Mais resultados com menos esforço",
    ],
    programs: [],
    prerequisites: [
        "Saber utilizar um computador"
    ],
    target_audiences: [
       "Profissionais",
       "Estudantes",
       "Administrativos",
       "Analistas",
       "Gestores",
    ],
    materials: [
        "Um computador.",
        "O programa Excel",
    ],
    tags:[
        {title:"📌 Vagas limitadas", subtitle:"Inscrições abertas!"},
        {title:"🎓 Vários níveis",subtitle:"Do nível principiante ao avançado, com certificação até ao final."},
        {title:"🏢 Instalações equipadas",subtitle:"Pode ir lá e usar os computadores da escola."},
    ],
    notes: [],
    //photo_url = "",
    //status: ClassLesson.STATUS.OPEN,
    //translate = {},
    //translates = [],
    //created_time = new Date(),
    //last_edit_time = new Date(),
});