import { books, chapters, copy, courses, education, experience, family, guidedProjects, hobbies, navItems, nptelCourses, profile, profilePhoto, publications, resumeFocusAreas, resumeTools } from "./content.js";

const page = document.body.dataset.page || "home";
const details = copy[page] || copy.home;
const root = document.querySelector("#site-root");
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);
const gmailComposeUrl = (subject = "", body = "") => {
  const parameters = new URLSearchParams({ view: "cm", fs: "1", to: profile.email });
  if (subject) parameters.set("su", subject);
  if (body) parameters.set("body", body);
  return `https://mail.google.com/mail/?${parameters.toString()}`;
};
const link = (file, text, className = "") => `<a class="${className}" href="${file}">${text}</a>`;
const pill = (text) => `<span class="pill">${escapeHtml(text)}</span>`;

function header() {
  const links = navItems.map((item) => `
    <a class="nav-link${item.id === page ? " is-current" : ""}" href="${item.file}"${item.id === page ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a>
  `).join("");
  return `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <a class="brand" href="index.html" aria-label="${escapeHtml(profile.name)} — Home">
        <span class="brand-monogram" aria-hidden="true">S<span>.</span></span>
        <span class="brand-copy"><strong>${escapeHtml(profile.name)}</strong><small>IDEAS · PEOPLE · PROGRESS</small></span>
      </a>
      <button class="menu-toggle" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open navigation"><span></span><span></span></button>
      <nav class="primary-nav" id="primary-navigation" aria-label="Main navigation">${links}</nav>
      <a class="resume-action" href="resume.html" aria-label="View ${escapeHtml(profile.name)}’s short and detailed resumes" title="View resume">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 4.75h9l4.25 4.3v10.2a1.75 1.75 0 0 1-1.75 1.75h-10A1.75 1.75 0 0 1 4.75 19V6.5A1.75 1.75 0 0 1 6.5 4.75Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 5v4h4M8 12h6m-6 3h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Resume</span>
      </a>
    </header>`;
}

function footer() {
  return `
    <footer class="site-footer">
      <a class="footer-name" href="index.html">${escapeHtml(profile.name)}<span>.</span></a>
      <div class="footer-bottom"><span>© <span id="current-year">${new Date().getFullYear()}</span> ${escapeHtml(profile.name)}</span><a href="#top">Back to top ↑</a></div>
    </footer>`;
}

function pageArrows() {
  const index = navItems.findIndex((item) => item.id === page);
  if (index < 0) return "";
  const previous = navItems[index - 1];
  const next = navItems[index + 1];
  const arrow = (item, direction) => {
    const isPrevious = direction === "previous";
    const icon = isPrevious
      ? '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m14.5 5-7 7 7 7m-6.5-7h12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m9.5 5 7 7-7 7m6.5-7H4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const label = `${isPrevious ? "Previous" : "Next"} page${item ? `: ${item.label}` : ""}`;
    return item
      ? `<a class="page-arrow page-arrow-${direction}" href="${escapeHtml(item.file)}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">${icon}<span class="page-arrow-tooltip" aria-hidden="true">${escapeHtml(item.label)}</span></a>`
      : `<span class="page-arrow page-arrow-${direction} is-disabled" aria-disabled="true" aria-label="${escapeHtml(isPrevious ? "First portfolio page" : "Last portfolio page")}" title="${escapeHtml(isPrevious ? "First portfolio page" : "Last portfolio page")}">${icon}</span>`;
  };
  return `<nav class="page-arrows" aria-label="Previous and next portfolio pages">${arrow(previous, "previous")}${arrow(next, "next")}</nav>`;
}

function visitorBadge() {
  return `<aside class="visitor-badge" id="visitor-badge" aria-label="Website visitor counter" title="One count per browsing session; moving between pages does not add another visit." hidden>
    <span class="visitor-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M2.5 12s3.2-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.2 6.5-9.5 6.5S2.5 12 2.5 12Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/><path d="m18.5 4 .8 1.7L21 6.5l-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7Z" fill="currentColor"/></svg><span></span></span>
    <span class="visitor-copy"><span class="visitor-label">SITE VISITORS</span><strong id="visitor-count" aria-live="polite">—</strong></span>
  </aside>`;
}

function photo() {
  return `
    <div class="portrait-wrap">
      <div class="portrait-frame has-photo">
        <img src="${escapeHtml(profilePhoto)}" alt="Portrait of Sujithra Yesurathinam" draggable="false">
      </div>
    </div>`;
}

function hero() {
  return `
    <section class="hero page-width" id="top">
      <div class="hero-copy">
        <p class="eyebrow"><span class="eyebrow-mark"></span>${escapeHtml(details.eyebrow)}</p>
        <h1><span class="hero-name">Sujithra<br class="desktop-break"> Yesurathinam<span class="hero-dot">.</span></span></h1>
        <p class="hero-motto">${escapeHtml(details.title)}</p>
        <div class="hero-rule"></div>
        <p class="hero-focus">BUSINESS OPERATIONS <span>·</span> PERFORMANCE INSIGHT <span>·</span> CREATIVE COMMUNICATION</p>
        <p class="hero-intro">${escapeHtml(details.intro)}</p>
        <div class="hero-actions">${link("about.html", "Discover my story", "button button-primary")} ${link("contact.html", "Get in touch", "button button-quiet")} <a class="button button-google" href="https://www.google.com/search?q=Sujithra+Yesurathinam+portfolio" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" stroke-width="1.7"/><path d="m16 16 4.4 4.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>Find me on Google<span class="visually-hidden"> (opens in a new tab)</span></a></div>
        <span class="hero-coordinate"><span class="location-mark" aria-hidden="true"></span> ${escapeHtml(profile.location.toUpperCase().replace(", INDIA", ""))} <span>·</span> INDIA</span>
      </div>
      ${photo()}
      <span class="hero-index" aria-hidden="true">AN INTRODUCTION</span>
    </section>`;
}

