import PageLayout from "@/components/PageLayout";
import ConsultationHub from "@/components/ConsultationHub";

export const metadata = {
    title: "Book a Consultation | Forte Migration",
    description: "Connect with our expert migration agents for the strategy and clarity you need for your Australian journey.",
};

export default function ConsultPage() {
    return (
        <PageLayout forceSolidHeader={true}>
            <div className="pt-8 lg:pt-10 min-h-[70vh]">
                <div className="w-full">
                    <ConsultationHub />
                </div>
            </div>
        </PageLayout>
    );
}
