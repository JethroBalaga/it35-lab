import { 
  IonButtons,
  IonContent, 
  IonHeader, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonSearchbar 
} from '@ionic/react';
import { useState } from 'react';
import SearchComponent from '../../components/SearchComponent';

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  return (
      <IonPage>
          <IonHeader>
              <IonToolbar>
                  <IonButtons slot='start'>
                      <IonMenuButton></IonMenuButton>
                  </IonButtons>
                  <IonTitle>Search</IonTitle>
              </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
           <SearchComponent/>
          </IonContent>
      </IonPage>
  );
};

export default Search;
