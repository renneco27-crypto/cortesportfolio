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
            <p>
              I&rsquo;m Lawrence Cortes, a BS Information Technology student based in Ormoc City, Leyte,
              Philippines. I pair full-stack development &mdash; React, Next.js, Node.js, REST APIs &mdash; with
              the documentation discipline I built supporting a government accounting office: precise, organized,
              and built to hold up under process.
            </p>
            <p style={{ marginTop: "1rem" }}>
              Currently pursuing internship opportunities where I can apply full-stack development, cloud
              fundamentals, and steady, detail-first execution to a real product team.
            </p>
            <p style={{ marginTop: "1rem" }}>
              If you&rsquo;d like to talk shop, ask about an internship, or just say hi,
              email me directly at{" "}
              <a href="mailto:renneco27@gmail.com" className="dev-email-link">
                renneco27@gmail.com
              </a>{" "}
              and let&rsquo;s chat one-on-one.
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