function currentFocus() {
  const focus = details.currentFocus;
  if (!focus) return "";
  return `<div class="page-width page-content page-content-home">
    ${section(focus.title, `<p class="section-lead">${escapeHtml(focus.intro)}</p>${cards(focus.items, "card-grid card-grid-3 home-focus-cards")}<a class="home-focus-link" href="career.html">Explore Strategy &amp; Operations <span aria-hidden="true">→</span></a>`, focus.eyebrow, "home-focus-section")}
  </div>`;
}

function pageHeading() {
  return `
    <div class="inner-hero inner-hero-${escapeHtml(page)} page-width" id="top">
      <p class="eyebrow"><span class="eyebrow-mark"></span>${escapeHtml(details.eyebrow)}</p>
      <h1>${escapeHtml(details.title)}<span class="hero-dot">.</span></h1>
      <p class="inner-intro">${escapeHtml(details.intro)}</p>
      <span class="inner-index">${String(navItems.findIndex((item) => item.id === page) + 1).padStart(2, "0")} <span>/</span> ${String(navItems.length).padStart(2, "0")}</span>
    </div>`;
}

function cards(items, className = "card-grid") {
  return `<div class="${className}">${items.map((item) => `
    <article class="info-card">
      ${item.eyebrow ? `<span class="card-eyebrow">${escapeHtml(item.eyebrow)}</span>` : ""}
      <h3>${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.title)} <span aria-hidden="true">↗</span></a>` : escapeHtml(item.title)}</h3>
      ${item.detail ? `<p>${escapeHtml(item.detail)}</p>` : ""}
      ${item.meta ? `<div class="card-meta">${item.meta}</div>` : ""}
    </article>`).join("")}</div>`;
}

function list(items, extraClass = "") {
  return `<ul class="editorial-list ${extraClass}">${items.map((item) => `<li><span class="list-marker" aria-hidden="true">✳</span><span>${escapeHtml(item)}</span></li>`).join("")}</ul>`;
}

function section(title, body, eyebrow = "", id = "") {
  return `<section class="content-section${id ? " " + id : ""}"${id === "learning" ? ' id="learning"' : ""}>
    <div class="section-heading">${eyebrow ? `<p class="section-eyebrow">${escapeHtml(eyebrow)}</p>` : ""}<h2>${escapeHtml(title)}</h2></div>
    <div class="section-body">${body}</div>
  </section>`;
}

function timeline(entries) {
  return `<div class="timeline">${entries.map((entry) => `
    <article class="timeline-item"><span class="timeline-marker" aria-hidden="true"></span>
      <div class="timeline-meta"><span>${escapeHtml(entry.date)}</span>${entry.tags ? `<span class="timeline-tag">${escapeHtml(entry.tags)}</span>` : ""}</div>
      <h3>${escapeHtml(entry.title)}</h3><p class="timeline-place">${escapeHtml(entry.place)}</p>
      ${entry.description ? `<p>${escapeHtml(entry.description)}</p>` : ""}
    </article>`).join("")}</div>`;
}

function about() {
  const paragraphs = details.paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join("");
  const familyCards = family.map((member, index) => `<article class="family-card">
      <span class="family-card-number">${String(index + 1).padStart(2, "0")}</span>
      <p class="card-eyebrow">${escapeHtml(member.relationship)}</p>
      <div class="family-name-row"><h3>${escapeHtml(member.name)}</h3>${member.symbol ? `<img class="family-symbol" src="${escapeHtml(member.symbol)}" alt="" aria-hidden="true">` : ""}</div>
      <p class="family-role">${escapeHtml(member.role)}</p>
      ${member.organization ? `<p class="family-organization">${member.logo && member.url ? `<a class="family-logo-link" href="${escapeHtml(member.url)}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${escapeHtml(member.organization)} website"><img class="family-logo" src="${escapeHtml(member.logo)}" alt=""><span>${escapeHtml(member.organization)} <span aria-hidden="true">↗</span></span></a>` : member.url ? `<a href="${escapeHtml(member.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(member.organization)} <span aria-hidden="true">↗</span></a>` : escapeHtml(member.organization)}</p>` : ""}
    </article>`).join("");
  return `<div class="page-width page-content page-content-about">
    ${section("A little about my journey", `<div class="story-copy">${paragraphs}</div>`, "MY STORY")}
    ${section("The people who keep me grounded", `<p class="section-lead family-lead">My family brings together different callings and perspectives—a steady source of encouragement behind my own journey.</p><div class="family-grid">${familyCards}</div>`, "ROOTED IN FAMILY")}
    ${section("The disciplines that shape my work", `<div class="perspective-path">
      <article class="perspective-step"><span class="perspective-step-number">01</span><span class="perspective-step-line"></span><p class="card-eyebrow">SCIENTIFIC FOUNDATION</p><h3>Biotechnology</h3><p>B.Sc. and M.Sc. studies, supported by medical laboratory training and hands-on work across laboratory disciplines.</p></article>
      <article class="perspective-step"><span class="perspective-step-number">02</span><span class="perspective-step-line"></span><p class="card-eyebrow">KNOWLEDGE IN ACTION</p><h3>Education &amp; research</h3><p>Teacher education, university teaching, student project guidance, and a continuing record of research and publication.</p></article>
      <article class="perspective-step"><span class="perspective-step-number">03</span><span class="perspective-step-line"></span><p class="card-eyebrow">A WIDER LENS</p><h3>Analytics &amp; operations</h3><p>Data analytics training and Founder’s Office experience bring structure, business context, and execution into the picture.</p></article>
    </div>`, "A CAREER BUILT IN CHAPTERS")}
    ${section("Away from the work", `<p class="section-lead">A few things I enjoy in my own time.</p><ol class="hobby-list">${hobbies.map((hobby, index) => `<li><span class="hobby-number">${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(hobby)}</h3><span class="hobby-mark" aria-hidden="true">↗</span></li>`).join("")}</ol>`, "A PERSONAL NOTE")}
  </div>`;
}

function career() {
  return `<div class="page-width page-content page-content-career">
    ${section("Connecting intent to execution", `<div class="story-copy">
      <p>At EV91 Technologies, I work in the Founder’s Office, where leadership priorities meet day-to-day execution. My role brings together business operations, performance management, and cross-functional coordination to support organisational alignment and informed decisions.</p>
      <p>My work includes leadership reporting, business performance tracking, cross-functional coordination, management reviews, and execution monitoring. By working closely with teams, I help translate priorities into actionable plans, keep progress visible, and bring attention to critical deliverables.</p>
      <p>With a structured approach to MIS and business analysis, I contribute to problem-solving, process improvement, operational governance, cost optimisation, and clearer communication with stakeholders. I also create visual materials—from investor pitch decks to LinkedIn posters and other company creative—bringing important ideas to people with greater clarity and care.</p>
      <p>At a company building scalable, technology-enabled EV logistics and workforce infrastructure, my focus is on strengthening execution, accountability, and operational visibility.</p>
    </div>
    <figure class="career-company-feature">
      <figcaption class="career-company-caption">
        <span class="career-company-label">THE ORGANISATION BEHIND MY WORK</span>
        <a class="career-company-brand" href="https://ev91riderz.com/" target="_blank" rel="noreferrer" aria-label="Explore EV91 Riderz online">
          <img class="career-company-logo" src="assets/images/ev91-logo.png" alt="EV91 Technologies" draggable="false">
          <span>EV91 Technologies <span aria-hidden="true">↗</span></span>
        </a>
        <span class="career-company-description">Building scalable, technology-enabled EV logistics and workforce infrastructure.</span>
        <span class="career-company-links-label">EXPLORE EV91</span>
        <nav class="career-company-links" aria-label="EV91 Technologies links">
          <a href="https://ev91riderz.com/" target="_blank" rel="noreferrer">Company website <span aria-hidden="true">↗</span></a>
          <a href="https://www.linkedin.com/company/95705278/" target="_blank" rel="noreferrer">EV91 on LinkedIn <span aria-hidden="true">↗</span></a>
          <a href="https://play.google.com/store/apps/details?id=com.ev91riderapp&amp;hl=en_IN" target="_blank" rel="noreferrer">Riderz delivery partner app <span aria-hidden="true">↗</span></a>
        </nav>
      </figcaption>
    </figure>`, "MY CURRENT ROLE · JUNE 2025–PRESENT")}
    ${section("From leadership intent to visible progress", `<figure class="execution-map" aria-label="Diagram showing how leadership priorities move through planning, coordinated delivery, and performance review">
      <div class="execution-map-heading"><span>THE EXECUTION CYCLE</span><span>FOUNDER’S OFFICE · EV91 TECHNOLOGIES</span></div>
      <div class="execution-flow">
        <article class="execution-node"><span class="execution-node-index">01</span><h3>Set direction</h3><p>Leadership priorities &amp; business goals</p></article>
        <span class="execution-connector" aria-hidden="true">→</span>
        <article class="execution-node"><span class="execution-node-index">02</span><h3>Align the work</h3><p>Plans, owners &amp; cross-team coordination</p></article>
        <span class="execution-connector" aria-hidden="true">→</span>
        <article class="execution-node"><span class="execution-node-index">03</span><h3>Track delivery</h3><p>MIS, dashboards, reviews &amp; action follow-up</p></article>
        <span class="execution-connector" aria-hidden="true">→</span>
        <article class="execution-node execution-node-outcome"><span class="execution-node-index">04</span><h3>Improve outcomes</h3><p>Insight, accountability &amp; process improvement</p></article>
      </div>
      <div class="execution-communication"><span>THE STORY OUTWARD</span><i aria-hidden="true"></i><p>Investor presentations</p><p>LinkedIn &amp; company creative</p><p>Stakeholder communication</p></div>
      <figcaption>Business operations create the rhythm; considered communication makes the work visible to investors, teams, and the wider market.</figcaption>
    </figure>`, "HOW THE WORK CONNECTS")}
    ${section("Three lenses. One throughline.", `<p class="section-lead working-signature-intro">My work brings analysis, coordination, and communication together to make the next step clearer.</p>
    <ol class="working-signature" aria-label="Three connected practices in Sujithra’s work">
      <li>
        <span class="working-signature-index">01 <span>READ THE SIGNAL</span></span>
        <h3>Make information useful</h3>
        <p>MIS, dashboards, performance tracking, and business analysis help bring focus to what needs attention.</p>
        <p class="working-signature-output">Leadership reporting · Performance views</p>
      </li>
      <li>
        <span class="working-signature-index">02 <span>SET THE RHYTHM</span></span>
        <h3>Keep priorities moving</h3>
        <p>Cross-functional coordination, reviews, and action tracking connect plans with the people carrying them forward.</p>
        <p class="working-signature-output">Management reviews · Follow-through</p>
      </li>
      <li>
        <span class="working-signature-index">03 <span>SHAPE THE STORY</span></span>
        <h3>Give ideas a clear voice</h3>
        <p>Investor pitch decks and company creative translate business priorities into considered communication.</p>
        <p class="working-signature-output">Investor decks · LinkedIn posters</p>
      </li>
    </ol>
    <p class="working-signature-close">Analysis gives the work direction. Coordination gives it momentum. Communication helps others see why it matters.</p>`, "MY WORKING SIGNATURE")}
    ${section("How I measure good execution", `<blockquote class="work-philosophy"><span class="philosophy-mark" aria-hidden="true">“</span><p>Make the priority clear. Align the people responsible. Keep progress visible.</p><cite>SUJITHRA YESURATHINAM · FOUNDER’S OFFICE</cite></blockquote>`, "MY OPERATING PRINCIPLE")}
    ${section("Earlier chapters in my career", `<p class="section-lead">Before my current Founder’s Office position, my work brought together laboratory practice, biotechnology teaching, student mentorship, and academic service.</p>${timeline(experience.slice(1).map((entry) => ({
      date: entry.date,
      title: entry.title,
      place: entry.organization,
      description: entry.summary,
    })))}`, "CAREER & ACADEMIC SERVICE")}
  </div>`;
}

function educationPage() {
  const rows = education.map((entry, index) => `<article class="qualification-entry">
    <span class="qualification-marker" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
    <div class="qualification-date">${escapeHtml(entry.years)}</div>
    <div class="qualification-main"><p class="card-eyebrow">${escapeHtml(entry.kind)}</p><h3>${escapeHtml(entry.degree)}</h3><p>${escapeHtml(entry.institution)}</p></div>
  </article>`).join("");
  const certificates = nptelCourses.map((course, index) => `<article class="certificate-card">
    <div class="certificate-card-heading"><span class="certificate-index">0${index + 1}</span><span class="certificate-score">${course.score}%<small> SCORE</small></span></div>
    <a class="certificate-image-link" href="${escapeHtml(course.certificate)}" target="_blank" rel="noreferrer" aria-label="Open certificate for ${escapeHtml(course.title)}">
      <img src="${escapeHtml(course.certificate)}" alt="NPTEL certificate for ${escapeHtml(course.title)}, score ${course.score} percent" loading="lazy" draggable="false">
      <span class="certificate-view">VIEW CERTIFICATE ↗</span>
    </a>
    <h3>${escapeHtml(course.title)}</h3>
    <p>${escapeHtml(course.duration)} · NPTEL</p>
  </article>`).join("");
  return `<div class="page-width page-content page-content-education">
      ${section("Qualifications", `<div class="qualification-timeline">${rows}</div>`, "A FOUNDATION BUILT OVER TIME")}
    ${section("NPTEL certificates", `<div class="certificate-gallery">${certificates}</div>`, "COURSES COMPLETED · SCORES EARNED")}
    ${section("Additional training", list(courses), "DIGITAL & CREATIVE SKILLS")}
    ${section("A connected toolkit", `<figure class="skills-map" aria-label="Diagram of laboratory, analytics, and digital productivity skills">
      <div class="skills-hub"><span>TOOLS I<br>WORK WITH</span></div>
      <div class="skills-branch skills-branch-lab"><span class="skills-branch-number">01</span><div><h3>Laboratory practice</h3><p>Hematology · Clinical pathology · Immunology · Serology · Microbiology · Histopathology · Biochemistry</p></div></div>
      <div class="skills-branch skills-branch-data"><span class="skills-branch-number">02</span><div><h3>Analytics</h3><p>Advanced Excel · Power BI · Tableau · Basic SQL</p></div></div>
      <div class="skills-branch skills-branch-digital"><span class="skills-branch-number">03</span><div><h3>Digital productivity</h3><p>Microsoft Office · Google Drive · Docs · Sheets · Slides · Forms</p></div></div>
      <figcaption>A cross-disciplinary toolkit spanning scientific practice, data interpretation, and everyday collaboration.</figcaption>
    </figure>`, "PRACTICE ACROSS DISCIPLINES")}
    ${section("A legacy that stays with me", `<div class="legacy-note"><span class="card-eyebrow">K. KAMARAJ · SERVICE THROUGH EDUCATION</span><h3>Widening opportunity through learning</h3><p>K. Kamaraj’s enduring contribution to education in Tamil Nadu is a powerful reminder of how access to learning can shape lives and communities. His example resonates with my own journey through biotechnology and teacher education.</p></div>`, "AN ADMIRATION, NOT A QUOTATION")}
  </div>`;
}

function research() {
  const publicationList = publications.map((item, index) => `<article class="research-entry">
    <span class="research-entry-number">${String(index + 1).padStart(2, "0")}</span>
    <div><h3>${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.title)} <span aria-hidden="true">↗</span></a>` : escapeHtml(item.title)}</h3><p>${escapeHtml(item.detail)}</p></div>
  </article>`).join("");
  const chapterList = chapters.map((item, index) => `<article class="research-entry">
    <span class="research-entry-number">${String(index + 1).padStart(2, "0")}</span>
    <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.detail)}</p></div>
  </article>`).join("");
  const bookList = books.map((item, index) => `<article class="book-entry">
    <span class="book-entry-number">0${index + 1}</span><a class="book-cover-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="View ${escapeHtml(item.title)} on Amazon"><img class="book-cover" src="${escapeHtml(item.cover)}" alt="Cover of ${escapeHtml(item.title)}"></a><div class="book-entry-copy"><p class="card-eyebrow">AUTHORED BOOK</p><h3><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)} <span aria-hidden="true">↗</span></a></h3><p class="book-authors">By ${escapeHtml(item.authors)}</p><p>${escapeHtml(item.detail)}</p></div>
  </article>`).join("");
  return `<div class="page-width page-content page-content-research">
    ${section("Selected journal work", `<div class="research-list">${publicationList}</div>`, "PEER-REVIEWED & PUBLISHED")}
    ${section("Contributed chapters", `<div class="research-list research-chapters">${chapterList}</div>`, "BOOK CHAPTERS")}
    ${section("Books and authorship", `<div class="book-list">${bookList}</div>`, "INDEPENDENTLY AUTHORED")}
    ${section("Current manuscript", `<div class="manuscript-note"><span>IN DEVELOPMENT</span><h3>Nano Thymoquinone (TQ) as High Performance Drug Targeting Vehicle for Liver</h3></div>`, "RESEARCH IN PROGRESS")}
  </div>`;
}

