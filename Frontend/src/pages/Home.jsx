import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Navbar from '../components/NavBar'; 

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default Home;