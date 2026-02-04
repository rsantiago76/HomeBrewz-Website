import React from 'react';

const OurStory = () => {
    return (
        <div className="bg-coffee-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm p-8 md:p-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-coffee-900 mb-4">Our Story</h1>
                    <div className="h-1 w-20 bg-brand-green mx-auto rounded-full"></div>
                </div>

                <div className="prose prose-lg prose-coffee mx-auto text-coffee-700 leading-relaxed font-serif">
                    <p className="mb-6">
                        For me, coffee has always been more than just a morning routine—it’s a ritual that grounds us and a language that connects us. <strong>HomeBrewz</strong> was born out of a simple desire: to bridge the gap between the artisanal quality of your favorite local roaster and the comfort of your own kitchen. I wanted to create a space where the craft of coffee meets the ease of modern life, ensuring that every cup you brew is as exceptional as the beans it came from.
                    </p>

                    <p className="mb-8">
                        We believe that great coffee shouldn't be complicated or exclusive. That’s why we’ve poured our hearts into curating the finest ethically sourced beans and building a platform that makes discovering them effortless. By blending time-honored roasting traditions with a seamless digital experience, we’re here to make sure that the best part of your day is just a click away. Thank you for inviting us into your home and making us part of your daily rhythm.
                    </p>

                    <div className="mt-12 pt-8 border-t border-coffee-100">
                        <p className="font-sans text-coffee-900 font-bold text-lg mb-1">Warmly,</p>
                        <div className="font-handwriting text-3xl text-brand-green mb-2" style={{ fontFamily: 'cursive' }}>Richard Santiago</div>
                        <p className="text-coffee-600 text-sm uppercase tracking-wider font-semibold">Founder, HomeBrewz</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurStory;
