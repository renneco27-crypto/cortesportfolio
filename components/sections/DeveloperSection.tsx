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
            <p className="greeting">Hey, I&rsquo;m Lawrence Cortes</p>
            <p className="subtitle">BS Information Technology · Ormoc City, Leyte, Philippines</p>
            <p>
              I build full-stack applications that solve real problems &mdash; from polished frontends with React
              and Next.js to robust backends powered by Node.js and PostgreSQL. Clean architecture, maintainable
              code, and user experience that actually feels good to use.
            </p>
            <p>
              My background in a government accounting office taught me something most dev schools don&rsquo;t:
              how to work with precision, process, and patience &mdash; because when every number matters, you
              double-check everything. I bring that same discipline to every project I touch.
            </p>
            <p>
              Right now, I&rsquo;m looking for an internship where I can join a real product team, contribute
              meaningfully, and keep growing. I thrive on thoughtful feedback, messy problems, and the kind of
              work that makes you better just by showing up.
            </p>
            <p>
              Want to talk tech, exchange ideas, or just see if we vibe?<br />
              Reach out on Facebook:{" "}
              <a href="https://www.facebook.com/Rennejay.Dev.21" target="_blank" rel="noopener noreferrer" className="dev-email-link">
                facebook.com/Rennejay.Dev.21
              </a>
              &nbsp;&mdash; I&rsquo;d love to hear from you.
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
