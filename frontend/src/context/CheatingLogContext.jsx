// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';

// const CheatingLogContext = createContext();

// export const CheatingLogProvider = ({ children }) => {
//   const { userInfo } = useSelector((state) => state.auth);
//   const [cheatingLog, setCheatingLog] = useState({
//     noFaceCount: 0,
//     multipleFaceCount: 0,
//     cellPhoneCount: 0,
//     prohibitedObjectCount: 0,
//     examId: '',
//     username: userInfo?.name || '',
//     email: userInfo?.email || '',
//   });

//   useEffect(() => {
//     if (userInfo) {
//       setCheatingLog((prev) => ({
//         ...prev,
//         username: userInfo.name,
//         email: userInfo.email,
//       }));
//     }
//   }, [userInfo]);

//   const updateCheatingLog = (newLog) => {
//     setCheatingLog((prev) => {
//       // Ensure all count fields are numbers and have default values
//       const updatedLog = {
//         ...prev,
//         ...newLog,
//         noFaceCount: Number(newLog.noFaceCount || 0),
//         multipleFaceCount: Number(newLog.multipleFaceCount || 0),
//         cellPhoneCount: Number(newLog.cellPhoneCount || 0),
//         prohibitedObjectCount: Number(newLog.prohibitedObjectCount || 0),
//       };
//       console.log('Updated cheating log:', updatedLog); // Debug log
//       return updatedLog;
//     });
//   };

//   const resetCheatingLog = (examId) => {
//     const resetLog = {
//       noFaceCount: 0,
//       multipleFaceCount: 0,
//       cellPhoneCount: 0,
//       prohibitedObjectCount: 0,
//       examId: examId,
//       username: userInfo?.name || '',
//       email: userInfo?.email || '',
//     };
//     console.log('Reset cheating log:', resetLog); // Debug log
//     setCheatingLog(resetLog);
//   };

//   return (
//     <CheatingLogContext.Provider value={{ cheatingLog, updateCheatingLog, resetCheatingLog }}>
//       {children}
//     </CheatingLogContext.Provider>
//   );
// };

// export const useCheatingLog = () => {
//   const context = useContext(CheatingLogContext);
//   if (!context) {
//     throw new Error('useCheatingLog must be used within a CheatingLogProvider');
//   }
//   return context;
// };






// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';

// const CheatingLogContext = createContext();

// export const CheatingLogProvider = ({ children }) => {
//   const { userInfo } = useSelector((state) => state.auth);

//   const [cheatingLog, setCheatingLog] = useState({
//     noFaceCount: 0,
//     multipleFaceCount: 0,
//     cellPhoneCount: 0,
//     prohibitedObjectCount: 0,
//     examId: '',
//     username: userInfo?.name || '',
//     email: userInfo?.email || '',
//     screenshots: [], // ✅ added from first version
//   });

//   // Keep username/email in sync with Redux userInfo
//   useEffect(() => {
//     if (userInfo) {
//       setCheatingLog((prev) => ({
//         ...prev,
//         username: userInfo.name,
//         email: userInfo.email,
//       }));
//     }
//   }, [userInfo]);

//   // ✅ Aggregates counts + merges screenshots (from first version)
//   const updateCheatingLog = (newLog) => {
//     setCheatingLog((prev) => {
//       const updatedLog = {
//         ...prev,
//         ...newLog,
//         noFaceCount: (prev.noFaceCount || 0) + (Number(newLog.noFaceCount) || 0),
//         multipleFaceCount: (prev.multipleFaceCount || 0) + (Number(newLog.multipleFaceCount) || 0),
//         cellPhoneCount: (prev.cellPhoneCount || 0) + (Number(newLog.cellPhoneCount) || 0),
//         prohibitedObjectCount: (prev.prohibitedObjectCount || 0) + (Number(newLog.prohibitedObjectCount) || 0),
//         screenshots: [...(prev.screenshots || []), ...(newLog.screenshots || [])],
//       };
//       console.log('Updated cheating log (aggregated):', updatedLog);
//       return updatedLog;
//     });
//   };

