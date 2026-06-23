export default function Footer() {
  return (
    <footer className="site-footer" style={{ backgroundColor: '#130237', color: '#fff', padding: '20px 0' }}>
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} LuxeStay. All rights reserved and Created By Omprakash &hearts;</p>
        <p>Trusted hotel booking across resorts, city stays, and beach escapes.</p>
      </div>
    </footer>
  )
}