function projects() {
  const supervised = guidedProjects.map((project, index) => `<li class="project-step"><span class="project-step-number">${String(index + 1).padStart(2, "0")}</span><span class="project-step-joint" aria-hidden="true"></span><p>${escapeHtml(project)}</p></li>`).join("");
  return `<div class="page-width page-content page-content-projects">
    ${section("Master’s research project", `<div class="project-focus"><p class="card-eyebrow">M.SC. BIOTECHNOLOGY</p><h3>A study to evaluate the performance of <em>Saccharomyces cerevisiae</em> isolated from beetroot wine in the production of vinegar using beetroot and grapefruit wine.</h3><div class="project-flow" aria-label="Research process"><span>Beetroot wine</span><i aria-hidden="true">→</i><span>Yeast performance</span><i aria-hidden="true">→</i><span>Vinegar production</span></div></div>`, "INDIVIDUAL RESEARCH")}
    ${section("Projects guided", `<p class="section-lead">Individual and group projects for III B.Sc. and II M.Sc. Biotechnology students, during academic year 2022–2023.</p><ol class="project-path">${supervised}</ol>`, "MENTORSHIP · 2022–2023")}
    ${section("Creative communication", `<div class="creative-practice"><article><span>01</span><h3>Visual design</h3><p>Canva · Graphic design</p></article><article><span>02</span><h3>Motion &amp; editing</h3><p>Video Editing Basics · Great Learning</p></article><article><span>03</span><h3>Digital reach</h3><p>Digital Marketing 101 · Simplilearn SkillUp</p></article></div>`, "A CREATIVE DIMENSION")}
  </div>`;
}

