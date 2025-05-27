// src/components/GoogleLoginButton.tsx
import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import { supabase } from '../utils/supabaseClient';
import { useIonRouter } from '@ionic/react';

const GoogleLoginButton = () => {
  const router = useIonRouter();
  const [presentToast] = useIonToast();

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/it35-lab/app'
        }
      });

      if (error) {
        throw error;
      }

      // Show success feedback
      await presentToast({
        message: 'Google login successful!',
        duration: 2000,
        position: 'top',
        color: 'success'
      });

      // Redirect after successful login
      router.push('/it35-lab/app', 'forward', 'replace');

    } catch (error: any) {
      await presentToast({
        message: error.message || 'Google login failed',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      console.error('Google login error:', error);
    }
  };

  return (
    <IonButton 
      expand="block" 
      onClick={handleGoogleLogin}
      fill="outline"
      className="google-login-button"
    >
      <IonIcon 
        slot="start" 
        icon={logoGoogle} 
        className="google-icon"
      />
      Continue with Google
    </IonButton>
  );
};

export default GoogleLoginButton;