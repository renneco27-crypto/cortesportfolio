import type { Certification } from "@/types";

export const certificationsData: Certification[] = [
  {
    id: "csc-professional",
    label: "Civil Service Exam — Professional Level",
    issuingBody: "Civil Service Commission (CSC), Philippines",
    status: "planned",
    targetDate: "2025-08-01",
    notes: "Required for PH gov internships. Passing score: 80%. Covers English, Math, General Info, Analogies, Logical Reasoning.",
  },
  {
    id: "tesda-css-nc2",
    label: "Computer Systems Servicing NC II",
    issuingBody: "TESDA",
    status: "in-progress",
    verifyUrl: "https://www.tesda.gov.ph",
    notes: "Hands-on practical assessment — hardware, OS, networking, troubleshooting.",
  },
  {
    id: "pwncollege-badge",
    label: "pwn.college — Program Security Path",
    issuingBody: "pwn.college",
    status: "in-progress",
    verifyUrl: "https://pwn.college",
    badgeImageSrc: "/images/certs/pwncollege.png",
  },
  {
    id: "nextwork-cloud",
    label: "NextWork — Cloud-Native AI Engineering",
    issuingBody: "NextWork",
    status: "planned",
    verifyUrl: "https://nextwork.org",
    badgeImageSrc: "/images/certs/nextwork.png",
  },
  {
    id: "aws-cloud-practitioner",
    label: "AWS Certified Cloud Practitioner",
    issuingBody: "Amazon Web Services",
    status: "planned",
    targetDate: "2025-12-01",
    notes: "Entry-level AWS cert. Strong internship signal for cloud-adjacent roles.",
  },
  {
    id: "google-ads-cert",
    label: "Google Ads — Search Certification",
    issuingBody: "Google Skillshop",
    status: "planned",
    verifyUrl: "https://skillshop.google.com",
    notes: "Free. Reinforces TikTok/funnel marketing skills.",
  },
  {
    id: "meta-social-cert",
    label: "Meta Social Media Marketing Certificate",
    issuingBody: "Meta / Coursera",
    status: "planned",
    notes: "Backs up TikTok funnel expertise with Meta's ecosystem cert.",
  },
];
