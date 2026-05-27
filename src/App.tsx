import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';

function App() {
  const [session, setSession] = useState<any>(null);
  const [authView, setAuthView] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('App: Initializing...');
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        console.log('App: Session retrieved', !!session);
        setSession(session);
        setLoading(false);
      })
      .catch(err => {
        console.error('App: Session error', err);
        setError(err.message);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('App: Auth state changed', _event, !!session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl max-w-md">
          <h2 className="text-red-400 font-bold mb-2">Startup Error</h2>
          <p className="text-slate-400 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-xs text-white bg-slate-800 px-4 py-2 rounded-lg"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth view={authView} onViewChange={setAuthView} />;
  }

  return <Dashboard />;
}

export default App;
