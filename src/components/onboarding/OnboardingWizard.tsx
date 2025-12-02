import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { WhatsAppSetup } from './WhatsAppSetup';
import { MarketplaceSetup } from './MarketplaceSetup';
import { ProfileSetup } from './ProfileSetup';
import { createDemoData, shouldCreateDemoData } from '../../lib/demo-data';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface OnboardingWizardProps {
  workspaceId: string;
  onComplete: () => void;
}

export function OnboardingWizard({ workspaceId, onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOnboardingProgress();
  }, [workspaceId]);

  const loadOnboardingProgress = async () => {
    const { data, error } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at');

    if (!error && data) {
      const mappedSteps: OnboardingStep[] = [
        {
          id: 'profile_created',
          title: 'Profil Oluşturma',
          description: 'İşletme bilgilerinizi tamamlayın',
          completed: data.find(d => d.step_name === 'profile_created')?.is_completed || false,
        },
        {
          id: 'whatsapp_connected',
          title: 'WhatsApp Bağlantısı',
          description: 'WhatsApp Business hesabınızı bağlayın',
          completed: data.find(d => d.step_name === 'whatsapp_connected')?.is_completed || false,
        },
        {
          id: 'marketplace_integrated',
          title: 'Pazaryeri Entegrasyonu',
          description: 'Trendyol, N11 veya Hepsiburada bağlayın',
          completed: data.find(d => d.step_name === 'marketplace_integrated')?.is_completed || false,
        },
      ];

      setSteps(mappedSteps);

      const firstIncomplete = mappedSteps.findIndex(s => !s.completed);
      setCurrentStep(firstIncomplete >= 0 ? firstIncomplete : 0);
    }

    setLoading(false);
  };

  const markStepComplete = async (stepName: string) => {
    await supabase
      .from('onboarding_progress')
      .update({ is_completed: true, completed_at: new Date().toISOString() })
      .eq('workspace_id', workspaceId)
      .eq('step_name', stepName);

    await loadOnboardingProgress();
  };

  const handleNext = async () => {
    const step = steps[currentStep];
    await markStepComplete(step.id);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const allCompleted = steps.every(s => s.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hoş Geldiniz!</h1>
            <p className="text-gray-600 mb-8">
              Hesabınızı kullanmaya başlamak için birkaç adımı tamamlayalım
            </p>

            <div className="flex items-center justify-between mb-12">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition ${
                        step.completed
                          ? 'bg-green-500 border-green-500'
                          : index === currentStep
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="text-white" size={24} />
                      ) : index === currentStep ? (
                        <Circle className="text-white fill-white" size={12} />
                      ) : (
                        <Circle className="text-gray-400" size={12} />
                      )}
                    </div>
                    <p
                      className={`text-sm mt-2 text-center ${
                        index === currentStep ? 'font-semibold text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        step.completed ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {allCompleted ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Kurulum Tamamlandı!</h2>
                <p className="text-gray-600 mb-4">
                  Artık SiparişAsistanım kullanmaya hazırsınız
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 max-w-md mx-auto">
                  <p className="text-sm text-blue-800">
                    <strong>Demo Veriler Eklendi:</strong> Sistemi tanımak için örnek müşteriler, siparişler ve mesaj şablonları hazırladık. İstediğiniz zaman silebilirsiniz.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    const needsDemo = await shouldCreateDemoData(workspaceId);
                    if (needsDemo) {
                      await createDemoData(workspaceId);
                    }
                    onComplete();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition"
                >
                  Panele Git
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {steps[currentStep]?.title}
                  </h2>
                  <p className="text-gray-600">{steps[currentStep]?.description}</p>
                </div>

                <div className="min-h-[400px] mb-8">
                  {currentStep === 0 && (
                    <ProfileSetup workspaceId={workspaceId} onComplete={handleNext} />
                  )}
                  {currentStep === 1 && (
                    <WhatsAppSetup workspaceId={workspaceId} onComplete={handleNext} />
                  )}
                  {currentStep === 2 && (
                    <MarketplaceSetup workspaceId={workspaceId} onComplete={handleNext} />
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handleSkip}
                    className="text-gray-600 hover:text-gray-900 font-semibold transition"
                  >
                    Şimdilik Atla
                  </button>
                  <div className="text-sm text-gray-500">
                    Adım {currentStep + 1} / {steps.length}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
