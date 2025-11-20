import useIsSecondary from "@/hooks/useIsSecondary";
import { NS_HOME_FOOTER } from "@/libs/i18n/settings";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const FooterAbout = () => {
  const { isSecondary } = useIsSecondary();
  const {t}=useTranslation([NS_HOME_FOOTER]);
  const { title, subtitle,schedule, bubble, goals, tag,content, about, mission, vision, inefop } = t(`about`, { returnObjects: true });

  //const allCourses = getAllCourses();
  useEffect(()=>{
    //console.log("COURSES",allCourses)
  })
  return (
    <div
      className="sm:col-start-1 sm:col-span-12 md:col-span-6  lg:col-span-4 mr-30px"
      data-aos="fade-up"
    >
      <h4 className="text-size-22 font-bold text-whiteColor mb-3">{title}</h4>
      <p className="text-base lg:text-sm 2xl:text-base text-darkgray mb-30px leading-1.8 2xl:leading-1.8">
        {subtitle}
      </p>
      {isSecondary ? (
        <ul className="flex gap-3 lg:gap-2 2xl:gap-3" data-aos="fade-up">
          <li>
            <a
              href="https://www.facebook.com/"
              className="w-11 md:w-10 2xl:w-11 h-11 md:h-10 2xl:h-11 leading-11 md:leading-10 2xl:leading-11 text-whitegrey bg-darkgray bg-opacity-10 hover:text-whiteColor dark:text-whiteColor-dark dark:bg-whiteColor dark:hover:bg-secondaryColor dark:hover:text-whiteColor rounded-full text-center"
            >
              <i className="icofont-facebook"></i>
            </a>
          </li>
          <li>
            <a
              href="https://x.com/"
              className="w-11 md:w-10 2xl:w-11 h-11 md:h-10 2xl:h-11 leading-11 md:leading-10 2xl:leading-11 text-whitegrey bg-darkgray bg-opacity-10 hover:text-whiteColor dark:text-whiteColor-dark dark:bg-whiteColor dark:hover:bg-secondaryColor dark:hover:text-whiteColor rounded-full text-center"
            >
              <i className="icofont-twitter"></i>
            </a>
          </li>
          <li>
            <a
              href="https://vimeo.com/"
              className="w-11 md:w-10 2xl:w-11 h-11 md:h-10 2xl:h-11 leading-11 md:leading-10 2xl:leading-11 text-whitegrey bg-darkgray bg-opacity-10 hover:text-whiteColor dark:text-whiteColor-dark dark:bg-whiteColor dark:hover:bg-secondaryColor dark:hover:text-whiteColor rounded-full text-center"
            >
              <i className="icofont-vimeo"></i>
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/"
              className="w-11 md:w-10 2xl:w-11 h-11 md:h-10 2xl:h-11 leading-11 md:leading-10 2xl:leading-11 text-whitegrey bg-darkgray bg-opacity-10 hover:text-whiteColor dark:text-whiteColor-dark dark:bg-whiteColor dark:hover:bg-secondaryColor dark:hover:text-whiteColor rounded-full text-center"
            >
              <i className="icofont-linkedin"></i>
            </a>
          </li>
          <li>
            <a
              href="https://www.skype.com/"
              className="w-11 md:w-10 2xl:w-11 h-11 md:h-10 2xl:h-11 leading-11 md:leading-10 2xl:leading-11 text-whitegrey bg-darkgray bg-opacity-10 hover:text-whiteColor dark:text-whiteColor-dark dark:bg-whiteColor dark:hover:bg-secondaryColor dark:hover:text-whiteColor rounded-full text-center"
            >
              <i className="icofont-skype"></i>
            </a>
          </li>
        </ul>
      ) : (
        <div className="flex items-center">
          <div>
            <i className="icofont-clock-time text-3xl text-whiteColor h-78px w-78px bg-primaryColor leading-78px mr-22px block text-center"></i>
          </div>
          <div>
            <h6 className="text-lg text-whiteColor font-medium leading-29px">
              {`Heures d'ouverture`}
            </h6>
            <p className="text-sm text-whiteColor text-opacity-60 mb-1">
              {`Lundi - Samedi (8h - 18h)`}
            </p>
            <p className="text-sm text-whiteColor text-opacity-60">
              {`Dimanche - Fermé`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterAbout;
