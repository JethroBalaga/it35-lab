import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
  IonIcon,
  IonModal,
  IonItem,
  IonInput,
  IonLabel,
  useIonRouter
} from '@ionic/react';
import { clipboardOutline } from 'ionicons/icons';

const OtpPage: React.FC = () => {
  const navigation = useIonRouter();
  const history = useHistory();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');

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

  const handleVerification = async () => {
    try {
      // Verify the code with Supabase or your backend
      const { data, error } = await supabase
        .from('user_otp_settings')
        .select('*')
        .eq('otp_code', verificationCode)
        .single();

      if (error || !data) {
        throw error || new Error('Invalid verification code');
      }

      // If verification is successful
      setShowVerificationModal(false);
      navigation.push('/it35-lab/app', 'forward', 'replace');
    } catch (err) {
      setVerificationError('Invalid verification code');
      // If verification fails, go back to it35-lab
      setTimeout(() => {
        history.push('/it35-lab');
      }, 1500);
    }
  };

  const handleCancelVerification = () => {
    setVerificationCode(''); // Clear the input
    setVerificationError(''); // Clear any errors
    setShowVerificationModal(false);
    history.push('/it35-lab');
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
            onClick={() => setShowVerificationModal(true)}
            expand="block" 
            fill="clear"
            className="ion-margin-top"
          >
            Back to Verification
          </IonButton>
        </div>

        {/* Verification Modal */}
        <IonModal 
          isOpen={showVerificationModal}
          onDidDismiss={handleCancelVerification}
        >
          <IonContent className="ion-padding">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Enter Verification Code</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonItem>
                  <IonLabel position="stacked">6-digit Code</IonLabel>
                  <IonInput
                    type="number"
                    value={verificationCode}
                    onIonChange={(e) => setVerificationCode(e.detail.value!)}
                    maxlength={6}
                  />
                </IonItem>
                
                {verificationError && (
                  <p style={{ color: 'red' }}>{verificationError}</p>
                )}

                <IonButton 
                  expand="block" 
                  onClick={handleVerification}
                  className="ion-margin-top"
                >
                  Verify
                </IonButton>

                <IonButton 
                  expand="block" 
                  fill="clear" 
                  onClick={handleCancelVerification}
                >
                  Cancel
                </IonButton>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonModal>

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