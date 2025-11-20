import { getJsonValues } from "@/contexts/functions";
import { NS_HOME } from "@/contexts/i18n/settings";
import { useTranslation } from "react-i18next";

const Category = ({ subject }) => {
    const { title, desc } = subject;
    return (
      <div
        //href={`/#`}
        className="pt-5 pb-15px px-30px rounded-5px bg-borderColor text-center hover:bg-primaryColor dark:bg-borderColor-dark dark:hover:bg-secondaryColor group"
        data-aos="fade-up"
      >
        <h4 className="text-blackColor text-lg font-medium group-hover:text-blackColor-dark dark:text-blackColor-dark">
          {title}
        </h4>
        <p className="text-xs text-contentColor group-hover:text-contentColor-dark dark:text-contentColor-dark">
          {desc}
        </p>
      </div>
    );
  };
const CategoriesComponent = ({ subject }) => {
  const { t } = useTranslation([NS_HOME]);
  const categories = getJsonValues(t("categories", { returnObjects: true }));
  return (
    <section>
      <div className={subject ? "container-fluid-2" : "container"}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-30px pt-10 md:pt-0 pb-100px">
          {categories.map((category, idx) => (
            <Category key={idx} subject={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesComponent;
