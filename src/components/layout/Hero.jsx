import React from 'react';
import jsLogo from '../../assets/js.png';
import phpLogo from '../../assets/php.png';
import pyLogo from '../../assets/Py.png';
import Button from '../ui/Button';
import Card from '../ui/Card';
import SplashCursor from '../SplashCursor';

const Hero = () => {
    return (
        <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" style={{ position: 'relative' }}>
            <SplashCursor
                SIM_RESOLUTION={64}
                DYE_RESOLUTION={512}
                DENSITY_DISSIPATION={2.0}
                VELOCITY_DISSIPATION={0.98}
                PRESSURE={0.8}
                CURL={30}
                SPLAT_RADIUS={0.25}
                SPLAT_FORCE={3000}
                COLOR_UPDATE_SPEED={5}
                SHADING={false}
            />
            {/*Hero Section */}
            <div className="max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 100 }}>
                <div className="text-center mb-16">
                    <div className="p-8 md:p-12 rounded-xl">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blak leading-tight mb-6">
                            Education should be something you experience, not just something you watch.
                        </h1>
                        <a href='./register' className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-full text-lg hover:bg-blue-50 transition duration-300 cursor-pointer shadow-md">
                            Start Now
                        </a>
                    </div>
                </div>

                {/*Quiz Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/*JavaScript Card */}
                    <Card 
                        title="JavaScript"
                        image={jsLogo}
                        imageAlt="JavaScript Logo"
                        difficulty="Easy"
                        buttonText="Start Quiz"
                        onButtonClick={() => console.log("Starting Javascript Quiz")}
                    />

                    {/*PHP Card*/}
                    <Card 
                        title="PHP"
                        image={phpLogo}
                        imageAlt="PHP Logo"
                        difficulty="Easy"
                        buttonText="Start Quiz"
                        onButtonClick={() => console.log("starting PHP quiz")}
                    />

                    {/*Python Card */}
                    <Card 
                        title="Python"
                        image={pyLogo}
                        imageAlt="Python Logo"
                        difficulty="Easy"
                        buttonText="Start Quiz"
                        onButtonClick={() => console.log("starting python quiz")}
                    />
                </div>
            </div>
            <div>
                <a  className="flex justify-self-end font-bold mt-5 transition transform hover:scale-[1.05] shadow-2xl text-blue-600" href="#">More Quizs</a>
            </div>
        </section>
    );
};

export default Hero;