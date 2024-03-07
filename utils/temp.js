//   module.exports.generateCSVData = async function generateCSVData() {
//     try {
//         // Fetch owners and populate cattles for each owner
//         // const ownersWithCattles = await Owner.find().populate('cattles');

//         const ownersWithCattles = await Owner.aggregate([
//           {
//             $lookup: {
//               from: 'cattles',
//               localField: 'cattles',
//               foreignField: '_id',
//               as: 'cattles',
//             },
//           },
//           {
//             $unwind: '$cattles',
//           },
//           {
//             $group: {
//               _id: '$_id',
//               name: { $first: '$name' },
//               createdAt: { $first: '$createdAt' },
//               cattles: { $push: '$cattles' },
//             },
//           },
//         ]);
        
//         // Group data by months or any other categorization logic
//         const categorizedData = categorizeDataByMonths(ownersWithCattles);
//         console.log('Categorized Data:', categorizedData);

//         // Transform data into the desired format for CSV
//         const csvData = transformDataForCSV(categorizedData);

//         return csvData;
//     } catch (error) {
//         throw error;
//     }
// }

// // Function to categorize data by months
// function categorizeDataByMonths(data) {
//     const categorizedData = {};

//     if (!Array.isArray(data)) {
//         console.error('Invalid data format. Expected an array.');
//         return categorizedData;
//     }

//     data.forEach((owner) => {
//         const ownerMonth = getMonthFromDate(owner.createdAt); // Assuming owners have a createdAt field

//         if (!categorizedData[ownerMonth]) {
//             categorizedData[ownerMonth] = [];
//         }

//         if (owner.cattles && owner.cattles.length > 0) {
//             owner.cattles.forEach((cattle) => {
//                 categorizedData[ownerMonth].push({
//                     ownerName: owner.name,
//                     cattlecolor: cattle.color || 'N/A', // Example: Include color with fallback
//                     Gender: cattle.gender || 'N/A',
//                     DateOfBirth: cattle.dateOfBirth ? cattle.dateOfBirth.toISOString().split('T')[0] : 'N/A',
//                     Weight: cattle.weight || 'N/A',
//                     IdentificationNumber: cattle.identificationNumber || 'N/A',
//                     HealthStatus: cattle.healthStatus || 'N/A',
//                     DateAdded: owner.createdAt ? owner.createdAt.toISOString().split('T')[0] : 'N/A',
//                 });
//             });
//         }
//     });

//     return categorizedData;
// }

// // Helper function to get the month from a date
// function getMonthFromDate(date) {
//     const monthNames = [
//         'January',
//         'February',
//         'March',
//         'April',
//         'May',
//         'June',
//         'July',
//         'August',
//         'September',
//         'October',
//         'November',
//         'December',
//     ];

//     const d = new Date(date);
//     return monthNames[d.getMonth()];
// }

// function transformDataForCSV(data) {
//   const transformedData = [];

//   if (!data || typeof data !== 'object') {
//     console.error('Invalid data format. Expected an object.');
//     return transformedData;
//   }

//   // Iterate over months
//   Object.keys(data).forEach((month) => {
//     // Iterate over owner/cattle objects in each month
//     data[month].forEach((record) => {
//       // Check if the owner's name is not already in the transformed data
//       const ownerIndex = transformedData.findIndex((item) => item.Owner === record.ownerName);

//       if (ownerIndex === -1) {
//         // If the owner is not found, add a new entry for the owner
//         transformedData.push({
//           Owner: record.ownerName,
//           'Total cattles owned': 1, // Initialize count for the owner
//         });
//       } else {
//         // If the owner is already in the transformed data, update the count
//         transformedData[ownerIndex]['Total cattle’s owned'] += 1;
//       }

//       // Add an entry for the cattle
//       transformedData.push({
//         Owner: '', // Empty for subsequent cattle under the same owner
//         Color: record.cattlecolor || 'N/A',
//         Gender: record.Gender || 'N/A',
//         DateOfBirth: record.DateOfBirth || 'N/A',
//         Weight: record.Weight || 'N/A',
//         IdentificationNumber: record.IdentificationNumber || 'N/A',
//         HealthStatus: record.HealthStatus || 'N/A',
//         DateAdded: record.DateAdded || 'N/A',
//       });
//     });
//   });

//   return transformedData;
// }
