import type { Certification } from "@/types";

export const certificationsData: Certification[] = [
  {
    id: "csc-professional",
    label: "Civil Service Exam — Professional Level",
    issuingBody: "Civil Service Commission (CSC), Philippines",
    status: "in-progress",
    verifyUrl: "https://www.csc.gov.ph",
  },
  {
    id: "tesda-css-nc2",
    label: "Computer Systems Servicing NC II",
    issuingBody: "TESDA",
    status: "in-progress",
    verifyUrl: "https://www.tesda.gov.ph",
  },
  {
    id: "cisco-cybersecurity",
    label: "Intro to Cybersecurity & Networking Basics",
    issuingBody: "Cisco Networking Academy",
    status: "in-progress",
    verifyUrl: "https://www.netacad.com",
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
];
