import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel
} from '@ionic/react';

const people = [
  {
    name: 'John Doe',
    description: 'Tech Enthusiast & Coder',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    name: 'Jane Smith',
    description: 'UI/UX Designer & Developer',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    name: 'Michael Johnson',
    description: 'Full Stack Developer',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    name: 'Emily Davis',
    description: 'AI Researcher & Data Scientist',
    avatar: 'https://i.pravatar.cc/150?img=4'
  },
  {
    name: 'David Martinez',
    description: 'Cybersecurity Specialist',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    name: 'Sarah Wilson',
    description: 'Game Developer & Designer',
    avatar: 'https://i.pravatar.cc/150?img=6'
  },
  {
    name: 'Chris Brown',
    description: 'Cloud Engineer & DevOps',
    avatar: 'https://i.pravatar.cc/150?img=7'
  },
  {
    name: 'Jessica Taylor',
    description: 'Software Engineer & Mentor',
    avatar: 'https://i.pravatar.cc/150?img=8'
  },
  {
    name: 'Daniel Anderson',
    description: 'Blockchain Developer',
    avatar: 'https://i.pravatar.cc/150?img=9'
  },
  {
    name: 'Laura Thompson',
    description: 'Mobile App Developer',
    avatar: 'https://i.pravatar.cc/150?img=10'
  },
  {
    name: 'Kevin White',
    description: 'Machine Learning Engineer',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    name: 'Rachel Green',
    description: 'Digital Marketer',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    name: 'Tom Harris',
    description: 'Frontend Developer',
    avatar: 'https://i.pravatar.cc/150?img=13'
  },
  {
    name: 'Samantha Lee',
    description: 'Backend Developer',
    avatar: 'https://i.pravatar.cc/150?img=14'
  },
  {
    name: 'William Scott',
    description: 'Cybersecurity Analyst',
    avatar: 'https://i.pravatar.cc/150?img=15'
  },
  {
    name: 'Olivia Turner',
    description: 'Product Manager',
    avatar: 'https://i.pravatar.cc/150?img=16'
  },
  {
    name: 'Ethan Walker',
    description: 'AI Engineer',
    avatar: 'https://i.pravatar.cc/150?img=17'
  },
  {
    name: 'Sophia Carter',
    description: 'UX Researcher',
    avatar: 'https://i.pravatar.cc/150?img=18'
  },
  {
    name: 'James Adams',
    description: 'Data Engineer',
    avatar: 'https://i.pravatar.cc/150?img=19'
  }
];

const Favorites: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Favorites</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {people.map((person, index) => (
            <IonItem key={index}>
              <IonAvatar slot="start">
                <img src={person.avatar} alt={person.name} />
              </IonAvatar>
              <IonLabel>
                <h2>{person.name}</h2>
                <p>{person.description}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Favorites;
