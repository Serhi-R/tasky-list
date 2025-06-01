import Footer from '../../src/components/Footer/Footer';
import Header from '../../src/components/Header/Header';

export default function Home() {
    return (
        <>
            <Header />
            <main>
        <h1 className="text-center text-2xl font-bold my-8 text-purple-700">Welcome to Tasky</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto px-4">
          Your task management solution for increased productivity and organization.
        </p>
      </main>            
            
        </>
    );
}
