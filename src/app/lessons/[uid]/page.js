"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IconLessons } from "@/assets/icons/IconsComponent";
import { ClassLesson, ClassLessonTranslate } from "@/classes/ClassLesson";
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper";
import { languages, NS_DASHBOARD_MENU, NS_DAYS, NS_LANGS } from "@/contexts/i18n/settings";
import { useTranslation } from "react-i18next";
import { useLesson } from "@/contexts/LessonProvider";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import LessonComponent from "@/components/dashboard/lessons/LessonComponent";
import DialogLesson from "@/components/dashboard/lessons/DialogLesson";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import { useAuth } from "@/contexts/AuthProvider";
import { ClassUserIntern } from "@/classes/users/ClassUser";

export default function DashboardOneLesson() {
    const params = useParams();
    const { uid } = params; // <- ici tu récupères l'uid
    const { lesson, isLoading: isLoadingLessons, getOneLesson, setUidLesson } = useLesson();
    const { t } = useTranslation([ClassLesson.NS_COLLECTION, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
    //const [lesson, setLesson] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (uid && !isLoadingLessons) {
            const _lesson = getOneLesson(uid);
            //setLesson(_lesson);
            setUidLesson(uid);
            console.log("UUUID lesson", uid)
        }
    }, [uid, isLoadingLessons]);


    return (
        <DashboardPageWrapper
            titles={[
                { name: t('lessons', { ns: NS_DASHBOARD_MENU }), url: PAGE_LESSONS },
                { name: lesson?.translate?.title, url: '' }
            ]}
            //title={`Cours / ${lesson?.title}`}
            //subtitle={lesson?.translate?.subtitle}
            icon={<IconLessons />}>
            {

                user instanceof ClassUserIntern && <>
                    <ButtonConfirm
                        label={`Modifier`}
                        onClick={async () => {
                            //const translate = await ClassLessonTranslate.fetchFromFirestore("zlUoi3t14wzC5cNhfS3J", 'en');
                            const _lesson = await ClassLesson.fetchFromFirestore("zlUoi3t14wzC5cNhfS3J");
                            const _translates = {};
                            
                            for (const lang of languages) {
                                const _tr = await ClassLessonTranslate.fetchFromFirestore("zlUoi3t14wzC5cNhfS3J", lang);
                                //_lesson.update({ translates: { [lang]: _tr?.toJSON() } });
                                _translates[lang] = _tr?.toJSON();
                            }
                            
                            _lesson.update({ translates: _translates});
                            await _lesson.updateFirestore();
                            console.log("Translate", _lesson)
                            //setIsOpen(true)
                        }}
                        style={{ marginBottom: '10px' }}
                    />

                </>
            }
            <DialogLesson isOpen={isOpen} setIsOpen={setIsOpen} />
            <LessonComponent lesson={lesson} />
        </DashboardPageWrapper>
    );
}