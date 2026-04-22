import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faEye, faHeart, faUsers, faTrophy, faLightbulb } from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8" style={{ position: 'relative' }}>
      <section>
        <div className="max-w-7xl mx-auto my-20" style={{ position: 'relative', zIndex: 99 }}>
          <div className="text-center">
            <div className="p-8 md:p-12 rounded-xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight mb-6">
                About Play2LearnLearning
              </h1>
              <p className="text-lg justify-self-center my-5 text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
                We are on a mission to transform education into an engaging and interactive experience that makes learning fun and effective for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 mb-20 sm:px-8 py-20" style={{ position: 'relative', zIndex: 100 }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Our Mission & Vision</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Building the future of education through innovation and engagement.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition">
              <FontAwesomeIcon icon={faBullseye} className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To make quality education accessible and enjoyable for learners worldwide through interactive quizzes, gamification, and personalized learning experiences.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
              <FontAwesomeIcon icon={faEye} className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              A world where every student loves to learn, where education is not a chore but an exciting journey of discovery and growth.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 " style={{ position: 'relative', zIndex: 100 }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Core Values</h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-3">The principles that guide everything we do.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition">
                <FontAwesomeIcon icon={faHeart} className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Passion for Learning</h3>
              <p className="text-gray-600 text-sm">We believe in the transformative power of education and its ability to change lives.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community First</h3>
              <p className="text-gray-600 text-sm">We build inclusive learning environments where everyone feels welcome and supported.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition">
                <FontAwesomeIcon icon={faTrophy} className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-gray-600 text-sm">We strive to achieve the highest quality in everything we create and deliver to our learners.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
                <FontAwesomeIcon icon={faLightbulb} className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">We constantly explore new ways to make learning more engaging and effective.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ position: 'relative', zIndex: 100 }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Impact</h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-3">Numbers that speak to our commitment.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">1M+</div>
              <p className="text-gray-600">Active Learners</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <p className="text-gray-600">Quiz Topics</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <p className="text-gray-600">Countries</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">4.8★</div>
              <p className="text-gray-600">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 " style={{ position: 'relative', zIndex: 100 }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-3">The journey that brought us here.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
            <p className="text-gray-500 max-w-xl mx-auto mt-3">I created this project at the end of the year because I needed a website like this.</p>
            <p className="text-gray-500 max-w-xl mx-auto mt-3">It started as an idea, then became lines of code and hard work.</p>
            <p className="text-gray-500 max-w-xl mx-auto mt-3">Every part of it was built to solve a problem I faced myself.</p>
            <p className="text-gray-500 max-w-xl mx-auto mt-3">Now it is finished. This project is proof that I could make something useful.</p>
            <p className="text-gray-500 max-w-xl mx-auto mt-3">That is why it matters to me.</p>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ position: 'relative', zIndex: 100 }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Team</h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-3">The passionate people behind Play2LearnLearning.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-700">L</span>
              </div>
              <h3 className="font-bold">L7aj</h3>
              <p className="text-gray-600 text-sm">CEO & Founder</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-700">T</span>
              </div>
              <h3 className="font-bold">Tiyeb</h3>
              <p className="text-gray-600 text-sm">Educational Director</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-700">S</span>
              </div>
              <h3 className="font-bold">Super</h3>
              <p className="text-gray-600 text-sm">CTO</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-700">M</span>
              </div>
              <h3 className="font-bold">Mhiyeb</h3>
              <p className="text-gray-600 text-sm">UX Lead</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;

