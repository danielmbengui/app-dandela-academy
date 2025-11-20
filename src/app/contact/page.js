"use client"
import ContactMain from "@/components/contact/ContactMain";
import PageWrapper from "@/components/home/layout/PageWrapper";
import ThemeController from "@/components/home/others/ThemeController";

const Contact = () => {
  return (
    <PageWrapper>
      <main>
        <ContactMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Contact;
