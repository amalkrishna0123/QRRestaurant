import React, { useEffect, useState } from 'react';
import { FaUserAltSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UploadFile from './UploadFile';
import { auth, db } from './Firebase';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { ref, get, onValue, remove } from 'firebase/database';
import { getStorage, ref as storageRef, deleteObject, getDownloadURL } from 'firebase/storage'; 
import { MdDelete } from "react-icons/md";
import { IoIosMenu } from "react-icons/io";
import { IoHandLeftSharp } from "react-icons/io5";

const Navbar = ({setOPenAdminPanel, handleOpenAdminPanel}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [randomKey, setRandomKey] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoKey, setLogoKey] = useState('');
  const [shopName, setShopName] = useState(""); // State to store shop name

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            setUser(currentUser);

            // Fetch admin data for the logged-in user
            const adminRef = ref(db, `admins/${currentUser.uid}`);
            get(adminRef).then((snapshot) => {
              if (snapshot.exists()) {
                const adminData = snapshot.val();
                console.log("Admin Data:", adminData); // Log admin data to check values
                setRandomKey(adminData.randomKey);
                setShopName(adminData.shopName); // Set shop name from Firebase
              }
            }).catch((error) => {
              console.error("Error fetching admin data:", error);
            });

            // Fetch logo for the user
            const logoRef = ref(db, `logos/${currentUser.uid}`);
            onValue(logoRef, (snapshot) => {
              if (snapshot.exists()) {
                const logos = snapshot.val();
                const logoKeys = Object.keys(logos);
                if (logoKeys.length > 0) {
                  const freshLogoUrl = logos[logoKeys[0]].url;
                  setLogoKey(logoKeys[0]);
                  setLogoUrl(`${freshLogoUrl}?t=${new Date().getTime()}`); // Cache-busting
                }
              } else {
                setLogoUrl("");
              }
            });
          } else {
            setUser(null);
            navigate("/login");
          }
        });
        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminUid');
    auth.signOut().then(() => navigate('/login')); // Ensure navigation happens after sign out
  };

  const handleDeleteLogo = async () => {
    if (user && logoKey) {
      const storage = getStorage();
      const logoStorageRef = storageRef(storage, `logos/${user.uid}/${logoKey}`);
  
      console.log("Attempting to delete logo from storage at path:", logoStorageRef.fullPath);
  
      try {
        // Check if the logo exists before deleting
        await getDownloadURL(logoStorageRef);
        await deleteObject(logoStorageRef);
        console.log("Logo deleted from storage.");
  
        const logoDbRef = ref(db, `logos/${user.uid}/${logoKey}`);
        await remove(logoDbRef);
        console.log("Logo reference removed from database.");
        setLogoUrl(''); // Clear the logo URL in state
        setLogoKey(''); // Clear the logo key
      } catch (error) {
        console.error("Error deleting logo:", error);
        if (error.code === 'storage/object-not-found') {
          console.log("Logo does not exist, unable to delete.");
          
          // Clean up the database entry if it does not exist in storage
          const logoDbRef = ref(db, `logos/${user.uid}/${logoKey}`);
          await remove(logoDbRef); // Remove the entry from the database
          console.log("Removed invalid logo reference from database.");
        }
      }
    } else {
      console.log("No user or logo key found.");
    }
  };

  

  return (
    <div id='uploadLogo'>
      <header className='flex justify-between gap-5 fixed items-center w-full py-5 px-2  md:px-5 bg-[#fff]  z-50 rounded-b mb-5'>
        {/* Logo and Logout Button Section */}
        <div className='text-lg font-medium w-full flex gap-1 items-center'><span className='hidden md:block'>Hello</span> <span className='hidden md:block'>:</span><span className='text-[#72b114] font-bold'>{shopName}....</span>
          <span className='text-[#ffdc43]'><IoHandLeftSharp className='hidden md:block'/></span>
        </div>
          <div className='flex items-center justify-center md:justify-start w-full md:gap-10'> {/* Use full width for the flex container */}
            {/* <div className='flex items-center'>
              {logoUrl && (
                <div className='relative flex items-center gap-2'> 
                  <img src={logoUrl} alt="Logo" className="w-[100px] object-contain" />
                  {user &&(
                    <button onClick={handleDeleteLogo} className=' top-0 right-0 bg-red-500 p-1'>
                      <MdDelete className='text-white' />
                    </button>
                  )}
                </div>
              )}
            </div> */}
            {user && (
              <div className=' flex md:items-end items-center gap-5'>
                <button onClick={handleLogout} className='flex items-center relative text-red-600 z-50'>
                  <FaUserAltSlash className='mr-2' />
                  Logout
                </button>
                <button className='md:hidden text-3xl' onClick={handleOpenAdminPanel}>
                  <IoIosMenu/>
                </button>
                
              </div>
            )}
          </div>
          {/* <button onClick={() => navigate('/login')} className='bg-blue-500 text-white px-4 py-2 rounded'>
            Login
          </button> */}
        
      </header>

      <main className='pt-36'>
        <div className='flex justify-center items-center font-bold text-2xl mb-5 ItemText'>Upload Your Logo</div>
        {/* Pass user and randomKey to UploadFile component for proper functionality */}
        {user && <UploadFile user={user} randomKey={randomKey} />}
      </main>
    </div>
  );
};

export default Navbar;
