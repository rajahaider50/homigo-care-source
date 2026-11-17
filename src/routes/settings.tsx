import { createFileRoute } from "@tanstack/react-router";
import { FileArchive, Download, Smartphone, Info } from "lucide-react";
import { AppHeader, Card, Screen, SectionTitle, logoUrl } from "@/components/app/shell";
import { meta } from "@/lib/meta";
import sourceZip from "@/assets/homigo-care-source.zip.asset.json";

export const Route = createFileRoute("/settings")({
  head: () => meta("Settings", "App settings and developer downloads."),
  component: Settings,
});

function Settings() {
  return (
    <>
      <AppHeader title="Settings" subtitle="Admin · private" />
      <Screen>
        <Card className="flex items-center gap-3">
          <img src={logoUrl} alt="Homigo Care" className="h-14 w-14 rounded-2xl" />
          <div><p className="text-[17px] font-semibold text-primary-deep">Homigo Care</p><p className="text-[13px] text-muted-foreground">Version 1.0 · Prototype</p></div>
        </Card>
        <SectionTitle>Developer</SectionTitle>
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary"><FileArchive className="h-6 w-6" /></span>
            <div className="min-w-0"><p className="text-[16px] font-semibold text-primary-deep">Full source code</p><p className="text-[13px] text-muted-foreground">Whole project as ZIP · {(sourceZip.size / 1024).toFixed(0)} KB</p></div>
          </div>
          <a href={sourceZip.url} download="homigo-care-source.zip" className="press accent-gradient shadow-accent flex h-14 items-center justify-center gap-2 rounded-2xl text-[16px] font-semibold text-accent-foreground">
            <Download className="h-5 w-5" /> Download ZIP
          </a>
        </Card>
        <Card className="flex gap-3">
          <Smartphone className="h-5 w-5 shrink-0 text-primary" />
          <p className="text-[13px] text-muted-foreground">The ZIP includes ANDROID_APK.md with steps to build the Android APK in Android Studio.</p>
        </Card>
        <div className="flex gap-2 px-1 text-[12px] text-muted-foreground"><Info className="h-4 w-4 shrink-0" /> The ZIP is a snapshot of the code when it was created.</div>
      </Screen>
    </>
  );
}
