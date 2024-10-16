import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code'; // Import the QRCode component
import Navbar from './Navbar';
import BannerSlider from './BannerSlider';
import Category from './Category';
import { Outlet } from 'react-router-dom';
import { IoCopy } from "react-icons/io5";
import { useParams } from 'react-router-dom'; // Import useParams
import { HiOutlineDownload } from "react-icons/hi";
import { FaHome } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { IoQrCodeSharp } from "react-icons/io5";
import html2canvas from 'html2canvas'; // Import html2canvas
import { toast } from 'react-hot-toast';
import { FaUser } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Home = () => {
  // const { adminId } = useParams(); 
  const [openQrPopUp, setOpenQrPopUp] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const currentAdminId = localStorage.getItem('adminUid'); // Get currently logged-in admin ID
  const adminId = localStorage.getItem('adminUid'); 
  const adminUrl = `http://52.66.196.77/${adminId}`; // The URL that includes the admin ID
  const qrRef = useRef(); // Create a ref to the QR code element
  const [openAdminPanel, setOPenAdminPanel] = useState(false)

  useEffect(() => {
    // Check for authentication state
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === adminId) {
        setIsAuthenticated(true); // Admin is authenticated
      } else {
        setIsAuthenticated(false); // Admin is not authenticated
      }
    });

    // Set the QR code URL
    setQrUrl(adminUrl);

    return () => unsubscribe();
  }, [adminId]);

  const handleGenerateQR = () => {
    setQrGenerated(true);
    setOpenQrPopUp(true);
  };

  // Function to download the QR code as an image
  const handleDownloadQR = () => {
    if (qrRef.current) {
      html2canvas(qrRef.current).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png'); // Convert to image
        link.download = 'qr-code.png'; // Set the download filename
        link.click(); // Trigger the download
      });
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    toast.success('URL copied to clipboard!'); // Show success message
  };

  const handleOpenAdminPanel = () => {
    setOPenAdminPanel(!openAdminPanel);
  };


  return (
    <div className=' w-full overflow-hidden'>
      <div className=' w-full'>
        {/* Mobile Admin Pannel */}
        
        {isAuthenticated && openAdminPanel && (
          <div className='fixed bottom-0 top-0 left-0 right-0 bg-[#fff] z-[999] flex flex-col justify-center items-center'>
          <div className=' absolute top-5 right-5 text-2xl' >
            <IoClose onClick={handleOpenAdminPanel} className='cursor-pointer'/>
          </div>
          <div className='text-center mb-20 text-xl font-bold flex justify-center items-center gap-2 text-[#082114]'>Admin Panel <span className='text-xl text-[#6d8040]'><FaUser/></span></div>
          <ul className='flex flex-col justify-center items-start gap-6 font-semibold text-lg mb-20'>
            <li className='cursor-pointer' onClick={()=>{document.getElementById("uploadLogo").scrollIntoView({ behavior:"smooth" });setOPenAdminPanel(!openAdminPanel)}}>Upload Logo</li>
            <li className='cursor-pointer' onClick={()=>{document.getElementById("uploadBanner").scrollIntoView({ behavior:'smooth' }); setOPenAdminPanel(!openAdminPanel)}}>Upload Banner</li>
            <li className='cursor-pointer' onClick={()=>{document.getElementById("addCategory").scrollIntoView({ behavior:'smooth' }); setOPenAdminPanel(!openAdminPanel)}} >Add Category</li>
            <li className='cursor-pointer' onClick={()=>{document.getElementById("addItems").scrollIntoView({ behavior:'smooth' });setOPenAdminPanel(!openAdminPanel)}}>Add Items</li>
          </ul>
          <div>
          
              <div className=' flex flex-col justify-center items-center gap-2'>
                <div className='text-lg font-bold text-[#6d8040] drop-shadow-sm'>QR Link</div>
                <div className=' bg-[#6d8040] p-3 rounded-full text-[#ffffff] drop-shadow-sm cursor-pointer'>
                  <IoQrCodeSharp onClick={()=>{
                    handleGenerateQR();
                    setOPenAdminPanel(!openAdminPanel);
                  }} />
                </div>
              </div>
              {/* {handleGenerateQR};{setOPenAdminPanel(!openAdminPanel)} */}
          </div>
        </div>
        )}
        
      <div className='md:flex justify-center w-full'>
        {/* First Div (Side Navbar) */}
        <div className='md:w-[20%] md:h-screen hidden md:block'>
          <div className=' md:fixed flex-col gap-16 w-[20%] h-screen bg-[#fff] md:flex justify-center items-center'>
            <div className='text-center font-bold text-[#fff] flex justify-center items-center px-8 py-3 rounded-3xl bg-[#082114] drop-shadow-md'>Admin Pannel
              <span><FaUser/></span>
            </div>
            <ul className='flex flex-col justify-center gap-5 font-semibold text-lg w-full text-center'>
              <li className='w-full p-2 bg-[#6d8040] text-[#fff] drop-shadow-sm cursor-pointer' onClick={()=> document.getElementById('uploadLogo').scrollIntoView({ behavior:'smooth'})}>Upload Logo</li>
              <li className='w-full p-2 bg-[#6d8040] text-[#fff] drop-shadow-sm cursor-pointer'onClick={()=> document.getElementById('uploadBanner').scrollIntoView({behavior:'smooth'})}>Upload Banners</li>
              <li className='w-full p-2 bg-[#6d8040] text-[#fff] drop-shadow-sm cursor-pointer' onClick={()=> document.getElementById('addCategory').scrollIntoView({behavior:'smooth'})}>Add Categories</li>
              <li className='w-full p-2 bg-[#6d8040] text-[#fff] drop-shadow-sm cursor-pointer'onClick={()=>document.getElementById('addItems').scrollIntoView({ behavior:'smooth'})}>Add Items</li>
            </ul>
            {/* QR Icon */}
            
              <div className=' flex flex-col justify-center items-center gap-2'>
                <div className='text-lg font-bold text-[#6d8040] drop-shadow-sm'>QR Link</div>
                {/* QR Button */}
                <div className=' bg-[#6d8040] p-3 rounded-full text-[#ffffff] drop-shadow-sm cursor-pointer'>
                  <IoQrCodeSharp onClick={handleGenerateQR} />
                </div>
              </div>
            
          </div>
        </div>
        {/* Second Div (Contents) */}
          <div className='md:w-[80%] w-full'>
          {/* QR PopUp */}
          {openQrPopUp && (
            <div className='fixed top-0 bottom-0 left-0 right-0 bg-[#d6eda1] z-[100] flex justify-center items-center h-full'>
              <div className='h-[600px] w-[90%] md:w-[60%] lg:w-[400px] bg-[#ffffff] rounded-3xl py-5 relative'>
                <div className='absolute top-5 right-5 drop-shadow-sm text-[#1d076b] z-[120]'>
                  <IoIosCloseCircle className='cursor-pointer' onClick={() => setOpenQrPopUp(!openQrPopUp)} />
                </div>
                <div className='text-center text-3xl font-semibold text-[#1d076b] drop-shadow-sm mb-5'>Generated QR Code</div>

                {/* QR Code Display */}
                <div ref={qrRef} className='h-[300px] w-[90%] mx-auto px-2 py-2 rounded-3xl bg-[#ffffff] mb-5 flex justify-center items-center'>
                  {qrUrl && <QRCode value={qrUrl} size={256} />} {/* Use react-qr-code for generating the QR code */}
                </div>

                {/* URL Input */}
                <div className='w-full px-2 flex flex-col justify-center items-center gap-5'>
                  <div className='relative flex justify-center items-center w-full border-[#1d076b] border-[1px] rounded-xl'>
                    <input
                      type="text"
                      className='w-full py-3 pl-3 border-none outline-none rounded-xl text-[#1d076b]'
                      value={qrUrl}
                      readOnly
                    />
                    <div className=' w-[20%] h-full items-center flex '>
                      <span className='absolute right-7 text-[#1d076b] cursor-pointer bg-[#fff] z-50'  onClick={handleCopyUrl}>
                        <IoCopy />
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className='flex justify-between items-center gap-2 md:gap-10'>
                    <button onClick={handleDownloadQR} className='px-6 py-2 bg-[#1d076b] border-[1px] rounded-xl text-sm font-semibold text-[#ffffff] flex justify-center items-center gap-2'>
                      Download QR <span><HiOutlineDownload /></span>
                    </button>
                    <button onClick={() => setOpenQrPopUp(!openQrPopUp)} className='px-6 py-2 bg-[#1d076b] border-[1px] rounded-xl text-sm font-semibold text-[#ffffff] flex justify-center items-center gap-2'>
                      Home <span><FaHome /></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QR Icon */}
          {/* {!qrGenerated && (
            <div className='fixed z-[90] bottom-10 right-10 p-5 bg-[#082114] rounded-full text-3xl drop-shadow-md'>
              <IoQrCodeSharp className='drop-shadow-lg text-[#fff] cursor-pointer' onClick={handleGenerateQR} />
            </div>
          )} */}

          <div>
            <Navbar handleOpenAdminPanel={handleOpenAdminPanel} setOPenAdminPanel={setOPenAdminPanel}/>
          </div>
          <div>
            <BannerSlider />
          </div>
          <div>
            <Category />
          </div>
          <div className=''>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Home;

// onClick={() => document.getElementById('homesection').scrollIntoView({ behavior: 'smooth' })}