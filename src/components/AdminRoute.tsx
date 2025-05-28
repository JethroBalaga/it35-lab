import { useEffect, useState } from 'react';
import { Route, Redirect} from 'react-router-dom';
import { IonRouterOutlet} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { IonLoading } from '@ionic/react';
import AdminDashboard from './AdminDashboard';
const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(user?.user_metadata?.is_admin || false);
    };
    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <IonLoading isOpen={true} />; // Show loading while checking
  }

  return isAdmin ? <AdminDashboard /> :
    <IonRouterOutlet id="main">
        <Route exact path="/it35-lab/adminroute/admindashboard" component={AdminDashboard} />
                    <Route exact path="/it35-lab/adminroute">
                        <Redirect to="/it35-lab/adminroute/admindashboard"/>
                    </Route>
                </IonRouterOutlet>
};


export default AdminRoute;