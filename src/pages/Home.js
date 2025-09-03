import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DarkModeToggle from '../components/common/DarkModeToggle';

const TEAM = [
  { name: 'Garvit Ranka', role: 'Team Leader', img: '', bio: 'Aspiring Computer Scientist & Cybersecurity Enthusiast passionate about cloud, networks, and digital security.', linkedin: 'https://www.linkedin.com/in/garvit835', github: 'https://www.github.com/garvit835' },
  { name: 'Mahesh Kumawat', role: 'Team Member', img: '', bio: 'B.Tech 4th semester student with skills in web development, Java, Python, and cloud fundamentals, passionate about learning new technologies and problem-solving.', linkedin: 'https://www.linkedin.com/in/mahesh-kumawat-2287922b0/', github: 'https://github.com/mahesh7805' },
  { name: 'Samiksha Singh', role: 'Team Member', img: '', bio: 'Core contributor.', linkedin: '#', github: 'https://github.com/SamikshaSingh241' },
  { name: 'Vivek Vyas', role: 'Team Member', img: '', bio: 'Passionate Computer Science Student with a keen interest in WebDevelopment,Blockchain And Problem Solving', linkedin: 'https://www.linkedin.com/in/vivek-vyas-8777752b0/', github: 'https://github.com/vivek1735' },
  { name: 'Krutik Chamta', role: 'Team Member', img: '', bio: 'Core contributor.', linkedin: '#', github: 'https://github.com/Krutik0806' },
  { name: 'Anvesha Sinha', role: 'Team Member', img: '', bio: 'Hi, I’m Anvesha Sinha, currently pursuing B.Tech CSE (Microsoft) at Parul University , and I’m interested in Java, C language, Python, and coding.', linkedin: '#', github: 'https://github.com/anvesha01901-prog' }
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isDark, setIsDark] = useState(typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  useEffect(() => {
    // preload hide
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hidden');

    // load AOS and VanillaTilt (CDN) if not present
    const addCss = () => {
      if (!document.getElementById('aos-css')) {
        const link = document.createElement('link');
        link.id = 'aos-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
        document.head.appendChild(link);
      }
    };
    const addScript = (id, src, onload) => {
      if (document.getElementById(id)) { if (onload) onload(); return; }
      const s = document.createElement('script');
      s.id = id; s.src = src; s.async = true; s.onload = onload; document.body.appendChild(s);
    };

    addCss();
    addScript('aos-js', 'https://unpkg.com/aos@2.3.1/dist/aos.js', () => { if (window.AOS) window.AOS.init({ once: true, duration: 800 }); });
    addScript('vanilla-tilt', 'https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.0/vanilla-tilt.min.js', () => {
      if (window.VanillaTilt) window.VanillaTilt.init(document.querySelectorAll('.team-card'), { max: 20, speed: 400, glare: true, 'max-glare': 0.3 });
    });

    // delegated click handlers are handled via React onClick below
    const esc = (ev) => { if (ev.key === 'Escape') { setModalOpen(false); document.body.classList.remove('modal-open'); } };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, []);

  // Keep track of current theme (detect class changes on <html>) so we can set inline styles
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    const mo = new MutationObserver(() => update());
    if (document && document.documentElement) {
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      // initial sync
      update();
    }
    return () => mo.disconnect();
  }, []);

  const openProfile = (t) => { setSelected(t); setModalOpen(true); document.body.classList.add('modal-open'); };
  const closeModal = () => { setModalOpen(false); document.body.classList.remove('modal-open'); };

  return (
  <div className="min-h-screen">
  <style>{`
        /* Home page palette and UI helpers (from provided HTML) */
        .preloader { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #f8fafc; display: flex; justify-content: center; align-items: center; z-index: 9999; transition: opacity 0.5s ease, visibility 0.5s ease; }
        .dark .preloader { background-color: #111827; }
        .spinner { border: 4px solid rgba(0, 0, 0, 0.1); width: 36px; height: 36px; border-radius: 50%; border-left-color: #a855f7; animation: spin 1s ease infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .preloader.hidden { opacity: 0; visibility: hidden; }
        .animated-gradient { background: linear-gradient(90deg, #a855f7, #22d3ee, #a855f7); background-size: 200% 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradient-animation 4s ease infinite; }
        @keyframes gradient-animation { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .hamburger { cursor: pointer; width: 24px; height: 24px; transition: all 0.25s; position: relative; }
        .hamburger-top, .hamburger-middle, .hamburger-bottom { position: absolute; width: 24px; height: 2px; top: 0; left: 0; background: #a855f7; transform: rotate(0); transition: all 0.5s; }
        .hamburger-middle { transform: translateY(7px); }
        .hamburger-bottom { transform: translateY(14px); }
        .open .hamburger-top { transform: rotate(45deg) translateY(6px) translateX(6px); }
        .open .hamburger-middle { display: none; }
        .open .hamburger-bottom { transform: rotate(-45deg) translateY(6px) translateX(-6px); }
        .modal-overlay { opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; }
        .modal-content { transform: scale(0.9); opacity: 0; transition: transform 0.3s ease, opacity 0.3s ease; }
        body.modal-open .modal-overlay { opacity: 1; visibility: visible; }
        body.modal-open .modal-content { transform: scale(1); opacity: 1; }
        .team-card { transform-style: preserve-3d; transform: perspective(1000px); transition: transform 0.1s ease; position: relative; }
        .team-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 0.75rem; border: 2px solid transparent; background: linear-gradient(45deg, #a855f7, #22d3ee) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask-composite: exclude; opacity: 0; transition: opacity 0.3s ease-in-out; }
  .team-card:hover::before { opacity: 1; }
  /* Ensure hero paragraph readable in light and dark modes */
  .home-hero p { color: #111827; }
  .dark .home-hero p { color: #d1d5db; }
  /* Force CTA / important buttons to keep white text in dark mode */
  .home-btn { color: #fff !important; }
  .dark .home-btn { color: #fff !important; }
  /* Team card name visibility overrides */
    /* let the element choose color (we set via classes) */
    .team-card h4 { color: inherit; }
  .dark .team-card h4 { color: inherit; }
  .team-card p.role { color: #7c3aed; }
  .dark .team-card p.role { color: #a78bfa !important; }
  /* subtle animated background for Home */
  .home-animated-bg { background-color: transparent; }
  .home-animated-bg::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 10% 20%, rgba(168,85,247,0.06), transparent 8%), radial-gradient(circle at 80% 80%, rgba(34,211,238,0.04), transparent 10%); z-index: 0; pointer-events: none; }
  /* feature section floating blobs */
  .feature-blob { position: absolute; border-radius: 9999px; filter: blur(40px); opacity: 0.35; animation: blob-move 8s infinite ease-in-out; pointer-events: none; }
  .feature-blob.b1 { width: 320px; height: 200px; background: rgba(168,85,247,0.06); top: -40px; left: -80px; }
  .feature-blob.b2 { width: 260px; height: 160px; background: rgba(34,211,238,0.04); bottom: -50px; right: -60px; animation-delay: 2s; }
  @keyframes blob-move { 0% { transform: translateY(0) scale(1); } 50% { transform: translateY(12px) scale(1.03); } 100% { transform: translateY(0) scale(1); } }
  /* ensure text/controls sit above blobs */
  #features .max-w-7xl, #features .section-title, #features h4, #features p { position: relative; z-index: 10; }
      `}</style>
  <div id="preloader" className="preloader"><div className="spinner" /></div>

  <header id="navbar" className="bg-white dark:bg-gray-900 backdrop-blur-lg shadow-md fixed w-full top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-600">🎓 Smart Student Hub</Link>
          <nav className="hidden md:flex space-x-6 items-center">
            <a href="#features" className="text-gray-800 hover:text-purple-500 dark:text-gray-200 dark:hover:text-purple-400 font-medium transition">Features</a>
            <a href="#benefits" className="text-gray-800 hover:text-purple-500 dark:text-gray-200 dark:hover:text-purple-400 font-medium transition">Benefits</a>
            <a href="#solution" className="text-gray-800 hover:text-purple-500 dark:text-gray-200 dark:hover:text-purple-400 font-medium transition">Our Solution</a>
            <Link to="/login" className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-full font-semibold shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">Login / Sign Up</Link>
            <div className="ml-2"><DarkModeToggle /></div>
          </nav>
          <div className="md:hidden flex items-center">
            <div className="mr-2"><DarkModeToggle /></div>
          </div>
        </div>
      </header>

  <main className="pt-12 home-animated-bg relative">
  <section className="bg-purple-50 dark:bg-purple-900/20 pt-8 pb-16">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
            <div data-aos="fade-right" data-aos-duration="1000" className="home-hero">
              <h2 className="text-4xl md:text-5xl font-bold section-title leading-tight">Your Entire Academic Journey, <span className="animated-gradient">Verified & Centralised.</span></h2>
              <p className="mt-4 text-lg">From academics to extracurriculars, Smart Student Hub consolidates every achievement into a verified digital profile. Empower students for placements and simplify institutional reporting for NAAC, NIRF, and more.</p>
              <div className="mt-8 flex space-x-4"><Link to="/login" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">Get Started</Link></div>
            </div>
            <div className="flex justify-center" data-aos="fade-left" data-aos-duration="1000"><img src="https://img.freepik.com/free-vector/data-points-concept-illustration_114360-2374.jpg" alt="Centralized Data Illustration" className="w-full md:w-4/5 rounded-xl"/></div>
          </div>
        </section>

  <section id="features" className="py-20 bg-gradient-to-r from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
          <div className="feature-blob b1" />
          <div className="feature-blob b2" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center" data-aos="fade-up"><h3 className={`text-4xl font-bold section-title ${isDark ? 'text-white' : 'animated-gradient'}`}>A Unified Platform for Total Growth</h3><p className="text-gray-700 dark:text-gray-400 mt-2">Built to address every challenge in student record management.</p></div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
              <img src="https://cdn-icons-png.flaticon.com/512/8157/8157715.png" alt="Activity Tracker" className="h-16 mx-auto mb-4"/>
              <h4 className={`text-xl font-semibold ${isDark ? 'text-white' : 'animated-gradient'}`}>
                Activity & Achievement Tracker
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Students can easily upload certificates and records for workshops, internships, club activities, and more.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
              <img src="https://cdn-icons-png.flaticon.com/512/9490/9490150.png" alt="Faculty Approval" className="h-16 mx-auto mb-4"/>
              <h4 className={`text-xl font-semibold ${isDark ? 'text-white' : 'animated-gradient'}`}>
                Faculty Approval Panel
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Designated faculty can verify and approve student submissions, ensuring the credibility of every record.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
              <img src="https://cdn-icons-png.flaticon.com/512/3898/3898054.png" alt="Digital Portfolio" className="h-16 mx-auto mb-4"/>
              <h4 className={`text-xl font-semibold ${isDark ? 'text-white' : 'animated-gradient'}`}>
                Auto-Generated Digital Portfolio
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Generate a comprehensive, verified student portfolio as a PDF or shareable link for placements and higher studies.</p>
            </div>
            </div>
          </div>
        </section>

        <section id="team" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center" data-aos="fade-up">
            <h3 className="text-4xl font-bold section-title">Meet the Team</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">The minds behind FightForByte. Click on a card to learn more.</p>
          </div>
          <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {TEAM.map((t, i) => (
              <button
                key={i}
                onClick={() => openProfile(t)}
                className="team-card bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center cursor-pointer"
                data-tilt
                data-tilt-glare
                data-tilt-max-glare="0.3"
                data-aos="fade-up"
                data-aos-delay={100 + i * 100}
              >
                {t.img ? (
                  <img className="h-24 w-24 rounded-full mx-auto" src={t.img} alt={t.name}/>
                ) : (
                  <div className="h-24 w-24 rounded-full mx-auto bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    {t.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                  </div>
                )}
                <h4 className={"mt-4 text-xl font-semibold " + (isDark ? 'text-white' : 'animated-gradient')}>{t.name}</h4>
                <p className="role text-purple-600 dark:text-purple-400">{t.role}</p>
              </button>
            ))}
          </div>
        </section>

        <section id="solution" className="bg-purple-600 text-white py-20">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h3 className="text-4xl font-bold section-title" data-aos="zoom-in">Bridge the Gap in Student Record Management 🚀</h3>
            <p className="mt-4 text-lg text-purple-100" data-aos="zoom-in" data-aos-delay="100">Empower your students and modernize your institution. Let's build a future-ready campus together.</p>
              <Link to="/login" className="mt-8 inline-block bg-cyan-500 hover:bg-cyan-600 home-btn px-8 py-3 rounded-full font-semibold shadow-md transform transition-transform duration-300 hover:scale-110" data-aos="zoom-in" data-aos-delay="200">Get Started Now</Link>
          </div>
        </section>
      </main>

  {/* Footer removed here to avoid duplicate — global footer is rendered in App.js */}

      {/* Team modal */}
      {modalOpen && selected && (
        <div id="team-modal-overlay" className="modal-overlay fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div id="team-modal-content" className="modal-content relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg text-center p-8">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200" onClick={closeModal}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            <img className="h-32 w-32 rounded-full mx-auto -mt-20 border-4 border-white dark:border-gray-800" src={selected.img} alt={selected.name}/>
            <h3 className="mt-4 text-3xl font-bold" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>{selected.name}</h3>
            <p className="mt-1 text-xl text-purple-600 dark:text-purple-400">{selected.role}</p>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{selected.bio}</p>
            <div className="mt-6 flex justify-center space-x-4">
              <a href={selected.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-cyan-400">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0H12v2.3h.1c.6-1.1 2.1-2.3 4.3-2.3 4.6 0 5.5 3 5.5 6.9V24H17v-7.4c0-1.8 0-4.1-2.5-4.1-2.5 0-2.9 2-2.9 4v7.5H7.5V8z"/></svg>
              </a>
              <a href={selected.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-gray-400 hover:text-cyan-400">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.28 3.438 9.754 8.205 11.327.6.11.82-.26.82-.577v-2.234C6.688 20.7 6 19.578 6 19.578c-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.48 5.921.43.372.823 1.102.823 2.222v3.293c0 .32.192.694.801.576C20.564 22.25 24 17.782 24 12.5 24 5.87 18.63.5 12 .5z"/></svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
