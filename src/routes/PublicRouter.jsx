import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/layout/Hero'
import AboutUs from '../pages/public/AboutUs'
import Services from '../pages/public/Services'
import Contact from '../pages/public/Contact'
import FAQ from '../pages/public/FAQ'
import Pricing from '../pages/public/Pricing'
import Library from '../pages/public/Library'
import JoinQuiz from '../pages/public/JoinQuiz'
import CreateQuiz from '../pages/public/CreateQuiz'

const PublicRouter = () => {
  return (
    <Routes>
      <Route path="/" element={
        <>
          <Navbar />
          <Hero />
          <Footer />
        </>
      } />
      <Route path="/services" element={
        <>
          <Navbar />
          <Services />
          <Footer />
        </>
      } />
      <Route path="/contact" element={
        <>
          <Navbar />
          <Contact />
          <Footer />
        </>
      } />
      <Route path="/Plans" element={
        <>
          <Navbar />
          <Pricing />
          <Footer />
        </>
      } />
      <Route path="/faq" element={
        <>
          <Navbar />
          <FAQ />
          <Footer />
        </>
      } />
      <Route path="/AboutUs" element={
        <>
          <Navbar />
          <AboutUs />
          <Footer />
        </>
      } />
      <Route path="/library" element={
        <>
          <Navbar />
          <Library />
          <Footer />
        </>
      } />
      <Route path="/join-quiz" element={
        <>
          <Navbar />
          <JoinQuiz />
          <Footer />
        </>
      } />
      <Route path="/create-quiz" element={
        <>
          <Navbar />
          <CreateQuiz />
          <Footer />
        </>
      } />
    </Routes>
  )
}

export default PublicRouter