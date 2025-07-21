import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../actions/posts';

const AutoInsertPost = () => {
  const dispatch = useDispatch();
  const [ip, setIp] = useState(null);

  useEffect(() => {
    const insertData = async () => {
      try {
        // 1. Get IP address
        const res = await fetch('https://api64.ipify.org?format=json');
        const { ip: userIp } = await res.json();
        setIp(userIp);

        // 2. Build data with IP and timestamp
        const now = new Date().toISOString();

        const result = await dispatch(
          createPost({
            ip_address: userIp,
            access_time: now,
          })
        );

        console.log('✅ Auto-inserted post with IP:', result);
      } catch (err) {
        console.error('❌ Error during IP fetch or insert:', err.message);
      }
    };

    insertData();
  }, [dispatch]);

  return null; // or return <p>Auto-recording access...</p>;
};

export default AutoInsertPost;
