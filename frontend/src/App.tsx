import { ArrowRight, Star, Laptop, LockKeyhole, Sparkles } from 'lucide-react'
import { AccordionApp, type AccordionItemData } from '@/components/watermelon/card-split-accordian'
import './App.css'
import './watermelon.css'

const repository = 'https://github.com/faares01/DUALINK'
const questions: AccordionItemData[] = [
  { id: 1, title: 'Choose your folders', icon: <span>⌁</span>, content: 'Connect the exact folders you use. You decide where every linked folder begins and ends.' },
  { id: 2, title: 'Move files with intent', icon: <span>↗</span>, content: 'Send Across queues a file for a precise destination on the other device.' },
  { id: 3, title: 'Stay in control', icon: <span>◌</span>, content: 'Conflicts do not overwrite quietly. Safe Delete and version history give you a way back.' },
]

function App() {
  return <main className="site-shell">
    <nav className="site-nav"><a className="wordmark" href="/">DUALINK<span>.</span></a><div className="nav-actions"><a href="#story">The story</a><a href={repository} target="_blank" rel="noreferrer"><Star /> Star on GitHub</a><a className="open-app" href="/app.html">Open app <ArrowRight /></a></div></nav>
    <section className="opening"><div className="orb orb-one"/><div className="orb orb-two"/><p className="eyebrow"><Sparkles /> A gentler cross-system workspace</p><h1>We present to you<br/><i>DUALINK.</i></h1><p className="lede">The file bridge for people who live between Linux and Windows—without turning either computer into a compromise.</p><div className="actions"><a href="/app.html" className="primary">Start with Google <ArrowRight /></a><a href={repository} target="_blank" rel="noreferrer" className="secondary"><Star /> Give DUALINK a star</a></div><div className="portal"><div className="portal-label linux"><span>⌘</span><b>Linux</b><small>/home/fares/Projects</small></div><div className="thread"><em/><span>made for the in-between</span></div><div className="portal-label windows"><span>⊞</span><b>Windows</b><small>D:\Projects</small></div></div></section>
    <section id="story" className="manifesto"><p>Not a cloud drive.</p><h2>Just the missing connection between the systems you already call home.</h2><div className="manifesto-copy"><p>DUALINK lets you choose the folders that matter, then keeps their place in your day—not in the way.</p><p>When a computer is asleep, transfers wait. When it wakes, your work is ready.</p></div></section>
    <section className="scenes"><article className="scene scene-send"><span className="scene-number">01 / SEND</span><h3>Point.<br/>Place.<br/>Done.</h3><p>Send one file to the exact folder on the other side.</p><div className="file-chip"><span>ZIP</span><b>project.zip</b><ArrowRight /><small>Windows Desktop</small></div></article><article className="scene scene-safe"><span className="scene-number">02 / KEEP</span><h3>Nothing gets<br/>lost quietly.</h3><p>Conflicts ask. Safe Delete waits. Version history remembers.</p><div className="version-stack"><div>report.docx <small>Today, 10:22</small></div><div>report.docx <small>Yesterday</small></div><div>report.docx <small>Sep 29</small></div></div></article><article className="scene scene-private"><span className="scene-number">03 / YOURS</span><h3>Only the folders<br/>you allow.</h3><p>Local permissions are explicit. Server secrets never reach the browser.</p><div className="permission"><LockKeyhole /><div><b>Folder access</b><small>3 approved locations</small></div><span>Active</span></div></article></section>
    <section className="device-callout"><Laptop /><div><p className="eyebrow">DESKTOP COMPANION</p><h2>A website that behaves like it belongs on your desktop.</h2></div><p>The companion adds trusted folder access, system notifications, and Send to DUALINK—without creating a second account or a second database.</p></section>
    <section className="watermelon-section"><div><p className="eyebrow">THE SMALL DETAILS</p><h2>Every action should feel obvious.</h2><p>DUALINK uses motion with purpose: reveal what changed, keep choices close, and stay out of the way.</p></div><AccordionApp items={questions} /></section>
    <section className="final-ask"><p className="eyebrow">MAKE THE BRIDGE REAL</p><h2>Your two systems<br/>can finally agree.</h2><div className="actions"><a href="/app.html" className="primary">Open DUALINK <ArrowRight /></a><a href={repository} target="_blank" rel="noreferrer" className="secondary"><Star /> Star the project</a></div></section>
    <footer><p>Thank you for visiting and using <b>DUALINK</b></p><p>wishing you a wonderfully weird day. Made by <a href="https://faaa.space/?utm_source=chatgpt.com" target="_blank" rel="noreferrer">FAA</a>.</p></footer>
  </main>
}
export default App
