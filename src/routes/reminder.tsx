import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BellRing, Volume2, Check, X } from "lucide-react";
import { AppHeader, Card, Screen } from "@/components/app/shell";
import { meta } from "@/lib/meta";
import box from "@/assets/medicine-box.jpg";

export const Route = createFileRoute("/reminder")({
  head: () => meta("Medicine reminder", "Urdu medicine reminder with photo check so the right person takes the right dose."),
  component: Reminder,
});

function Reminder() {
  const [ans, setAns] = useState<null | boolean>(null);
  return (
    <>
      <AppHeader title="Medicine reminder" subtitle="8:30 PM · after dinner" right={<BellRing className="animate-heartbeat h-6 w-6" />} />
      <Screen>
        <Card className="overflow-hidden p-0">
          <img src={box} alt="Metformin 500 mg medicine box" width={1024} height={768} className="aspect-[4/3] w-full object-cover" />
          <div dir="rtl" lang="ur" className="space-y-1 p-5 text-right">
            <p className="font-urdu text-[24px] font-bold text-primary-deep">میٹفارمن ۵۰۰ ملی گرام</p>
            <p className="font-urdu text-[19px] text-foreground">رات کے کھانے کے بعد ایک گولی پانی کے ساتھ لیں۔</p>
          </div>
          <button className="press mx-5 mb-5 flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-[14px] font-semibold text-primary"><Volume2 className="h-4 w-4" /> Listen in Urdu</button>
        </Card>
        <Card className="text-center">
          <p className="text-[20px] font-semibold text-primary-deep">This is for Ahmed. Is that correct?</p>
          <p dir="rtl" lang="ur" className="font-urdu mt-1 text-[17px] text-muted-foreground">یہ دوا احمد کے لیے ہے۔ کیا یہ درست ہے؟</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button onClick={() => setAns(true)} className="press flex h-20 flex-col items-center justify-center rounded-2xl bg-success text-primary-foreground text-[20px] font-bold"><Check className="h-7 w-7" strokeWidth={3} />Yes · جی ہاں</button>
            <button onClick={() => setAns(false)} className="press flex h-20 flex-col items-center justify-center rounded-2xl bg-destructive text-destructive-foreground text-[20px] font-bold"><X className="h-7 w-7" strokeWidth={3} />No · نہیں</button>
          </div>
        </Card>
        {ans === true && <div className="animate-screen rounded-2xl bg-success-soft p-4 text-[15px] font-semibold text-success">Dose recorded for Ahmed at 8:30 PM.</div>}
        {ans === false && <div className="animate-screen rounded-2xl bg-accent-soft p-4 text-[15px] font-semibold text-accent">Stopped. Sara has been alerted to check the medicine.</div>}
      </Screen>
    </>
  );
}
