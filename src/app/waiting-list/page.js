"use client"
import PageWrapper from "@/components/home/layout/PageWrapper";
import ThemeController from "@/components/home/others/ThemeController";
import WaitingListMain from "@/components/waiting-list/WaitingListMain";

const WaitingListPage = () => {
  return (
    <PageWrapper>
      <main>
        <WaitingListMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default WaitingListPage;
