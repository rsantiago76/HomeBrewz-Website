import homeBanner from '../../assets/homebrewz-homepage.png';

const Home = () => {
    return (
        <div className="w-full min-h-screen bg-[#FDFBF7]">
            <img
                src={homeBanner}
                alt="HomeBrewz Homepage"
                className="w-full h-auto object-cover"
            />
        </div>
    );
};

export default Home;
