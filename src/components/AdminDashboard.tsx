// AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, 
  IonContent, IonList, IonItem, IonLabel,
  IonLoading, IonText, IonNote, IonButton,
  IonButtons, IonIcon
} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const AdminDashboard = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('login_attempts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          setError(error.message);
        } else {
          setLogs(data || []);
        }
      } catch (err) {
        setError('Failed to fetch login attempts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      history.push('/it35-lab'); // Redirect to /it35-lab after logout
    } catch (error) {
      setError('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Admin Dashboard</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <IonLoading isOpen={loading} message={loading ? "Loading..." : "Logging out..."} />
        
        {error ? (
          <div className="ion-text-center ion-padding">
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          </div>
        ) : !loading && logs.length === 0 ? (
          <div className="ion-text-center ion-padding">
            <IonText>
              <p>No login attempts recorded</p>
            </IonText>
          </div>
        ) : (
          <IonList>
            {logs.map(log => (
              <IonItem key={log.id}>
                <IonLabel>
                  <h2>{log.email}</h2>
                  <IonNote>
                    {new Date(log.created_at).toLocaleString()}
                  </IonNote>
                  <p style={{ color: log.success ? 'green' : 'red' }}>
                    {log.success ? 'Success' : 'Failed'}
                    {log.error_message && ` - ${log.error_message}`}
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;