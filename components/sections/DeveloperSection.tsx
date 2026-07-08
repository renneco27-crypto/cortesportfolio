"use client";

import GitHubGraph from "@/components/ui/GitHubGraph";

const TECH_STACK = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js",
  "Node.js", "Express", "PostgreSQL", "MongoDB", "Git", "Docker",
  "REST APIs", "Java", "Spring Boot", "Hibernate/JPA", "Maven/Gradle",
  "Python", "Go", "Rust", "Azure", "Google Cloud", "BigQuery",
  "Kubernetes", "Power BI",
];

export default function DeveloperSection() {
  return (
    <section className="section dev-section" id="developer">
      <div className="container">
        <div className="dev-grid">
          <div className="dev-photo-wrap reveal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/lawrence-face.jpg"
              alt="Lawrence Cortes"
              width={320}
              height={320}
              className="dev-photo"
            />
            <GitHubGraph username="renneco27-crypto" />
          </div>

          <div className="dev-info reveal">
            <span className="eyebrow">Developer</span>
            <h2>Who I Am</h2>
            <p className="greeting">Hey, I&rsquo;m Lawrence Cortes</p>
            <p className="subtitle">BS Information Technology · Ormoc City, Leyte, Philippines</p>
            <p>
              I build full-stack apps with Next.js, Node.js, and PostgreSQL &mdash; nothing fancy, just code
              that actually runs. An accounting office once told me that&rsquo;s what matters, and I&rsquo;ve
              carried that with me ever since.
            </p>
            <p>
              I&rsquo;m obsessed with secure, maintainable, and thoughtful solutions.<br />
              Looking for an internship where I can join a product team, solve real problems, and ship code
              I&rsquo;m proud of.
            </p>
            <p>
              Wanna talk shop? Geek out over a stack? Or just say hi?<br />
              Hit me up on Facebook:{" "}
              <a href="https://www.facebook.com/Rennejay.Dev.21" target="_blank" rel="noopener noreferrer" className="dev-email-link">
                facebook.com/Rennejay.Dev.21
              </a>
              <br />
              Let&rsquo;s chat one-on-one.
            </p>

            <div className="tag-row" style={{ marginTop: "1.5rem" }}>
              {TECH_STACK.map((tech) => (
                <span key={tech} className="tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
