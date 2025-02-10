import { CompanyDetailsFormData, UserAccountFormData } from "../validations/settings";
import { auth, db, storage } from "@/config/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { logger } from "@/utils/logger";

export async function fetchUserAccount(): Promise<UserAccountFormData> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      // Initialize with data from auth and associate with default company
      const initialData: UserAccountFormData & { companyId: string } = {
        fullName: user.displayName || '',
        email: user.email || '',
        picture: user.photoURL || '',
        phoneNumber: '',
        jobTitle: '',
        department: '',
        role: '',
        interests: [],
        companyId: 'default-company' // Associate with default company
      };
      await setDoc(doc(db, 'users', user.uid), initialData);
      return initialData;
    }

    return userDoc.data() as UserAccountFormData;
  } catch (error) {
    logger.error('Error fetching user account:', error);
    throw new Error('Failed to fetch user account data');
  }
}

export async function updateUserAccount(data: UserAccountFormData): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    await updateDoc(doc(db, 'users', user.uid), data);
  } catch (error) {
    logger.error('Error updating user account:', error);
    throw new Error('Failed to update user account data');
  }
}

export async function fetchCompanyDetails(): Promise<CompanyDetailsFormData> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    // Get user's company ID from their profile
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      // If user document doesn't exist, create it with default company
      await setDoc(doc(db, 'users', user.uid), {
        companyId: 'default-company',
        email: user.email,
        fullName: user.displayName
      });
    }
    
    const userData = userDoc.data();
    const companyId = userData?.companyId || 'default-company';

    const companyDoc = await getDoc(doc(db, 'companies', companyId));
    if (!companyDoc.exists()) {
      // Initialize default company if it doesn't exist
      const defaultCompany: CompanyDetailsFormData = {
        companyName: '',
        website: '',
        industry: '',
        companySize: '',
        address: {
          formattedAddress: '',
          street: '',
          suburb: '',
          state: '',
          country: '',
          zipCode: ''
        }
      };
      await setDoc(doc(db, 'companies', companyId), defaultCompany);
      return defaultCompany;
    }

    const data = companyDoc.data();
    
    // Ensure address is in the correct format
    if (!data.address || typeof data.address === 'string') {
      const formattedAddress = data.address || '';
      data.address = {
        formattedAddress,
        street: '',
        suburb: '',
        state: '',
        country: '',
        zipCode: ''
      };
      // Update the document with the new address format
      await updateDoc(doc(db, 'companies', companyId), { address: data.address });
    }

    logger.info('Fetched company details successfully', { 
      companyId,
      hasAddress: !!data.address,
      addressType: typeof data.address 
    });

    return data as CompanyDetailsFormData;
  } catch (error) {
    logger.error('Error fetching company details:', error);
    throw new Error('Failed to fetch company details');
  }
}

export async function updateCompanyDetails(data: CompanyDetailsFormData): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    // Get user's company ID from their profile
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) throw new Error('User profile not found');
    
    const userData = userDoc.data();
    const companyId = userData.companyId || 'default-company';

    // Ensure address data is properly formatted
    const companyData = {
      ...data,
      address: {
        formattedAddress: data.address.formattedAddress,
        street: data.address.street || '',
        suburb: data.address.suburb || '',
        state: data.address.state || '',
        country: data.address.country || '',
        zipCode: data.address.zipCode || '',
        updatedAt: new Date().toISOString()
      }
    };

    await updateDoc(doc(db, 'companies', companyId), companyData);
    logger.info('Company details updated successfully', { companyId });
  } catch (error) {
    logger.error('Error updating company details:', error);
    throw new Error('Failed to update company details');
  }
}

export async function uploadProfilePicture(file: File): Promise<{ url: string }> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, `profile-pictures/${user.uid}/${file.name}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const url = await getDownloadURL(storageRef);
    
    // Update the user's profile picture URL in Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      picture: url
    });

    return { url };
  } catch (error) {
    logger.error('Error uploading profile picture:', error);
    throw new Error('Failed to upload profile picture');
  }
}
