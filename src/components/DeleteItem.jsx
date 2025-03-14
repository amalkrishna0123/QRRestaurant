import React from 'react';
import { IoIosClose } from "react-icons/io";
import { motion } from "framer-motion";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import { toast } from 'react-hot-toast';
import { db } from './Firebase'; // Ensure correct Firebase setup

const DeleteItem = ({ setItemDeletePopUp, itemToDelete, deleteItem,adminId }) => {
  
  const handleDelete = async () => {
    if (itemToDelete) {
      const itemId = itemToDelete.id;
      const categoryId = itemToDelete.categoryId;

      // Get the image URL and extract the image name
      const imageUrl = itemToDelete.imageUrl;
      const imageName = decodeURIComponent(imageUrl.split('/').pop().split('?')[0]);
      const storage = getStorage();
      const imageRef = storageRef(storage, `admins/${adminId}/categories/${categoryId}/items/${imageName}`);

      console.log(`Attempting to delete image at path: ${imageRef.fullPath}`);

      try {
        // Delete image from storage first
        await deleteObject(imageRef);
        console.log('Image deleted successfully from storage');

        // Now, delete the item from the database
        await deleteItem(itemId, categoryId);
        setItemDeletePopUp(false); // Close the pop-up after deletion
        toast.success("Item deleted successfully!");
      } catch (error) {
        if (error.code === 'storage/object-not-found') {
          toast.error("Error: Image not found. It may have already been deleted.");
        } else {
          toast.error("Error deleting image: " + error.message);
        }
      }
    } else {
      toast.error("Missing item data. Cannot delete item.");
    }
  };

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-[#ff0000a1] z-50 flex justify-center items-center px-6'>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: .5, ease: 'backInOut' } }}
        className='relative w-full h-[230px] bg-[#fff] rounded-3xl'>
        <div className='absolute right-5 top-5 text-2xl text-[#80964c] cursor-pointer' onClick={() => setItemDeletePopUp(false)}>
            <IoIosClose/>
        </div>
        <div className='px-8 pt-5 mb-5 text-[28px] font-bold text-[#80964c]'>Are you sure?</div>
        <div className='px-8 mb-7'>You want to delete this <span className='font-bold'>item</span>? You won't be able to view this <span className='font-bold'>item</span> in your list anymore.</div>
        <div className='px-8 flex justify-between items-center'>
            <button className='px-8 py-2 rounded-xl bg-[#7a7171bc] font-bold text-[#fff]' onClick={() => setItemDeletePopUp(false)}>Cancel</button>
            <button className='px-8 py-2 rounded-xl bg-[#f80000] font-bold text-[#fff]' onClick={handleDelete}>Delete</button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteItem;
