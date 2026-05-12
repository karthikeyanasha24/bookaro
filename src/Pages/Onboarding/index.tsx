import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageLayout from '../../components/global/PageLayout';
import OnboardingConfigSentence from '../../components/onboarding/OnboardingConfigSentence';
import OnboardingActionGrid from '../../components/onboarding/OnboardingActionGrid';
import OnboardingProgressSidebar from '../../components/onboarding/OnboardingProgressSidebar';
import { useOnboarding } from '../../components/onboarding/onboarding.hook';
import { Objective, Profile } from '../../components/onboarding/onboarding.types';
import './style.scss';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const firstName = user?.firstName || user?.fullName?.split(' ')[0] || '';
  const {
    state,
    actions,
    progress,
    availableObjectives,
    setProfile,
    setObjective,
  } = useOnboarding();

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <PageLayout>
      <div className="onboarding-page">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[22px] font-semibold text-[#47525E]">
            {firstName ? `${firstName}, réalisez` : 'Réalisez'} ces quelques actions pour bien lancer votre projet immobilier.
          </h1>
          <p className="text-[14px] text-gray-500 mt-1">
            Suivez ces quelques étapes pour comprendre comment AnyHomes vous aide à concrétiser votre projet immobilier.
          </p>
          <div className="onboarding-illustration mt-4 flex justify-center">
            <img src="/assets/img/Onborading.jpg" alt="Onboarding illustration" className="w-full max-w-[880px] rounded-md shadow-sm" />
          </div>
        </div>

        {/* Config selector — une seule ligne */}
        <OnboardingConfigSentence
          profile={state.profile as Profile}
          objective={state.objective as Objective}
          onProfileChange={setProfile}
          onObjectiveChange={setObjective}
        />

        {/* Main content + sidebar */}
        <div className="flex gap-6 items-start">
          {/* Action grid */}
          <div className="flex-1 min-w-0">
            <OnboardingActionGrid
              actions={actions}
              completions={state.completions}
            />

            {/* Continue to dashboard */}
            {progress >= 50 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleContinue}
                  className="px-8 py-3 bg-[#976DD0] text-white rounded-full font-medium text-[14px] hover:bg-[#7f58b5] transition-colors shadow"
                >
                  Accéder au tableau de bord →
                </button>
              </div>
            )}
          </div>

          {/* Progress sidebar */}
          <div className="w-[280px] flex-shrink-0 hidden lg:block">
            <OnboardingProgressSidebar
              progress={progress}
              actions={actions}
              completions={state.completions}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default OnboardingPage;
