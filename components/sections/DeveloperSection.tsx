"use client";

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
          </div>

          <div className="dev-info reveal">
            <span className="eyebrow">Developer</span>
            <h2>Who I Am</h2>
            <p>Hey, I&rsquo;m Lawrence Cortes</p>
            <p className="subtitle">BS Information Technology · Ormoc City, Leyte, Philippines</p>
            <p>
              I build full-stack apps that actually work &mdash;<br />
              Next.js · TypeScript · Node.js · PostgreSQL
            </p>
            <p>API integrations, debugging, responsive design &mdash; clean code is my love language.</p>
            <p>
              I write software that scales, not just runs.<br />
              I&rsquo;m obsessed with secure, maintainable, and thoughtful solutions.
            </p>
            <p>Looking for an internship where I can join a product team, solve real problems, and ship code I&rsquo;m proud of.</p>
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