//   // ✅ Reset log fully, including screenshots
//   const resetCheatingLog = (examId) => {
//     const resetLog = {
//       noFaceCount: 0,
//       multipleFaceCount: 0,
//       cellPhoneCount: 0,
//       prohibitedObjectCount: 0,
//       examId: examId,
//       username: userInfo?.name || '',
//       email: userInfo?.email || '',
//       screenshots: [],
//     };
//     console.log('Reset cheating log:', resetLog);
//     setCheatingLog(resetLog);
//   };

//   // ✅ Utility function for total violations
//   const getTotalCheatingLog = () => {
//     return {
//       ...cheatingLog,
//       totalViolations:
//         (cheatingLog.noFaceCount || 0) +
//         (cheatingLog.multipleFaceCount || 0) +
//         (cheatingLog.cellPhoneCount || 0) +
//         (cheatingLog.prohibitedObjectCount || 0),
//     };
//   };

//   return (
//     <CheatingLogContext.Provider
//       value={{ cheatingLog, updateCheatingLog, resetCheatingLog, getTotalCheatingLog }}
//     >
//       {children}
//     </CheatingLogContext.Provider>
//   );
// };

// export const useCheatingLog = () => {
//   const context = useContext(CheatingLogContext);
//   if (!context) {
//     throw new Error('useCheatingLog must be used within a CheatingLogProvider');
//   }
//   return context;
// };











import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const CheatingLogContext = createContext();

export const CheatingLogProvider = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const [cheatingLog, setCheatingLog] = useState({
    noFaceCount: 0,
    multipleFaceCount: 0,
    cellPhoneCount: 0,
    prohibitedObjectCount: 0,
    examId: '',
    username: userInfo?.name || '',
    email: userInfo?.email || '',
    screenshots: [],
  });

  // keep user info synced
  useEffect(() => {
    if (userInfo) {
      setCheatingLog((prev) => ({
        ...prev,
        username: userInfo.name,
        email: userInfo.email,
      }));
    }
  }, [userInfo]);

  // ✅ increments counts + merges screenshots properly
  const updateCheatingLog = (newLog) => {
    setCheatingLog((prev) => {
      const updatedLog = {
        ...prev,
        examId: newLog.examId || prev.examId,
        username: newLog.username || prev.username,
        email: newLog.email || prev.email,

        noFaceCount: (prev.noFaceCount || 0) + (Number(newLog.noFaceCount) || 0),
        multipleFaceCount: (prev.multipleFaceCount || 0) + (Number(newLog.multipleFaceCount) || 0),
        cellPhoneCount: (prev.cellPhoneCount || 0) + (Number(newLog.cellPhoneCount) || 0),
        prohibitedObjectCount: (prev.prohibitedObjectCount || 0) + (Number(newLog.prohibitedObjectCount) || 0),

        screenshots: [...(prev.screenshots || []), ...(newLog.screenshots || [])],
      };

      console.log("Updated cheating log:", updatedLog);
      return updatedLog;
    });
  };

  // ✅ reset everything for a new exam
  const resetCheatingLog = (examId) => {
    const resetLog = {
      noFaceCount: 0,
      multipleFaceCount: 0,
      cellPhoneCount: 0,
      prohibitedObjectCount: 0,
      examId: examId,
      username: userInfo?.name || '',
      email: userInfo?.email || '',
      screenshots: [],
    };
    console.log('Reset cheating log:', resetLog);
    setCheatingLog(resetLog);
  };

  // ✅ utility to get total violations
  const getTotalCheatingLog = () => {
    return {
      ...cheatingLog,
      totalViolations:
        (cheatingLog.noFaceCount || 0) +
        (cheatingLog.multipleFaceCount || 0) +
        (cheatingLog.cellPhoneCount || 0) +
        (cheatingLog.prohibitedObjectCount || 0),
    };
  };

  return (
    <CheatingLogContext.Provider
      value={{ cheatingLog, updateCheatingLog, resetCheatingLog, getTotalCheatingLog }}
    >
      {children}
    </CheatingLogContext.Provider>
  );
};

export const useCheatingLog = () => {
  const context = useContext(CheatingLogContext);
  if (!context) {
    throw new Error('useCheatingLog must be used within a CheatingLogProvider');
  }
  return context;
};
