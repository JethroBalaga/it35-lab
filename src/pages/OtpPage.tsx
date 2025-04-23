import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { 
  IonPage, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonButton,
  IonAlert,
  IonIcon
} from '@ionic/react';
import { clipboardOutline } from 'ionicons/icons';

const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);

  useEffect(() => {
    const fetchOtp = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Please login first');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('user_otp_settings')
        .select('otp_code, otp_expires_at, email')
        .eq('id', user.id)
        .single();

      if (fetchError || !data?.otp_code) {
        setError('No active OTP found');
        return;
      }

      if (new Date(data.otp_expires_at) < new Date()) {
        setError('OTP has expired');
        return;
      }

      setOtp(data.otp_code);
      setEmail(data.email);
      setExpiresAt(new Date(data.otp_expires_at).toLocaleTimeString());
    };

    fetchOtp();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(otp);
    setShowCopiedAlert(true);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="ion-text-center">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Your OTP Code</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {error ? (
                <p style={{ color: 'red' }}>{error}</p>
              ) : otp ? (
                <>
                  <p>For account: {email}</p>
                  <div style={{ 
                    fontSize: '2rem', 
                    letterSpacing: '5px',
                    margin: '20px 0',
                    fontWeight: 'bold'
                  }}>
                    {otp.match(/.{1,3}/g)?.join(' ')}
                  </div>
                  <p>Expires at: {expiresAt}</p>
                  
                  <IonButton 
                    onClick={copyToClipboard}
                    expand="block"
                  >
                    <IonIcon icon={clipboardOutline} slot="start" />
                    Copy OTP
                  </IonButton>
                </>
              ) : (
                <p>Loading OTP...</p>
              )}
            </IonCardContent>
          </IonCard>

          <IonButton 
            routerLink="/it35-lab" 
            expand="block" 
            fill="clear"
            className="ion-margin-top"
          >
            Back to Login
          </IonButton>
        </div>

        <IonAlert
          isOpen={showCopiedAlert}
          onDidDismiss={() => setShowCopiedAlert(false)}
          header="Success"
          message="OTP copied to clipboard!"
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default OtpPage;