import { 
  IonButton,
  IonContent, 
  IonHeader, 
  IonInput,
  IonItem,
  IonLabel,
  IonPage, 
  IonTitle, 
  IonToolbar, 
  useIonRouter,
  IonAlert,
  IonLoading  
} from '@ionic/react';
import { useState } from 'react';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);  
  const [showLoading, setShowLoading] = useState(false);  

  const doLogin = () => {
    console.log("Username:", username);
    console.log("Password:", password);
    
    setShowLoading(true);
    
    setTimeout(() => {
      setShowLoading(false);
      setShowAlert(true);
      navigation.push('/it35-lab/app', 'forward', 'replace');
    }, 3000); 
  };

  const navigateToRegister = () => {
    navigation.push('/register'); // Navigate to the Register page
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Username</IonLabel>
          <IonInput 
            value={username} 
            onIonChange={(e) => setUsername(e.detail.value!)} 
            placeholder="Enter username" 
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput 
            type="password"
            value={password} 
            onIonChange={(e) => setPassword(e.detail.value!)} 
            placeholder="Enter password" 
          />
        </IonItem>

        <IonButton onClick={doLogin} expand="full">
          Login
        </IonButton>

        {/* Button to navigate to Register page */}
        <IonButton onClick={navigateToRegister} expand="full" color="secondary">
          Don't have an account? Sign Up
        </IonButton>

        {/* Loading spinner while logging in */}
        <IonLoading
          isOpen={showLoading}
          message="Logging in..."
          duration={0}  // Keep loading spinner visible until manually hidden
        />

        {/* Alert on successful login */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Login Successful"
          message="You have successfully logged in!"
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
