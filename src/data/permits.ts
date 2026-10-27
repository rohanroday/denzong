// DRAFT SEED DATA. Permit rules change often and differ for Indian and
// foreign travellers. Every row is unverified until checked against the
// official Sikkim Tourism / Home Department notices.

import { SIKKIM_TOURISM } from "./places";

type PermitSeed = {
  id: string;
  name: string;
  indianRule: string;
  foreignerAllowed: "yes" | "group" | "no";
  foreignerRule: string;
  howToApply: string;
  approxFeeInr?: number;
};

export const permitSeeds: PermitSeed[] = [
  {
    id: "rap-sikkim",
    name: "Restricted Area Permit (RAP) for Sikkim",
    indianRule: "Not needed. Indian nationals can enter Sikkim without a permit.",
    foreignerAllowed: "yes",
    foreignerRule: "Every foreign national needs a RAP to enter Sikkim at all. It is free and is usually issued for 30 days.",
    howToApply: "Apply online through Sikkim's e-RAP system or at counters such as Rangpo checkpost, Melli checkpost, Bagdogra airport, or Sikkim Tourism offices in Delhi, Kolkata and Siliguri. Carry passport, Indian visa and photos.",
  },
  {
    id: "pap-east",
    name: "Protected Area Permit: Tsomgo Lake",
    indianRule: "Needed. Arranged through a registered tour operator or taxi association in Gangtok, usually a day before. Carry photo ID and passport photos.",
    foreignerAllowed: "group",
    foreignerRule: "Allowed as a day trip in a group of two or more, arranged by a registered travel agency.",
    howToApply: "Book through a registered Gangtok tour operator; they apply with your ID copies and photos. Apply a day in advance.",
    approxFeeInr: 200,
  },
  {
    id: "pap-nathula",
    name: "Protected Area Permit: Nathu La and Baba Mandir",
    indianRule: "Needed, separate from the Tsomgo permit. Indian nationals only. Nathu La is usually closed to tourists on Mondays and Tuesdays.",
    foreignerAllowed: "no",
    foreignerRule: "Not allowed. Foreign nationals cannot visit Nathu La or Baba Mandir.",
    howToApply: "Through a registered Gangtok tour operator, at least a day in advance, with photo ID and photos. Limited daily vehicle quota.",
    approxFeeInr: 200,
  },
  {
    id: "pap-silk-route",
    name: "Protected Area Permit: Zuluk / Silk Route",
    indianRule: "Needed. Usually issued at Rongli for travellers with a confirmed Zuluk homestay booking, or arranged by the homestay or tour operator.",
    foreignerAllowed: "no",
    foreignerRule: "Not allowed as of this draft. Check the current rule before planning.",
    howToApply: "Ask your Zuluk homestay or a registered operator; they arrange it at the Rongli permit office with your ID and photos.",
  },
  {
    id: "pap-north",
    name: "Protected Area Permit: North Sikkim (Lachung, Lachen, Yumthang)",
    indianRule: "Needed. Arranged through a registered tour operator in Gangtok; most trips are sold as 2N/3D or 3N/4D packages with permits included.",
    foreignerAllowed: "group",
    foreignerRule: "Allowed in a group of two or more through a registered agency, for Lachung, Yumthang and Lachen.",
    howToApply: "Book a North Sikkim trip with a registered Gangtok operator; they apply with your ID copies and photos, usually 1–2 days ahead.",
  },
  {
    id: "pap-zero-point",
    name: "Zero Point (Yumesamdong) access",
    indianRule: "Covered by the North Sikkim permit, but the vehicle usually charges extra and access depends on snow.",
    foreignerAllowed: "no",
    foreignerRule: "Not allowed as of this draft. Foreign nationals usually go only as far as Yumthang.",
    howToApply: "Add it when booking the North Sikkim trip.",
  },
  {
    id: "pap-gurudongmar",
    name: "Gurudongmar Lake and Chopta Valley access",
    indianRule: "Covered by the North Sikkim permit for Indian nationals. You must spend the night before at Lachen.",
    foreignerAllowed: "no",
    foreignerRule: "Not allowed. Foreign nationals cannot visit Gurudongmar Lake or Chopta Valley.",
    howToApply: "Included in a Lachen-route North Sikkim package from a registered Gangtok operator.",
  },
  {
    id: "dzongu",
    name: "Dzongu entry permit",
    indianRule: "Needed. Issued by the district administration at Mangan, often arranged by your Dzongu homestay.",
    foreignerAllowed: "group",
    foreignerRule: "Allowed with a permit, usually in a group and arranged through a registered agency or homestay.",
    howToApply: "Ask your Dzongu homestay; they help apply at the Mangan district office with your ID and photos.",
  },
];

export const PERMIT_SOURCE = SIKKIM_TOURISM;