function resumePage() {
  const localResumeExport = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const careerItems = experience.map((entry) => `<article class="resume-experience-item">
    <div class="resume-item-heading"><h3>${escapeHtml(entry.title)}</h3><span>${escapeHtml(entry.date)}</span></div>
    <p class="resume-organization">${escapeHtml(entry.organization)}</p>
    <p>${escapeHtml(entry.summary)}</p>
  </article>`).join("");
  const qualifications = education
    .filter((entry) => entry.kind !== "State Board" && !entry.degree.startsWith("DMLT"))
    .map((entry) => `<li><strong>${escapeHtml(entry.degree)}</strong><span>${escapeHtml(entry.institution)} · ${escapeHtml(entry.years)}</span></li>`).join("");
  const detailedQualifications = education
    .map((entry, index) => `<li><span class="resume-list-number">${String(index + 1).padStart(2, "0")}</span><div><strong>${escapeHtml(entry.degree)}</strong><span>${escapeHtml(entry.institution)}</span></div><span class="resume-education-meta">${escapeHtml(entry.years)}</span></li>`).join("");
  const focusAreas = resumeFocusAreas.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const tools = resumeTools.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  const shortWriting = [
    ...publications.slice(0, 2).map((item) => item.title),
    ...books.map((item) => item.title),
  ].map((item, index) => `<li><span class="resume-list-number">${String(index + 1).padStart(2, "0")}</span>${escapeHtml(item)}</li>`).join("");
  const numberedEntries = (items, render) => items.map((item, index) => `<li><span class="resume-list-number">${String(index + 1).padStart(2, "0")}</span><div>${render(item)}</div></li>`).join("");
  const detailedPublications = numberedEntries(publications, (item) => `<strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail)}</span>`);
  const detailedChapters = numberedEntries(chapters, (item) => `<strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail)}</span>`);
  const detailedBooks = numberedEntries(books, (item) => `<strong>${escapeHtml(item.title)}</strong><span class="resume-book-authors">Authors: ${escapeHtml(item.authors)}</span><span>${escapeHtml(item.detail)}</span><a href="${escapeHtml(item.url)}">${escapeHtml(item.source || "View book")} ↗</a>`);
  const detailedProjects = numberedEntries(guidedProjects, (item) => `<strong>${escapeHtml(item)}</strong>`);
  const detailedNptel = numberedEntries(nptelCourses, (item) => `<strong>${escapeHtml(item.title)}</strong><span>${item.score}% · ${escapeHtml(item.duration)}</span>`);
  const allCourses = [...nptelCourses.map((item) => `${item.title} · ${item.score}% · NPTEL`), ...courses];

  return `<div class="resume-page" id="top">
    <div class="resume-toolbar page-width">
      <a href="index.html">← Back to portfolio</a>
      <div class="resume-toolbar-actions">
        <div class="resume-switch" role="group" aria-label="Choose resume format">
          <button class="resume-switch-option is-selected" type="button" data-resume-mode="short" aria-pressed="true">Short <span>01</span></button>
          <button class="resume-switch-option" type="button" data-resume-mode="detailed" aria-pressed="false">Detailed <span>02</span></button>
        </div>
      <button class="resume-download" id="resume-download" type="button" aria-label="Print or save the short resume as PDF"${localResumeExport ? "" : " hidden"}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Save short PDF</span>
      </button>
      </div>
    </div>
    <section class="resume-variant is-active" data-resume-panel="short" aria-label="Short resume">
      <article class="resume-sheet">
        <header class="resume-heading">
          <div><p class="resume-kicker">PROFILE · ${escapeHtml(experience[0].organization.toUpperCase())}</p><h1>${escapeHtml(profile.name)}</h1><p class="resume-position">${escapeHtml(experience[0].title)}</p></div>
          <span class="resume-monogram" aria-hidden="true">SY<span>.</span></span>
          <div class="resume-contact">
            <span>${escapeHtml(profile.location)}</span>
            <a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>
            <a href="${escapeHtml(profile.linkedin)}">${escapeHtml(profile.linkedin.replace("https://www.", "").replace("https://", ""))}</a>
          </div>
        </header>
        <section class="resume-section resume-summary"><h2>Professional profile</h2><p>${escapeHtml(copy.home.intro)}</p></section>
        <section class="resume-section"><h2>Experience</h2><div class="resume-experience">${careerItems}</div></section>
        <div class="resume-two-column">
          <section class="resume-section"><h2>Education &amp; training</h2><ul class="resume-qualifications">${qualifications}</ul></section>
          <section class="resume-section"><h2>Core strengths</h2><ul class="resume-strengths">${focusAreas}</ul><div class="resume-tools">${tools}</div></section>
        </div>
        <section class="resume-section resume-writing"><h2>Selected publications &amp; books</h2><ul>${shortWriting}</ul></section>
        <footer class="resume-footer"><span>${escapeHtml(profile.name)}</span><span>Detailed portfolio: ${window.location.origin}</span></footer>
      </article>
    </section>
    <section class="resume-variant" data-resume-panel="detailed" aria-label="Detailed resume" hidden>
      <article class="resume-sheet resume-sheet-detailed">
        <header class="resume-heading">
          <div><p class="resume-kicker">DETAILED CAREER PROFILE · ${escapeHtml(experience[0].organization.toUpperCase())}</p><h1>${escapeHtml(profile.name)}</h1><p class="resume-position">${escapeHtml(experience[0].title)}</p></div>
          <span class="resume-monogram" aria-hidden="true">SY<span>.</span></span>
          <div class="resume-contact">
            <span>${escapeHtml(profile.location)}</span>
            <a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>
            <a href="${escapeHtml(profile.linkedin)}">${escapeHtml(profile.linkedin.replace("https://www.", "").replace("https://", ""))}</a>
          </div>
        </header>
        <section class="resume-section resume-summary"><h2>Professional profile</h2><p>${escapeHtml(copy.home.intro)}</p></section>
        <section class="resume-section"><h2>Professional experience</h2><div class="resume-experience">${careerItems}</div></section>
        <section class="resume-section"><h2>Academic qualifications</h2><ol class="resume-numbered-list resume-education-list">${detailedQualifications}</ol></section>
        <div class="resume-two-column">
          <section class="resume-section"><h2>Core strengths</h2><ol class="resume-numbered-list">${numberedEntries(resumeFocusAreas, (item) => `<strong>${escapeHtml(item)}</strong>`)}</ol></section>
          <section class="resume-section"><h2>Digital &amp; professional tools</h2><div class="resume-tools">${tools}</div><h3 class="resume-subheading">Additional learning</h3><ol class="resume-numbered-list">${numberedEntries(allCourses, (item) => `<strong>${escapeHtml(item)}</strong>`)}</ol></section>
        </div>
        <section class="resume-section"><h2>NPTEL certificates</h2><ol class="resume-numbered-list resume-compact-list">${detailedNptel}</ol></section>
        <section class="resume-section"><h2>Selected projects guided</h2><ol class="resume-numbered-list resume-project-list">${detailedProjects}</ol></section>
        <section class="resume-section"><h2>Journal publications</h2><ol class="resume-numbered-list resume-bibliography">${detailedPublications}</ol></section>
        <section class="resume-section"><h2>Book chapters</h2><ol class="resume-numbered-list resume-bibliography">${detailedChapters}</ol></section>
        <section class="resume-section"><h2>Authored books</h2><ol class="resume-numbered-list resume-bibliography">${detailedBooks}</ol></section>
        <section class="resume-section"><h2>Research in development</h2><p class="resume-detail-copy">Nano Thymoquinone (TQ) as High Performance Drug Targeting Vehicle for Liver.</p></section>
        <footer class="resume-footer"><span>${escapeHtml(profile.name)}</span><span>Detailed portfolio: ${window.location.origin}</span></footer>
      </article>
    </section>
    <p class="resume-print-note">${localResumeExport ? "Choose a profile, then use Save PDF to create a copy. The detailed profile includes your full academic, research, and project record." : "Both resume formats are available to view. PDF export is available from your private local portfolio copy."}</p>
  </div>`;
}

