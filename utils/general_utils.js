const Owner = require("../models/ownerModel");
const Cattle = require("../models/cattleModel");
const json2csv = require('json2csv');
const fs = require('fs');
const PDFDocument = require('pdfkit-table');
// require('pdfkit-table')(PDFDocument);


// Create a function to generate generateUserCodea unique code
 module.exports.generateUserCode = function generateUserCode(name) {
    // Extract initials from the user's name
    const initials = name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase())
      .join("");
  
    // Generate 6 random digits
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
  
    // Combine initials and random digits to create the unique code
    const uniqueCode = `${initials}${randomDigits}`;
  
    return uniqueCode;
  }

  module.exports.generateStaffId = function generateStaffId() {
    return "RDF/" + Math.floor(1000 + Math.random() * 9000); // Example format: STAFF-1234
  };

  module.exports.capitalizeEachWord = function capitalizeEachWord(str) {
    return str.replace(/\b\w/g, match => match.toUpperCase());
  }
  

module.exports.generateAndDownloadPDF = function generateAndDownloadPDF(data, res) {
  try {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      // Create a writable stream for the PDF
      const stream = doc.pipe(res);

      // Set the font size
      doc.fontSize(20);
      doc.font('Times-Roman')

      // Add the header
      doc.text('Roddan Development Foundation', { align: 'center' });
      doc.moveDown();
      doc.text('Record of Owners', { align: 'center' });
      doc.moveDown();

      // Loop through the owners
      for (const owner of data) {
          // Add the owner's name, location, and contact information
          doc.fontSize(16);
          doc.font('Times-Roman')
          doc.text(`Owner Name: ${owner.name}`);
          doc.fontSize(12);
          doc.font('Times-Roman')
          doc.text(`Location: ${owner.location}`);
          doc.text(`Contact: ${owner.phone}`);
          doc.moveDown();
          
          if (doc.y > 700) {
            doc.addPage()
          }

          // Add the table  
          const table = {
              headers: ['Color', 'Gender',  'Weight', 'Identification Number'," ", 'Health Status', 'Date Added'],
              FontFace: 'Times-Roman',
              rows: owner.cattles.map(cattle => [cattle.color, cattle.gender, cattle.weight, cattle.identificationNumber,cattle.healthStatus, formatMongoDBDate(cattle.createdAt)])
          };
          doc.table(table, {
              prepareHeader: () => doc.font('Times-Bold').fontSize(10),
              prepareRow: (row, i) => doc.font('Times-Roman').fontSize(10)
          });
          doc.moveDown();
          
          if (doc.y > 700) {
            doc.addPage()
          }
          // Add a blank row if the owner has no cattle
          if (owner.cattles.length === 0) {
              doc.text('No cattle found', { align: 'center' });
              doc.moveDown();
          }
      }

    
      // Finalize the PDF file
      doc.end();
  } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Internal Server Error');
  }
};


function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }) +
      ' ' +
      new Date(date).toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' });
}

function formatMongoDBDate(date) {
  const dateObject = new Date(date);
  const formattedDate = dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "UTC", // Set the desired time zone
  });

  return formattedDate;
}
