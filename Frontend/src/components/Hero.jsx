const Hero = () => {
    return (
      <section className="flex-grow bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 text-center flex items-center justify-center">
        <div className="max-w-3xl mx-auto py-20">
          <h1 className="text-5xl font-bold mb-4">Your Smart AI Chat Assistant</h1>
          <p className="text-lg mb-8">
            Ask questions, get answers, and explore the web — all in one chat.
          </p>
          <a
            href="/auth"
            className="inline-block bg-white text-indigo-600 font-semibold py-3 px-6 rounded-full shadow hover:bg-gray-100 transition duration-300"
          >
            Get Started
          </a>
        </div>
      </section>
    );
  };
  
  export default Hero;