function contact() {
  return `<div class="contact-page" id="top">
    <div class="page-width contact-layout">
      <section class="contact-introduction" aria-labelledby="contact-heading">
        <p class="contact-eyebrow"><span></span> A DIRECT LINE</p>
        <h1 id="contact-heading">Let’s make<br>the next conversation <em>count.</em></h1>
        <p class="contact-description">I welcome professional and academic enquiries across business operations, performance, investor communication, and creative collaboration.</p>
        <div class="contact-details" aria-label="Contact details">
          <a class="contact-detail" href="${escapeHtml(gmailComposeUrl())}" aria-label="Compose an email to ${escapeHtml(profile.email)} in Gmail">
            <span class="contact-detail-icon" aria-hidden="true">@</span>
            <span><span class="contact-label">EMAIL</span><strong>${escapeHtml(profile.email)}</strong></span>
            <span class="contact-external" aria-hidden="true">↗</span>
          </a>
          <a class="contact-detail" href="${escapeHtml(profile.linkedin)}" target="_blank" rel="noreferrer">
            <span class="contact-detail-icon contact-linkedin-icon" aria-hidden="true">in</span>
            <span><span class="contact-label">LINKEDIN</span><strong>View my LinkedIn profile</strong></span>
            <span class="contact-external" aria-hidden="true">↗</span>
          </a>
        </div>
        <p class="contact-location"><span aria-hidden="true">—</span> ${escapeHtml(profile.location)}</p>
      </section>
      <section class="message-panel" aria-labelledby="message-heading">
        <div class="message-panel-heading">
          <div><p class="section-eyebrow">START A CONVERSATION</p><h2 id="message-heading">Send a message</h2></div>
          <span class="message-panel-index" aria-hidden="true">01 / 02</span>
        </div>
        <p class="message-intro">Tell me what you have in mind. I’ll get back to you as soon as I can.</p>
        <form class="message-form" id="contact-form">
          <label class="form-field"><span>Your name</span><input name="name" autocomplete="name" placeholder="Name" required maxlength="100"></label>
          <label class="form-field"><span>Your email</span><input name="email" type="email" autocomplete="email" placeholder="Email address" required maxlength="254"></label>
          <label class="form-field"><span>Your message</span><textarea name="message" rows="5" placeholder="A few details about your enquiry..." required maxlength="5000"></textarea></label>
          <button class="send-message" type="submit">Compose email <span aria-hidden="true">↗</span></button>
          <p class="form-note">Gmail will open with your message addressed to Sujithra. Sign in if prompted, then review and send it.</p>
          <p class="form-status" id="form-status" role="status" aria-live="polite"></p>
        </form>
      </section>
    </div>
  </div>`;
}

