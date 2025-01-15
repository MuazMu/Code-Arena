import { db } from './config';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc,
  doc,
  orderBy,
  limit 
} from 'firebase/firestore';

// Practice Questions
export async function getPracticeQuestions() {
  const q = query(collection(db, 'challenges'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Admin Analytics
export async function getAdminAnalytics() {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const challengesSnapshot = await getDocs(collection(db, 'challenges'));
  const submissionsSnapshot = await getDocs(collection(db, 'submissions'));

  return {
    totalUsers: usersSnapshot.size,
    totalChallenges: challengesSnapshot.size,
    totalSubmissions: submissionsSnapshot.size,
    // Add more analytics as needed
  };
}

// Add Challenge
export async function addChallenge(challengeData: any) {
  try {
    const docRef = await addDoc(collection(db, 'challenges'), {
      ...challengeData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
}

// Add Competition
export async function addCompetition(competitionData: any) {
  try {
    const docRef = await addDoc(collection(db, 'competitions'), {
      ...competitionData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
}

// Get User Submissions
export async function getUserSubmissions(userId: string) {
  const q = query(
    collection(db, 'submissions'),
    where('userId', '==', userId),
    orderBy('submittedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}