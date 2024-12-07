import { useAuth } from './contexts/AuthContext';
import { Feed } from './components/Feed';
import { Navbar } from './components/Navbar';
import { SignIn } from './components/auth/SignIn';

function App() {
  const { user } = useAuth();

  if (!user) {
    return <SignIn />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8">
        <Feed />
      </main>
    </div>
  );
}

export default App;