const pageRenderers = {
  about, career, education: educationPage, research, projects, contact, resume: resumePage,
};

function spotlight() {
  if (page === "resume") return "";
  const feature = details.spotlight;
  if (!feature) return "";
  const attribution = feature.sourceUrl
    ? `<a href="${escapeHtml(feature.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(feature.attribution)} <span aria-hidden="true">↗</span></a>`
    : escapeHtml(feature.attribution);
  return `<section class="spotlight spotlight-${escapeHtml(page)}" aria-label="${escapeHtml(feature.label)}">
    <div class="spotlight-inner">
      <div class="spotlight-index"><span>NOTE</span><span class="spotlight-index-rule"></span></div>
      <div class="spotlight-content">
        <p class="spotlight-eyebrow">${escapeHtml(feature.label)}</p>
        <blockquote><span class="spotlight-quotation" aria-hidden="true">“</span><p>${escapeHtml(feature.quote)}</p></blockquote>
        <p class="spotlight-attribution">— ${attribution}</p>
      </div>
      <span class="spotlight-mark" aria-hidden="true">${escapeHtml(page === "education" ? "LEARN" : page === "research" ? "THINK" : page === "career" ? "ACT" : "GROW")}</span>
    </div>
  </section>`;
}

function initNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");
  if (!toggle || !navigation) return;
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
    }
  });
}

