import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonText,
  IonAlert,
  IonLoading,
  IonToggle
} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';

const EnableEmailOtp: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [otpStatus, setOtpStatus] = useState<boolean>(false);
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user?.email || !user?.id) {
          setMessage("You must be logged in to manage OTP.");
          setShowAlert(true);
          return;
        }

        setEmail(user.email);

        const { data: otpSettings, error: otpError } = await supabase
          .from('user_otp_settings')
          .select('otp_status')
          .eq('email', user.email)
          .single();

        if (otpSettings) {
          setOtpStatus(otpSettings.otp_status);
        } else {
          // If not present, insert a new record with default status
          const { error: insertError } = await supabase
            .from('user_otp_settings')
            .insert({
              id: user.id,
              email: user.email,
              otp_status: false
            });

          if (insertError) throw insertError;
          setOtpStatus(false);
        }
      } catch (err) {
        setMessage("Error fetching or initializing OTP settings.");
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const toggleOtpStatus = async () => {
    if (!email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_otp_settings')
        .update({ otp_status: !otpStatus })
        .eq('email', email);

      if (error) throw error;

      setOtpStatus(!otpStatus);
      setMessage(`2FA via Email OTP is now ${!otpStatus ? "enabled" : "disabled"}.`);
    } catch (err) {
      setMessage("Failed to update OTP status.");
    } finally {
      setIsLoading(false);
      setShowAlert(true);
    }
  };

  return (
    <IonContent className="ion-padding">
      <IonText>
        <h2>Enable 2FA OTP?</h2>
      </IonText>

      {email && (
        <div style={{ marginTop: "1.5rem" }}>
          <IonToggle
            checked={otpStatus}
            onIonChange={toggleOtpStatus}
            disabled={isLoading}
          />
          <span style={{ marginLeft: "0.5rem" }}>
            Status: {otpStatus ? "Enabled" : "Disabled"}
          </span>
        </div>
      )}

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        message={message}
        buttons={["OK"]}
      />

      <IonLoading isOpen={isLoading} message="Processing..." />
    </IonContent>
  );
};

export default EnableEmailOtp;
