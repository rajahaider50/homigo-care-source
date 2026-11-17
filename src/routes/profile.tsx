import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Clock, BadgeCheck, MessageCircle, Phone } from "lucide-react";
import {
  AppHeader,
  Card,
  PrimaryButton,
  Screen,
  SectionTitle,
  TierBadge,
} from "@/components/app/shell";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/profile")({
  head: () =>
    meta(
      "Professional profile",
      "Ratings, response time and verified credentials of your care professional.",
    ),
  component: Profile,
});

const checks = [
  ["CNIC identity verified", "8 Oct"],
  ["Nursing degree verified", "10 Oct"],
  ["Council registration verified", "12 Oct"],
  ["Hospital experience letter verified", "14 Oct"],
  ["Clinical skills test passed", "16 Oct"],
];

function Profile() {
  return (
    <>
      <AppHeader title="Professional profile">
        <div className="mt-5 flex items-center gap-4">
          <div className="relative">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-surface font-display text-[26px] font-bold text-primary">
              AR
            </div>
            <BadgeCheck className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-surface fill-success text-surface" />
          </div>
          <div className="min-w-0">
            <p className="text-[22px] font-semibold">Ayesha Raza</p>
            <p className="text-[14px] text-primary-foreground/75">Registered Nurse · 8 yrs</p>
          </div>
        </div>
      </AppHeader>
      <Screen>
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-3 text-center">
            <Star className="mx-auto h-5 w-5 fill-accent text-accent" />
            <p className="mt-1 text-[18px] font-bold text-primary-deep">4.9</p>
            <p className="text-[12px] text-muted-foreground">312 reviews</p>
          </Card>
          <Card className="p-3 text-center">
            <Clock className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-1 text-[18px] font-bold text-primary-deep">8 min</p>
            <p className="text-[12px] text-muted-foreground">Response</p>
          </Card>
          <Card className="grid place-items-center p-3">
            <TierBadge tier="Gold" />
          </Card>
        </div>
        <SectionTitle>Verification</SectionTitle>
        <Card className="space-y-3.5">
          {checks.map(([l, d]) => (
            <div key={l} className="flex items-center gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-success-soft">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-success"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <path
                    d="M5 12l5 5 9-10"
                    strokeDasharray="24"
                    strokeDashoffset="24"
                    style={{ animation: "dash .6s ease-out forwards" }}
                  />
                </svg>
              </span>
              <p className="text-[15px] text-foreground">
                {l}, <span className="text-muted-foreground">{d}</span>
              </p>
            </div>
          ))}
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <PrimaryButton tone="outline">
            <MessageCircle className="h-5 w-5" /> Message
          </PrimaryButton>
          <PrimaryButton tone="outline">
            <Phone className="h-5 w-5" /> Call
          </PrimaryButton>
        </div>
        <Link to="/book">
          <PrimaryButton>Book Ayesha</PrimaryButton>
        </Link>
      </Screen>
    </>
  );
}