function initSwipeNavigation() {
  const currentIndex = navItems.findIndex((item) => item.id === page);
  if (currentIndex < 0) return;

  let touchStart = null;
  const ignoreSwipeTarget = (target) => target instanceof Element
    && Boolean(target.closest("a, button, input, textarea, select, [contenteditable='true']"));

  document.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1 || ignoreSwipeTarget(event.target)) {
      touchStart = null;
      return;
    }
    const touch = event.touches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });

  document.addEventListener("touchend", (event) => {
    if (!touchStart || event.changedTouches.length !== 1) {
      touchStart = null;
      return;
    }
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(deltaX) < 70 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;

    const destinationIndex = currentIndex + (deltaX < 0 ? 1 : -1);
    const destination = navItems[destinationIndex];
    if (destination) window.location.href = destination.file;
  }, { passive: true });
  document.addEventListener("touchcancel", () => { touchStart = null; }, { passive: true });
}

function initContactForm() {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  if (!form || !status) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    if (!name || !email || !message) return;
    const subject = `Portfolio enquiry from ${name}`;
    const body = `Hello Sujithra,\n\n${message}\n\nBest regards,\n${name}\n${email}`;
    status.textContent = "Opening Gmail with your message addressed to Sujithra. Sign in if prompted, then review and send it.";
    window.location.href = gmailComposeUrl(subject, body);
  });
}

