import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { LoginForm } from './components/auth/LoginForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { Dashboard } from './components/Dashboard';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { WhatsAppSupport } from './components/support/WhatsAppSupport';
import { supabase } from './lib/supabase';

function AppContent() {
  const { user, workspace, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(false);

  useEffect(() => {
    if (user && workspace) {
      checkOnboardingStatus();
    }
  }, [user, workspace]);

  const checkOnboardingStatus = async () => {
    if (!workspace) return;

    setCheckingOnboarding(true);
    const { data } = await supabase
      .from('onboarding_progress')
      .select('is_completed')
      .eq('workspace_id', workspace.id)
      .eq('step_name', 'whatsapp_connected');

    const whatsappCompleted = data?.[0]?.is_completed || false;
    setNeedsOnboarding(!whatsappCompleted);
    setCheckingOnboarding(false);
  };

  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (user && workspace) {
    if (needsOnboarding) {
      return (
        <OnboardingWizard
          workspaceId={workspace.id}
          onComplete={() => setNeedsOnboarding(false)}
        />
      );
    }
    return <Dashboard />;
  }

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        {isSignUp ? (
          <SignUpForm onToggle={() => setIsSignUp(false)} />
        ) : (
          <LoginForm onToggle={() => setIsSignUp(true)} />
        )}
      </div>
    );
  }

  return (
    <>
      <LandingPage onGetStarted={() => setShowAuth(true)} />
      <WhatsAppSupport />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