function initResumeDownload() {
  const button = document.querySelector("#resume-download");
  if (!button) return;
  if (button.hidden) return;

  const options = document.querySelectorAll("[data-resume-mode]");
  const panels = document.querySelectorAll("[data-resume-panel]");
  const setMode = (mode) => {
    panels.forEach((panel) => {
      const isActive = panel.dataset.resumePanel === mode;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });
    options.forEach((option) => {
      const isActive = option.dataset.resumeMode === mode;
      option.classList.toggle("is-selected", isActive);
      option.setAttribute("aria-pressed", String(isActive));
    });
    const label = mode === "detailed" ? "detailed" : "short";
    button.querySelector("span").textContent = `Save ${label} PDF`;
    button.setAttribute("aria-label", `Print or save the ${label} resume as PDF`);
    document.title = `${profile.name} | ${mode === "detailed" ? "Detailed" : "Short"} Resume`;
  };

  options.forEach((option) => option.addEventListener("click", () => setMode(option.dataset.resumeMode)));
  button.addEventListener("click", () => window.print());
}

function initImageProtection() {
  document.addEventListener("contextmenu", (event) => {
    if (event.target instanceof Element && event.target.closest("img")) event.preventDefault();
  });
  document.addEventListener("dragstart", (event) => {
    if (event.target instanceof Element && event.target.closest("img")) event.preventDefault();
  });
}

function initVisitorCounter() {
  const badge = document.querySelector("#visitor-badge");
  const output = document.querySelector("#visitor-count");
  if (!badge || !output) return;
  const visitSessionKey = "portfolio-visit-counted-v2";

  const footer = document.querySelector(".site-footer");
  if (footer) {
    const updateFooterOverlap = () => {
      const bounds = footer.getBoundingClientRect();
      badge.classList.toggle("is-footer-visible", bounds.top < window.innerHeight && bounds.bottom > 0);
    };
    window.addEventListener("scroll", updateFooterOverlap, { passive: true });
    window.addEventListener("resize", updateFooterOverlap);
    updateFooterOverlap();
  }

  const animateCount = (count) => {
    badge.hidden = false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      output.textContent = count.toLocaleString("en-IN");
      return;
    }
    const duration = 1000;
    const start = performance.now();
    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      output.textContent = Math.round(count * eased).toLocaleString("en-IN");
      if (progress < 1) window.requestAnimationFrame(frame);
    };
    window.requestAnimationFrame(frame);
  };

  let isNewBrowsingSession = true;
  try {
    isNewBrowsingSession = sessionStorage.getItem(visitSessionKey) !== "true";
    if (isNewBrowsingSession) sessionStorage.setItem(visitSessionKey, "true");
  } catch (error) {
    console.error("Could not determine whether this browsing session was already counted:", error);
  }

  fetch("/api/visits", {
    method: isNewBrowsingSession ? "POST" : "GET",
    ...(isNewBrowsingSession ? {
      headers: { "Content-Type": "application/json" },
      body: "{}",
    } : {}),
    cache: "no-store",
  }).then(async (response) => {
    if (!response.ok) throw new Error(`Visitor counter returned HTTP ${response.status}.`);
    const data = await response.json();
    if (!Number.isSafeInteger(data.visits) || data.visits < 0) {
      throw new Error("Visitor counter returned an invalid total.");
    }
    animateCount(data.visits);
  }).catch((error) => {
    console.error("Could not load the website visit count:", error);
    if (isNewBrowsingSession) {
      try {
        sessionStorage.removeItem(visitSessionKey);
      } catch (storageError) {
        console.error("Could not reset the visitor counter session marker:", storageError);
      }
    }
    badge.hidden = false;
    badge.classList.add("visitor-badge-unavailable");
    badge.title = "The site visitor counter is unavailable. Check the server or Redis configuration.";
    output.textContent = "—";
    output.setAttribute("aria-label", "Visit count unavailable");
  });
}

function initMotion() {
  const targets = document.querySelectorAll(".content-section, .content-section:not(.home-focus-section) .info-card, .timeline-item, .qualification-entry, .certificate-card, .spotlight, .contact-introduction, .message-panel, .resume-toolbar, .story-copy p, .editorial-list li, .working-signature li, .working-signature-close, .career-company-feature, .execution-map, .skills-map, .legacy-note, .work-philosophy, .resume-heading, .resume-section, .resume-footer");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }
  document.body.classList.add("has-motion");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -36px 0px" });
  targets.forEach((target) => observer.observe(target));
}

function initReadingThread() {
  let frameRequested = false;
  const updateProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    document.documentElement.style.setProperty("--reading-progress", String(Math.min(1, Math.max(0, progress))));
    frameRequested = false;
  };
  const scheduleUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateProgress);
  };
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  updateProgress();
}

root.innerHTML = `<span class="reading-thread" aria-hidden="true"></span>${header()}
  <main id="main-content" tabindex="-1">
    ${page === "home" ? `${hero()}${currentFocus()}` : page === "resume" ? resumePage() : page === "contact" ? contact() : `${pageHeading()}${(pageRenderers[page] || pageRenderers.about)()}`}
    ${spotlight()}
  </main>
    ${pageArrows()}
    ${visitorBadge()}
    ${footer()}`;
document.title = page === "resume" ? `${profile.name} | Short Resume` : page === "home" ? `${profile.name} | Ideas into Action` : `${details.title} | ${profile.name}`;
initNavigation();
initSwipeNavigation();
initContactForm();
initResumeDownload();
initImageProtection();
initVisitorCounter();
initMotion();
initReadingThread();
